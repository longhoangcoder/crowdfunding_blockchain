// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract CampaignFactory {
    address payable[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender)); //creates and deploys a new Campaign contract 
        deployedCampaigns.push(payable(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address payable[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {
    struct Request { //this is a type definition not an instance of a struct 
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals; //this is a reference type 
        uint approvalCount; //this and other variables in struct are value types
    }
       
    address public manager;
    uint public minimumContribution;
    uint public approversCount;
    mapping(address => bool) public approvers;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor (uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true; 
        /*
            adds key 'msg.sender' with value 'true'
            the address corresponding to msg.sender does not actually get stored in the mapping
            becausing mappings don't store keys
            what is stored is a hash coressponding to an index which corresponds to value
        */
        approversCount++;

    }

    function createRequest(string memory description, uint value, address recipient) 
        public restricted {
            //if wanted the person having created a request to have contributed to the campaign
            //require(approvers[msg.sender])
            //requires approvers[msg.sender] to return true
            
            //have to provide values for all the fields declared in the struct definition up top
            Request storage newRequest = requests.push();
            newRequest.description = description;
            newRequest.value = value;
            newRequest.recipient = recipient;
            newRequest.complete = false;
            newRequest.approvalCount = 0;
            /*
                have to use 'memory' when creating the Request because the only variables that can use
                'storage' are the instance variables. As in the only variables  in storage are 
                the instance variables declared above. We cannot point 'newRequest' to any of the
                instance variables above, not even 'requests' because none of them are a single
                Request.

                Local variables like those inside a function are also by default 'memory' I think 
            */

            /*
                alternative syntax for instantiating a struct 
                Request(description, value, recipient, false);
            */
    }

    function approveRequest(uint index) public {
        Request storage request = requests[index];
        //want to be looking at the same Request that exists in storage

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        
        require(!request.complete);
        require(request.approvalCount > (approversCount / 2));

        payable(request.recipient).transfer(request.value);
        //I guess 'transfer' doesn't require the function to have payable modifier

        request.complete = true;
    }

    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance, //how to get the balance of a contract
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

}

/*
    Storage/Memory is either referring to
        - where our contract stores data
        - or how our solidity variables store values  

    Storage
        - where data is stored between function calls
        - instance variables stored in storage 
        - pretty much like a computer's hard drive 
            - data is there when you turn off then turn back on your computer 

    Memory
        - temporary place to store data
        - like a computer's RAM
        - data in RAM doesn't persist when restart your computer 
        - arguments to a function are in "memory"

    How Solidity stores variables 

        Storage
            int[] public numbers;
            numbers.push(20);
            numbers.push(32);

            int storage myArray = numbers;
            //myArray points at the exact storage location/data structure that 'numbers' points at
            //altering myArray will also alter 'numbers'

        Memory
            int[] public numbers;
            numbers.push(20);
            numbers.push(32);

            int memory myArray = numbers;
            //myArray is a copy of numbers but myArray and 'numbers' are two separate objects
            //changing myArray will not change 'numbers'

            When you pass an argument to a function, if that argument is an already existing varaible,
            then you are passing a copy of that variable to the function. In fact, you are always passing 
            a copy. The function uses a copy of the argument you passed  

            function changeArray(int[] memory myArray) private {
                ...
            }

            is the same as 

            function changeArray(int[] myArray) private {
                ...
            }


*/