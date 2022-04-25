const db = require("../db/connection.js")

exports.fetchTopicsAll = () => {
    const str = `SELECT slug, description FROM topics;`;
    return db.query(str)
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchArticlesAll = () => {
    return db.query('SELECT * FROM articles;')
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchArticleById = (articleId) => {
    const id = parseInt(articleId)
    if (Number.isNaN(id)) { return Promise.reject({ status: 400, msg: "Bad request" }) }
    const str = `SELECT * FROM articles WHERE article_id = $1;`;
    return db.query(str, [id])
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({ status: 404, msg: "Id non existent" });
            return rows[0]
        })
}

exports.fetchUsersAll = () => {
    return db.query('SELECT * FROM users;')
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchAllComentsByArticleId = (articleId) => {
    const id = parseInt(articleId)

    if (Number.isNaN(id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    return db
        .query('SELECT * FROM comments WHERE article_id = $1', [id])
        .then(({ rows }) => {

            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" })
            }

            return rows
        });
}

