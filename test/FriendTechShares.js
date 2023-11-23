const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FriendtechSharesV1", () => {
  let friendtechShares;
  let owner;
  let addr1;
  let addr2;

  const initialPrice = 100;
  const protocolFeePercent = 1;
  const subjectFeePercent = 2;

  beforeEach(async () => {
    const FriendtechSharesV1 = await ethers.getContractFactory("FriendtechSharesV1");
    [owner, addr1, addr2] = await ethers.getSigners();

    friendtechShares = await upgrades.deployProxy(FriendtechSharesV1, [initialPrice], { initializer: 'initialize' });
    await friendtechShares.waitForDeployment();
  });

  it("should initialize the contract correctly", async () => {
    expect(await friendtechShares.initialPrice()).to.equal(initialPrice);
    expect(await friendtechShares.protocolFeeDestination()).to.equal(ethers.ZeroAddress);
    expect(await friendtechShares.protocolFeePercent()).to.equal(0);
    expect(await friendtechShares.subjectFeePercent()).to.equal(0);
  });

  it("should set fee destination correctly", async () => {
    await friendtechShares.setFeeDestination(addr1.address);
    await expect(friendtechShares.protocolFeeDestination()).to.equal(addr1.address);

    await friendtechShares.connect(addr1).setFeeDestination(addr2.address);
    await expect(friendtechShares.protocolFeeDestination()).to.equal(addr2.address);
  });

  it("should set protocol fee percent correctly", async () => {
    await friendtechShares.setProtocolFeePercent(protocolFeePercent);
    expect(await friendtechShares.protocolFeePercent()).to.equal(protocolFeePercent);

    await friendtechShares.connect(addr1).setProtocolFeePercent(3);
    expect(await friendtechShares.protocolFeePercent()).to.equal(3);
  });
});