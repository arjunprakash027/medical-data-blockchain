pragma solidity >=0.5.16;

contract SimpleContract {

    function getMessage() public view returns (string memory) {
        return "hello world";
    }
}