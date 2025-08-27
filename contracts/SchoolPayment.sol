// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SchoolPayment {
    struct Payment {
        string studentId;
        string studentName;
        string paymentType;
        uint256 amount;
        string description;
        address payer;
        uint256 timestamp;
        bool isCompleted;
    }

    mapping(bytes32 => Payment) public payments;
    mapping(address => bytes32[]) public userPayments;
    
    address public owner;
    uint256 public totalPayments;
    
    event PaymentCreated(
        bytes32 indexed paymentId,
        string studentId,
        string paymentType,
        uint256 amount,
        address payer
    );
    
    event PaymentCompleted(
        bytes32 indexed paymentId,
        uint256 timestamp
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function createPayment(
        string memory _studentId,
        string memory _studentName,
        string memory _paymentType,
        uint256 _amount,
        string memory _description
    ) public payable returns (bytes32) {
        require(_amount > 0, "Amount must be greater than 0");
        require(msg.value >= _amount, "Insufficient payment amount");

        bytes32 paymentId = keccak256(
            abi.encodePacked(
                _studentId,
                _paymentType,
                _amount,
                msg.sender,
                block.timestamp
            )
        );

        payments[paymentId] = Payment({
            studentId: _studentId,
            studentName: _studentName,
            paymentType: _paymentType,
            amount: _amount,
            description: _description,
            payer: msg.sender,
            timestamp: block.timestamp,
            isCompleted: true
        });

        userPayments[msg.sender].push(paymentId);
        totalPayments++;

        emit PaymentCreated(paymentId, _studentId, _paymentType, _amount, msg.sender);
        emit PaymentCompleted(paymentId, block.timestamp);

        return paymentId;
    }

    function getPayment(bytes32 _paymentId) public view returns (Payment memory) {
        return payments[_paymentId];
    }

    function getUserPayments(address _user) public view returns (bytes32[] memory) {
        return userPayments[_user];
    }

    function withdraw() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}