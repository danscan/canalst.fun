require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      // accounts: [{ privateKey, balance: '1000000000000000000' }],
      // forking: {
      //   url: 'https://eth-mainnet.alchemyapi.io/v2/atdJm1pAkpGkAQMYkk4yBSjzJ7ziYnl9',
      //   enabled: true,
      // }
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

