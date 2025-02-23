# TSalon

A decentralized Web3 publishing platform built on [Story Protocol](https://www.story.foundation/), enabling content creation, curation, and licensing through blockchain technology.

![TSalon Platform](/readme-images/MUd_Image_1.png)

## Overview

- **TBookstore**: Marketplace for discovering and collecting digital publications (TBooks)
- **NFT-Based Publishing**: Each publication is minted as a unique IP asset on Story Protocol
- **Creator Dashboard**: Write, publish, and manage your content in Markdown
- **Collection System**: Collect and own copies of published works
- **Remix Licensing**: Create derivative works with automatic attribution and royalties
- **DAO Curation**: Community-driven content curation for commercial licensing

For more details on the vision and implementation of TSalon, please refer to the [THESIS.md](THESIS.md) file.

## Tech Stack

- Frontend: React.js, TypeScript
- Backend: Node.js, Express
- Database: MongoDB
- Blockchain: Ethereum (Sepolia testnet)
- Smart Contracts: Solidity, Hardhat
- Web3 Integration: Rainbow Kit, wagmi.js
- IP Management: Story Protocol

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- MetaMask or compatible Web3 wallet
- Sepolia testnet ETH

### Installation

1. Clone the repository

```bash
git clone https://github.com/jayyu23/TSalon.git
cd app-ts
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
```

4. Start the development server

```bash
npm run
```

5. Open your browser and navigate to `http://localhost:3000`

## Architecture

- **Frontend**: React-based SPA with Web3 wallet integration
- **Backend API**: Express server handling user authentication and content management
- **Smart Contracts**: Manage NFT minting, licensing, and DAO operations
- **Story Protocol Integration**: Handles IP asset registration and licensing

## License

This project is licensed under the MIT License.

## Contact

Project Link: [https://github.com/jayyu23/tsalon-story](https://github.com/jayyu23/tsalon-story)

## Acknowledgments

- [Story Protocol](https://www.story.foundation/)
- [Rainbow Kit](https://www.rainbowkit.com/)
- [wagmi.js](https://wagmi.sh/)