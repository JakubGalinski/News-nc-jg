const db = require("../db/connection");
const format = require("pg-format");


exports.insertCommentsByArticleId = (id, body) => {

    const commentBodyStrring = body.body;
    const username = body.username;


    if (Number.isNaN(id)) {
        console.log(id, " reject");
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    if (Object.keys(body).length !== 2) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    if (typeof commentBodyStrring !== "string" || typeof username !== "string") {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    const queryParamsArray = [commentBodyStrring, username, id, 0];

    const queryString = ` 
    INSERT INTO comments(body, author, article_id, votes)
    VALUES($1,$2,$3,$4)
    RETURNING*;`

    return db.query(queryString, queryParamsArray)
        .then(({ rows }) => {

            return rows[0];
        })

}
