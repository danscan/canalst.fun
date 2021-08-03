// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "./SafeAddress.sol";

contract CanalSt721 is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdCounter;

    // The minimum value accepted in makeReplica calls
    uint256 public makeReplicaPrice;

    function initialize() public initializer {
        __ERC721_init("CanalSt721", "CANAL");
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init();

        makeReplicaPrice = 0;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function setMakeReplicaPrice(uint256 newMakeReplicaPrice) public onlyOwner {
        makeReplicaPrice = newMakeReplicaPrice;
    }

    // Base function that accepts a tokenURI, allowing for optional overrides of original token's URI
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
