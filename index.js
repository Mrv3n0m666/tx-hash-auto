import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import chalk from "chalk";
import figlet from "figlet";
import solc from "solc";
import path from "path";
import { exit } from "process";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

let savedOption = null;
let savedTransactionCount = null;
let savedCoinChoice = null;

// Function to display ASCII banner
function showBanner() {
    console.clear();
    console.log(chalk.blueBright(figlet.textSync("TX & HASH AUTO", { horizontalLayout: "fitted" })));
    console.log(chalk.greenBright("🔥 Created by v3n0m 🔥"));
    console.log(chalk.greenBright("🔥 x.com | mrv3n0mm 🔥\n"));
}

// Function to fetch and display wallet info
async function showWalletInfo() {
    const balance = await provider.getBalance(wallet.address);
    console.log(chalk.yellow("💳 Wallet Information"));
    console.log(chalk.cyan(`🔹 Address: ${wallet.address}`));
    console.log(chalk.green(`🔹 Balance: ${ethers.formatEther(balance)} ETH\n`));
}

// Function to compile and deploy the contract
async function deployContract() {
    // Ask for token details
    const tokenName = await askQuestion(chalk.magenta("Enter token name: "));
    const tokenSymbol = await askQuestion(chalk.magenta("Enter token symbol (e.g., MTK): "));
    const totalSupply = await askQuestion(chalk.magenta("Enter token total supply: "));

    const contractPath = path.resolve("auto.sol");

    if (!fs.existsSync(contractPath)) {
        console.log(chalk.red(`❌ File ${contractPath} not found.`));
        return;
    }

    const contractSource = fs.readFileSync(contractPath, "utf8");

    function findImports(importPath) {
        const fullPath = path.resolve("node_modules", importPath);
        if (fs.existsSync(fullPath)) {
            return { contents: fs.readFileSync(fullPath, "utf8") };
        } else {
            return { error: "File not found" };
        }
    }

    const input = {
        language: "Solidity",
        sources: {
            "auto.sol": { content: contractSource }
        },
        settings: {
            outputSelection: {
                "*": {
                    "*": ["abi", "evm.bytecode.object"]
                }
            }
        }
    };

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    if (!output.contracts || !output.contracts["auto.sol"]) {
        console.log(chalk.red("❌ Compile error: output.contracts['auto.sol'] not found."));
        console.log("🛠 Compiler output:", JSON.stringify(output, null, 2));
        return;
    }

    const contractName = Object.keys(output.contracts["auto.sol"])[0];
    const contractData = output.contracts["auto.sol"][contractName];

    if (!contractData || !contractData.evm || !contractData.evm.bytecode.object) {
        console.log(chalk.red(`❌ Compilation failed! Bytecode not found.`));
        console.log("🛠 Compiler output:", JSON.stringify(output, null, 2));
        return;
    }

    const contractFactory = new ethers.ContractFactory(
        contractData.abi,
        contractData.evm.bytecode.object,
        wallet
    );

    console.log(chalk.yellow("⏳ Deploying contract..."));
    try {
        const contract = await contractFactory.deploy(tokenName, tokenSymbol, Number(totalSupply), wallet.address);
        await contract.waitForDeployment();
        console.log(chalk.green(`✅ Contract deployed! Address: ${chalk.blue(await contract.getAddress())}`));
    } catch (error) {
        console.log(chalk.red(`❌ Deployment failed: ${error.message}`));
    }

    console.log(chalk.greenBright("\n🎉 Deployment completed! (No Looping)\n"));
    process.exit(0);
}

// Function to handle automatic transactions
async function autoTransaction() {
    let option = savedOption;
    let transactionCount = savedTransactionCount;
    let coinChoice = savedCoinChoice;

    if (option === null || transactionCount === null || coinChoice === null) {
        option = await askQuestion(chalk.magenta("\nSelect transaction option (1: Burn Address, 2: KYC Wallets): "));
        transactionCount = await askQuestion(chalk.magenta("Enter number of transactions: "));
        console.log(chalk.magenta("\nSelect coin for transaction:"));
        console.log(chalk.yellow("1: ETH"));
        console.log(chalk.yellow("2: Custom Token"));
        coinChoice = await askQuestion(chalk.magenta("Choose: "));

        savedOption = option;
        savedTransactionCount = Number(transactionCount);
        savedCoinChoice = coinChoice;
    }

    const file = option === "1" ? "burnAddress.txt" : "KycAddress.txt";

    if (!fs.existsSync(file)) {
        console.log(chalk.red(`❌ File ${file} not found.`));
        return;
    }

    const addresses = fs.readFileSync(file, "utf-8").split("\n").map(addr => addr.trim()).filter(addr => addr);

    let contract = null;
    let tokenSymbol = "ETH";
    let decimals = 18;

    if (coinChoice === "2") {
        const tokenAddress = await askQuestion(chalk.magenta("Input contract address for token: "));
        tokenSymbol = await askQuestion(chalk.magenta("Input token symbol: "));
        const tokenDecimals = await askQuestion(chalk.magenta("Enter the number of decimal places for the token (usually 18): "));
        decimals = Number(tokenDecimals);

        const tokenAbi = [
            "function transfer(address to, uint256 amount) public returns (bool)",
            "function balanceOf(address account) public view returns (uint256)"
        ];
        contract = new ethers.Contract(tokenAddress, tokenAbi, wallet);
    }

    console.log(chalk.yellow("\n🚀 Starting Transactions...\n"));

    for (let i = 0; i < savedTransactionCount; i++) {
        const recipient = addresses[Math.floor(Math.random() * addresses.length)];
        const amount = (Math.random() * (0.09 - 0.01) + 0.01).toFixed(4);

        console.log(chalk.blueBright(`🔹 Transaction ${i + 1}/${savedTransactionCount}`));
        console.log(chalk.cyan(`➡ Sending ${chalk.green(amount + " " + tokenSymbol)} to ${chalk.yellow(recipient)}`));

        try {
            let tx;
            if (coinChoice === "2") {
                // Token transaction
                const amountWei = ethers.parseUnits(amount, decimals);
                tx = await contract.transfer(recipient, amountWei);
            } else {
                // ETH transaction
                tx = await wallet.sendTransaction({
                    to: recipient,
                    value: ethers.parseEther(amount)
                });
            }

            console.log(chalk.green(`✅ Success! TX Hash: ${chalk.blue(tx.hash)}`));
            await tx.wait();
        } catch (error) {
            console.log(chalk.red(`❌ Transaction failed: ${error.message}`));
        }

        console.log(chalk.gray("⌛ Waiting 35 seconds before next transaction...\n"));
        await new Promise(res => setTimeout(res, 25000));
    }

    console.log(chalk.greenBright("\n🎉 All transactions completed! Next run in 24 hours.\n"));
    setTimeout(autoTransaction, 86400000); // Restart after 24 hours
}

// Function to handle user input
async function askQuestion(query) {
    process.stdout.write(chalk.yellow(query));
    return new Promise(resolve => {
        process.stdin.once("data", data => resolve(data.toString().trim()));
    });
}

// Main process function
async function startProcess() {
    showBanner();
    await showWalletInfo();

    console.log(chalk.magenta("\nSelect option:"));
    console.log(chalk.yellow("1: Deploy Contract ERC20"));
    console.log(chalk.yellow("2: Auto Transaction (sending token)"));

    const choice = await askQuestion("Choose: ");

    if (choice === "1") {
        await deployContract();
    } else if (choice === "2") {
        await autoTransaction();
    } else {
        console.log(chalk.red("❌ Invalid option! Restarting..."));
        setTimeout(startProcess, 10000);
    }
}

// Start the process
startProcess();