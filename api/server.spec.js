const request = require('supertest');
const server = require('./server');
const db = require('../database/dbConfig');
const testUser = { username: "test", password: "test" }

describe('server.js', () => {
    describe('GET request for jokes', () => {
        it('should return status code 400 when not logged in', async () => {
            const res = await request(server)
                .get('/api/jokes')
            expect(res.status).toBe(400)
        })
        it('should return json', async () => {
            const res = await request(server)
                .get('/api/jokes')
            expect(res.type).toBe('application/json')
        })
    });
    describe('registering new user', () => {
        it('should return status code 201 when adding new user', async () => {
            await db('users').truncate()
            const res = request(server)
                .post('/api/auth/register')
                .send(testUser)
            expect(res.status).toBe(201)
        })
        it('should return status code 500 with invalid user', async () => {
            const res = request(server)
                .post('/api/auth/register')
                .send({ username: 'user', password: 'pass' })
            expect(res.status).toBe(500)
        })
    });
    describe('login with user', () => {
        it('should return status code 200 with test user', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send(testUser)
            expect(res.status).toBe(200)
        })
        it('should return status code 401 with non-valid user', async () => {
            const res = await request(server)
                .post('/api/auth/login')
                .send({ username: 'user', password: 'pass' })
            expect(res.status).toBe(500)
        })
    })
})