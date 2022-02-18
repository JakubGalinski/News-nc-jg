exports.handleSqlErrors = (err, req, res, next) => {
    console.log(`Custom sql occured`);
    console.log(err);
    if (err.code === "23503") {
        res.status(400).send({ msg: 'Bad request' });
    }
    else {
        next(err);
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    console.log(`Error custom ${err.status} occured`);
    console.log(err);
    if (err.status) res.status(err.status).send({msg: err.msg});
    else next(err);
};

exports.handle500Error = (err, req, res, next) => {
    console.log(`Error 500 occured`);
    console.log(err);
    res.status(500).send({msg: "Server Error"})
}