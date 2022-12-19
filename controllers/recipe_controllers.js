const recipe = require('express').Router()
const db = require('../models')
const {Recipes , Ingredients, Steps, Recipe_ingredient} = db
const {Op} = require('sequelize')

const ingredients = require('../models/ingredients')

//INDEX
recipe.get('/', async(req,res) => {
    try{
        const foundRecipes = await Recipes.findAll({
            where:{
              title:{[Op.like]:`%${req.query.title ? req.query.title : ''}%`}
            }
        })
        res.status(200).json({
            message:"found all recipes",
            data:foundRecipes
        })
    }catch(err){
        res.status(500).json(err)
    }
    
})

//SHOW Find a specific Recipe returns steps ingredients and quantity in adition to recipe values 
recipe.get('/:id', async(req,res) => {
    try {
        const foundRecipe = await Recipes.findOne({
            where: { recipe_id: req.params.id},
            include:[
                {
                model:Ingredients,
                as:'ingredients',
                through:{
                    attributes:["quantity"]
                },
            }
        ,
            {
                model:Steps,
                as:"steps"
            }
        ]
        })
        // const ingredientList = await Recipe_ingredient.findAll({
        //     where:{recipe_id : foundRecipe.recipe_id},
        //})
        console.log("hi")
        res.status(200).json(foundRecipe)
    } catch (error) {
        res.status(500).json(error)
    }
})

//test create
recipe.post('/', async (req,res)=>{
    try{
        
        const newRecipe = await Recipes.create(
                        { author: req.body.author,
                          image: req.body.image,
                          title: req.body.title,
                          description: req.body.description
                        })

         const response = await req.body
        
        //creates an array of all our added steps refencing the created recipe id 
        const stepsArr = await response.step_body.map((value,i) =>{
         //sets i to be 1 for the first value and then goes up from there   
            i++
            return(
                {
                    step_body: value,
                    step_number: i,
                    recipe_id:newRecipe.recipe_id
                }
            )
        })
        //bulk creates all the new steps
        const bulkSteps = await Steps.bulkCreate(stepsArr)

        const ingredientsArr = await response.name.map(value =>{
            return(
                {
                    name:value
                }
            )
        })
       // adds all ingredient objects to the database
        const bulkIngredients = await Ingredients.bulkCreate(ingredientsArr)

        const recipeIngredientArr = await response.quantity.map((value,i) =>{
            return(
                {
                  recipe_id:newRecipe.recipe_id,
                  ingredient_id:bulkIngredients[i].ingredient_id,
                  quantity:value  
                }
            )
        })

        const bulkRecipeIngredient = await Recipe_ingredient.bulkCreate(recipeIngredientArr)
  
        // res.status(200).json({
        //     message:"that worked",
        //     data:[response]
        // })
        res.redirect(`https://what-the-chef-frontend.onrender.com/${newRecipe.recipe_id}`)
    }catch(err){
        console.log(err)
    }
})

//UPDATE
recipe.put('/:id', async (req, res) => {
    try {
        const response = await req.body
        
        const update_main = await Recipes.update(
            { author: req.body.author,
              image: req.body.image,
              title: req.body.title,
              description: req.body.description
            }, {
            where: {
                recipe_id: req.params.id
            }
        })
            //creates an array of all our added steps refencing the created recipe id 
            const stepsArr = await response.step_body.map((value,i) =>{
                //sets i to be 1 for the first value and then goes up from there   
                   i++
                   return(
                       {
                           step_body: value,
                           step_number: i,
                           recipe_id:req.params.id
                       }
                   )
               })
              //clear all old steps
               const deleteSteps = await Steps.destroy({
                where: {
                    recipe_id: req.params.id
                }
            })

               //bulk creates all the new steps
            const bulkSteps = await Steps.bulkCreate(
                stepsArr,
                {
                    updateOnDuplicate : ["step_body"]
                }
                 )
                //create an array of updated ingredents
                 const ingredientsArr = await response.name.map(value =>{
                    return(
                        {
                            name:value
                        }
                    )
                })

                const deleteRecipeIngredient = await Recipe_ingredient.destroy({
                    where: {
                        recipe_id: req.params.id
                    }
                })

               // adds all ingredient objects to the database
                const bulkIngredients = await Ingredients.bulkCreate(ingredientsArr)

                const recipeIngredientArr = await response.quantity.map((value,i) =>{
                    return(
                        {
                          recipe_id:req.params.id,
                          ingredient_id:bulkIngredients[i].ingredient_id,
                          quantity:value  
                        }
                    )
                })
        
                const bulkRecipeIngredient = await Recipe_ingredient.bulkCreate(recipeIngredientArr)
          

    res.redirect(`https://what-the-chef-frontend.onrender.com/${req.params.id}`)
        // res.status(200).json({
        //     message: bulkSteps, bulkRecipeIngredient
        // })
    } catch(err) {
        res.status(500).json(err)
    }
})

//DELETE
recipe.delete('/:id', async (req, res) => {
    try {
        const deletedRecipe = await Recipes.destroy({
            where: {
                recipe_id: req.params.id
            }
        })

        const deleteSteps = await Steps.destroy({
            where: {
                recipe_id: req.params.id
            }
        })

        const deleteRecipeIngredient = await Recipe_ingredient.destroy({
            where: {
                recipe_id: req.params.id
            }
        })
        res.status(200).json({
            message: `Successfully deleted ${deletedRecipe} recipe(s)`
        })
    } catch(err) {
        res.status(500).json(err)
    }
})


module.exports = recipe

