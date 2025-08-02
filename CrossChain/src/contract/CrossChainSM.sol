// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IOrderMixin} from "limit-order-protocol/contracts/interfaces/IOrderMixin.sol";
import {TakerTraits} from "limit-order-protocol/contracts/libraries/TakerTraitsLib.sol";
import {AddressLib, Address} from "@1inch/solidity-utils/contracts/libraries/AddressLib.sol";

contract CrossChainSM is ReentrancyGuard {
    using SafeERC20 for IERC20;

    struct Swap {
        address initiator;
        address participant;
        address tokenA; // Token on chain A
        address tokenB; // Token on chain B
        uint256 amountA;
        uint256 amountB;
        bytes32 secretHash;
        uint256 timelock;
        bool completed;
        bool cancelled;
        bool isInitiatorSide; // true if this is initiator's chain
    }

    IOrderMixin private immutable _LOP;
    mapping(bytes32 => Swap) public swaps;

    event SwapInitiated(
        bytes32 indexed swapId,
        address indexed initiator,
        address indexed participant,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        bytes32 secretHash,
        uint256 timelock,
        bool isInitiatorSide
    );

    event SwapCompleted(bytes32 indexed swapId, bytes32 secret);
    event SwapCancelled(bytes32 indexed swapId);

    constructor(address limitOrderProtocol) {
        _LOP = IOrderMixin(limitOrderProtocol);
    }

    // Custom errors
    error SwapAlreadyExists();
    error SwapNotFound();
    error SwapAlreadyCompleted();
    error SwapAlreadyCancelled();
    error UnauthorizedParticipant();
    error TimelockExpired();
    error InvalidSecret();
    error InvalidTimelock();

    // Modifiers
    modifier swapExists(bytes32 swapId) {
        if (swaps[swapId].initiator == address(0)) revert SwapNotFound();
        _;
    }

    modifier swapNotCompleted(bytes32 swapId) {
        if (swaps[swapId].completed) revert SwapAlreadyCompleted();
        _;
    }

    modifier swapNotCancelled(bytes32 swapId) {
        if (swaps[swapId].cancelled) revert SwapAlreadyCancelled();
        _;
    }

    function initiateSwapWithLOP(
        bytes32 swapId,
        address participant,
        address tokenA,
        address tokenB,
        uint256 amountA,
        uint256 amountB,
        bytes32 secretHash,
        uint256 timelock,
        bool isInitiatorSide,
        IOrderMixin.Order calldata order,
        bytes32 r,
        bytes32 vs,
        TakerTraits takerTraits,
        bytes calldata args
    ) external nonReentrant {
        if (swaps[swapId].initiator != address(0)) revert SwapAlreadyExists();
        require(timelock > block.timestamp, "Invalid timelock");
        require(participant != address(0), "Invalid participant");

        // Store swap info
        swaps[swapId] = Swap({
            initiator: msg.sender,
            participant: participant,
            tokenA: tokenA,
            tokenB: tokenB,
            amountA: amountA,
            amountB: amountB,
            secretHash: secretHash,
            timelock: timelock,
            completed: false,
            cancelled: false,
            isInitiatorSide: isInitiatorSide
        });

        // Execute LOP order if provided
        if (AddressLib.get(order.maker) != address(0)) {
            _LOP.fillOrderArgs(order, r, vs, amountA, takerTraits, args);
        } else {
            // Fallback to direct transfer
            IERC20(tokenA).safeTransferFrom(msg.sender, address(this), amountA);
        }

        emit SwapInitiated(
            swapId,
            msg.sender,
            participant,
            tokenA,
            tokenB,
            amountA,
            amountB,
            secretHash,
            timelock,
            isInitiatorSide
        );
    }

    function completeSwapWithLOP(
        bytes32 swapId,
        bytes32 secret,
        IOrderMixin.Order calldata order,
        bytes32 r,
        bytes32 vs,
        TakerTraits takerTraits,
        bytes calldata args
    )
        external
        nonReentrant
        swapExists(swapId)
        swapNotCompleted(swapId)
        swapNotCancelled(swapId)
    {
        Swap storage swap = swaps[swapId];

        if (msg.sender != swap.participant) revert UnauthorizedParticipant();
        if (block.timestamp >= swap.timelock) revert TimelockExpired();
        if (keccak256(abi.encodePacked(secret)) != swap.secretHash)
            revert InvalidSecret();

        swap.completed = true;

        // Execute LOP order for completion if provided
        if (AddressLib.get(order.maker) != address(0)) {
            _LOP.fillOrderArgs(order, r, vs, swap.amountA, takerTraits, args);
        } else {
            // Direct transfer
            IERC20(swap.tokenA).safeTransfer(swap.participant, swap.amountA);
        }

        emit SwapCompleted(swapId, secret);
    }

    // Enhanced for partial fills
    function completePartialSwap(
        bytes32 swapId,
        bytes32 secret,
        uint256 fillAmount, // Amount to fill (supports partial)
        IOrderMixin.Order calldata order,
        bytes32 r,
        bytes32 vs,
        TakerTraits takerTraits,
        bytes calldata args
    )
        external
        nonReentrant
        swapExists(swapId)
        swapNotCompleted(swapId)
        swapNotCancelled(swapId)
    {
        Swap storage swap = swaps[swapId];

        if (msg.sender != swap.participant) revert UnauthorizedParticipant();
        if (block.timestamp >= swap.timelock) revert TimelockExpired();
        if (keccak256(abi.encodePacked(secret)) != swap.secretHash)
            revert InvalidSecret();
        require(fillAmount <= swap.amountA, "Fill amount exceeds available");

        // Update remaining amount
        swap.amountA -= fillAmount;
        if (swap.amountA == 0) {
            swap.completed = true;
        }

        // Execute partial fill via LOP
        if (AddressLib.get(order.maker) != address(0)) {
            _LOP.fillOrderArgs(order, r, vs, fillAmount, takerTraits, args);
        } else {
            IERC20(swap.tokenA).safeTransfer(swap.participant, fillAmount);
        }

        emit SwapCompleted(swapId, secret);
    }

    // Cancel a swap after timelock expires
    function cancelSwap(
        bytes32 swapId
    )
        external
        nonReentrant
        swapExists(swapId)
        swapNotCompleted(swapId)
        swapNotCancelled(swapId)
    {
        Swap storage swap = swaps[swapId];

        if (msg.sender != swap.initiator) revert UnauthorizedParticipant();
        if (block.timestamp < swap.timelock) revert InvalidTimelock();

        swap.cancelled = true;

        // Return tokens to initiator
        IERC20(swap.tokenA).safeTransfer(swap.initiator, swap.amountA);

        emit SwapCancelled(swapId);
    }

    // View function to get swap details
    function getSwap(bytes32 swapId) external view returns (Swap memory) {
        return swaps[swapId];
    }

    // Check if swap is active
    function isSwapActive(bytes32 swapId) external view returns (bool) {
        Swap memory swap = swaps[swapId];
        return
            swap.initiator != address(0) && !swap.completed && !swap.cancelled;
    }
}
