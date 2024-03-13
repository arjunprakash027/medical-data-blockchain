
const fs = require('fs-extra');
const path = require('path');
var ethers = require('ethers');
const { tessera, quorum } = require("./keys.js");


const host = quorum.rpcnode.url;
async function getValueAtAddress(provider, deployedContractAbi, deployedContractAddress){
    const contract = new ethers.Contract(deployedContractAddress, deployedContractAbi, provider);
    const res = await contract.get();
    console.log("Data URL: "+ res);
    return res
  }

async function get_value(deployedContractAddress){
    const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
    const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
    const contractAbi = contractJson.abi;
    const provider = new ethers.JsonRpcProvider(host);
    await getValueAtAddress(provider, contractAbi, deployedContractAddress);
  }

  if (require.main === module) {
    get_value("0xeB35B7bA819DAD84E60752c357d45e5ce41D85c5");
  }


