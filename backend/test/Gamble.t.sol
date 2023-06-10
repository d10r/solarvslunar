// SPDX-License-Identifier: AGPLv3
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "forge-std/StdCheats.sol";
import { 
    ISuperfluid,
    ISuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import { CFAv1Forwarder } from "@superfluid-finance/ethereum-contracts/contracts/utils/CFAv1Forwarder.sol";

import "../contracts/Gamble.sol";

contract GambleTest is Test {

    using SuperTokenV1Library for ISuperToken;

    address public HOST;
    address public SUPERTOKEN;
    ISuperfluid host;
    ISuperToken superToken;
    CFAv1Forwarder cfaFwd;
    Gamble public game;

    address internal constant deployer = address(0x420);
    address internal constant alice = address(0x421);
    address internal constant bob = address(0x422);
    address internal constant carol = address(0x423);
    address internal constant dan = address(0x424);

    constructor() {
        string memory rpc = vm.envString("RPC");
        vm.createSelectFork(rpc);
        HOST = vm.envAddress("HOST");
        SUPERTOKEN = vm.envAddress("SUPERTOKEN");
        
        host = ISuperfluid(HOST);
        superToken = ISuperToken(SUPERTOKEN);

        vm.startPrank(deployer);
        game = new Gamble(host, superToken);
        cfaFwd = CFAv1Forwarder(0xcfA132E353cB4E398080B9700609bb008eceB125);
        vm.stopPrank();

        deal(address(superToken), alice, uint256(100e18));
        deal(address(superToken), bob, uint256(100e18));
        deal(address(superToken), carol, uint256(100e18));
        deal(address(superToken), dan, uint256(100e18));
    }
    
    using SuperTokenV1Library for ISuperToken;

    // HELPERS

    // assumption: no stream was created by who before
    function stream(address who, int96 flowRate) public {
        vm.startPrank(who);
        superToken.approve(address(game), type(uint256).max);
        superToken.createFlow(address(game), flowRate);
        vm.stopPrank();
    }

    function gamble(address who, uint256 amount) public {
        vm.startPrank(who);
        superToken.send(address(game), amount, new bytes(0));
        vm.stopPrank();
    }

    function assertInvariants(address expectedGambler, int96 expectedFr) public {
        int96 gameNetFr = superToken.getNetFlowRate(address(game));
        assertEq(int256(superToken.getNetFlowRate(address(game))), 0, "game flowrate is not 0");
        assertEq(game.lastGambler(), expectedGambler, "unexpected gambler");
        int96 gamblerNetFr = superToken.getNetFlowRate(game.lastGambler());
        assertEq(int256(gamblerNetFr), int256(expectedFr), "unexpected flowrate");
    }

    // TESTS

    function testBeFirstStreamer() public {
        stream(alice, 1e9);
        console.log("flowrate to game: %s", uint256(int256(superToken.getFlowRate(alice, address(game)))));
        assertEq(int256(superToken.getFlowRate(alice, address(game))), 1e9, "unexpected flowrate");
    }

    function testGambleWithoutStream() public {
        console.log("minGambleAmount: %s", game.getMinGambleAmount());
        gamble(bob, 1e12);
        assertEq(superToken.balanceOf(address(game)), 1e12, "unexpected balance");
    }

    function testGambleWithStream() public {
        stream(alice, 1e9);
        console.log("minGambleAmount: %s", game.getMinGambleAmount());
        gamble(bob, 1e12);
        //assertEq(superToken.balanceOf(address(game)), 0, "unexpected balance");
    }

    function test1Stream2GamblersNoGap() public {
        stream(alice, 1e9);
        console.log("minGambleAmount for alice: %s", game.getMinGambleAmount());
        gamble(bob, 1e12);
        console.log("minGambleAmount for carol: %s", game.getMinGambleAmount());
        gamble(carol, 16e12);
    }

    function test1Stream2Gamblers1min() public {
        stream(alice, 1e9);
        console.log("minGambleAmount 1: %s", game.getMinGambleAmount());
        console.log("netFr game: %s", uint256(int256(superToken.getNetFlowRate(address(game)))));
        console.log("netFr bob:  %s", uint256(int256(superToken.getNetFlowRate(address(bob)))));

        assertInvariants(deployer, 1e9);

        gamble(bob, 1e12);
        assertInvariants(bob, 1e9);

        assertEq(uint256(int256(superToken.getNetFlowRate(address(bob)))), 1e9, "bob unexpected fr");
        skip(60); // fast forward 60 seconds
        console.log("block.timestamp: %s", game.getBlockTimestamp());
        //console.log("lastAmount: %s, lastTimestamp: %s, prevDuration: %s", game.lastGambleAmount(), game.lastGambleTimestamp(), game.prevGambleDuration());
        console.log("minGambleAmount 2: %s", game.getMinGambleAmount());
        gamble(carol, 15e12);
        console.log("game netFr: %s", uint256(int256(superToken.getNetFlowRate(address(game)))));
        console.log("netFr bob:  %s", uint256(int256(superToken.getNetFlowRate(address(bob)))));
        console.log("netFr carol:  %s", uint256(int256(superToken.getNetFlowRate(address(carol)))));

        skip(3600);
        console.log("minGambleAmount 3: %s", game.getMinGambleAmount());
        gamble(bob, 15e12);
        console.log("game netFr: %s", uint256(int256(superToken.getNetFlowRate(address(game)))));
        console.log("netFr bob:  %s", uint256(int256(superToken.getNetFlowRate(address(bob)))));
    }

    function testComplexSetup() public {
        stream(alice, 1e9);
        
    }
}