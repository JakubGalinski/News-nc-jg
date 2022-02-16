const db = require("../db/connection")

exports.fetchTopics = () => {
    const str = `SELECT slug, description FROM topics;`;
    return db.query(str)
        .then(({ rows }) => {
            console.table(rows);
            return rows
        })
}

exports.fetchArticleById = (articleId) => {
    const id = parseInt(articleId)
    if (Number.isNaN(id)) { return Promise.reject({ status: 400, msg: "Bad request" }) }
    const str = `SELECT * FROM articles WHERE article_id = $1;`;
    return db.query(str, [id])
        .then(({ rows }) => {
            console.log(rows, "rowwwww");
            if (rows.length === 0)
                return Promise.reject({ status: 404, msg: "Id non existent" });
            return rows[0]
        })

}