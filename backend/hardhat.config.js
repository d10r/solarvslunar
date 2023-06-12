/** @type import('hardhat/config').HardhatUserConfig */
require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      }
    }
  },

  networks: {
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    any: {
      url: process.env.RPC || "",
      accounts:
          process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      goerli: process.env.ETHERSCAN_API_KEY,
      optimisticGoerli: process.env.OPTIMISTIC_API_KEY,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      xdai: process.env.GNOSISSCAN_API_KEY,
      gnosis: process.env.GNOSISSCAN_API_KEY,
      avalanche: process.env.SNOWTRACE_API_KEY,
      optimisticEthereum: process.env.OPTIMISTIC_API_KEY,
      arbitrumOne: process.env.ARBISCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY
    },
  },
};
