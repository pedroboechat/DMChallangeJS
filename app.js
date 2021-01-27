// NPM imports
const express = require("express");
const dotenv = require("dotenv");

// Controller import
const recipeController = require("./controllers/recipes");

// Configure environment variables
dotenv.config();

// Create Express instance
const app = express();
app.disable("x-powered-by");

// Routes
app.get("/", (req, res) => {
    return res.json({message: "Welcome to the API!"});
})

app.get("/recipes", recipeController.getRecipe);

app.use((req, res) => {
    return res.status(404).json({message: "Page not found"});
});

// Listen to port 80
// const PORT = process.env.PORT | 80;
app.listen(80);