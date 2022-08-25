const Product = require('./models/Product')
const products = require('./data/products.json')
require('./db')

const feedData=async()=>{
    try{
        await Product.deleteMany();
        console.log("Seccessfully deleted all products");
        await Product.insertMany(products);
        console.log("Successfully feeded data");
        process.exit();
    }catch(error){
        console.log(error);
        process.exit();

    }
}

feedData();