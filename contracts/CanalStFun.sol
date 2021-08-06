// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./SafeAddress.sol";

contract CanalStFun is ERC721URIStorage, Pausable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    /** The minimum value accepted in makeReplica calls */
    uint256 public makeReplicaPrice;

    /** Event emitted when the makeReplicaPrice changes */
    event MakeReplicaPriceChanged(uint256 newMakeReplicaPrice);
    /** Event emitted someone makes a replica */
    event ReplicaCreated(
        address recipient,
        address originalTokenAddress,
        uint256 originalTokenId,
        uint256 replicaTokenId,
        string comment
    );

    constructor() ERC721("CanalStFun", "CSF1") {
        // Initialize makeReplicaPrice to 0
        // Can be overridden by owner
        makeReplicaPrice = 0;
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
        emit MakeReplicaPriceChanged(newMakeReplicaPrice);
    }

    /** ERC721 tokenURI view */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /** CSF1: Make a replica of an original ERC721 token */
    function makeReplica(
        address originalTokenAddress,
        uint256 originalTokenId,
        string memory replicaTokenURI,
        address feeSplitRecipient,
        string calldata optionalComment
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

        // If the feeSplitRecipient address is empty address(0), set it to the token owner address (if there is one)
        if (feeSplitRecipient == address(0)) {
            feeSplitRecipient = IERC721(originalTokenAddress).ownerOf(
                originalTokenId
            );
        }

        // If the feeSplitRecipient address is not a contract, send it half of msg.value
        // Else: Send the contract owner the full msg.value
        if (
            !SafeAddress.isContract(feeSplitRecipient) &&
            feeSplitRecipient != address(0)
        ) {
            uint256 originalTokenOwnerPayment = msg.value / 2;
            uint256 ownerPayment = msg.value - originalTokenOwnerPayment;

            SafeAddress.sendValue(payable(owner()), ownerPayment);
            SafeAddress.sendValue(
                payable(feeSplitRecipient),
                originalTokenOwnerPayment
            );
        } else {
            SafeAddress.sendValue(payable(owner()), msg.value);
        }

        // Emit ReplicaCreated event
        emit ReplicaCreated(
            msg.sender,
            originalTokenAddress,
            originalTokenId,
            replicaTokenId,
            optionalComment
        );

        return replicaTokenId;
    }
}
