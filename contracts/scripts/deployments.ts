import { viem } from "hardhat";
import fs from "fs";
import path from "path";
import Artifact from "../artifacts/contracts/simple-storage.sol/SimpleStorage.json";

async function main() {
  const [walletClient] = await viem.getWalletClients();
  const publicClient = await viem.getPublicClient();

  console.log("🚀 Deploying with:", walletClient.account.address);

  const hash = await walletClient.deployContract({
    abi: Artifact.abi,
    bytecode: Artifact.bytecode as `0x${string}`,
    args: [],
  });

  console.log("📨 Tx hash:", hash);

  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  const contractAddress = receipt.contractAddress;

  console.log("✅ Deployed at:", contractAddress);

  // Save deployment info
  const deploymentInfo = {
    contract: "SimpleStorage",
    address: contractAddress,
    network: "fuji",
    timestamp: new Date().toISOString(),
  };

  fs.mkdirSync("deployments", { recursive: true });
  fs.writeFileSync("deployments/deployment.json", JSON.stringify(deploymentInfo, null, 2));
  fs.writeFileSync("deployments/SimpleStorage_ABI.json", JSON.stringify(Artifact.abi, null, 2));

  console.log("📦 Saved to deployments/");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});