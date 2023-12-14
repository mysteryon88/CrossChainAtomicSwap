// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrossChainAtomicSwap {
    address public partyA;
    address public partyB;
    uint public amount;
    uint public timeout;
    bool public partyADeposited;
    bool public partyBDeposited;
    bytes32 public hash;

    constructor(address _partyB, uint _amount, uint _timeout, bytes32 _hash) {
        partyA = msg.sender;
        partyB = _partyB;
        amount = _amount;
        timeout = block.timestamp + _timeout;
        hash = _hash;
    }

    modifier isNotExpired() {
        require(block.timestamp < timeout, "Swap expired");
        _;
    }

    function deposit() external payable isNotExpired {
        require(msg.sender == partyA, "Only Party A can deposit");
        require(msg.value == amount, "Incorrect deposit amount");
        partyADeposited = true;
    }

    function confirmDeposit(string calldata key) external isNotExpired {
        require(msg.sender == partyB, "Only Party B can confirm deposit");
        require(
            hash == keccak256(abi.encodePacked(key)),
            "Hash does not match"
        );
        partyBDeposited = true;
    }

    function executeSwap() external {
        require(
            partyADeposited && partyBDeposited,
            "Both parties must have deposited"
        );

        payable(partyB).transfer(amount);
    }

    function withdrawal() external {
        require(block.timestamp > timeout, "Swap not yet expired");
        require(!partyBDeposited, "Party B already confirmed the deposit");
        payable(partyA).transfer(amount);
    }
}
