// const http = require('http');
const axios = require('axios');
const bodyParser = require("body-parser");

exports.getRecipe = async (req, res) => {
    let responseObject = {};
    let requestParam = req.query.i;

    if (!requestParam) {
        return res.status(500).json({errors: [{code:"invalidParam", detail:"error parsing query parameters"}]})
    }

    let keywords = [];
    requestParam.split(",").forEach((param) => {
        if (param !== "") {
            keywords.push(param);
        }
    });
    if (keywords.length < 1) {
        return res.status(500).json({errors: [{code:"emptyIngr", detail:"must receive at least one ingredient"}]})
    }
    if (keywords.length > 3) {
        return res.status(500).json({errors: [{code:"tooManyIngr", detail:"must receive up to three ingredients"}]})
    }
    responseObject.keywords = keywords;

    let raw_recipes;
    try {
        const response = await axios.get(`http://www.recipepuppy.com/api/?i=${requestParam}`)
        raw_recipes = response.data.results;
    } catch (error) {
        console.log(error);
    }

    if (!raw_recipes) {
        return res.status(500).json({errors: [{code:"emptyRecipes", detail:"couldn't find any recipes"}]})
    }

    let recipes = raw_recipes;
    responseObject.recipes = recipes;

    return res.json(responseObject);
}