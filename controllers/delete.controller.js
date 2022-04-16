

const { removeCommentById } = require('../models/delete-models.js');

exports.deleteCommentById = ((req, res, next) => {

    const id = parseInt(req.params.comment_id);
    removeCommentById(id).then((comment) => {

        res.status(204).send();

    })
        .catch((err) => {
            console.log(err, "controller err");
            next(err);
        })
})