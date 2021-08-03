// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./SafeAddress.sol";

contract CanalStFun is ERC721, ERC721URIStorage, Pausable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // The minimum value accepted in makeReplica calls
    uint256 public makeReplicaPrice;

    constructor() ERC721("CanalStFun", "CSF1") {
        // Initialize makeReplicaPrice to 0
        // Can be overridden by owner
        makeReplicaPrice = 0;
    }

    /** Owner-Only Mint */
    function safeMint(address to) public onlyOwner {
        _safeMint(to, _tokenIdCounter.current());
        _tokenIdCounter.increment();
    }

    /** Owner-Only Pause/Unpause */
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /** Owner-Only Set makeReplica Price */
    function setMakeReplicaPrice(uint256 newMakeReplicaPrice) public onlyOwner {
        makeReplicaPrice = newMakeReplicaPrice;
    }

    /** Hook: Called before token transfer */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    /** Holders can burn their tokens */
    function _burn(uint256 tokenId)
        internal
        override(ERC721, ERC721URIStorage)
    {
        super._burn(tokenId);
    }

    /** ERC721 tokenURI view */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /** CSF1: Make a replica of an original token */
    function makeReplica(
        address originalTokenAddress,
        uint256 originalTokenId,
        string memory replicaTokenURI
    ) public payable returns (uint256) {
        require(
            msg.value >= makeReplicaPrice,
            "calls to makeReplica must have a msg.value of at least makeReplicaPrice"
        );

        // If the replicaTokenURI is empty, set it to the original token's URI
        if (bytes(replicaTokenURI).length == 0) {
            replicaTokenURI = IERC721Metadata(originalTokenAddress).tokenURI(
                originalTokenId
            );
        }

        // Mint the replica token and set its tokenURI
        _tokenIdCounter.increment();
        uint256 replicaTokenId = _tokenIdCounter.current();
        _safeMint(msg.sender, replicaTokenId);
        _setTokenURI(replicaTokenId, replicaTokenURI);

        // Get the address of the original token's owner
        address originalTokenOwner = IERC721(originalTokenAddress).ownerOf(
            originalTokenId
        );

        // If the original token owner is not a contract, send them half of msg.value
        // Else: Send the contract owner the full msg.value
        if (
            !SafeAddress.isContract(originalTokenOwner) &&
            originalTokenOwner != address(0)
        ) {
            uint256 originalTokenOwnerPayment = msg.value / 2;
            uint256 ownerPayment = msg.value - originalTokenOwnerPayment;

            SafeAddress.sendValue(payable(owner()), ownerPayment);
            SafeAddress.sendValue(
                payable(originalTokenOwner),
                originalTokenOwnerPayment
            );
        } else {
            SafeAddress.sendValue(payable(owner()), msg.value);
        }

        return replicaTokenId;
    }
}
