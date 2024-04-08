
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
    return await getValueAtAddress(provider, contractAbi, deployedContractAddress);
  }


module.exports = get_value



