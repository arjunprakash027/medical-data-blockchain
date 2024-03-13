// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract SimpleStorage {
    string public storedData;
    event stored(address indexed _to, string _data);

    // Mapping to store authorized members
    mapping(address => bool) public authorizedMembers;

    // Address of the contract deployer
    address public owner;

    // Modifier to check if the caller is authorized
    modifier onlyAuthorized() {
        require(authorizedMembers[msg.sender], "Sender is not authorized");
        _;
    }

    // Modifier to check if the caller is the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can manage authorized members");
        _;
    }

    constructor(string memory initVal) {
        emit stored(msg.sender, initVal);
        storedData = initVal;

        // Set the contract deployer as the owner
        owner = msg.sender;

        // Assume the deployer of the contract is initially authorized
        authorizedMembers[msg.sender] = true;
    }

    function get() public view returns (string memory retVal) {
        return storedData;
    }

    function set(string memory newData) public onlyAuthorized {
        emit stored(msg.sender, newData);
        storedData = newData;
    }

    // Function to add or remove authorized members (only callable by the owner)
    function manageAuthorizedMember(address _member, bool _status) public onlyOwner {
        authorizedMembers[_member] = _status;
    }
}
