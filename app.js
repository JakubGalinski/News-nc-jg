const express = require("express");
const app = express();

// ------ GET ------
const { getTopicsAll, getArticleById, getUsersAll, getArticlesAll, getAllComentsByArticleId, getDocsAPI } = require("./controllers/get-controllers");

// ------ PATCH ------
const { patchArticleVotesById } = require("./controllers/patch-controllers");

// ------ POST ------
const { postCommentsByArticleId } = require("./controllers/post-controllers");

// ------ DELETE ------
const { deleteCommentById } = require("./controllers/delete.controller");


// ------ ERROR ------
const { handleCustomErrors, handle500Error, handleSqlErrors } = require("./controllers/errors-controllers");




app.use(express.json());


// ------ GET requests ------
app.get("/api/", getDocsAPI);


app.get("/api/topics", getTopicsAll);

app.get("/api/articles", getArticlesAll);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getAllComentsByArticleId)

app.get("/api/users", getUsersAll);


// ------ PATCH requests ------

app.patch("/api/articles/:article_id", patchArticleVotesById)

// ------ POST requests ------

app.post('/api/articles/:article_id/comments', postCommentsByArticleId);

// ------ DELETE requests ------

app.delete('/api/comments/:comment_id', deleteCommentById)


// ------ ERROR requests ------
//------ 404 Universal Error - path not found ------

app.all('/*', (req, res) => {
    console.log(" Global 404 error handler - Path not found");
    res.status(404).send({ msg: 'Path not found' });
})

// ------ Error controler invocation -------

app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use(handle500Error);










module.exports = app;