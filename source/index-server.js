#!/usr/bin/env node

const express = require("express");
const bodyParser = require("body-parser");
const { green, red, bgBlue, bgGreen, bgRed, bgYellow, black } = require("chalk");
const pad = require("pad");

const app = express();
app.use(bodyParser.json());

const COLOURS = [bgBlue, bgGreen, bgRed, bgYellow];

const clientIDs = [];
const clientColours = [];

function getClientColour(id) {
    const index = getClientIndex(id);
    return clientColours[index];
}

function getClientIndex(id) {
    const index = clientIDs.indexOf(id);
    if (index === -1) {
        const colour = COLOURS.shift();
        COLOURS.push(colour);
        clientColours.push(colour);
        const newLength = clientIDs.push(id);
        return newLength - 1;
    }
    return index;
}

function isNewClient(id) {
    return clientIDs.indexOf(id) === -1;
}

app.post("/", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const { line, id, name } = req.body;
    const isNew = isNewClient(id);
    const clientIndex = getClientIndex(id);
    const colour = getClientColour(id);
    if (isNew) {
        console.log(`${green("✔")} Connected: ${ip} (${clientIndex})`);
    }
    const clientName = name || `#${clientIndex}`;
    const formattedName = colour.black(` ${pad(clientName, 5, { strip: true })} `);
    console.log(`${formattedName} ${line}`);
    res.send(
        JSON.stringify({
            status: "ok"
        })
    );
});

app.listen(8888, () => {
    console.log("Listening on 8888");
});
