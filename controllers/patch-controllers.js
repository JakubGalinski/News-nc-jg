const db = require("../db");
const { mendArticleVotesById } = require("../models/patch-models")



exports.patchArticleVotesById = ( req, res, next) => {
    const reqBody = req.body;
    const articleId = parseInt(req.params.article_id);
   
    mendArticleVotesById(articleId, reqBody)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch((err) => {
        console.log(err, "Patch controller error catch msg");;
        next(err);
    });
}   
