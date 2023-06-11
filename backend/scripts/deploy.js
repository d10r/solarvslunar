// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const CFAv1ForwarderArtifact = require("@superfluid-finance/ethereum-contracts/artifacts/contracts/utils/CFAv1Forwarder.sol/CFAv1Forwarder.json");

async function main() {
  const host = process.env.HOST;
  const superToken = process.env.SUPERTOKEN;

  const Gamble = await hre.ethers.getContractFactory("Gamble");
  const gamble = await Gamble.deploy(host, superToken);
  await gamble.deployed();
  console.log(`contract deployed to ${gamble.address}`);

  /*
  console.log("starting a min stream to the contract...");
  const CFAv1Forwarder = await hre.ethers.getContractFactory(CFAv1ForwarderArtifact.abi, CFAv1ForwarderArtifact.bytecode);
  const cfaFwd = await CFAv1Forwarder.attach("0xcfA132E353cB4E398080B9700609bb008eceB125");
  await cfaFwd.setFlowrate(superToken, gamble.address, 1);
  console.log("done");
  */
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});