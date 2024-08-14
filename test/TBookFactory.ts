import {
    loadFixture,
    time,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { parseEther, getAddress } from "viem";

  const toTBookJSON = (tBook: [bigint, `0x${string}`, bigint, bigint]) => {
    return {
      tbsn: tBook[0],
      author: tBook[1],
      total_copies: tBook[2],
      current_copies: tBook[3],
    };
  };
  
  describe("TBookFactory", function () {
    async function deployTBookFactoryFixture() {
      const [owner, addr1, addr2] = await hre.viem.getWalletClients();

      console.log(owner.account.address, addr1.account.address, addr2.account.address);
  
      const tBookFactory = await hre.viem.deployContract("TBookFactory", [owner.account.address]);
  
      const publicClient = await hre.viem.getPublicClient();
  
      return { tBookFactory, owner, addr1, addr2, publicClient };
    }
  
    describe("Deployment", function () {
      it("Should set the right owner", async function () {
        const { tBookFactory, owner } = await loadFixture(deployTBookFactoryFixture);
  
        expect(await tBookFactory.read.owner()).to.equal(getAddress(owner.account.address));
      });
    });
  
    describe("TBook Management", function () {
      it("Should create a new TBook", async function () {
        const { tBookFactory, addr1 } = await loadFixture(deployTBookFactoryFixture);
  
        const TBSN1 = 75001n;
        const NUM_COPIES = 100n;
        // console.log("addr1", addr1.account.address);
  
        await tBookFactory.write.createTBook([TBSN1, NUM_COPIES, addr1.account.address], {
          client: { wallet: addr1 },
        });
  
        const tBookString = await tBookFactory.read.tbooks([TBSN1]);
        const tBook = toTBookJSON(tBookString);
        // console.log(tBook);

        expect(tBook.tbsn).to.equal(TBSN1);
        expect(tBook.author).to.equal(getAddress(addr1.account.address));
        expect(tBook.total_copies).to.equal(NUM_COPIES);
        expect(tBook.current_copies).to.equal(0n);
  
        const ownedTBooks = await tBookFactory.read.getOwnedTBooks([getAddress(addr1.account.address)]);
        expect(ownedTBooks).to.have.lengthOf(1);
        expect(ownedTBooks[0]).to.equal(TBSN1 * 10000n); // TBSN1 + Copy 0
      });
  
      it("Should fail to create a TBook with a duplicate TBSN", async function () {
        const { tBookFactory, addr1 } = await loadFixture(deployTBookFactoryFixture);
  
        const TBSN1 = 75001n;
        const NUM_COPIES = 100n;
  
        await tBookFactory.write.createTBook([TBSN1, NUM_COPIES, addr1.account.address], {
          client: { wallet: addr1 },
        });
  
        await expect(
          tBookFactory.write.createTBook([TBSN1, NUM_COPIES, addr1.account.address], {
            client: { wallet: addr1 },
          })
        ).to.be.rejectedWith("TBSN already exists");
      });
  
      it("Should mint additional copies", async function () {
        const { tBookFactory, addr1 } = await loadFixture(deployTBookFactoryFixture);
  
        const TBSN1 = 75001n;
        const NUM_COPIES = 100n;
  
        await tBookFactory.write.createTBook([TBSN1, NUM_COPIES, addr1.account.address], {
          client: { wallet: addr1 },
        });
        
        const tBookString = await tBookFactory.read.tbooks([TBSN1]);
        const tBook = toTBookJSON(tBookString);
        console.log(tBook);
        expect(tBook.current_copies).to.equal(0n);

        const initialPrice = await tBookFactory.read.getCurrentPrice([TBSN1]);
        await tBookFactory.write.mintCopy([TBSN1], {
          value: initialPrice,
          client: { wallet: addr1 },
        });
        
        const tBookString2 = await tBookFactory.read.tbooks([TBSN1]);
        const tBook2 = toTBookJSON(tBookString2);
        console.log(tBook2);
        expect(tBook2.current_copies).to.equal(1n);
  
        const ownedTBooks = await tBookFactory.read.getOwnedTBooks([getAddress(addr1.account.address)]);
        expect(ownedTBooks).to.have.lengthOf(2); // Copy 0 and Copy 1
      });
  
    //   it("Should fail to mint copies beyond the total_copies limit", async function () {
    //     const { tBookFactory, addr1 } = await loadFixture(deployTBookFactoryFixture);
  
    //     const TBSN1 = 75001n;
    //     const NUM_COPIES = 1n;
  
    //     await tBookFactory.write.createTBook([TBSN1, NUM_COPIES], {
    //       client: { wallet: addr1 },
    //     });
  
    //     const initialPrice = await tBookFactory.read.getCurrentPrice([TBSN1]);
    //     await tBookFactory.write.mintCopy([TBSN1], {
    //       value: initialPrice,
    //       client: { wallet: addr1 },
    //     });
  
    //     await expect(
    //       tBookFactory.write.mintCopy([TBSN1], {
    //         value: initialPrice,
    //         client: { wallet: addr1 },
    //       })
    //     ).to.be.rejectedWith("No more copies can be minted");
    //   });
  
    //   it("Should transfer ownership correctly", async function () {
    //     const { tBookFactory, addr1, addr2 } = await loadFixture(deployTBookFactoryFixture);
  
    //     const TBSN1 = 75001n;
    //     const NUM_COPIES = 100n;
  
    //     await tBookFactory.write.createTBook([TBSN1, NUM_COPIES], {
    //       client: { wallet: addr1 },
    //     });
  
    //     const initialPrice = await tBookFactory.read.getCurrentPrice([TBSN1]);
    //     await tBookFactory.write.mintCopy([TBSN1], {
    //       value: initialPrice,
    //       client: { wallet: addr1 },
    //     });
  
    //     const tokenId = await tBookFactory.read.generateTokenId([TBSN1, 1n]);
  
    //     await tBookFactory.write.safeTransferFrom([getAddress(addr1.account.address), getAddress(addr2.account.address), tokenId], {
    //       client: { wallet: addr1 },
    //     });
  
    //     const ownedTBooksAddr1 = await tBookFactory.read.getOwnedTBooks([getAddress(addr1.account.address)]);
    //     const ownedTBooksAddr2 = await tBookFactory.read.getOwnedTBooks([getAddress(addr2.account.address)]);
  
    //     expect(ownedTBooksAddr1).to.have.lengthOf(1); // Only Copy 0 should remain with addr1
    //     expect(ownedTBooksAddr2).to.have.lengthOf(1); // addr2 should own Copy 1
    //     expect(ownedTBooksAddr2[0]).to.equal(tokenId);
    //   });
  
    //   it("Should correctly update the current price for minting", async function () {
    //     const { tBookFactory, addr1 } = await loadFixture(deployTBookFactoryFixture);
  
    //     const TBSN1 = 75001n;
    //     const NUM_COPIES = 100n;
  
    //     await tBookFactory.write.createTBook([TBSN1, NUM_COPIES], {
    //       client: { wallet: addr1 },
    //     });
  
    //     let currentPrice = await tBookFactory.read.getCurrentPrice([TBSN1]);
    //     expect(currentPrice).to.equal(0n);
  
    //     await tBookFactory.write.mintCopy([TBSN1], {
    //       value: currentPrice,
    //       client: { wallet: addr1 },
    //     });
  
    //     currentPrice = await tBookFactory.read.getCurrentPrice([TBSN1]);
    //     expect(currentPrice).to.equal(parseEther("0.01")); // BASE_PRICE * 1
    //   });
  
    //   it("Should retrieve authored TBooks for an address", async function () {
    //     const { tBookFactory, addr1 } = await loadFixture(deployTBookFactoryFixture);
  
    //     const TBSN1 = 75001n;
    //     const TBSN2 = 75002n;
    //     const NUM_COPIES = 100n;
  
    //     await tBookFactory.write.createTBook([TBSN1, NUM_COPIES], {
    //       client: { wallet: addr1 },
    //     });
  
    //     await tBookFactory.write.createTBook([TBSN2, NUM_COPIES], {
    //       client: { wallet: addr1 },
    //     });
  
    //     const authoredTBooks = await tBookFactory.read.getAuthoredTBooks([getAddress(addr1.account.address)]);
    //     expect(authoredTBooks).to.have.lengthOf(2);
    //     expect(authoredTBooks[0]).to.equal(TBSN1);
    //     expect(authoredTBooks[1]).to.equal(TBSN2);
    //   });
    });
  });