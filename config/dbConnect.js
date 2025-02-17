import mongoose from "mongoose";


const dbConnect = async () => {
    console.log('try to connect db')
    await mongoose.connect('mongodb://localhost:27017/mamlaka');
    console.log('connect to db')



}

export default dbConnect
