#!/usr/bin/env node

const fetch = require("node-fetch");
const uuid = require("uuid/v4");
const { green, red } = require("chalk");

const ADDRESS = "http://localhost:8888";
const CLIENT = uuid();

const lines = [];

process.stdin.resume();
process.stdin.on("data", function(data) {
    lines.push(
        ...data
            .toString("utf8")
            .trim()
            .split("\n")
    );
});
process.stdout.on("error", function(err) {
    if (err.code === "EPIPE") {
        return process.exit();
    }
    process.emit("error", err);
});

function sendLine() {
    if (lines.length === 0) {
        setTimeout(sendLine, 100);
        return;
    }
    const line = lines.shift();
    fetch(ADDRESS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ line, id: CLIENT })
    })
        .then(() => {
            console.log(`${green("✔")} ${line}`);
            console.log(line);
            sendLine();
        })
        .catch(err => {
            console.log(`${red("✘")} ${line}`);
            //lines.unshift(line);
            sendLine();
        });
}

sendLine();
