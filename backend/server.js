const app = require('./app');
require('./db')


const dotenv = require('dotenv');


process.on('uncaughtException', (err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server because of uncaughtException");
        process.exit(1);
})

// setting up config file

dotenv.config({path : 'backend/config/config.env'})


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server started on Port ${process.env.PORT} and in ${process.env.NODE_ENV} mode`);
})


// handling unhandledRejection like b is missing in mongodb

server.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down server because of unhandledRejection");
    server.close(()=>{
        process.exit(1);
    })
})
