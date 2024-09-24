const Moralis = require("moralis").default;
const fs = require("fs");



function writeToFile(filePath, data) {
  fs.writeFile(filePath, data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('Data written to file successfully!');
    }
  });
}

async function uploadToIpfs() {

  await Moralis.start({
    apiKey: "",
  });

  const uploadArray = [{ path: "child-data.csv", content: fs.readFileSync('README.md', { encoding: 'base64' }) }]

  const response = await Moralis.EvmApi.ipfs.uploadFolder({
    abi: uploadArray,
  });

  console.log(response.result[0].path)
  data = `pragma solidity ^0.8.12;

contract StoreValue{
    // Defining a function
    function get_output() public pure returns (string memory){
        return ("${response.result[0].path}");
    }
}`

writeToFile("./contracts/StoreValue.sol", data);
}

uploadToIpfs();
