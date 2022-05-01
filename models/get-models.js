const db = require("../db/connection.js")
const fs = require('fs/promises');

exports.fetchDocsAPI = () => {
    return fs
        .readFile(`${__dirname}/../endpoints.json`)
        .then((JSONfile) => JSON.parse(JSONfile));

}

exports.fetchTopicsAll = () => {
    const str = `SELECT slug, description FROM topics;`;
    return db.query(str)
        .then(({ rows }) => {
            return rows
        })
}

exports.fetchArticlesAll = (sortby = 'created_at', order = 'DESC', topic) => {

    const validOrder = ['ASC', 'DESC'];

    if (!validOrder.includes(order)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    const validSortBy = ['created_at', 'article_id', 'votes', 'comment_count'];

    if (!validSortBy.includes(sortby)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
    }

    let str = `SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles
               LEFT JOIN comments ON comments.article_id = articles.article_id`

    if (topic !== undefined) str += ` WHERE articles.topic = '${topic}'`

    str += ` GROUP BY articles.article_id`

    if (sortby !== "comment_count")
        str += ` ORDER BY articles.${sortby} ${order};`;
    else {
        str += ` ORDER BY COUNT(comments.article_id) ${order};`
    }

    return db.query(str)
        .then(({ rows }) => {

            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }

            return rows;
        })
}

exports.fetchArticleById = (articleId) => {

    const id = parseInt(articleId)

    if (Number.isNaN(id)) { return Promise.reject({ status: 400, msg: "Bad request" }) }

    const str = 'SELECT articles.*, COUNT(articles.article_id) as comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;';
    return db.query(str, [id])
        .then(({ rows }) => {
            if (rows.length === 0)
                return Promise.reject({ status: 404, msg: "Not found" });
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

