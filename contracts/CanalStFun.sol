// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract CanalStItem is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable owner;

    constructor() ERC721("CanalSt.Fun", "CSF") {
        owner = payable(msg.sender);
    }

    function makeReplica(address originalNftAddress, uint256 originalNftTokenId)
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
        string memory _tokenURI = IERC721Metadata(originalNftAddress).tokenURI(
            originalNftTokenId
        );
        _setTokenURI(newReplicaId, _tokenURI);

        // Split message value between contract owner and token owner if any was included
        if (msg.value > 1 wei) {
            // Get the payable address
            address payable originalNftTokenOwner = payable(
                IERC721(originalNftAddress).ownerOf(originalNftTokenId)
            );

            // Split the tip
            uint256 halfTip = msg.value / 2;

            // Send half the tip to the original NFT token's owner
            originalNftTokenOwner.transfer(halfTip);
            console.log(
                "sent the original NFT token owner %s half the tip (%s) eth",
                originalNftTokenOwner,
                halfTip
            );

            // Send the remaining half of the tip to the contract owner
            owner.transfer(halfTip);
            console.log(
                "sent the contract owner %s half the tip (%s) eth",
                owner,
                halfTip
            );
        }

        return newReplicaId;
    }
}
