// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract CanalStItem is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable owner;

    constructor() ERC721("CanalStItem", "CSI") {
        owner = payable(msg.sender);
    }

    function makeReplica(address nftAddress, uint256 nftTokenId)
        public
        payable
        returns (uint256)
    {
        require(msg.value >= 0, "Value paid must be at least 0");

        // Increment tokens counter
        _tokenIds.increment();

        // Mint new token
        uint256 newReplicaId = _tokenIds.current();
        _mint(msg.sender, newReplicaId);
        console.log(
            "minted new replica token %s, for sender %s",
            newReplicaId,
            msg.sender
        );

        // Get original token's URI, and set it as the new token's URI
        string memory _tokenURI = IERC721Metadata(nftAddress).tokenURI(
            nftTokenId
        );
        _setTokenURI(newReplicaId, _tokenURI);

        // Pay message value to owner if any was included
        if (msg.value > 0) {
            console.log("transferring to owner msg.value %s", msg.value);
            owner.transfer(msg.value);
        }

        return newReplicaId;
    }
}
