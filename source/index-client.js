#!/usr/bin/env node

const fetch = require("node-fetch");
const uuid = require("uuid/v4");
const { dim, red } = require("chalk");
const minimist = require("minimist");

const CLIENT = uuid();

const args = minimist(process.argv.slice(2));
const { _: newTargets } = args;
const targets = newTargets.map(target => {
    const out = /:\d{1,6}\/?$/.test(target) ? target : `${target.replace(/\/$/, "")}:8888`;
    return /^https?:/.test(out) ? out : `http://${out}`;
});
const lines = [];

if (!targets || targets.length === 0) {
    throw new Error(`Failed to start: no target receivers specified`);
}

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

function sendLines() {
    if (lines.length === 0) {
        setTimeout(sendLines, 100);
        return;
    }
    const sendingLines = [...lines];
    lines.splice(0, lines.length);
    const data = {
        lines: sendingLines,
        id: CLIENT
    };
    if (args.name && args.name.length > 0) {
        data.name = args.name;
    }
    return Promise.all(
        targets.map(target =>
            fetch(target, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
        )
    )
        .then(() => {
            sendingLines.forEach(line => {
                console.log(`${dim("⇒")} ${line}`);
            });
            sendLines();
        })
        .catch(err => {
            sendingLines.forEach(line => {
                console.log(`${red("⇒")} ${line}`);
            });
            sendLines();
        });
}

sendLines();
