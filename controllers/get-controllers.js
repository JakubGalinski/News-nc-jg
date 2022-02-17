const { fetchTopicsAll, fetchArticleById, fetchUsersAll, fetchArticlesAll } = require("../models/get-models")


exports.getTopicsAll = (req, res, next) => {
    fetchTopicsAll()
        .then((topics) => {
            res.status(200).send({ topics: topics })
        })
        .catch((err) => {
            console.log(err, "Controller catch err log");
            next(err);
        });
}

exports.getArticlesAll = (req, res, next) => {
    fetchArticlesAll()
        .then((articles) => {
            res.status(200).send({ articles: articles })
        }).catch((err) => {
            console.log(err, "Controller catch err log");
            next(err);
        });
}

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;

    fetchArticleById(articleId)
        .then((article) => {
            res.status(200).send({ article: article })
        }).catch((err) => {
            console.log(err, "Controller catch err log");
            next(err);
        });
}

exports.getUsersAll= (req, res, next) => {
    fetchUsersAll()
        .then((users) => {
            res.status(200).send({ users: users })
        }).catch((err) => {
            console.log(err, "Controller catch err log");
            next(err);
        });
}
