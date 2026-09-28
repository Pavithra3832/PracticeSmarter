const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("TEST OK");
});

const server = app.listen(5001, () => {
    console.log("TEST SERVER RUNNING");
});

server.on("error", (error) => {
    console.log("SERVER ERROR:", error);
});