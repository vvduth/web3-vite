//require("@nomicfoundation/hardhat-toolbox");

require('@nomiclabs/hardhat-waffle')
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/fJng_rnHEHUjrIKrGttOqZ1oJq9ePQOi',
      accounts: ['229fc080bbf9687c0187b73124e9c7a4e7082921356e198462de27de19fb1daa']
    }
  }
};

// https://eth-goerli.g.alchemy.com/v2/fJng_rnHEHUjrIKrGttOqZ1oJq9ePQOi
