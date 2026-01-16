const connectBtn = document.getElementById("connectBtn");
const statusEl = document.getElementById("status");
const addressEl = document.getElementById("address");
const networkEl = document.getElementById("network");
const balanceEl = document.getElementById("balance");
const identityEl = document.getElementById("identity");

const AVALANCHE_FUJI_CHAIN_ID = "0xa869"; // 43113

function setStatus(text, type = null) {
  statusEl.textContent = text;
  statusEl.className = type ? type : "";
}

function shorten(addr) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";
}

async function connectWallet() {
  if (!window.ethereum) {
    setStatus("❌ Wallet tidak terdeteksi. Install Core Wallet / MetaMask.", "error");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[0];

    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    if (chainId === AVALANCHE_FUJI_CHAIN_ID) {
      setStatus("✅ Connected to Avalanche Fuji Testnet", "success");
      networkEl.textContent = "Avalanche Fuji Testnet";
    } else {
      setStatus("❌ Wrong Network. Switch ke Avalanche Fuji.", "error");
      networkEl.textContent = `ChainId: ${chainId}`;
    }

    addressEl.textContent = `${shorten(account)} — Fajar Ariyanto — NIM: 241011403186`;

    const balanceWei = await window.ethereum.request({
      method: "eth_getBalance",
      params: [account, "latest"],
    });
    const balanceEth = Number(BigInt(balanceWei)) / 1e18;
    balanceEl.textContent = `${balanceEth.toFixed(5)} AVAX`;

    connectBtn.disabled = true;
  } catch (err) {
    setStatus(`❌ Error: ${err.message}`, "error");
  }
}

connectBtn.addEventListener("click", connectWallet);

if (window.ethereum) {
  window.ethereum.on("accountsChanged", () => {
    setStatus("🔄 Akun berubah — silakan connect ulang.", "error");
    connectBtn.disabled = false;
    addressEl.textContent = "-";
    balanceEl.textContent = "-";
  });

  window.ethereum.on("chainChanged", () => {
    setStatus("🔄 Network berubah — silakan connect ulang.", "error");
    connectBtn.disabled = false;
    networkEl.textContent = "-";
  });
}