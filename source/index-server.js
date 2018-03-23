#!/usr/bin/env node

const express = require("express");
const bodyParser = require("body-parser");
const { green, red, bgRgb, black } = require("chalk");
const chalk = require("chalk");
const pad = require("pad");

const app = express();
app.use(bodyParser.json());

const COLOURS = [
    chalk.bgRgb(193, 166, 224), // violet
    chalk.bgRgb(242, 225, 152), // yellow
    chalk.bgRgb(194, 148, 225), // lavender
    chalk.bgRgb(186, 209, 158), // green
    chalk.bgRgb(226, 133, 219) // violet
];

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
    const { lines, id, name } = req.body;
    const isNew = isNewClient(id);
    const clientIndex = getClientIndex(id);
    const colour = getClientColour(id);
    if (isNew) {
        console.log(`${green("✔")} Connected: ${ip} (${clientIndex})`);
    }
    const clientName = name || `#${clientIndex}`;
    const formattedName = colour.black(` ${pad(clientName, 5, { strip: true })} `);
    lines.forEach(line => {
        console.log(`${formattedName} ${line}`);
    });
    res.send(
        JSON.stringify({
            status: "ok"
        })
    );
});

app.listen(8888, () => {
    console.log("Listening on 8888");
});
