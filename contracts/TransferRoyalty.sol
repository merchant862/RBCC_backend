// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

library SafeMath {
    function add(uint a, uint b) internal pure returns(uint c) {
        c = a + b;
        require(c >= a);
    }
    function sub(uint a, uint b) internal pure returns(uint c) {
        require(b <= a);
        c = a - b;
    }
    function mul(uint a, uint b) internal pure returns(uint c) {
        c = a * b;
        require(a == 0 || c / a == b);
    }
    function div(uint a, uint b) internal pure returns(uint c) {
        require(b > 0);
        c = a / b;
    }
}

contract MultiSend {
    
    using SafeMath for uint256;
    
    address private owner;

    //uint256 public timeLocked = 1 minutes;
    
    modifier isOwner() 
    {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    /* modifier isLocked()
    {
        require(block.timestamp >= timeLocked, "Withdrawal Locked for 1 min!");
        _;
    } */
    
    constructor() {
        owner = msg.sender;
    }
    
    
    function getOwner() external view returns (address) {
        return owner;
    }

    receive() external payable {
    }
    
    function withdrawls(address payable[] memory addrs) payable public isOwner /* isLocked */ {
        
        //require(msg.value > 0, "Insufficient fund");
        
        for (uint i=0; i < addrs.length; i++) 
        {
            uint256 balance = address(this).balance;
            uint256 value = (balance/2)/addrs.length;
            addrs[i].transfer(value);
        }

        //timeLocked = timeLocked + block.timestamp;

    }
    
}