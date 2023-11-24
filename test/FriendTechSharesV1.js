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
    const FriendtechSharesV1 = await ethers.getContractFactory(
      "FriendtechSharesV1"
    );
    [owner, addr1, addr2] = await ethers.getSigners();

    friendtechShares = await upgrades.deployProxy(
      FriendtechSharesV1,
      [initialPrice],
      { initializer: "initialize" }
    );
    await friendtechShares.waitForDeployment();
  });

  it("should initialize the contract correctly", async () => {
    expect(await friendtechShares.initialPrice()).to.equal(initialPrice);
    expect(await friendtechShares.protocolFeeDestination()).to.equal(
      ethers.ZeroAddress
    );
    expect(await friendtechShares.protocolFeePercent()).to.equal(0);
    expect(await friendtechShares.subjectFeePercent()).to.equal(0);
  });

  it("should set fee destination correctly", async () => {
    const feeDestination = addr1.address;
    await friendtechShares.setFeeDestination(feeDestination);
    const storedProtocolFeeDestination =
      await friendtechShares.protocolFeeDestination();
    expect(storedProtocolFeeDestination).to.equal(feeDestination);
  });

  it("should set protocol fee percent correctly", async () => {
    await friendtechShares.setProtocolFeePercent(protocolFeePercent);
    const storedProtocolFeePercent =
      await friendtechShares.protocolFeePercent();
    expect(storedProtocolFeePercent).to.equal(protocolFeePercent);
  });

  it("should set subject fee percent correctly", async () => {
    await friendtechShares.setSubjectFeePercent(subjectFeePercent);
    const storedSubjectFeePercent = await friendtechShares.subjectFeePercent();
    expect(storedSubjectFeePercent).to.equal(subjectFeePercent);
  });

  it("should set subject way correctly", async () => {
    const sharesSubject = addr1.address;
    const sharesWay = 1;
    await friendtechShares.setSubjectWay(sharesSubject, sharesWay);
    const storedSharesWay = await friendtechShares.sharesWay(sharesSubject);
    expect(storedSharesWay).to.equal(sharesWay);
  });

  it("should allow to users to buy shares", async () => {
    const sharesSubject = addr1.address;
    const amountToBuy = 100;
    await expect(() =>
      friendtechShares.connect(addr1).buyShares(sharesSubject, amountToBuy, {
        value: ethers.parseEther("15"), // Send more than the calculated price to cover fees
      })
    ).to.changeEtherBalance(addr1, ethers.parseEther("-15"));
    const sharesBalance = await friendtechShares.sharesBalance(
      sharesSubject,
      owner.address
    );
    const sharesSupply = await friendtechShares.sharesSupply(sharesSubject);
    expect(sharesBalance).to.equal(ethers.toBigInt(0));
    expect(sharesSupply).to.equal(ethers.toBigInt(100));
  });

  it("should allow to users to sell shares", async () => {
    const sharesSubject = addr1.address;
    const amountToSell = 20;
    await expect(() =>
      friendtechShares.connect(addr1).buyShares(sharesSubject, 100, {
        value: ethers.parseEther("15"), // Send more than the calculated price to cover fees
      })
    ).to.changeEtherBalance(addr1, ethers.parseEther("-15"));
    await expect(() =>
      friendtechShares.connect(addr2).buyShares(sharesSubject, 40, {
        value: ethers.parseEther("6"), // Send more than the calculated price to cover fees
      })
    ).to.changeEtherBalance(addr2, ethers.parseEther("-6"));
    const sellPrice = await friendtechShares.getPrice(120, 20, addr1.address);
    // Sell shares
    await expect(() =>
      friendtechShares.connect(addr2).sellShares(sharesSubject, amountToSell)
    ).to.changeEtherBalance(addr2, ethers.parseEther(await ethers.formatEther(sellPrice))); // Sell price is less than the purchase price
    const sharesBalance = await friendtechShares.sharesBalance(
      sharesSubject,
      addr2.address
    );
    const sharesSupply = await friendtechShares.sharesSupply(sharesSubject);
    expect(sharesBalance).to.equal(ethers.toBigInt(20));
    expect(sharesSupply).to.equal(ethers.toBigInt(120));
  });
});
