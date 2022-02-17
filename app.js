const express = require("express");
const app = express();

// ------ GET ------
const { getTopicsAll , getArticleById, getUsersAll, getArticlesAll} = require("./controllers/get-controllers");

// ------ PATCH ------
const { patchArticleVotesById } = require("./controllers/patch-controllers");

// ------ ERROR ------
const { handleCustomErrors, handle500Error } = require("./controllers/errors-controllers");




app.use(express.json());


// ------ GET methods ------
app.get("/api/topics", getTopicsAll);

app.get("/api/articles", getArticlesAll);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsersAll);

// ------ PATCH methods ------

app.patch("/api/articles/:article_id", patchArticleVotesById)



// ------ ERROR methods ------
//------ 404 Universal Error - path not found ------
app.all('/*', (req, res) => {
    console.log("Path not found");
    res.status(404).send({msg: 'Path not found.'});
})

app.use(handleCustomErrors);
app.use(handle500Error);










module.exports = app;