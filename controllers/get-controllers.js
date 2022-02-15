const { fetchTopics, } = require("../models/get-models")


exports.getTopics = (req, res, next) => {

    // console.log(req, "REQ Inside the controller");
    // console.log(res, "RES Inside the controller");
    fetchTopics()
    .then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch((err) => {
        console.log(err, "catch err log");
        next(err);
    })
}