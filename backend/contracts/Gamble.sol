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
*
* There's a min_amount for gamblers which changes over time.
* The current flowrate per hour poses a floor_amount to the min_amount.
* On a new gamble, the min_amount increases and is then gradually reduced to the floor.
* The timeframe which passed between previous and current gamble is the prev_gamble_duration.
* min_amount is reduced down to floor_amount with halvings.
* On a new gamble, min_amount is set to current_flowrate_per_hour * 16 and
* halving_period to prev_gamble_duration / 16.
* So it takes prev_gamble_duration for min_amount to reach the floor (assuming it doesn't change).
*/
contract Gamble is IERC777Recipient, SuperAppBaseCFA {
    // ---------------------------------------------------------------------------------------------
    // EVENTS
    event HailNewGambler(address gambler, uint256 amount);
    /// @notice Importing the SuperToken Library to make worgambler with streams easy.
    using SuperTokenV1Library for ISuperToken;
    /// @dev Thrown when the gambler is the zero adress.
    error InvalidGambler();
    /// @dev Thrown when gambler is also a super app.
    error GamblerIsSuperApp();

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
    uint256 public constant INITIAL_MIN_AMOUNT_MULTIPLIER = 16;

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
        lastGambleAmount = 0;
        lastGambleTimestamp = block.timestamp;
        gameStart = block.timestamp;
        bytes32 erc777TokensRecipientHash = keccak256("ERC777TokensRecipient");
        _ERC1820_REG.setInterfaceImplementer(address(this), erc777TokensRecipientHash, address(this));
        acceptedToken.createIndex(23);
    }

    // stepwise hyperbolic decay which gets stretched further over time the longer the previous gamble took,
    // resulting in an increasing incentive to wage a new gamble
    function getMinGambleAmount() public view returns(uint256) {
        return _getMinGambleAmount(block.timestamp, lastGambleAmount, lastGambleTimestamp, prevGambleDuration);
    }

    // have a pure version in order to make testing easier
    function _getMinGambleAmount(uint256 blockTimestamp, uint256 lastGambleAmount, uint256 lastGambleTimestamp, uint256 prevGambleDuration) public pure returns(uint256) {
        //uint256 halvingPeriod = prevGambleDuration / 16;
        //uint256 nrHalvings = halvingPeriod == 0 ? 0 :(block.timestamp - lastGambleTimestamp) / halvingPeriod;
        // equivalent to lastGambleAmount / 2^nrHalvings
        //uint256 discountedAmount = lastGambleAmount >> nrHalvings;
        //uint256 floorAmount = uint256(int256(acceptedToken.getFlowRate(address(this), gambler)));
        //return discountedAmount > floorAmount ? discountedAmount : floorAmount;

        uint256 initialHalvingPeriod = 1;
        uint256 x = prevGambleDuration;
        // this could loop at most 256 times
        while (x > 1) {
            x >>= 1;
            initialHalvingPeriod += 1;
        }

        uint256 halvingPeriod = initialHalvingPeriod; //4; //INITIAL_HALVING_PERIOD;
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

    function getBlockTimestamp() public view returns(uint256) {
        return block.timestamp;
    }

    // ---------------------------------------------------------------------------------------------
    // UTILITY FUNCTIONS
    // ---------------------------------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------
    // THE GAMBLE SIDE
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
        // TODO: is there any risk to not checking this?
        // check if gambler is a super app
//        (bool isSuperApp,,) = ISuperfluid(msg.sender).getAppManifest(ISuperApp(newGambler));
//        require(!isSuperApp, "gambler cannot be a SuperApp2");
        //require(!ISuperApp(newGambler).isSuperApp(), "Gambler cannot be a super app");
        // check gambler has sent enough. Calculate required amount
        // I don't know what the math should look like
        // but the basic idea is that the required amount decays over a period of time
        require(amount >= getMinGambleAmount(), "send bigger amount");
        //uint256 repaymentTime = lastGambleAmount / uint256(int256(acceptedToken.getFlowRate(address(this), gambler)));
        //uint256 requiredAmount = lastGambleAmount * repaymentTime / (repaymentTime + (block.timestamp - lastGambleTimestamp)**2);
        //require(amount >= requiredAmount, "send bigger amount");
        // distribute balance of token through index
        acceptedToken.distribute(23, acceptedToken.balanceOf(address(this)));
        // set new amount to be "beaten"
        lastGambleAmount = amount;
        // keep the order of the next 2 statements!
        prevGambleDuration = block.timestamp - lastGambleTimestamp;
        lastGambleTimestamp = block.timestamp;
        // replace the gambler
        _changeGambler(newGambler);
        // crown new gambler
    }
    // ---------------------------------------------------------------------------------------------
    // RECEIVER DATA
    /// @notice Returns current gambler's address, start time, and flow rate.
    /// @return startTime Start time of the current flow.
    /// @return gambler Receiving address.
    /// @return flowRate Flow rate from this contract to the gambler.
    function currentGambler()
        external
        view
        returns (
            uint256 startTime,
            address gambler,
            int96 flowRate
        )
    {
        if (lastGambler != address(0)) {
            (startTime, flowRate, , ) = acceptedToken.getFlowInfo(
                address(this),
                lastGambler
            );
            gambler = lastGambler;
        }
    }

/*    
    function _decay(uint256 start) public returns(uint256) {
        // decay is exponential in some way!
        return (block.timestamp - start)**2;
    }
*/
/*
    function _decay(uint256 initialAmount) public pure returns (uint256) {
        uint256 halvings = (block.timestamp - start) / HALVING_PERIOD;
        return initialAmount >> halvings; // equivalent to initialAmount / 2^halvings
    }
*/


    // ---------------------------------------------------------------------------------------------
    // SUPER APP CALLBACKS
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
        // ticket amount is the flowrate squared. This ensures opening a crazy stream is expensive
        // this makies opening a huge stream and then closing it immediately unprofitable
        acceptedToken.transferFrom(sender, address(this), uint256(int256(flowrate * flowrate)));
        newCtx = acceptedToken.distributeWithCtx(23, acceptedToken.balanceOf(address(this)), ctx);
        // give the streamers their share of future gambler money
        // units are clipped to reduce precision loss
        // I don't know if this math is right
        // but the basic idea is that keeping a stream open for a long time gives you a bigger share of the pot
        //newCtx = acceptedToken.updateSubscriptionUnitsWithCtx(23, sender, flowrate / (100000 + _decay(gameStart)/43200), newCtx); 
        //newCtx = acceptedToken.updateSubscriptionUnitsWithCtx(23, sender, flowrate / (100000 + _decay(gameStart)/43200), newCtx); 
        newCtx = acceptedToken.updateSubscriptionUnitsWithCtx(23, sender, uint128(int128(flowrate)) / 100000, newCtx); 
        return _updateOutflow(newCtx);
    }
    function onFlowUpdated(
        ISuperToken /*superToken*/,
        address sender,
        int96 previousFlowRate,
        uint256 /*lastUpdated*/,
        bytes calldata ctx
    )
        internal
        override
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
        newCtx = acceptedToken.deleteSubscriptionWithCtx(address(this), 23, sender, ctx);
        return _updateOutflow(newCtx);
    }
    // ---------------------------------------------------------------------------------------------
    // INTERNAL LOGIC
    /// @dev Changes gambler and redirects all flows to the new one. Logs `GamblerChanged`.
    /// @param newGambler The new gambler to redirect to.
    function _changeGambler(address newGambler) internal {
        if (newGambler == address(0)) revert InvalidGambler();
        if (host.isApp(ISuperApp(newGambler))) revert GamblerIsSuperApp();
        if (newGambler == lastGambler) return;
        int96 outFlowRate = acceptedToken.getFlowRate(address(this), lastGambler);
        if (outFlowRate > 0) {
            acceptedToken.deleteFlow(address(this), lastGambler);
            acceptedToken.createFlow(newGambler, outFlowRate);
        }
        lastGambler = newGambler;
        emit HailNewGambler(newGambler, lastGambleAmount);
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