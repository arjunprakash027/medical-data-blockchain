from web3 import Web3

# Connect to the local Ganache blockchain
w3 = Web3(Web3.HTTPProvider('HTTP://127.0.0.1:7545'))

# Load the contract ABI
with open('StoreValue.abi', 'r') as file:
    contract_abi = file.read()

# Load the contract address
contract_address = '0xa63d14A864739a156f411cC1701AC2E0228E8EA7'

# Create a contract instance
SimpleContract = w3.eth.contract(address=contract_address, abi=contract_abi)

# Call the contract function
message = SimpleContract.functions.get_output().call()

print(f"Message: {message}")