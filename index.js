const path = require("path");

const express = require("express");

const app = express();
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

app.set("views", path.join(__dirname, 'views'));
app.set("view engine", 'ejs');

//app.use('/', indexRouter);
app.use("/users", usersRouter);

app.use(function(req, res, next) {
    console.log('1');
    next(new Error('error'));
})

app.use(function(req, res, next) {
    console.log('2');
    res.status(200).end();
})

app.use(function(err, req, res, next) {
    console.log(err.stack);
    res.status(500).send('Something broke!');
})

app.listen(80);