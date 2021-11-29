const express = require("express");
const indexRouter = require("./routes/index.js")
const axios = require("axios");
const bodyParser = require("body-parser");
const usefulFunc = require('./checkEntries');
const app = express();

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let results;

app.get("/", indexRouter);

app.use(bodyParser.urlencoded({extended: true}));

app.get("/customizeGame", (req, res) => {
    res.render("customizegame", {error: ""});
});

app.post("/customizeGame", (req, res) => {
    const userConfig = {};

    userConfig.amount = req.body.amount;
    userConfig.category = req.body.category;
    userConfig.difficulty = req.body.difficulty;
    userConfig.type = req.body.type;

    axios.get(usefulFunc.getUrl(userConfig)).then((response) => {
        results = usefulFunc.reFormat(response.data);

        // results = {
        //     categories: results[0],
        //     correctAnswers: results[1],
        //     difficulties: results[2],
        //     incorrectAnswers: results[3],
        //     questions: results[4],
        //     types: results[5]
        // }
        if(results[4].length === 0){
            res.render("customizegame", {error: "There are no results for the selected category, try reducing the number of questions or choose another category"});
        }else{
            res.redirect("/startQuiz");
        }
    }).catch((error) => {
        results = {connError: error};
        res.redirect("/customizeGame")
    });
});

app.get("/startQuiz", (req, res) => {
    res.render("startquiz", {
        categories: results[0],
        correctAnswers: results[1],
        difficulties: results[2],
        incorrectAnswers: results[3].toString(),
        questions: results[4],
        types: results[5]
    });
});

app.listen(3000, () => {
    console.log("server running at port 3000");
});
