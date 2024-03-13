const Moralis = require("moralis").default;
const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');
var ethers = require('ethers');
const { tessera, quorum } = require("./keys.js");

const contractsPath = path.resolve(__dirname, '../', 'contracts');
const host = quorum.rpcnode.url;
const accountPrivateKey = quorum.rpcnode.accountPrivateKey;

function writeToFile(filePath, data) {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data written to file successfully!');
    }
  });
}

function buildSources() {
  const sources = {};
  const contractsFiles = fs.readdirSync(contractsPath);
  contractsFiles.forEach(file => {
    if(file.endsWith(".sol")){
      const contractFullPath = path.resolve(contractsPath, file);
      sources[file] = {
        content: fs.readFileSync(contractFullPath, 'utf8')
      };
    }
  });
  return sources;
}

const input = {
	language: 'Solidity',
	sources: buildSources(),
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*', 'evm.bytecode'  ]
			}
		}
	}
}

function compileContracts() {
  const stringifiedJson = JSON.stringify(input);
  const compilationResult = solc.compile(stringifiedJson);
  const output = JSON.parse(compilationResult);
	const compiledContracts = output.contracts;
	for (let contract in compiledContracts) {
		for(let contractName in compiledContracts[contract]) {
			fs.outputJsonSync(
				path.resolve(contractsPath, `${contractName}.json`),
				compiledContracts[contract][contractName], { spaces: 2 }
			)
		}
	}
}

async function createContract(provider, wallet, contractAbi, contractByteCode,contractInit) {
  const factory = new ethers.ContractFactory(contractAbi, contractByteCode, wallet);
  const contract = await factory.deploy(contractInit);
  // The contract is NOT deployed yet; we must wait until it is mined
  const deployed = await contract.waitForDeployment();
  //The contract is deployed now
  return contract
};

async function upload_to_blockchain(data_url){
  const contractJsonPath = path.resolve(__dirname, '../','contracts','SimpleStorage.json');
  const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
  const contractAbi = contractJson.abi;
  const contractBytecode = contractJson.evm.bytecode.object
  const provider = new ethers.JsonRpcProvider(host);
  const wallet = new ethers.Wallet(accountPrivateKey, provider);

  createContract(provider, wallet, contractAbi, contractBytecode, data_url)
  .then(async function(contract){
    contractAddress = await contract.getAddress();
    console.log("Contract deployed at address: " + contractAddress);

  })
  .catch(console.error);
}
async function uploadToIpfs() {

  await Moralis.start({
    apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjA2ZTJjNWNiLWVkZWYtNDRhNS1iMjhhLWY3M2ZiNzFlNzcxYiIsIm9yZ0lkIjoiMzE1NDQ1IiwidXNlcklkIjoiMzI0MzI3IiwidHlwZUlkIjoiNGRiMzBhNzktOWU4OS00MzVjLWE3NjAtY2QzMGQ4Y2M5MjcwIiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDczNTQ4NTQsImV4cCI6NDg2MzExNDg1NH0.SWiawFs1H2oxjanKPvXGv2QWLjQhGrLqJzaUzMAd804",
  });

  const uploadArray = [{ path: "./data/child-data.csv", content: fs.readFileSync("./data/child-data.csv", { encoding: 'base64' }) }]

  const response = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: uploadArray,
  });

  console.log(response.result[0].path)

  return response.result[0].path
}

const main = () => {
  var path = uploadToIpfs();
	//compileContracts();
  upload_to_blockchain(path);
}

if (require.main === module) {
  main();
}

module.exports = exports = main
