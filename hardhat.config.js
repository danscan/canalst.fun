require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

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
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
      accounts: [privateKey]
    },
    mainnet: {
      // Infura
      url: `https://mainnet.infura.io/v3/${infuraId}`,
      accounts: [privateKey]
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

