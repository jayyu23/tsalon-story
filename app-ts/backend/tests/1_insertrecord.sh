# Test 
curl -X POST http://localhost:8000/api/users \
    -H "Content-Type: application/json" \
    -d '{
        "username": "john_doe",
        "walletAddress": "0x123456789abcdef",
        "member": true,
        "tbooksPublished": [101, 102],
        "tbooksCollected": [201, 202],
        "tbooksDrafted": [301, 302],
        "dailyVotes": 15,
        "votesUsed": 5,
        "lastVoted": "2024-07-20T10:00:00Z",
        "greenTokens": 50
    }'