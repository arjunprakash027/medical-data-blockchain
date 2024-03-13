const Web3 = require('web3');
const web3 = new Web3('http://localhost:7545');

const abi = require('./StoreValue.json');
console.log(abi)

const contract = new web3.eth.Contract(abi, '0x03845ddfbBdF8b9e3dB967e4D990B31a2A0758bC');

const out = contract.methods.get_output().call().then(value => {
    console.log('Return value:', value);
  }).catch(error => {
    console.error('Error:', error);
  });