const Web3 = require('web3');
const web3 = new Web3('http://localhost:7545');

const abi = require('./StoreValue.json');
console.log(abi)

const contract = new web3.eth.Contract(abi, '0x7e492603586129825A4f5b1cE9eE9dabB9e8A358');

const out = contract.methods.get_output().call().then(value => {
    console.log('Return value:', value);
  }).catch(error => {
    console.error('Error:', error);
  });