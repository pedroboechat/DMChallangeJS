// NPM imports
const express = require("express");
const dotenv = require("dotenv");

// Configure environment variables
dotenv.config();

// Create Express instance
const app = express();

app.get("/", (req, res) => {
    return res.json({message: "asd"})
})

const PORT = process.env.PORT | 80;
app.listen(PORT);