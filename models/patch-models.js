const db = require("../db/connection");


exports.mendArticleVotesById = (id, body) => {


    if (Number.isNaN(id)) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    if (Object.keys(body).length !== 1) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }
    if (typeof body.inc_votes !== "number") {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }


    const queryStr = `
    UPDATE articles 
    SET votes = votes + $1 
    WHERE article_id = $2 RETURNING*;`
    const queryIdParamArr = [body.inc_votes, id];

    return db.query(queryStr, queryIdParamArr)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "Not found" });
            }

            return rows[0];
        })
}