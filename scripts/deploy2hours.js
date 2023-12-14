const hre = require("hardhat");

// sepolia 0xD1527dAD267431d60d741DBa77266287BD6011f4
// https://sepolia.etherscan.io/address/0xD1527dAD267431d60d741DBa77266287BD6011f4#code

// goerli 0xd81cD070c56E208764f4858c5fD2a888EF30C04b
// https://goerli.etherscan.io/address/0xd81cD070c56E208764f4858c5fD2a888EF30C04b#code

// npx hardhat run scripts/deploy2hours.js --network sepolia
// npx hardhat run scripts/deploy2hours.js --network goerli

// npx hardhat verify --network sepolia "0xD1527dAD267431d60d741DBa77266287BD6011f4" "0xc6ed73E7Af918b5F39e06F9b95FEA8618533DCc9" 10000 7200 "0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6"
// npx hardhat verify --network goerli "0xd81cD070c56E208764f4858c5fD2a888EF30C04b" "0x3128ef7F0933cF2bA18f1Ef7280A7b684347B115" 10000 7200 "0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6"

// hash = 0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6
// key = 91da4c39f3ed254dae255386562de78ce3ef3c38d9aef8266dea53b52152c577
// ether = 0.00000000000001

async function main() {
  const timeout = 7200;
  const amount = 10000;
  const hash =
    "0xdc5c3c0ed3ecff0e08285e5f2588989a35c0c8653f380cc03465481bfe1d32c6";
  const addr1 = "0xc6ed73E7Af918b5F39e06F9b95FEA8618533DCc9";
  const addr2 = "0x3128ef7F0933cF2bA18f1Ef7280A7b684347B115";

  // sepolia
  // const CrossChainAtomicSwap = await hre.ethers.deployContract(
  //   "CrossChainAtomicSwap",
  //   [addr1, amount, timeout, hash]
  // );

  // goerli
  const CrossChainAtomicSwap = await hre.ethers.deployContract(
    "CrossChainAtomicSwap",
    [addr2, amount, timeout, hash]
  );

  await CrossChainAtomicSwap.waitForDeployment();

  console.log(
    `CrossChainAtomicSwap deployed to ${CrossChainAtomicSwap.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
