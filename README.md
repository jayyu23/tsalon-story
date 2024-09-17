# TSalon

## A Web3 Publishing House, Powered by Story Protocol

![Enter image alt description](/readme-images/MUd_Image_1.png)

# 1 - Overview

TSalon is a web3 publishing house built using [Story Protocol](https://www.story.foundation/), providing a comprehensive toolkit for the publication, curation, and co-creation of content. TSalon reimagines the concept of digital publishing and collection by using blockchain primitives to solve creator attribution issues.

Fundamentally, online content suffers from a “copy paste” problem: if a creator publishes a piece of writing, media, or content online, anyone in the world can simply copy-paste the material and redistribute it elsewhere, without the creator’s consent. Oftentimes, if it is a perfect “copy-paste,” there’s no perceptible difference between the original and the replica.

While from a consumer perspective, this may seem beneficial, as we can get access to troves of content without ever paying a cent, the cost of this lack of creator attribution is a hidden one: it comes in the form of all the books, music, and artworks that are never published, which ultimately stifles artistic innovation.

Blockchain-based primitives may be an answer to this copy-paste problem. Decentralized public blockchains fundamentally represent an open, canonical repository of truth and authenticity. Take Non-Fungible Tokens (NFTs) for example. Even if someone copy-pastes the content ascribed to a NFT, or takes a screenshot of it and redistributes it on the Internet, anyone can publicly verify that this screenshot is not the original item.

TSalon thus represents a concept, prototype, and thesis for a new class of content distribution platforms: one that leverages blockchain-based primitives, such as NFTs, to reimagine the idea of digital publishing. When a creator publishes a piece of content on TSalon, it becomes registered as a digital IP asset, available for users to read and collect. Collecting the IP asset automatically mints a license token that enables readers to remix it in their works, to create derivative works of content with attribution and relevant royalties to the original author. Under the hood, TSalon uses Story Protocol’s IP asset registration and licensing model to build out this creator attribution infrastructure. The details of this are discussed in Parts 2 and 3 of this document.

In addition to having end users read, collect, and remix works, TSalon also envisions a Decentralized Autonomous Organization (DAO) that curates and collects works, consisting of users that have published and collected others’ works, and acting almost like a decentralized editorial board. When a creator wants to register their work for DAO-approved commercial licenses, their drafts are first submitted to the DAO, which then votes on the works to be curated and licensed.

Thus, TSalon represents an experimental concept in building a digital publishing platform, using on-chain primitives to build a proof-of-concept for an open-source framework for a new content economy.

# 2 - Functionality

## 2.1 - TBookstore and TBooks

The TBookstore is TSalon’s home page, where users can search, view, and collect through published TBook NFTs. Each TBook NFT is registered as a Story IP Asset, and is an article or piece of writing that can be publicly viewed by default.

![Enter image alt description](/readme-images/NyA_Image_2.png)

## 2.2 - Collecting TBooks

![Enter image alt description](/readme-images/yHm_Image_3.png)

On the collect page for each TBook, a user can log in and buy-and-collect a TBook NFT. This will mint a derivative NFT of the root IP asset that the user owns as a new “copy” of the TBook.

The price of the NFT to be minted depends on the number of copies that have been minted already. The more copies that have been minted, the higher the mint price will be. For each TBook, there is a maximum of 10000 copies that can be minted. Upon publication, the author will receive a free mint of Copy 0.

## 2.3 - User Dashboard - Drafting, Collection, Publication

![Enter image alt description](/readme-images/YAW_Image_4.png)

Users can log in to their personal dashboard, to publish their own works, and review and collect others' works. Drafting and publication is done through a dedicated portal where users can edit works in Markdown. Users can also view their personal collection and the works that they’ve published through this portal

![Enter image alt description](/readme-images/4xh_Image_5.png)

## 2.4 - Remixing and Commercial Licensing

TSalon’s vision is to be a novel hub for content creation, one that both allows for the free exchange of cultural capital, while also allowing creators a path to monetization. Collecting a TSalon NFT will allow the collector to remix and use that collected IP in their own works and features to develop a chain of user-generated worlds and “fanfiction spinoffs.”

![Enter image alt description](/readme-images/dKO_Image_6.png)

Story Protocol License Types. [Image Source](https://docs.story.foundation/docs/pil-flavors).

By default, all of the publications on TSalon use Story’s open [“Non-Commercial Social Remixing” license](https://docs.story.foundation/docs/pil-flavors), which allows for the free, non-commercial use and distribution of the asset. However, TSalon also plans to support “commercial remixing” and “commercial use” licenses, which enables creators to earn from derivative works. To apply for these licenses though, these works need to pass through an off-chain DAO vote, where other collectors can act as “reviewers” to see if the content applicable should be made available for commercial licensing. This allows the TSalon community to curate the premium content available, and every piece of commercially licensed content will become a DAO-approved blue-chip IP asset. A portion of the proceedings from these commercial license revenues will also accrue to the TSalon DAO treasury.

# 3 - An Open-Source Framework for a New Content Economy

TSalon’s code repository provides a prototype and proof of concept application that implements the basic idea of a decentralized publishing house and content studio. TSalon’s current prototype is built using a Typescript MERN stack with smart contracts deployed on Ethereum’s Sepolia testnet using Hardhat, with IP assets and licensing handled by Story Protocol and wallet integrations handled through Rainbowkit and Wagmi.js.

But above all, TSalon represents an experimental thesis of **what could be**, and how a new open-source framework for a content economy can be built. My personal background as a writer biases me to view this content framework through the lens of written content. But this vision of a new content experience is common to all of the creative arts, whether that be in writing, visual arts, film, or music.

Fundamentally, it is about leveraging public and persistent on-chain primitives, such as ERC-721 TBooks, to create a new content experience for the end user, and build a closer relationship between creator and fan, to ultimately bring back the renaissance of content that the Internet originally promised – content that we can all read, write, and own.
