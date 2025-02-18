const express = require('express');
const dotenv = require('dotenv');
const cors =  require('cors');
const path = require('path');
const db = require('./db/db')
const initializedDataBase = require('./db/initializedDataBase')

// import files
const userRoute = require('./routers/userRoutes')


// config .env
dotenv.config();


// create app
const app = express();
app.use(express.json({ limit: '10mb' })); // This ensures the limit is properly applied
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.set('view engine', 'ejs');

// Define the views folder
app.set('views', path.join(__dirname, 'views'));


// app.use(express.urlencoded());

const allowedOrigins = [`http://localhost:5173`, 'https://vishalkumar07.me'];

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}))


// connect with DB
db;
initializedDataBase();


// default route
app.get('/',(req,res)=>{
    try{
        res.status(200).json({message:"Welcome to by Vishal" , info:"API service available on route /api"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
});

// configure PORT
const PORT = process.env.PORT || 4040;

app.use('/api/user', userRoute);


// make listen our server to http
app.listen(PORT,()=>{
    console.log(`Server is running on PORT ${PORT}`);
})