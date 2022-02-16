const express = require("express");
const { handleCustomErrors, handle500Error } = require("./controllers/errors-controllers");
const { getTopicsAll , getArticleById, getUsersAll, getArticlesAll} = require("./controllers/get-controllers");



const app = express();
app.use(express.json());


app.get("/api/topics", getTopicsAll);

app.get("/api/articles", getArticlesAll);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsersAll);

// 404 Universal Error - path not found
app.all('/*', (req, res) => {
    res.status(404).send({msg: 'Path not found.'});
})






app.use(handleCustomErrors);
app.use(handle500Error);





module.exports = app;