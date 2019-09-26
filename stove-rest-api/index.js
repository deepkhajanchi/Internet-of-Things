const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')

const app = express();
const port = 80;

const mongo_server = "mongodb://localhost:27017";
const mongo_db = "cmpe272";
const mongo_collection = "usage";
let isOn = false;

app.use(bodyParser.json())

app.get('/usage', (req, res) => {
    MongoClient.connect(mongo_server, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongo_db);
        dbo.collection(mongo_collection)
            .find({date: {$gte: lastMonthDate()}}).toArray(function (err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

app.post("/on", (req, res) => {
    isOn = true;
    res.send("success")
});

app.post("/off", (req, res) => {
    // console.log(req.body)
    isOn = false;
    MongoClient.connect(mongo_server, function (err, db) {
        if (err) throw err;
        var dbo = db.db(mongo_db);
        dbo.collection(mongo_collection).findOne({date: tonight()}, async function (err, result) {
            if (err) throw err;
            if (!result) {
                const doc = {"date": tonight(), "usage": req.body.usage}
                await dbo.collection(mongo_collection).insertOne(doc, function (err, data) {
                    if (err) throw err;
                    // console.log(data);
                });
            } else {
                await dbo.collection(mongo_collection).updateOne(
                    {"date": tonight()},
                    {$set: {usage: Number(result.usage) + Number(req.body.usage)}})
            }
            db.close();
        });
        res.send("");
    });
});

app.get("/status", (req, res) => {
    if (isOn)
        res.send("Yes, It\'s on!");
    else
        res.send("Don\'t worry, It is off")
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

const tonight = () => {
    const d = new Date();
    return new Date(`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`)
};

const lastMonthDate = () => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return new Date(`${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`)
};