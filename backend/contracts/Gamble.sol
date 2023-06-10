// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {ISuperfluid, ISuperToken, ISuperApp, ISuperAgreement, SuperAppDefinitions} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {IConstantFlowAgreementV1} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/agreements/IConstantFlowAgreementV1.sol";
import { IERC1820Registry } from "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import { IERC777Recipient } from "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import {SuperAppBaseCFA} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBaseCFA.sol";


/**
* Solarpunk vs Lunarpunk
*
* The optimistic Solarpunk looks at the system and convinces himself they can make a positive-sum game out of it.
* The life-experienced Lunarpunk looks at the system and convinces himself there's be naive gamblers.
*/
contract Gamble is IERC777Recipient, SuperAppBaseCFA {
    // ---------------------------------------------------------------------------------------------
    // EVENTS
    event NewGamble(address gambler, uint256 amount);
    /// @notice Importing the SuperToken Library to make worgambler with streams easy.
    using SuperTokenV1Library for ISuperToken;
    /// @dev Thrown when the gambler is the zero adress.
    error InvalidGambler();
    /// @dev Thrown when gambler is also a super app.
    error GamblerIsSuperApp();

    // CONSTANTS
    uint32 public constant INITIAL_MIN_AMOUNT_MULTIPLIER = 10;
    uint32 public constant INDEX_ID = 23;

    // ---------------------------------------------------------------------------------------------
    // STORAGE & IMMUTABLES
    /// @notice Constant used for ERC777.
    IERC1820Registry constant internal _ERC1820_REG = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    /// @notice Token coming in and token going out
    ISuperToken public immutable acceptedToken;
    /// @notice the current gambler of the hill
    address public lastGambler;
    uint256 public lastGambleAmount;
    uint256 public lastGambleTimestamp;
    uint256 public prevGambleDuration;
    uint256 public gameStart;

    constructor(
        ISuperfluid _host,
        ISuperToken _token
    ) SuperAppBaseCFA(
        ISuperfluid(_token.getHost()), 
        true,
        true,
        true  
    ) {
        host = _host;
        acceptedToken = _token; 
        lastGambler = msg.sender;
        lastGambleTimestamp = block.timestamp;
        gameStart = block.timestamp;
        _ERC1820_REG.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
        acceptedToken.createIndex(INDEX_ID);
    }

    // stepwise hyperbolic decay which gets stretched further over time the longer the previous gamble took,
    // resulting in an increasing incentive to wage a new gamble
    function getMinGambleAmount() public view returns(uint256) {
        return _getMinGambleAmount(block.timestamp, lastGambleTimestamp, lastGambleAmount, prevGambleDuration);
    }

    // have a pure version in order to make testing easier
    function _getMinGambleAmount(uint256 blockTimestamp, uint256 lastGambleTimestamp, uint256 lastGambleAmount, uint256 prevGambleDuration) public pure returns(uint256) {
        uint256 initialHalvingPeriod = 4;
        uint256 x = prevGambleDuration ;
        // this could loop at most 256 times (nr of bits of x)
        while (x > 1) {
            x >>= 1;
            //initialHalvingPeriod += 4;
            initialHalvingPeriod = initialHalvingPeriod * 1337 / 1000;
        }

        uint256 halvingPeriod = initialHalvingPeriod;
        uint256 nrHalvings = 0;

        // create a log scale for the halving speed
        uint256 timePassed = blockTimestamp - lastGambleTimestamp;
        // this loop is in theory unbounded, but worst case 32 iterations cover >100 years, we're good with that
        while (timePassed >= halvingPeriod) {
            timePassed -= halvingPeriod;
            halvingPeriod *= 2;
            nrHalvings++;
        }

        return (lastGambleAmount * INITIAL_MIN_AMOUNT_MULTIPLIER) >> nrHalvings; // equivalent to initialAmount / 2^halvings        
    }

    // ---------------------------------------------------------------------------------------------
    // UTILITY FUNCTIONS
    // ---------------------------------------------------------------------------------------------

    // ---------------------------------------------------------------------------------------------
    // IERC777Recipient
    function tokensReceived(
        address /*operator*/,
        address from,
        address /*to*/,
        uint256 amount,
        bytes calldata /*userData*/,
        bytes calldata /*operatorData*/
    ) override external {
        // if it's not a SuperToken, something will revert along the way
        require(ISuperToken(msg.sender) == acceptedToken, "Please send the right token!");
        // user is trying to gamble
        _gamble(from, amount);
    }
    
    function gamble(uint256 amount) public{
        acceptedToken.transferFrom(msg.sender, address(this), amount);
        _gamble(msg.sender, amount);
    }
    
    function _gamble(address newGambler, uint256 amount) internal {
        require(amount >= getMinGambleAmount(), "insufficient amount");
        acceptedToken.distribute(INDEX_ID, acceptedToken.balanceOf(address(this)));
        lastGambleAmount = amount;
        prevGambleDuration = block.timestamp - lastGambleTimestamp;
        lastGambleTimestamp = block.timestamp;

        if (newGambler != lastGambler) {
            int96 outFlowRate = acceptedToken.getFlowRate(address(this), lastGambler);
            if (outFlowRate > 0) {
                acceptedToken.deleteFlow(address(this), lastGambler);
                acceptedToken.createFlow(newGambler, outFlowRate);
            }
            lastGambler = newGambler;
        }
        emit NewGamble(newGambler, amount);
    }

    // ---------------------------------------------------------------------------------------------
    // SUPERAPP CALLBACKS

    function onFlowCreated(
        ISuperToken /*superToken*/,
        address sender,
        bytes calldata ctx
    )
        internal
        override
        returns (bytes memory newCtx)
    {
        int96 flowrate = acceptedToken.getFlowRate(sender, address(this));
        // try and pull the initiation fee from the streamer
        // ticket amount is proportional to the flowrate (10 minutes worth of stream). This ensures opening a crazy big stream is expensive
        // this makies opening a huge stream and then closing it immediately unprofitable
        acceptedToken.transferFrom(sender, address(this), uint256(int256(flowrate * 600)));
        newCtx = acceptedToken.distributeWithCtx(INDEX_ID, acceptedToken.balanceOf(address(this)), ctx);
        // give the streamers their share of future gambler money
        newCtx = acceptedToken.updateSubscriptionUnitsWithCtx(INDEX_ID, sender, uint128(int128(flowrate)), newCtx); 
        return _updateOutflow(newCtx);
    }

    function onFlowUpdated(
        ISuperToken /*superToken*/,
        address /*sender*/,
        int96 /*previousFlowRate*/,
        uint256 /*lastUpdated*/,
        bytes calldata /*ctx*/
    )
        internal
        override
        pure
        returns (bytes memory)
    {
        revert("Streams cannot be updated");
    }

    function onFlowDeleted(
        ISuperToken /*superToken*/,
        address sender,
        address /*receiver*/,
        int96 /*previousFlowRate*/,
        uint256 /*lastUpdated*/,
        bytes calldata ctx
    ) 
        internal
        override
        returns (bytes memory newCtx) 
    {
        newCtx = acceptedToken.deleteSubscriptionWithCtx(address(this), INDEX_ID, sender, ctx);
        return _updateOutflow(newCtx);
    }

    /// @dev Updates the outflow. The flow is either created, updated, or deleted, depending on the
    /// net flow rate.
    /// @param ctx The context byte array from the Host's calldata.
    /// @return newCtx The new context byte array to be returned to the Host.
    function _updateOutflow(bytes memory ctx) private returns (bytes memory newCtx) {
        newCtx = ctx;
        int96 netFlowRate = acceptedToken.getNetFlowRate(address(this));
        int96 outFlowRate = acceptedToken.getFlowRate(address(this), lastGambler);
        int96 inFlowRate = netFlowRate + outFlowRate;
        if (inFlowRate == 0) {
            // The flow does exist and should be deleted.
            newCtx = acceptedToken.deleteFlowWithCtx(address(this), lastGambler, ctx);
        } else if (outFlowRate != 0) {
            // The flow does exist and needs to be updated.
            newCtx = acceptedToken.updateFlowWithCtx(lastGambler, inFlowRate, ctx);
        } else {
            // The flow does not exist but should be created.
            newCtx = acceptedToken.createFlowWithCtx(lastGambler, inFlowRate, ctx);
        }
    }
}