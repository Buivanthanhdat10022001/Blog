const mongoose = require('mongoose');

const connectDB = async () => {

    try {
        mongoose.set('strictQuery', false);
        const connect = await mongoose.connect(process.env.MONGODB_URL);
        console.log('Database Connect : succesfully')
    }catch(error) {
        console.log(error);
    }

} 

module.exports = connectDB;