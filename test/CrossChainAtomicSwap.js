const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

function generateRandomHexString(length) {
  let result = "";
  const characters = "0123456789abcdef";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const timeout = 600;
const amount = 1000;

describe("Grades contract", function () {
  async function deployFixture() {
    const [partyA, partyB, partyC] = await ethers.getSigners();

    const key = generateRandomHexString(64);
    console.log(key);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(key));
    console.log(hash);

    const crossChainAtomicSwap = await ethers.deployContract(
      "CrossChainAtomicSwap",
      [partyB.address, amount, timeout, hash]
    );
    const unlockTime = (await time.latest()) + timeout;

    await crossChainAtomicSwap.waitForDeployment();

    return { crossChainAtomicSwap, partyA, partyB, key, unlockTime };
  }

  it("Bad deposit", async function () {
    const { crossChainAtomicSwap, partyA, partyB } = await loadFixture(
      deployFixture
    );
    await expect(
      crossChainAtomicSwap.connect(partyA).deposit({ value: amount + 100 })
    ).to.be.revertedWith("Incorrect deposit amount");
    await expect(
      crossChainAtomicSwap.connect(partyB).deposit({ value: amount })
    ).to.be.revertedWith("Only Party A can deposit");
  });

  it("Good swap", async function () {
    const { crossChainAtomicSwap, partyA, partyB, key, unlockTime } =
      await loadFixture(deployFixture);
    await expect(
      crossChainAtomicSwap.connect(partyA).deposit({ value: amount })
    ).to.changeEtherBalance(partyA, -amount);

    await crossChainAtomicSwap.connect(partyB).confirmDeposit(key);

    await expect(
      crossChainAtomicSwap.connect(partyA).withdrawal()
    ).to.be.revertedWith("Swap not yet expired");

    await time.increaseTo(unlockTime);

    await expect(
      crossChainAtomicSwap.connect(partyA).withdrawal()
    ).to.be.revertedWith("Party B already confirmed the deposit");

    await expect(
      crossChainAtomicSwap.connect(partyB).executeSwap()
    ).to.changeEtherBalance(partyB, amount);
  });

  it("Timeout swap", async function () {
    const { crossChainAtomicSwap, partyA, partyB, key, unlockTime } =
      await loadFixture(deployFixture);

    await expect(
      crossChainAtomicSwap.connect(partyA).deposit({ value: amount })
    ).to.changeEtherBalance(partyA, -amount);

    await time.increaseTo(unlockTime);

    await expect(await crossChainAtomicSwap.withdrawal()).to.changeEtherBalance(
      partyA,
      amount
    );
  });
});
