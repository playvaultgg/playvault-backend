const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Game = require('../models/Game');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

describe('API Testing Suite', () => {

    describe('Auth Endpoints', () => {
        it('should register a new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    name: 'Test Agent',
                    email: 'agent@playvault.gg',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('token');
        });

        it('should login an existing user successfully', async () => {
            await request(app).post('/api/auth/register').send({
                name: 'Test Agent',
                email: 'agent@playvault.gg',
                password: 'password123'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'agent@playvault.gg',
                    password: 'password123'
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
        });

        it('should reject invalid auth credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'ghost@playvault.gg',
                    password: 'wrongpassword'
                });
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('Game Catalog Endpoints', () => {
        it('should fetch all active games', async () => {
            await Game.create({ title: 'CyberQuest', price: 60, description: 'Test', imageUrl: 'none', countInStock: 10, isActive: true });

            const res = await request(app).get('/api/games');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should not return disabled/inactive games to public', async () => {
            await Game.create({ title: 'HiddenQuest', price: 60, description: 'Test', imageUrl: 'none', countInStock: 10, isActive: false });

            const res = await request(app).get('/api/games');
            expect(res.statusCode).toEqual(200);
            expect(res.body.length).toEqual(0);
        });
    });

    describe('Protected & Admin Logic', () => {
        it('should reject unauthenticated access to profile', async () => {
            const res = await request(app).get('/api/auth/profile');
            expect(res.statusCode).toEqual(401);
        });

        it('should reject non-admin from accessing admin API', async () => {
            // Register standard user
            const regRes = await request(app).post('/api/auth/register').send({
                name: 'Standard User',
                email: 'user@playvault.gg',
                password: 'password123'
            });

            const res = await request(app)
                .get('/api/admin/stats')
                .set('Authorization', `Bearer ${regRes.body.token}`);

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toEqual('Not authorized as an admin');
        });
    });
});
