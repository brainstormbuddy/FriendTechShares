const { ethers, upgrades } = require("hardhat");

async function main() {
  const Contract = await ethers.getContractFactory("FriendtechSharesV1");
  const contract = await upgrades.deployProxy(
    Contract,
    [0],
    { initializer: 'initialize' }
  );

  await contract.waitForDeployment();
  console.log("FriendtechSharesV1 deployed to:", contract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});