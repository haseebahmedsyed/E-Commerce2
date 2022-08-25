const mongoose = require('mongoose')
const dotenv = require ('dotenv')
dotenv.config({path:"backend/config/config.env"})

// const connectDataBase = ()=>{
//     mongoose.connect("mongodb://localhost:27017/Ecommerce",()=>{
//         console.log("Connected to database");
//     })
// }

const connectDataBase = ()=>{
    mongoose.connect(process.env.DATABASE_URI,()=>{
        console.log(process.env.DATABASE_URI);
        console.log("Connected to database");
    })
}

connectDataBase();