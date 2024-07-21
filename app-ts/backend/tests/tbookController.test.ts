import request from 'supertest';
import jwt from 'jsonwebtoken';

const config = {
    jwtSecret: 'jwt',
    endpoint: 'http://localhost:8000',
};


// Generate a token for testing
const walletAddress = '0x123456789abcdef';
const token = jwt.sign({ address: walletAddress }, config.jwtSecret);

describe('API Endpoints', () => {

    it('should require sign in to update a draft', async () => {
        const draftData = {
            tbsn: 75001,
            title: 'Test Draft',
            blurb: 'Test Blurb',
            content: 'Test Content',
            coverImage: 'Test Cover Image',
            pubMode: 'green',
        };
        
        const response = await request(config.endpoint)
            .post('/api/drafts')
            .set('Authorization', `Bearer ${token}`)
            .send(draftData)
            .expect(200);

        // Validate response structure
        expect(response.body).toBeTruthy();
    });

    it('should get the public list of publications', async () => {
        const response = await request(config.endpoint)
            .get('/api/publications')
            .expect(200);

        // Validate response structure
        expect(response.body).toBeTruthy();
    });
});