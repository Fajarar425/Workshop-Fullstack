import { task, type HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { USER_PRIVATE_KEY } from "./helpers/constants/deployment";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.27",
    settings: {
      evmVersion: "shanghai",
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: USER_PRIVATE_KEY ? [USER_PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.SNOWTRACE_API_KEY,
  },
  sourcify: {
    enabled: true,
  },
};

task("accounts", "Prints the list of accounts", async (_, hre) => {
  const accounts = await hre.viem.getWalletClients();
  for (const account of accounts) {
    console.log("Account:", account.account.address);
  }
});

export default config;