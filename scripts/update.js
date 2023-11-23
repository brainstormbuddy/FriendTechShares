const { ethers, upgrades } = require("hardhat");
require('dotenv').config();

async function main() {
    const FriendtechSharesV2 = await ethers.getContractFactory("FriendtechSharesV2");
    console.log("Upgrading FriendtechShares...");
    await upgrades.upgradeProxy(process.env.PROXY_CONTRACT_ADDRESS, FriendtechSharesV2);
    console.log("Calculator upgraded");
}

main();