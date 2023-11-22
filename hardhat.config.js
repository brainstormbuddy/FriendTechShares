require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
        settings: {},
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    // for mainnet
    'base-mainnet': {
      url: 'https://mainnet.base.org',
      accounts: [process.env.WALLET_KEY],
      gasPrice: 1000000000,
    },
    // for testnet
    'base-goerli': {
      url: 'https://goerli.base.org/',
      accounts: [process.env.WALLET_KEY],
      gasPrice: 1000000000,
    },
  },
  etherscan: {
    apiKey: "N1BM63Y2TUKTX8ZW9MXKCNQ8BPZH73MKIY"
  },
  sourcify: {
    enabled: true
  }
};
