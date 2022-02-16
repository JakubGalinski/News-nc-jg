const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/index");
const db = require("../db/connection");
const { response } = require("../app");



afterAll(() => { if (db.end) db.end() })

beforeEach(() => seed(data));

describe('Global Error 404 handling testing for all endpoints', () => {
    test('Returns 404 status - with msg: "Path not found" for incorect path provided by the client', () => {
        return request(app)
            .get('/not-a-valid-endpoint')
            .expect(404)
            .then(({ body: { msg } }) => {
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
        test('Responds with: an array of topic objects, each of which should have the following properties: slug, description ', () => {
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
    describe('GET - /api/articles/:article_id', () => {
        test('Responds with: an article object, which should have the following properties: author which is the username from the users table title article_id body topic created_at votes', () => {
            return request(app)
                .get("/api/articles/1")
                .expect(200)
                .then((response) => {
                    const article = response.body.article;
                    expect(article).toEqual(expect.objectContaining({
                        article_id: 1,
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                    }))
                })
        });
        test('Returns 404 - for valid but non existend Id ', () => {
            return request(app)
                .get("/api/articles/666")
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Id non existent")
                })
        });
        test('Returns 404 - for valid but non existend Id ', () => {
            return request(app)
                .get("/api/articles/banan")
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })
        });
    });
    describe('GET /api/users', () => {
        test('Responds with: an array of objects, each object should have the following property: username ', () => {
            return request(app)
                .get("/api/users")
                .expect(200)
                .then(({body: {users}}) => {
                    users.forEach((user) => {
                        expect(user).toEqual(expect.objectContaining(
                            {
                                username: expect.any(String)
                            }))
                    })
                })
        });
    });
});

