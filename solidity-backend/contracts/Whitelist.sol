// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Whitelist{
    //max number of whitelisted address allowed 255;

    uint8 public maxWhitelistedAddress;
    //for enxuring a address that it is whitelisted or not
    mapping (address => bool) public WhitelistAddress;
        // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted

uint8 public numAddressesWhitelisted;
constructor(uint8 _maxWhitelistedAddresses){
    maxWhitelistedAddress=_maxWhitelistedAddresses;
}

function addAddressToWhitelist() public {
    require(!WhitelistAddress[msg.sender],"Caller is already a whitelisted");
    require(numAddressesWhitelisted<maxWhitelistedAddress,"adding this result in overflow for uint8 which is upper limit of whitelistedAddress");
    WhitelistAddress[msg.sender]=true;
    numAddressesWhitelisted+=1;


    
}

}