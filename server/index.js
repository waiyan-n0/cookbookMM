const dotenv = require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URL)
    .then(()=> console.log('MongoDB is connected!'))
    .catch((err)=>console.log('Database Error: ',err));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require('./routes/user_route.js');
const recipeRoute = require('./routes/recipe_route.js');
const interactionRoute = require('./routes/interaction_route.js');

app.use('/users', userRoute);
app.use('/recipes', recipeRoute);
app.use('/interactions', interactionRoute)

app.use((err, req, res, next)=>{
    res.status(400).json({con:false, msg: err.message});
});

app.listen(PORT, () => {
    console.clear();
    console.log(`Server listening on port ${PORT}`);
})

