require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const { task } = require("hardhat/config");

const {
  MNEMONIC,
  APOTHEM_RPC_URL,
  MAINNET_RPC_URL,
  SEPOLIA_RPC,
  POLYGON_MUMBAI_RPC,
} = process.env;

const sharedNetworkConfig = {
  accounts: {
    mnemonic: MNEMONIC ?? DEFAULT_MNEMONIC,
  },
};

task(
  "account",
  "returns nonce and balance for specified address on multiple networks"
)
  .addParam("address")
  .setAction(async (address) => {
    const web3Sepolia = createAlchemyWeb3(SEPOLIA_RPC);
    const web3Mumbai = createAlchemyWeb3(POLYGON_MUMBAI_RPC);
    const web3Mainnet = createAlchemyWeb3(MAINNET_RPC_URL);
    const web3Apothem = createAlchemyWeb3(APOTHEM_RPC_URL);
    // const web3Arb = createAlchemyWeb3(API_URL_ARBITRUM);
    // const web3Opt = createAlchemyWeb3(API_URL_OPTIMISM);

    const networkIDArr = [
      "Ethereum sepolia:",
      "Polygon  Mumbai:",
      "XDC Mainnet:",
      "Apothem:",
    ];
    const providerArr = [web3Sepolia, web3Mumbai, web3Mainnet, web3Apothem];
    const resultArr = [];

    for (let i = 0; i < providerArr.length; i++) {
      const nonce = await providerArr[i].eth.getTransactionCount(
        address.address,
        "latest"
      );
      const balance = await providerArr[i].eth.getBalance(address.address);
      resultArr.push([
        networkIDArr[i],
        nonce,
        parseFloat(providerArr[i].utils.fromWei(balance, "ether")).toFixed(2) +
          "ETH",
      ]);
    }
    resultArr.unshift(["  |NETWORK|   |NONCE|   |BALANCE|  "]);
    console.log(resultArr);
  });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    mainnet: {
      ...sharedNetworkConfig,
      url: MAINNET_RPC_URL,
    },
    apothem: {
      ...sharedNetworkConfig,
      url: APOTHEM_RPC_URL,
      gasPrice: 50000000000,
    },
    sepolia: {
      ...sharedNetworkConfig,
      url: SEPOLIA_RPC,
    },
    polygonMumbai: {
      ...sharedNetworkConfig,
      url: POLYGON_MUMBAI_RPC,
    },
  },
};
