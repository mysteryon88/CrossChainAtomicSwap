const hre = require("hardhat");

// sepolia 0x63cE5b209c1ebe3E48312a62e830791B33A1dC22
// https://sepolia.etherscan.io/address/0x63cE5b209c1ebe3E48312a62e830791B33A1dC22#code

// npx hardhat run scripts/deploy10minutes.js --network sepolia

// npx hardhat verify --network sepolia "0x63cE5b209c1ebe3E48312a62e830791B33A1dC22" "0xc6ed73E7Af918b5F39e06F9b95FEA8618533DCc9" 10000 60 "0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6"

// hash = 0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6
// key = 91da4c39f3ed254dae255386562de78ce3ef3c38d9aef8266dea53b52152c577
// ether = 0.00000000000001
  
async function main() {
  const timeout = 600;
  const amount = 10000;
  const hash =
    "0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6";
  const addr1 = "0xc6ed73E7Af918b5F39e06F9b95FEA8618533DCc9";
  const addr2 = "0x3128ef7F0933cF2bA18f1Ef7280A7b684347B115";

  // sepolia
  const CrossChainAtomicSwap = await hre.ethers.deployContract(
    "CrossChainAtomicSwap",
    [addr1, amount, timeout, hash]
  );

  // goerli
  // const CrossChainAtomicSwap = await hre.ethers.deployContract(
  //   "CrossChainAtomicSwap",
  //   [addr2, amount, timeout, hash]
  // );

  await CrossChainAtomicSwap.waitForDeployment();

  console.log(
    `CrossChainAtomicSwap deployed to ${CrossChainAtomicSwap.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
