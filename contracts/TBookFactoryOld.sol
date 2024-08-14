// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TBookFactoryOld is Ownable, ERC721 {
    // A Copy of a Book
    struct CopyInfo {
        // Basics
        bool exists;    
        uint256 tbsn;
        uint256 copyNumber;
        uint256 numTransactions; // How many times sold/transacted
        // Linked List info;
        uint256 nextLinkId;
        uint256 prevLinkId;
        // Holder Info
        address initHolder; // Who minted this
        address currentHolder;
        address lastHolder; // Who was the last person to hold this NFT
    }
    // A Single Book
    struct TBookInfo {
        bool exists;
        uint256 tbsn;
        uint256 numCopies; // Max 10 ** 12 copies
        address payable author;
        mapping(address => uint256) collectors;
    }

    // A Single User
    struct UserInfo {
        bool exists;
        address userAddress;
        uint256 collectionSize;
        mapping(uint256 => uint256) bookToCopies; // Maps TBSN to whether the number of copies the user has collected.
        // LinkedList Info
        uint256 firstLinkId;
        uint256 lastLinkId;
    }

    uint256 numUsers;
    mapping(address => UserInfo) addressToUser;

    // This ID is the NFT ID, is completely seperate from TBSN and Copy Number
    mapping(uint256 => CopyInfo) idToCopy;

    // Maps TBSN to TBook Info
    mapping(uint256 => TBookInfo) tbsnToBook;

    uint256 totalCopies;

    // Max copies of a single TBook
    uint256 private _maxCopies;

    constructor(address initialOwner) ERC721("TBook", "TBK") Ownable(initialOwner) {
        _maxCopies = 10**5;
    }

    // -------- Test functions -----------
    function getOwnerOf(uint256 tokenId) public view returns (address) {
        return idToCopy[tokenId].currentHolder;
    }

    // -----------------------------------

    /**
    Gets the ID from the TBSN and the Copy Number
    Copy 1 of 75025 would be 75025000000001
     */
    function getId(uint256 tbsn, uint256 copyNumber)
        public
        view
        returns (uint256)
    {
        uint256 id = tbsn * (_maxCopies);
        id += copyNumber;
        return id;
    }

    function tbsnFromId(uint256 id) public view returns (uint256) {
        return id / _maxCopies;
    }

    function copyNumberFromId(uint256 id) public view returns (uint256) {
        return id % _maxCopies;
    }

    function createUser(address userAddress) internal {
        UserInfo storage newUser = addressToUser[userAddress];
        if (!newUser.exists) {
            newUser.exists = true;
            newUser.userAddress = userAddress;
        }
    }

    function isUserHolder(address userAddress) public view returns (bool) {
        UserInfo storage user = addressToUser[userAddress];
        if (user.exists && user.collectionSize > 0) {
            return true;
        } else {
            return false;
        }
    }

    function userHoldsTBSN(uint256 tbsn, address userAddress)
        public
        view
        returns (bool)
    {
        TBookInfo storage book = tbsnToBook[tbsn];
        if (book.exists && (book.collectors[userAddress] > 0)) {
            return true;
        }
        return false;
    }

    // Mint a copy of the book
    function mint(uint256 tbsn, address mintAddress) internal {
        require(tbsnToBook[tbsn].exists);
        require(tbsnToBook[tbsn].numCopies < _maxCopies);
        uint256 currentCopy = tbsnToBook[tbsn].numCopies;

        // Generate the ID from the TBSN + Copy Number
        uint256 id = getId(tbsn, currentCopy);

        // Update CopyInfo
        CopyInfo storage mintCopy = idToCopy[id];
        mintCopy.exists = true;
        mintCopy.tbsn = tbsn;
        mintCopy.copyNumber = currentCopy;
        mintCopy.initHolder = mintAddress;
        mintCopy.currentHolder = mintAddress;

        // Update UserInfo
        UserInfo storage mintUser = addressToUser[mintAddress];
        if (!mintUser.exists) {
            // Init userInfo
            createUser(mintAddress);
            mintUser.firstLinkId = id;
        }

        // Update the LinkedList
        bool hasCollected = mintUser.collectionSize != 0;
        if (hasCollected) {
            uint256 lastLink = addressToUser[mintAddress].lastLinkId;
            idToCopy[lastLink].nextLinkId = id;
            mintCopy.prevLinkId = lastLink;
        }
        mintUser.lastLinkId = id;
        mintUser.bookToCopies[tbsn]++;
        mintUser.collectionSize++;

        // Update BookInfo
        tbsnToBook[tbsn].numCopies++;
        tbsnToBook[tbsn].collectors[mintAddress]++;

        totalCopies += 1;
        _safeMint(msg.sender, id);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public override virtual {
        uint256 tbsn = tbsnFromId(tokenId);
        require(
            (tbsnToBook[tbsn].collectors[from] > 0) &&
                (addressToUser[from].bookToCopies[tbsn] > 0)
        );

        // Update CopyInfo
        CopyInfo storage bookCopy = idToCopy[tokenId];
        bookCopy.lastHolder = from;
        bookCopy.currentHolder = to;
        bookCopy.numTransactions++;

        // Update TBookInfo
        TBookInfo storage tbookInfo = tbsnToBook[tbsn];
        tbookInfo.collectors[from]--;
        tbookInfo.collectors[to]++;

        // Update UserInfo
        UserInfo storage fromUser = addressToUser[from];
        UserInfo storage toUser = addressToUser[to];

        fromUser.bookToCopies[tbsn]--;
        fromUser.collectionSize--;
        toUser.bookToCopies[tbsn]++;
        toUser.collectionSize++;

        // Handle Linked List Stuff

        // Detach step
        uint256 fromLinkPrev = bookCopy.prevLinkId;
        uint256 fromLinkNext = bookCopy.nextLinkId;
        if (fromLinkPrev == 0) {
            // First book of the user
            fromUser.firstLinkId = fromLinkNext;
        } else {
            idToCopy[fromLinkPrev].nextLinkId = fromLinkNext;
        }
        if (fromLinkNext == 0) {
            fromUser.lastLinkId = fromLinkPrev;
        }

        // Attach step
        uint256 toLastLink = toUser.lastLinkId;
        bookCopy.prevLinkId = toLastLink;
        bookCopy.nextLinkId = 0;
        if (toLastLink == 0) {
            toUser.firstLinkId = tokenId;
        } else {
            idToCopy[toLastLink].nextLinkId = tokenId;
        }
        toUser.lastLinkId = tokenId;

        _safeTransfer(from, to, tokenId, data);
    }

    function getPrice(uint256 tbsn) public view returns (uint256) {
        require(tbsnToBook[tbsn].exists, "TBook does not exist");
        uint256 floor = 0;
        uint256 inc = 10; // linear
        // exponential:
        // uint256 step = 50;
        // uint256 power = copies / step;
        // uint256 price = floor * (2**power);

        uint256 copies = tbsnToBook[tbsn].numCopies;
        uint256 price = floor + (copies * inc);
        return price; // returns in finneys
    }

    function collect(uint256 tbsn, address collector)
        public
        payable
        returns (uint256)
    {
        // Check if tbsn exists
        require(tbsnToBook[tbsn].exists, "Book doesn't exist");

        uint256 priceWei = getPrice(tbsn) * (10**15); // convert to Wei
        require(
            msg.value >= priceWei,
            "Insufficient funds. Please check price."
        );
        uint256 authorPay = (priceWei * 80) / 100;
        uint256 platformPay = priceWei - authorPay;
        address payable author = tbsnToBook[tbsn].author;
        mint(tbsn, collector);
        author.transfer(authorPay);
        payable(owner()).transfer(platformPay);
        return addressToUser[collector].lastLinkId;
    }

    function publish(uint256 tbsn, address payable author) external {
        // Use an oracle to check that this is a valid call with correct author (valid tbsn)
        // TODO
        TBookInfo storage book = tbsnToBook[tbsn];
        require(!book.exists, "Publication minted before.");
        // Only the Foundation can Publish
        require(msg.sender == owner());
        // Update BookInfo
        tbsnToBook[tbsn].exists = true;
        tbsnToBook[tbsn].author = author;
        // Free mint for the author
        mint(tbsn, author);
    }

    // ----------------------------
    // Public Gets
    // Can use this in order to iterate through an entire user's collection
    function getCopyInfo(uint256 id) external view returns (CopyInfo memory) {
        return idToCopy[id];
    }

    function getUserInfo(address userAddress)
        public
        view
        returns (
            bool,
            uint256,
            uint256,
            uint256
        )
    {
        UserInfo storage info = addressToUser[userAddress];
        return (
            info.exists,
            info.collectionSize,
            info.firstLinkId,
            info.lastLinkId
        );
    }

    function getTBookExists(uint256 tbsn) public view returns (bool) {
        return tbsnToBook[tbsn].exists;
    }
}
