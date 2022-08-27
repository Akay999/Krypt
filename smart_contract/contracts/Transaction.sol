//SPDX-License-Identifier: UNLICENSED


pragma solidity ^0.8.0;

contract Transaction {
    uint256 transactionsCounter;

    event Transfer(address sender, address reciever, uint amount, string message, uint256 timestamp, string keyword);

    struct TransferStruct {
        address sender;
        address reciever;
        uint amount;
        uint256 timestamp;
        string keyword;
        string message;
    }

    TransferStruct[] transaction;

    function addToBlockChain(address payable reciever, uint amount, string memory message, string memory keyword) public {
        transactionsCounter += 1;
        transaction.push(TransferStruct(msg.sender, reciever, amount, block.timestamp, message, keyword ));

        emit Transfer(msg.sender, reciever, amount, message, block.timestamp, keyword);

    }

    function listAllTransaction() public view returns (TransferStruct[] memory) {
        return transaction;
    }

    function getTransactionCounts() public view returns (uint256) {
        return transactionsCounter;
    }
}