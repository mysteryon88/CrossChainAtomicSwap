# Cross-Chain Atomic Swaps

## Description

A simple swaps of assets between two EVM networks.

Both Alice and Bob lock up the correct amount of tokens in a smart contract on their respective blockchains. Only once both parties put the correct amount of tokens in each smart contract can they be unlocked. Alice receives the digital assets that Bob has originally locked up, and vice versa.

Atomic swaps use a hash timelock contract (HTLC) which acts as a “virtual vault” or “cryptographic escrow account” that keeps user funds safe and only executes when the correct amount of tokens has been deposited to the contract. Each user must acknowledge receipt of tokens within a specified interval to unlock them.

### Hashed Timelock Contract (HTLC)

An HTLC is a time-bound smart contract where a private key and cryptographic hash are used to control access to funds. Each party must meet all of the swap agreements for it to be finalized, otherwise, tokens revert to their original owner.

An HTCL consists of two core security features:

- Hashlock key — Both parties must submit cryptographic proofs verifying that they have met their side of the swap contract.
- Timelock key — If the proofs are not submitted within a preset time limit, the deposited coins are returned to the original owner.

### Swaps

The repository is 4 templates for cross-chain trading:

- `AtomicNativeSwap`
- `AtomicERC20Swap`
- `AtomicERC721Swap`
- `AtomicERC1155Swap`

_Native = ETH, BNB, MATIC etc._

By combining these templates, you can get more than just such pairs to exchange:

- Native - Native
- ERC20 - ERC20
- ERC721 - ERC721
- ERC1155 - ERC1155

But they're also:

|                  |                  |
| ---------------- | ---------------- |
| Native - ERC20   | ERC20 - Native   |
| Native - ERC721  | ERC721 - Native  |
| Native - ERC1155 | ERC1155 - Native |
| ERC20 - ERC721   | ERC721 - ERC20   |
| ERC20 - ERC1155  | ERC1155 - ERC20  |
| ERC721 - ERC1155 | ERC1155 - ERC721 |

There are two roles:

- Initiator of the exchange (**Party A**)
- Receiver of the exchange (**Party B**)

# References

- [What Is an Atomic Swap?](https://chain.link/education-hub/atomic-swaps)
- [What Are Cross-Chain Swaps?](https://chain.link/education-hub/cross-chain-swap)
