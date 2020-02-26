const { server } = require('./server.js');
const request = require('supertest');

describe('api/boba', () => {
    test('display boba data',
        async(done) => {
            const response = await request(server).get('/api/boba');
            console.log(response.body);
            expect(response.body).toEqual({
                id: expect.any(Number),
                flavor: expect.any(String),
                type: expect.any(String),
                is_milk_tea: expect.any(Boolean),
                image: expect.any(String),
                star_rating: expect.any(Number)
            });

            expect(response.statusCode).toBe(200);
            
            done();
        });
});