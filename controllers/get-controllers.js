const { fetchTopics, fetchArticlesById } = require("../models/get-models")


exports.getTopics = (req, res, next) => {
    fetchTopics()
        .then((topics) => {
            res.status(200).send({ topics: topics })
        })
        .catch((err) => {
            console.log(err, "Controller catch err log");
            next(err);
        })
}

exports.getArticlesById = (req, res, next) => {
    const articleId = req.params.article_id;

    fetchArticlesById(articleId)
        .then((article) => {
            res.status(200).send({ article: article })
        }).catch((err) => {
            console.log(err, "Controller catch err log");
            next(err);
        });
}