const { expect } = require("chai");

const nftTokenUri = 'https://dscanlon.com/testnft';

describe("CanalStItem", function() {
  it("Should mint a replica of an NFT", async function() {
    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNFT = await TestNFT.deploy();
    await testNFT.deployed();
    const testNFTContractAddress = testNFT.address;
    console.log('testNFTContractAddress', testNFTContractAddress);

    const CanalStItem = await ethers.getContractFactory("CanalStItem")
    const canalStItem = await CanalStItem.deploy();
    await canalStItem.deployed();

    await testNFT.createToken(nftTokenUri);
    await canalStItem.makeReplica(testNFTContractAddress, 1);

    const replicaTokenUri = await canalStItem.tokenURI(1);

    expect(replicaTokenUri).to.eq(nftTokenUri);
  });
})