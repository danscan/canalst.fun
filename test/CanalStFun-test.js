const { expect } = require("chai");

const nftTokenUri = 'https://dscanlon.com/testnft';

describe("CanalStFun", function() {
  it("Should mint a replica of an NFT and send", async function() {
    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNFT = await TestNFT.deploy();
    await testNFT.deployed();
    const testNFTContractAddress = testNFT.address;
    console.log('testNFTContractAddress', testNFTContractAddress);

    const CanalStFun = await ethers.getContractFactory("CanalStFun")
    const canalStFun = await CanalStFun.deploy();
    await canalStFun.deployed();

    await testNFT.createToken(nftTokenUri);
    await canalStFun.makeReplica(testNFTContractAddress, 1, { value: ethers.utils.parseEther('0.0023') });

    const replicaTokenUri = await canalStFun.tokenURI(1);

    expect(replicaTokenUri).to.eq(nftTokenUri);
  });
})