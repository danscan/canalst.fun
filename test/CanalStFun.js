const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("CanalStFun.makeReplica", () => {
  const initialMakeReplicaPrice = ethers.utils.parseEther('1');
  const testNftTokenUri = 'https://dscanlon.com/testnft';

  let testNFT;
  let canalStFun;

  let signerOwner;
  let signerOriginalNFTOwner;
  let signerReplicaMaker;

  beforeEach(async () => {
    // Get signer addresses
    const signers = await ethers.getSigners();
    signerOwner = signers[0];
    signerOriginalNFTOwner = signers[1];
    signerReplicaMaker = signers[2];

    // Deploy the TestNFT contract so we have an original ERC 721 NFT to replicate
    const TestNFT = await ethers.getContractFactory("TestNFT");
    testNFT = await TestNFT.deploy();
    await testNFT.deployed();
    // Create a TestNFT token (will have ID 1)
    await testNFT.connect(signerOriginalNFTOwner).createToken(testNftTokenUri);
    
    // Deploy the CanalStFun contract
    const CanalStFun = await ethers.getContractFactory("CanalStFun")
    canalStFun = await CanalStFun.deploy();
    await canalStFun.deployed();
    await canalStFun.setMakeReplicaPrice(initialMakeReplicaPrice);
  });

  it("should mint a replica of an ERC 721 token and send it to the message sender", async () => {
    expect(
      await canalStFun.connect(signerReplicaMaker).makeReplica(
        // address originalTokenAddress
        testNFT.address,
        // uint256 originalTokenId
        1,
        // string memory replicaTokenURI
        '',
        // address feeSplitRecipient
        ethers.utils.getAddress('0x0000000000000000000000000000000000000000'),
        // string calldata optionalComment
        '',
        // overrides, used for setting message value
        { value: ethers.utils.parseEther('1') }
      )
    ).to.changeEtherBalances(
      [
        signerOwner,
        signerOriginalNFTOwner,
        signerReplicaMaker,
      ],
      [
        ethers.utils.parseEther('0.5'),
        ethers.utils.parseEther('0.5'),
        ethers.utils.parseEther('-1'),
      ],
    );

    const replicaTokenUri = await canalStFun.tokenURI(1);
    expect(replicaTokenUri).to.eq(testNftTokenUri);

    const replicaTokenOwner = await canalStFun.ownerOf(1);
    expect(replicaTokenOwner).to.eq(signerReplicaMaker.address);
  });

  it("should accept an override replicaTokenURI value", async () => {
    const overrideReplicaTokenUri = 'https://canalst.fun/test';
    await canalStFun.connect(signerReplicaMaker).makeReplica(
      // address originalTokenAddress
      testNFT.address,
      // uint256 originalTokenId
      1,
      // string memory replicaTokenURI
      overrideReplicaTokenUri,
      // address feeSplitRecipient
      ethers.utils.getAddress('0x0000000000000000000000000000000000000000'),
      // string calldata optionalComment
      '',
      // overrides, used for setting message value
      { value: ethers.utils.parseEther('1') }
    );

    const replicaTokenUri = await canalStFun.tokenURI(1);
    expect(replicaTokenUri).to.eq(overrideReplicaTokenUri);
  });

  it("should accept an override feeSplitRecipient value", async () => {
    expect(
      await canalStFun.connect(signerReplicaMaker).makeReplica(
        // address originalTokenAddress
        testNFT.address,
        // uint256 originalTokenId
        1,
        // string memory replicaTokenURI
        '',
        // address feeSplitRecipient
        signerOwner.address,
        // string calldata optionalComment
        '',
        // overrides, used for setting message value
        { value: ethers.utils.parseEther('1') }
      ),
    ).to.changeEtherBalances(
      [
        signerOwner,
        signerOriginalNFTOwner,
        signerReplicaMaker,
      ],
      [
        ethers.utils.parseEther('1'),
        ethers.utils.parseEther('0'),
        ethers.utils.parseEther('-1'),
      ],
    ).to.emit(canalStFun, 'ReplicaCreated');
  });

  it("should accept an optional comment which appears in the ReplicaCreatedEvent", async () => {
    const optionalComment = 'Hello';
    expect(
      await canalStFun.connect(signerReplicaMaker).makeReplica(
        // address originalTokenAddress
        testNFT.address,
        // uint256 originalTokenId
        1,
        // string memory replicaTokenURI
        '',
        // address feeSplitRecipient
        signerOwner.address,
        // string calldata optionalComment
        optionalComment,
        // overrides, used for setting message value
        { value: ethers.utils.parseEther('1') }
      )
    ).to.emit(canalStFun, 'ReplicaCreated')
    .withArgs(signerReplicaMaker.address, testNFT.address, 1, 1, optionalComment)
  });

  it("should allow the owner to change its makeReplicaPrice", async () => {
    const newMakeReplicaPrice = ethers.utils.parseEther('2');
    await canalStFun.setMakeReplicaPrice(newMakeReplicaPrice);

    expect(await canalStFun.makeReplicaPrice())
      .to.eq(newMakeReplicaPrice)
      .to.emit(canalStFun, 'MakeReplicaPriceChanged')
      .withArgs(newMakeReplicaPrice);

    expect(
      await canalStFun.connect(signerReplicaMaker).makeReplica(
        // address originalTokenAddress
        testNFT.address,
        // uint256 originalTokenId
        1,
        // string memory replicaTokenURI
        '',
        // address feeSplitRecipient
        ethers.utils.getAddress('0x0000000000000000000000000000000000000000'),
        // string calldata optionalComment
        '',
        // overrides, used for setting message value
        { value: ethers.utils.parseEther('1') }
      ),
    ).to.throw();
  });
})
