exports.handleCustomErrors = (err, req, res, next) => {
    console.log(`Error ${err.status} occured`);
    if (err.status) res.status(err.status).send({msg: err.msg});
    else next(err);
};

exports.handle500Error = (err, req, res, next) => {
    console.log(`Error 500 occured`);
    res.status(500).send({msg: "Server Error"})
}