const fs = require('fs');
const path = require('path');
const Tx = require('ethereumjs-tx').Transaction;
const { Web3 } = require('web3')
const web3 = new Web3("http://127.0.0.1:8545/");
// use an existing account, or make an account
const privateKey =
  "0xf93a87950a3fa04c9c319b1c296401306536e81e2c2b79c31caf080b74d6f2db";
const account = web3.eth.accounts.privateKeyToAccount(privateKey);

const privateKeySign =
  "f93a87950a3fa04c9c319b1c296401306536e81e2c2b79c31caf080b74d6f2db";

console.log("account: " + account.address)
// read in the contracts
const contractJsonPath = path.resolve(__dirname, "SimpleStorage.json");
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBinPath = path.resolve(__dirname, "SimpleStorage.bin");
const contractBin = fs.readFileSync(contractBinPath);
// initialize the default constructor with a value `47 = 0x2F`; this value is appended to the bytecode
const contractConstructorInit =
  "000000000000000000000000000000000000000000000000000000000000002F";

// get txnCount for the nonce value

async function main() {
  const txnCount = await web3.eth.getTransactionCount(account.address);
  console.log(txnCount);

  const rawTxOptions = {
    nonce: web3.utils.numberToHex(txnCount),
    from: account.address,
    to: null, // public tx
    value: "0x00",
    data: "0x"+contractBin, // remove "0x" prefix
    gasPrice: "0x00", // Example gas price (adjust as needed)
    gasLimit: "0x24A22",
  };

  console.log(rawTxOptions);

  console.log("private_key", privateKey);

  console.log("Creating transaction...");
  const tx = new Tx(rawTxOptions);
  console.log("Signing transaction...");
  tx.sign(Buffer.from(privateKeySign, 'hex'));
  console.log("Sending transaction...");

  try {
    const pTx = await web3.eth.sendSignedTransaction(
      "0x" + tx.serialize().toString("hex")
    );
    console.log("tx transactionHash: " + pTx.transactionHash);
    console.log("tx contractAddress: " + pTx.contractAddress);
  } catch (error) {
    console.error("Transaction failed:", error);
  }
}

main();
