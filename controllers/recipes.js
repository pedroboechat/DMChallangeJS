// const http = require('http');
const axios = require('axios');

// Receives the 'ingredients' and uses RecipePuppy's API to return an array of recipes with them
const getRP = async (ingredients) => {
    try {
        const response = await axios.get(`http://www.recipepuppy.com/api/?i=${ingredients}`)
        // return response.data.results;
        return response.data.results.slice(1,3);
    } catch (error) {
        console.log(error);
        return [];
    }
}

// Receives a 'query' string and uses GIPHY's API to return a GIF URL
const getGif = async (query) => {
    try {
        const response = await axios.get(`http://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_KEY}&q=${query}`);
        return await response.data.data[0].url;
    }
    catch(e) {
        console.log(e);
        return "";
    }
}

// Receives a 'raw_recipes' array and returns an array of recipe objects
const prepareRecipes = async (raw_recipes) => {
    var recipes = [];
    for (const raw_recipe of raw_recipes) {
        const gif = await getGif(raw_recipe.title);
        const obj = {
            title: raw_recipe.title.trim(),
            ingredients: raw_recipe.ingredients,
            link: raw_recipe.href,
            gif: gif
        };
        recipes.push(obj);
    }
    return recipes;
}

// Main function of the API
const getRecipe = async (req, res) => {
    // Gets the request's 'i' query parameter and declares the response object
    const requestQuery = req.query.i;
    const responseObject = {};

    // If the 'i' query parameter is empty or not the only parameter passed
    if (!requestQuery || Object.keys(req.query).length !== 1) {
        return res.status(400).json({errors: [{code:"invalidQuery", detail:"invalid query value(s) or parameter(s)"}]})
    }

    // Extract the keywords/ingredients from the 'i' query parameter
    let keywords = [];
    requestQuery.split(",").forEach((param) => {
        if (param !== "") {
            keywords.push(param);
        }
    });
    // Checks if at least one keyword was passed
    if (keywords.length < 1) {
        return res.status(400).json({errors: [{code:"invalidQuery", detail:"invalid query value(s) or parameter(s)"}]})
    }
    // Checks if the number of keywords is below the limit
    if (keywords.length > 3) {
        return res.status(400).json({errors: [{code:"tooManyIngredients", detail:"must receive up to three ingredients"}]})
    }
    // Assign the keywords array to the equivalent key in the response object
    responseObject.keywords = keywords;

    // Calls 'getRP' function with the 'i' query parameter of ingredients
    const raw_recipes = await getRP(requestQuery);

    // Checks if any recipe was found
    if (!raw_recipes.length) {
        return res.status(400).json({errors: [{code:"emptyRecipes", detail:"couldn't find any recipes"}]})
    }

    // Calls 'prepareRecipes' with the raw_recipes array
    const recipes = await prepareRecipes(raw_recipes);

    // Assign the formated recipes to the equivalent key in the response object
    responseObject.recipes = recipes;

    // Returns the response object
    return res.json(responseObject);
}

exports.getRecipe = getRecipe;