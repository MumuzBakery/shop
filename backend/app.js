const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

mongoose.connect("mongodb+srv://admin:mmz-bakery@cluster0.xvcctmy.mongodb.net/node-angular?retryWrites=true&w=majority").then(() => {
    console.log('Connected to mongo database!');
}).catch(() => {
    console.log('Failed to connect!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded(
    {
        extended: false
    }
));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, PUT, OPTIONS");
    next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);


module.exports = app;