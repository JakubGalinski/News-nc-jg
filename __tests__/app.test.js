const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/index");
const db = require("../db/connection");
const { response } = require("../app");




afterAll(() => { if (db.end) db.end() })

beforeEach(() => seed(data));


// ------ Universal 404 - error handler ------
describe('Universal Error 404 handling testing for all endpoints', () => {

    // non existent path trigers 404 Universal error in app.js file
    test('Returns 404 status - with msg: "Path not found" for incorect path provided by the client', () => {
        return request(app)
            .get('/not-a-valid-endpoint')
    });
});

// ------ GET - requests testing------
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
                .then(({ body: { users } }) => {
                    users.forEach((user) => {
                        expect(user).toEqual(expect.objectContaining(
                            {
                                username: expect.any(String)
                            }))
                    })
                })
        });
    });
    describe('GET - /api/articles', () => {
        test('Responds with: an articles array of article objects, each of which should have the following properties: author which is the username from the users table title article_id topic created_at votes the articles should be sorted by date in descending order.', () => {
            return request(app)
                .get("/api/articles")
                .expect(200)
                .then(({ body: { articles } }) => {
                    articles.forEach((article) => {
                        expect(article).toEqual(expect.objectContaining({
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            body: expect.any(String),
                            created_at: expect.any(String),
                            votes: expect.any(Number)
                        }))
                    })
                })
        });
    });

    describe('GET /api/articles/:article_id/comments', () => {
        test('Returns: 200, Returns array of comments for given article_id', () => {
            return request(app)
                .get('/api/articles/1/comments')
                .expect(200)
                .then(({ body: comments }) => {
                    comments.forEach((comment) => {
                        expect(comment).toEqual(
                            expect.objectContaining({
                                comment_id: expect.any(Number),
                                votes: expect.any(Number),
                                created_at: expect.any(String),
                                author: expect.any(String),
                                body: expect.any(String),
                            })
                        );
                    })
                });
        })

        // non existent path trigers 404 Universal error in app.js file
        test('Error 404 when wrong path been passed ', () => {
            return request(app)
                .get('/api/articles/1/not-valid-path')
        });

        test('Error 400 request when given invalid article_id', () => {
            return request(app)
                .get('/api/articles/not-valid-id/comments')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe('Bad Request');
                });
        });

        test('/api/articles/article:id/comments responds error 404 when article_id does not exist in the database', () => {
            return request(app)
                .get('/api/articles/666/comments')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found")
                })
        })
    });


});

// ------ PATCH - requests testing ------
describe('PATCH - requests testing', () => {
    describe('PATCH - /api/articles/:article_id', () => {
        // variable to use while testing on this whole endpoint 200 + 400s... paths
        const incrementArticleVotesBy =
        {
            inc_votes: 11
        }
        test("Responds with: the updated article. Request body accepts: an object in the form { inc_votes: newVote } newVote will indicate how much the votes property in the database should be updated by e.g. { inc_votes : 1 } would increment the current article's vote property by 1 { inc_votes : -100 } would decrement the current article's vote property by 100", () => {

            return request(app)
                .patch("/api/articles/1")
                .send(incrementArticleVotesBy)
                .expect(200)
                .then(({ body: { article } }) => {
                    expect(article).toEqual(expect.objectContaining({
                        article_id: 1,
                        votes: 111,
                        title: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        topic: expect.any(String)
                    }))
                })
        });
        // ------ error testing /api/articles/:article_id ------
        // ------ 404 /* is handled globaly -app, 500 is handled globaly errors-controlers ------

        test('Error 404 when article_id does not exist in a database', () => {
            return request(app)
                .patch('/api/articles/666')
                .send(incrementArticleVotesBy)
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found")
                })
        })


        test('Error 400 when article_id is not valid ', () => {
            return request(app)
                .patch('/api/articles/not-valid-id')
                .send(incrementArticleVotesBy)
                .expect(400)
                .then(({ body: { msg } }) => {

                    expect(msg).toEqual("Bad request");
                })

        });
        test('Error 400 when body is empty ', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({})
                .expect(400)
                .then(({ body: { msg } }) => {

                    expect(msg).toEqual("Bad request");
                })

        });
        test('Error 400 when passed body is not valid', () => {
            return request(app)
                .patch('/api/articles/1')
                .send({
                    inc_votes: "not-an-id"
                })
                .expect(400)
                .then(({ body: { msg } }) => {

                    expect(msg).toEqual("Bad request");
                })

        })
        test('Error 400 when passed body has more than 1 {}', () => {
            return request(app)
                .patch('/api/articles/1')
                .send(
                    [{
                        inc_votes: 11
                    },
                    {
                        inc_votes: 12
                    }]
                )
                .expect(400)
                .then(({ body: { msg } }) => {

                    expect(msg).toEqual("Bad request");
                })

        })
    });
});

// ------ POST - request testing------

describe('POST request testing', () => {
    describe('POST - /api/articles/:article_id/comments', () => {

        // non existent path trigers 404 Universal error in app.js file
        test('Error 404 when wrong path been passed ', () => {
            return request(app)
                .post('/api/articles/3/not-valid-path')
                .send(requestConntentToPost)
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Path not found")
                })
        });

        // object to send as body in tests for this endpoint
        const requestConntentToPost =
        {
            username: 'lurker',
            body: 'Just looking'
        }

        test('Request body accepts: an object with the following properties: username, body. Responds with: the posted comment', () => {


            return request(app)
                .post("/api/articles/1/comments")
                .send(requestConntentToPost)
                .expect(200)
                .then(({ body: { comment } }) => {
                    expect(comment).toEqual(expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: 0,
                        author: 'lurker',
                        body: 'Just looking',
                        created_at: expect.any(String),
                        article_id: 1
                    }))
                })
        });

        test('Error 400 when article_id does not exist in a database', () => {
            return request(app)
                .post('/api/articles/666/comments')
                .send(requestConntentToPost)
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })
        })

        test('Error 500 when article_id is not valid ', () => {
            return request(app)
                .post('/api/articles/not-valid-id/comments')
                .send(requestConntentToPost)
                .expect(500)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Server Error")
                })
        });

        test('Error 400 when passed body is empty ', () => {
            return request(app).
                post('/api/articles/3/comments')
                .send({})
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })


        })

        test('Error 400 when passed body has only one property ', () => {
            return request(app)
                .post('/api/articles/3/comments')
                .send(
                    {
                        body: 'Just looking'
                    })
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })

        })

        test('Error 400 when passed body has more then two properties ', () => {
            return request(app)
                .post('/api/articles/3/comments')
                .send(
                    {
                        username: 'lurker',
                        body: 'Just looking',
                        num: 11
                    }
                )
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })

        })

        test('Error 400 when username value is not a string ', () => {
            return request(app)
                .post('/api/articles/3/comments')
                .send(
                    {
                        username: 33,
                        body: 'Just looking',
                    }
                )
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })


        })

        test('Error 400 when passed body value is not a string ', () => {
            return request(app)
                .post('/api/articles/3/comments')
                .send(
                    {
                        username: 33,
                        body: 22,
                    }
                )
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })
        })
    });
});

// ------ DELETE - request testing------

describe('DELETE - request testing', () => {
    describe('DELETE - /api/comments/:comment_id', () => {

        // non existent path trigers 404 Universal error in app.js file
        test('Error 404 when path does is not valid', () => {
            return request(app)
                .delete('/api/commen/1')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Path not found")
                })
        });

        test('Error 204 and delete comment /api/comments/:comment_id', () => {
            return request(app)
                .delete('/api/comments/1')
                .expect(204).then((response) => {
                })

        })
        test('Error 404 when comment_id does not exist in the database', () => {
            return request(app)
                .delete('/api/comments/666')
                .expect(404)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Not found")
                })
        });
        test('Error 400 when comment_id does is not valid', () => {
            return request(app)
                .delete('/api/comments/not-valid')
                .expect(400)
                .then(({ body: { msg } }) => {
                    expect(msg).toBe("Bad request")
                })
        });
    });
});