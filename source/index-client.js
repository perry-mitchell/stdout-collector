#!/usr/bin/env node

const fetch = require("node-fetch");
const uuid = require("uuid/v4");
const { dim, red } = require("chalk");
const minimist = require("minimist");

const ADDRESS = "http://localhost:8888";
const CLIENT = uuid();

const args = minimist(process.argv.slice(2));
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
process.stdin.on("end", function() {
    setTimeout(() => {
        process.exit(0);
    }, 250);
});
process.stdout.on("error", function(err) {
    if (err.code === "EPIPE") {
        return process.exit(1);
    }
    process.emit("error", err);
});

function sendLine() {
    if (lines.length === 0) {
        setTimeout(sendLine, 100);
        return;
    }
    const line = lines.shift();
    const data = {
        line,
        id: CLIENT
    };
    if (args.name && args.name.length > 0) {
        data.name = args.name;
    }
    fetch(ADDRESS, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(() => {
            console.log(`${dim("⇒")} ${line}`);
            sendLine();
        })
        .catch(err => {
            console.log(`${red("⇒")} ${line}`);
            sendLine();
        });
}

sendLine();
