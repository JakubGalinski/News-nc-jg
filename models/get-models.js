const db = require("../db/connection")

exports.fetchTopics = () => {
    const str = `SELECT slug, description FROM topics`
    return db.query(str)
        .then(({ rows }) => {
            console.table(rows);
            return rows
        })
}