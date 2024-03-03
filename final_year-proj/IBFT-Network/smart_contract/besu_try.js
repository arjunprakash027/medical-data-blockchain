const { Web3 } = require('web3');

// Replace with your Besu node URL
const host = "http://127.0.0.1:8545";
const web3 = new Web3(host);

// Check if the connection is successful
web3.eth.net.isListening()
  .then(() => {
    console.log(`Connected to Besu node at ${host}`);

    // Retrieve the latest block number
    web3.eth.getBlockNumber()
      .then((blockNumber) => {
        console.log(`Latest block number: ${blockNumber}`);
      })
      .catch((error) => {
        console.error(`Error retrieving block number: ${error.message}`);
      });
  })
  .catch((error) => {
    console.error(`Unable to connect to Besu node: ${error.message}`);
  });
