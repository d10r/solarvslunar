// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
import {
    ISuperfluid,
    ISuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import { IERC1820Registry } from "@openzeppelin/contracts/utils/introspection/IERC1820Registry.sol";
import { IERC777Recipient } from "@openzeppelin/contracts/token/ERC777/IERC777Recipient.sol";
import { SuperAppBaseCFA } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperAppBaseCFA.sol";

// THIS CONTRACT IS NOT WELL TESTED, USE AT YOUR OWN RISK!
contract Gamble is IERC777Recipient, SuperAppBaseCFA {

    using SuperTokenV1Library for ISuperToken;

    event NewGamble(address gambler, uint256 amount);
    event NewStream(address streamer, int96 flowrate, uint128 idaUnits);

    // CONSTANTS & IMMUTABLES
    uint32 public constant INITIAL_MIN_AMOUNT_MULTIPLIER = 10;
    uint32 public constant INDEX_ID = 23;
    IERC1820Registry constant internal _ERC1820_REG = IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);
    ISuperToken public immutable acceptedToken;

    // STORAGE
    address public lastGambler;
    uint256 public lastGambleAmount;
    uint256 public lastGambleTimestamp;
    uint256 public prevGambleDuration;
    uint256 public gameStartTimestamp;

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
        gameStartTimestamp = block.timestamp;
        lastGambler = msg.sender;
        lastGambleTimestamp = block.timestamp;
        _ERC1820_REG.setInterfaceImplementer(address(this), keccak256("ERC777TokensRecipient"), address(this));
        acceptedToken.createIndex(INDEX_ID);
    }

    // Returns everything needed to understand the current game state
    function getGameState()
        public view
        returns(
            uint256 _gameStartTimestamp,
            address _lastGambler,
            uint256 _lastGambleTimestamp,
            uint256 _currentMinGambleAmount,
            int96 _currentFlowrate,
            uint128 _currentUnitsPer1MNewFlowrate
        )
    {
        return (
            gameStartTimestamp,
            lastGambler,
            lastGambleTimestamp,
            getMinGambleAmount(),
            acceptedToken.getFlowRate(address(this), lastGambler),
            _getUnitsForFlowrate(1e6)
        );
    }

    // stepwise hyperbolic decay which gets stretched further over time the longer the previous gamble took,
    // resulting in an increasing incentive to wage a new gamble
    function getMinGambleAmount() public view returns(uint256) {
        return _getMinGambleAmount(block.timestamp, lastGambleTimestamp, lastGambleAmount, prevGambleDuration);
    }

    // have a pure version in order to make testing easier
    function _getMinGambleAmount(
        uint256 blockTimestamp,
        uint256 lastGambleTimestamp_,
        uint256 lastGambleAmount_,
        uint256 prevGambleDuration_
    ) 
        public pure
        returns(uint256)
    {
        uint256 initialHalvingPeriod = 4;
        uint256 x = prevGambleDuration_ ;
        // this could loop at most 256 times (nr of bits of x)
        while (x > 1) {
            x >>= 1;
            //initialHalvingPeriod += 4;
            initialHalvingPeriod = initialHalvingPeriod * 1337 / 1000;
        }

        uint256 halvingPeriod = initialHalvingPeriod;
        uint256 nrHalvings = 0;

        // create a log scale for the halving speed
        uint256 timePassed = blockTimestamp - lastGambleTimestamp_;
        // this loop is in theory unbounded, but worst case 32 iterations cover >100 years, we're good with that
        while (timePassed >= halvingPeriod) {
            timePassed -= halvingPeriod;
            halvingPeriod *= 2;
            nrHalvings++;
        }

        return (lastGambleAmount_ * INITIAL_MIN_AMOUNT_MULTIPLIER) >> nrHalvings; // equivalent to initialAmount / 2^halvings        
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

    // IDA units are proportional to the flowrate, with a linear time based discount applied.
    // This creates an incentive to keep streams open
    function _getUnitsForFlowrate(int96 flowrate) public view returns(uint128) {
        // this translates to ~99% after 1 day, ~80% after 1 month, ~25% after 1 year ...
        return uint128(uint256(int256(flowrate)) * 1e7 / (1e7 + (block.timestamp - gameStartTimestamp)));
    }

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
        uint128 idaUnits = _getUnitsForFlowrate(flowrate);
        newCtx = acceptedToken.updateSubscriptionUnitsWithCtx(INDEX_ID, sender, idaUnits, newCtx); 
        emit NewStream(sender, flowrate, idaUnits);
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