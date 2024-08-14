// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

contract TBookFactory is ERC721, Ownable {
    using EnumerableSet for EnumerableSet.UintSet;
    using Strings for uint256;

    uint256 public constant MAX_COPIES = 10000;
    uint256 public constant BASE_PRICE = 0.01 ether;

    // TBook structure
    struct TBook {
        uint256 tbsn;
        address author;
        uint256 total_copies;
        uint256 current_copies;
    }

    // Global mapping from TBSN to TBook
    mapping(uint256 => TBook) public tbooks;
    
    // Global set of all TBSNs
    EnumerableSet.UintSet private tbsnSet;

    // Mapping from author address to set of authored TBSNs
    mapping(address => EnumerableSet.UintSet) private authoredTBooks;

    // Mapping from owner address to set of owned TBSN-Copy IDs
    mapping(address => EnumerableSet.UintSet) private ownedTBooks;

    constructor(address initialOwner) ERC721("TBook", "TBK") Ownable(initialOwner) {}

    // Function to create a new TBook
    function createTBook(uint256 tbsn, uint256 numCopies, address payable author) external {
        require(numCopies <= MAX_COPIES, "Cannot exceed 10k copies");
        require(!tbsnSet.contains(tbsn), "TBSN already exists");
        require(owner() == msg.sender, "Owner must be the message sender");

        // Add TBook to the global mapping
        TBook memory newTBook = TBook({
            tbsn: tbsn,
            author: author,
            total_copies: numCopies,
            current_copies: 0
        });

        tbooks[tbsn] = newTBook;
        tbsnSet.add(tbsn);
        authoredTBooks[author].add(tbsn);

        // Mint the first copy (Copy 0) to the author
        uint256 tokenId = generateTokenId(tbsn, 0);
        _safeMint(msg.sender, tokenId);
        ownedTBooks[author].add(tokenId);
    }

    // Function to mint additional copies
    function mintCopy(uint256 tbsn) external payable {
        TBook storage book = tbooks[tbsn];
        require(book.tbsn == tbsn, "TBook does not exist");
        require(book.current_copies < book.total_copies, "No more copies can be minted");

        uint256 cost = getCurrentPrice(tbsn);
        require(msg.value >= cost, "Insufficient payment");

        uint256 tokenId = generateTokenId(tbsn, book.current_copies + 1);
        _safeMint(msg.sender, tokenId);
        ownedTBooks[msg.sender].add(tokenId);
        book.current_copies++;
        
    }

    function getCurrentPrice(uint256 tbsn) public view returns (uint256) {
        uint256 copies = tbooks[tbsn].current_copies;
        return BASE_PRICE * (copies + 1);
    }

    // Utility function to generate a unique token ID
    function generateTokenId(uint256 tbsn, uint256 copyNumber) internal pure returns (uint256) {
        return tbsn * 10000 + copyNumber;
    }

    // Override the transferFrom to update ownership mappings
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override virtual {
        _safeTransfer(from, to, tokenId, data);
        if (from != address(0)) {
            ownedTBooks[from].remove(tokenId);
        }
        if (to != address(0)) {
            ownedTBooks[to].add(tokenId);
        }
    }

    // Function to get all TBSNs authored by an address
    function getAuthoredTBooks(address author) external view returns (uint256[] memory) {
        return authoredTBooks[author].values();
    }

    // Function to get all TBSN-Copy IDs owned by an address
    function getOwnedTBooks(address owner) external view returns (uint256[] memory) {
        return ownedTBooks[owner].values();
    }
}