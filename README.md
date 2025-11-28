<!-- README.md -->
# On-Chain Feedback DApp

## Contract Address

- **Network**: Flare Coston2 Testnet  
- **Contract Address**: `0x6048B2c8d60FA2Fbd14aD52dB27a65cb33A420D9`  
- **Explorer**: https://coston2-explorer.flare.network/address/0x6048B2c8d60FA2Fbd14aD52dB27a65cb33A420D9

---

## Description

This project is a lightweight, production-ready example of an on-chain feedback system deployed on the Flare Coston2 testnet. It demonstrates how to collect user feedback (rating and comment) directly on-chain using a simple smart contract, and how to integrate that contract into a modern React/Next.js frontend using **wagmi** and **viem**.

Users connect their wallet, submit a rating (1–5) along with a textual comment, and the contract:

- Stores the feedback immutably on-chain.
- Emits events for each feedback submission.
- Maintains an aggregate average rating.
- Tracks the total number of feedback entries.

The frontend provides a minimal but clean UI that shows the current average rating and total feedback count, and allows any connected user to submit new feedback.

---

## Features

### Smart Contract

- **Feedback Submission**
  - `submitFeedback(string _comment, uint8 _rating)`
  - Accepts a free-form comment and an integer rating.
  - Only requires a transaction from a connected wallet (no native token value needed).
  - Emits a `FeedbackSubmitted` event containing:
    - `user` (address)
    - `rating` (uint8)
    - `comment` (string)
    - `timestamp` (uint256)

- **Read Functions**
  - `getAverageRating() -> uint256`
    - Returns the current average rating across all feedback entries.
  - `getFeedbackCount() -> uint256`
    - Returns the total number of feedback entries stored.
  - `getFeedback(uint256 _index) -> (address user, string comment, uint8 rating, uint256 timestamp)`
    - Returns a specific feedback entry by index.

### Frontend (React / Next.js)

- **Wallet Gating**
  - Uses `wagmi`’s `useAccount` hook.
  - If the user is not connected, a friendly message prompts them to connect their wallet.
  - Only connected users can interact with the contract.

- **On-Chain Data Integration**
  - `useFeedbackContract` hook encapsulates all contract interactions.
  - Uses `useReadContract` to:
    - Fetch `getAverageRating`.
    - Fetch `getFeedbackCount`.
  - Uses `useWriteContract` and `useWaitForTransactionReceipt` to:
    - Submit feedback via `submitFeedback`.
    - Track transaction lifecycle (pending, confirming, confirmed).

- **UI Components**
  - **Summary Cards**
    - Average rating (formatted as `X.XX / 5` when available).
    - Total feedback count.
  - **Feedback Form**
    - Rating input (1–5).
    - Comment textarea.
    - Client-side validation for rating range and non-empty comment.
  - **Transaction State Display**
    - Shows transaction hash when available.
    - Displays “waiting for confirmation” while the transaction is being mined.
    - Shows a success message when the transaction is confirmed.
    - Displays error messages if the transaction fails.

- **User Experience**
  - Clear step-by-step layout:
    1. Select rating.
    2. Write feedback.
    3. Submit transaction.
  - Disabled buttons and inputs while transactions are pending.
  - Visual feedback for invalid rating entries.

---

## How It Solves the Problem

### The Problem

Collecting honest, verifiable feedback is a common requirement across many applications—dApps, protocols, platforms, and products. Traditional feedback systems usually have the following issues:

- **Centralization & Trust**
  - Feedback is stored in centralized databases and can be altered or selectively displayed.
  - Users cannot independently verify that their feedback exists or has not been tampered with.

- **Transparency**
  - Aggregated metrics such as average ratings or counts are opaque to end users.
  - There is no way to audit individual feedback entries or ensure fairness.

- **Composability**
  - Off-chain feedback systems are not easily composable with other Web3 protocols or dApps.
  - Integrations typically require custom APIs and backend infrastructure.

### The Solution

This project uses a smart contract as the source of truth for feedback data and provides a simple, reusable integration pattern:

1. **Immutable Storage**
   - Each feedback entry is stored on-chain with the user’s address, rating, comment, and timestamp.
   - Once submitted, feedback cannot be retroactively altered by an operator or backend.

2. **Verifiable Aggregates**
   - The contract maintains an on-chain representation of the average rating and feedback count.
   - Anyone can call read functions or inspect the contract on the block explorer to verify the values.

3. **Fully Transparent Data**
   - Through the explorer or direct RPC calls, all feedback entries can be inspected.
   - External consumers (analytics, dashboards, other dApps) can build on top of the same data.

4. **Simple Frontend Integration**
   - The `useFeedbackContract` hook encapsulates all contract logic, making it easy to drop into any React-based project.
   - It illustrates how to:
     - Connect wagmi and viem to a contract ABI.
     - Handle read/write operations.
     - Manage transaction lifecycle and UI state.

5. **Composability & Extensibility**
   - Other smart contracts or dApps can read the feedback data (e.g., gating features based on ratings, aggregating across multiple contracts).
   - The UI can be extended to:
     - Display paginated lists of feedback using `getFeedback`.
     - Filter feedback by rating, user address, or timestamp.
     - Integrate with analytics or reputation systems.

### Use Cases and Benefits

- **Protocol / dApp Feedback**
  - Governance frontends or DeFi dashboards can embed this widget to collect user feedback about UX or feature requests.
  - On-chain ratings can inform future governance proposals or upgrades.

- **Beta Testing & Developer Tooling**
  - Devs can collect structured, immutable feedback from testers on testnets (e.g., Coston2) before mainnet deployments.
  - Testing environments can re-use the same pattern across multiple contracts.

- **Reputation and Review Systems**
  - On-chain rating data can serve as a foundation for decentralized review systems.
  - Other dApps can query aggregated ratings to make decisions (e.g., show only high-rated services).

- **Transparency and Trust**
  - By exposing all storage and aggregated metrics directly on-chain, users gain confidence that their feedback is counted and unaltered.
  - Developers gain a credible, auditable signal for user satisfaction.

---

This repository provides a clear reference for integrating a feedback-oriented smart contract with a modern Web3 frontend stack. It can serve as a starting point or template for any project that needs transparent, on-chain feedback capture on the Flare network or other EVM-compatible chains.


# feedbackloop
