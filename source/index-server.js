#!/usr/bin/env node

const express = require("express");
const bodyParser = require("body-parser");
const { green, red } = require("chalk");

const app = express();
app.use(bodyParser.json());

const clientIDs = [];

function getClientIndex(id) {
    const index = clientIDs.indexOf(id);
    if (index === -1) {
        return clientIDs.push(id) - 1;
    }
    return index;
}

function isNewClient(id) {
    return clientIDs.indexOf(id) === -1;
}

app.post("/", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { line, id } = req.body;
    const isNew = isNewClient(id);
    const clientIndex = getClientIndex(id);
    if (isNew) {
        console.log(`${green("✔")} Connected: ${ip} (${clientIndex})`);
    }
    console.log(`${clientIndex} » ${line}`);
    res.send(
        JSON.stringify({
            status: "ok"
        })
    );
});

app.listen(8888, () => {
    console.log("Listening on 8888");
});
