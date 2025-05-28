# 🚀 AUTO TRANSACTION & DEPLOY TESTNET TOKEN | AIRDROP

![banner](https://img.shields.io/badge/Deployer-ERC20-blue?style=for-the-badge)
![author](https://img.shields.io/badge/Created%20by-Mrv3n0m-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge)

> ⚡ An automated tool to deploy Testnet token ERC-20 smart contracts and perform randomized token/ETH transactions with beautiful CLI visuals. Built for simplicity, speed, and anonymity.

---

## ✨ Features

- 🛠 **Deploy Custom ERC20 Token**
  - Deploys a customizable ERC20 smart contract from `auto.sol`
  - Prompts for token name, symbol, and supply
  - Automatic compilation using `solc`

- 💸 **Auto Transaction Tool**
  - Randomized ETH or custom token transfers to addresses
  - Supports:
    - `burnAddress.txt` for dead wallet spam
    - `KycAddress.txt` for simulated activity
  - 24-hour interval re-loop for continuous operation
  - Adjustable decimals and symbol for any ERC20 token

- 🎨 **Cool CLI UI**
  - Uses `figlet`, `chalk`, and custom ASCII art for clean UX
  - Displays live wallet balance and transaction status
  - Delay between transactions (35s) to mimic organic behavior

---

## 📦 Requirements

- Node.js >= 18.x
- A `.env` file with the following values:

📁 Project Structure
```
tx-hash-auto/
├── auto.sol              # Solidity contract for deployment
├── burnAddress.txt       # List of burn addresses
├── KycAddress.txt        # List of KYC wallet addresses
├── .env                  # Configuration file (do not commit)
├── index.js              # Main application file
├── node_modules/         # Node.js dependencies
├── package.json          # Project metadata and dependencies
└── README.md             # This file
```

⚙️ Installation
```
git clone https://github.com/Mrv3n0m666/tx-hash-auto.git
cd tx-hash-auto
npm install
```
🛠 Setup Your configuration
- input your custom RPC url from any tetnet airdrop
- input your PrivateKey
```
nano .env
```

```env
RPC_URL=https://your_rpc_url_here (Change the RPC url of the airdrop you want to use)
PRIVATE_KEY=your_private_key_here
```
🚀 Usage
➤ Option 1: Deploy ERC20 Contract
```
node index.js
# Then select option 1 when prompted
```
![YGL-deploy](https://github.com/user-attachments/assets/3da621a3-51b5-4e73-9b73-03bfdbbc971a)

- **You will be asked for:**
  - Token name:  (e.g., *YAGOAL TOKEN*)
  - Token symbol: (e.g., *YGL*)
  - Total supply: (e.g., *18*)

➤ Option 2: Auto Transaction
![YGL-tx](https://github.com/user-attachments/assets/d5d40053-bd8b-4034-82cb-358728bd2eb0)

#  SUGGESTION
>  After you deploy the token in option 1, take the CA to import it to the testnet chain that you are using, to push the transaction option 2. 
>  Importing it to your EVM wallet will make it easier to find the CA that you want to use for transactions at a anytime.


![YGL](https://github.com/user-attachments/assets/58af9d2a-b647-4adf-988c-8b366d681c0a)

📄 auto.sol Template
Ensure your `auto.sol` contract looks something like this:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract AutoToken is ERC20 {
    constructor(string memory name, string memory symbol, uint256 supply, address to) ERC20(name, symbol) {
        _mint(to, supply * 10 ** decimals());
    }
}
```

 **Contributing**
  - Fork this repository
  - Create a new branch `(git checkout -b feature/awesome-feature)`
  - Commit your changes `(git commit -m "Add awesome feature")`
  - Push to the branch `(git push origin feature/awesome-feature)`
  - Create a Pull Request

🛑 **Disclaimer**
  - **DYOR. (This does not ensure about eligibility)**
    - ⚠️ This script is for educational and testing purposes only.
    - 🔐 Always secure your private keys and RPC endpoints.
    - 📜 Use testnets or proper compliance if using in production.
    - 👻 I am not responsible for any misuse or financial loss.
    
  ## 📧 Contact
- **Telegram**: [Mr_v3n0mm](https://t.me/Mr_v3n0mm)
- **X**: [mrv3n0mm](https://x.com/mrv3n0mm)
- **Issues**: Report bugs or suggestions at [GitHub Issues](https://github.com/Mrv3n0m666/tx-hash-auto/issues)
  
🧠 **Credits**
- Created with 💀 by: v3n0m
- Follow for updates and more tools.

## 🍻 Buy Me a Drink

If you find this project helpful, feel free to send me a drink. Your support helps fuel more development 🍸

**Solana**: `95JSb5DrCcjLDwUMtCxTHW2MvnKsKCNaYegk6Gipj8EB`  
**ETH/BNB (EVM)**: `0x7d8d9E268Ab62C038d163B6aF37ccaa013e5606a`

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
