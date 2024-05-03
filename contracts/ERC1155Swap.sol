// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC1155} from "./interfaces/IERC1155.sol";
import {ERC1155TokenReceiver} from "./TokenReceivers/ERC1155TokenReceiver.sol";
import {AtomicSwap} from "./AtomicSwap/AtomicSwap.sol";

/// @title AtomicERC1155Swap
/// @notice A contract for a cross-chain atomic swap that stores a token identifier and amount that can be exchanged for any other asset
contract AtomicERC1155Swap is AtomicSwap, ERC1155TokenReceiver {
    /// @notice The ERC1155 token to be swapped.
    /// @dev The contract holds and transfers tokens of this ERC1155 type.
    IERC1155 public immutable token;

    /// @notice Number of tokens to be exchanged
    uint256 public immutable value;

    /// @notice Identifier of the token to be swapped.
    /// @dev The contract interacts only with this token identifier.
    uint256 public immutable id;

    /// @param _token The address of the ERC1155 token contract
    /// @param _otherParty The address of the counterparty
    /// @param _value The value/amount of ERC1155 tokens
    /// @param _id The ID of the ERC1155 token
    constructor(
        address _token,
        address _otherParty,
        uint256 _value,
        uint256 _id
    ) payable {
        owner = msg.sender;
        token = IERC1155(_token);
        otherParty = _otherParty;
        value = _value;
        id = _id;
    }

    /// @notice Deposits ERC1155 token into the contract from the owner's balance.
    /// @dev Requires that the owner has approved the contract to transfer NFT on their behalf.
    /// Only callable by the owner.
    /// @param _hashKey The cryptographic hash of the secret key needed to complete the swap.
    /// @param _deadline The Unix timestamp after which the swap can be cancelled.
    /// @param _flag Determines who the swap initiator is.
    function deposit(
        bytes32 _hashKey,
        uint256 _deadline,
        bool _flag
    ) external payable override onlyOwner {
        hashKey = _hashKey;
        // The user who initiates the swap sends flag = 1 and his funds will be locked for 24 hours longer,
        // done to protect the swap receiver (see documentation)
        if (_flag) deadline = _deadline + DAY;
        else deadline = _deadline;
        token.safeTransferFrom(owner, address(this), id, value, "0x00");
    }

    /// @notice Confirms the swap and transfers the ERC1155 token to the other party if the provided key matches the hash key.
    /// @dev Requires that the key provided hashes to the stored hash key and transfers tokens (value) from this contract to the other party.
    /// Only callable by the otherParty.
    /// @param _key The secret key to unlock the swap.
    function confirmSwap(
        string calldata _key
    ) external override onlyOtherParty {
        // Key verification
        require(keccak256(abi.encodePacked(_key)) == hashKey, "Invalid key");
        require(block.timestamp <= deadline, "Deadline has passed");
        // Publishing a key
        emit SwapConfirmed(_key);
        // Transfer ERC1155 token to caller (otherParty)
        token.safeTransferFrom(address(this), msg.sender, id, value, "");
    }

    /// @notice Allows the owner to withdraw the token if the swap is not completed by the deadline.
    /// @dev Checks if the current time is past the deadline and transfers the token balance from this contract to the owner.
    /// Only callable by the owner.
    function withdrawal() external override onlyOwner {
        require(block.timestamp > deadline, "Swap not yet expired");
        token.safeTransferFrom(address(this), owner, id, value, "");
    }
}
