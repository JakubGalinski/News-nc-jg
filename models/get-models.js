const db = require("../db/connection.js")

exports.fetchTopicsAll = () => {
    const str = `SELECT slug, description FROM topics;`;
    return db.query(str)
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchArticlesAll = () => {

    const str = `SELECT articles.*, CAST(COUNT(comments.article_id)AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id;`

    return db.query(str)

        .then(({ rows }) => {
            return rows
        })
}

exports.fetchArticleById = (articleId) => {

    const id = parseInt(articleId)

    if (Number.isNaN(id)) { return Promise.reject({ status: 400, msg: "Bad request" }) }

    const str = 'SELECT articles.*, COUNT(articles.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;';
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

