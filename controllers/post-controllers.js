const { insertCommentsByArticleId } = require("../models/post-models");




exports.postCommentsByArticleId = ((req, res, next) => {

    const articleId = req.params.article_id;
    const requestBody = req.body;

    insertCommentsByArticleId(articleId, requestBody)
        .then((comment) => {
            res.status(200).send({ comment: comment });
        }).catch((err) => {
            console.log(err, "POST controller err");
            next(err);
        })

})