const app = require('./app');
require('./db')
const cloudinary = require('cloudinary')

const dotenv = require('dotenv');


process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server because of uncaughtException");
        process.exit(1);
})

// setting up config file

dotenv.config({path : 'backend/config/config.env'})


// const server = app.listen(process.env.PORT,()=>{
const server = app.listen(3000,()=>{
    console.log(`Server started on Port ${process.env.PORT} and in ${process.env.NODE_ENV} mode`);
})


// setup cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET,
})


// handling unhandledRejection like b is missing in mongodb

server.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server because of unhandledRejection");
    server.close(()=>{
        process.exit(1);
    })
})
