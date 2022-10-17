//DEPENDENCIES

const express = require('express')
const app = express();

//MIDDLEWARE

require('dotenv').config()

//ROOT 
app.get('/',(req, res)=>{
    res.status(200).send('now we\'re cooking 🍜')
})

//LISTEN
app.listen(process.env.PORT, ()=>{
    console.log(` 🍳 cooking on port: ${process.env.PORT} `)
    
})