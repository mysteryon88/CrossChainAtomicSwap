require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const privateKey = process.env.PRIVATE_KEY;
const sepolia = process.env.URL_SEPOLIA;
const goerli = process.env.URL_GOERLI;
const etherscanKey = process.env.ETHERSCAN_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: sepolia,
      accounts: [`0x${privateKey}`],
    },
    goerli: {
      url: goerli,
      accounts: [`0x${privateKey}`],
    },
  },
  etherscan: {
    apiKey: {
      sepolia: etherscanKey,
      goerli: etherscanKey,
    },
  },
};
