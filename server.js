//DEPENDENCIES
const express = require('express')
const methodOverride = require("method-override")
const { Sequelize } = require('sequelize');
const cors = require('cors')

//CONFIGURATION
require('dotenv').config()
const app = express();

//MIDDLEWARE
app.use(methodOverride('_method'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
const sequelize = new Sequelize(process.env.PG_URI)

//ROOT 
app.get('/',(req, res)=>{
    res.status(200).send('now we\'re cooking 🍜')
})

//CONTROLERS
const recipeController = require('./controllers/recipe_controllers')
app.use('/recipe',recipeController)

//LISTEN
app.listen(4000, ()=>{
    console.log(` 🍳 cooking on port: 4000 `)
    
})