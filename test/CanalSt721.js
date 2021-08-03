const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("CanalSt721.makeReplica", function() {
  it("should mint a replica of an ERC 721 token and send it to the message sender", async function() {
    const testNftTokenUri = 'https://dscanlon.com/testnft';
    const TestNFT = await ethers.getContractFactory("TestNFT");
    const testNFT = await TestNFT.deploy();
    await testNFT.deployed();
    const originalTokenAddress = testNFT.address;
    console.log('originalTokenAddress', originalTokenAddress);

    const initialMakeReplicaPrice = ethers.utils.parseEther('1');
    const CanalSt721 = await ethers.getContractFactory("CanalSt721")
    const canalSt721 = await upgrades.deployProxy(CanalSt721, []);
    await canalSt721.deployed();
    await canalSt721.setMakeReplicaPrice(initialMakeReplicaPrice);
    
    const [signerOwner, signerOriginalNFTOwner, signerReplicaMaker] = await ethers.getSigners();
    await testNFT.connect(signerOriginalNFTOwner).createToken(testNftTokenUri);
    await canalSt721.connect(signerReplicaMaker).makeReplica(originalTokenAddress, 1, '', { value: ethers.utils.parseEther('1') });

    const replicaTokenUri = await canalSt721.tokenURI(1);
    expect(replicaTokenUri).to.eq(testNftTokenUri);

    const replicaTokenOwner = await canalSt721.ownerOf(1);
    expect(replicaTokenOwner).to.eq(signerReplicaMaker.address);

    const accounts = await ethers.provider.listAccounts();
    const balances = await Promise.all(accounts.map(async (address) => ethers.utils.formatEther(await waffle.provider.getBalance(address))));
  });
})

// describe("CanalSt721", function() {
//   it('upgrades successfully', async () => {
//     const CanalSt721 = await ethers.getContractFactory("CanalSt721");
//     const BoxV2 = await ethers.getContractFactory("TestCanalSt721_V2");
  
//     const instance = await upgrades.deployProxy(Box, [ethers.utils.parseEther('0.002')]);
//     const upgraded = await upgrades.upgradeProxy(instance.address, BoxV2);

//     const value = await upgraded.value();
//     expect(value.toString()).to.equal('42');
//   });
// });