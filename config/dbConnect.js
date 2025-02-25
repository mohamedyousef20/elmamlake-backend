// import mongoose from "mongoose";


// const connectDB = async () => {
//     console.log('try to connect db')
//     await mongoose.connect('mongodb://localhost:27017/mamlaka');
//     console.log('connect to db')



// }

// export default connectDB

// ////
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ MongoDB Connected Successfully!");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

export default connectDB;
