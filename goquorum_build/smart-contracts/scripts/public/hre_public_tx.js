const path = require('path');
const fs = require('fs-extra');
var ethers = require('ethers');

// RPCNODE details
const { tessera, quorum } = require("../keys.js");
const host = quorum.rpcnode.url;
const accountPrivateKey = "0x8bbbb1b345af56b560a5b20bd4b0ed1cd8cc9958a16262bc75118453cb546df8";

console.log("acc private key:",accountPrivateKey)
console.log("rpc node url",host)
// abi and bytecode generated from simplestorage.sol:
// > solcjs --bin --abi simplestorage.sol
const contractJsonPath = path.resolve(__dirname, '../../','contracts','SimpleStorage.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBytecode = contractJson.evm.bytecode.object

async function getValueAtAddress(provider, deployedContractAbi, deployedContractAddress){
  const contract = new ethers.Contract(deployedContractAddress, deployedContractAbi, provider);
  const res = await contract.get();
  console.log("Obtained value at deployed contract is: "+ res);
  return res
}

// You need to use the accountAddress details provided to Quorum to send/interact with contracts
async function setValueAtAddress(provider, wallet, deployedContractAbi, deployedContractAddress, value){
  const contract = new ethers.Contract(deployedContractAddress, deployedContractAbi, provider);
  const contractWithSigner = contract.connect(wallet);
  const tx = await contractWithSigner.set(value);
  // verify the updated value
  await tx.wait();
  // const res = await contract.get();
  // console.log("Obtained value at deployed contract is: "+ res);
  return tx;
}

async function createContract(provider, wallet, contractAbi, contractByteCode, contractInit) {
  const factory = new ethers.ContractFactory(contractAbi, contractByteCode, wallet);
  const contract = await factory.deploy(contractInit);
  // The contract is NOT deployed yet; we must wait until it is mined
  const deployed = await contract.waitForDeployment();
  //The contract is deployed now
  return contract
};

async function main(){
  const provider = new ethers.JsonRpcProvider(host);
  const wallet = new ethers.Wallet(accountPrivateKey, provider);

  createContract(provider, wallet, contractAbi, contractBytecode, 980)
  .then(async function(contract){
    contractAddress = await contract.getAddress();
    console.log("Contract deployed at address: " + contractAddress);
    console.log("Use the smart contracts 'get' function to read the contract's constructor initialized value .. " )
    await getValueAtAddress(provider, contractAbi, contractAddress);
    console.log("Use the smart contracts 'set' function to update that value to another value .. " );
    await setValueAtAddress(provider, wallet, contractAbi, contractAddress, 2344 );
    console.log("Verify the updated value that was set .. " )
    await getValueAtAddress(provider, contractAbi, contractAddress);
    // await getAllPastEvents(host, contractAbi, tx.contractAddress);
  })
  .catch(console.error);
}

if (require.main === module) {
  main();
}

module.exports = exports = main