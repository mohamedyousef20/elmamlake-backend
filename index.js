import express from 'express'
import dbConnect from './config/dbConnect.js';
import dotenv from 'dotenv'
import mountRoutes from './routes/index.js';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';


const app = express();

// to read .env file variable
dotenv.config();

const allowedOrigins = ['http://localhost:3000', 'https://yourdomain.com'];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps, curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));


// middleware to read json file 
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
// mount routes
mountRoutes(app);

// global error handling middleware
// app.use(errorHandler)
app.use(errorHandler)
const PORT = process.env.PORT || 5500

app.listen(PORT, () => {
    // connected to mongo db

    dbConnect();

    console.log(`server is ready to use on port ${PORT}  now you on ${process.env.NODE_ENV} mood`)
})