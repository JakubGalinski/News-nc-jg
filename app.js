const express = require("express");
const { handleCustomErrors, handle500Error } = require("./controllers/errors-controllers");
const { getTopics } = require("./controllers/get-controllers");



const app = express();
app.use(express.json());


app.get("/api/topics", getTopics);


// 404 Universal Error - path not found
app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Path not found.'});
})






app.use(handleCustomErrors);
app.use(handle500Error);





module.exports = app;