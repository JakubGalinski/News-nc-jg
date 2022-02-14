const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/index");
const db = require("../db/connection");



afterAll(() => { if (db.end) db.end() })

beforeEach(() => seed(data));

describe('Error 404 handling testing for all endpoints', () => {
    test('Returns 404 status - with msg: "Path not found" for incorect path provided by the client', () => {
        return request(app)
        .get('/not-a-valid-endpoint')
        .expect(404)
        .then(({body: { msg } }) => {
            expect(msg).toBe("Path not found.")
        })
    });
});
describe('GET - requests testing', () => {
    describe('GET - /api/topics', () => {
        test('Testing for succesful path', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then((response) => {
                    expect(response.body.topics).toBeInstanceOf(Array)
                })
        });
        test('Testing for succesful path', () => {
            return request(app)
                .get("/api/topics")
                .expect(200)
                .then((response) => {
                    response.body.topics.forEach((topic) => {
                        expect(topic).toEqual(expect.objectContaining(
                            {
                                slug: expect.any(String),
                                description: expect.any(String)
                            }
                        ))
                    })
                })
        });

    });
});