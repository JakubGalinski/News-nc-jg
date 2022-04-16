const db = require('../db/connection.js');


exports.removeCommentById = (id) => {

    if (Number.isNaN(id)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    let str = `DELETE FROM comments WHERE comment_id = $1 RETURNING*;`;

    return db.query(str, [id])
        .then(({ rows }) => {

            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }

            return rows[0];
        })
}