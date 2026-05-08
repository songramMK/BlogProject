const express = require('express') ; 
const app = express() ; 
const cookieParser = require("cookie-parser");
const dotenv = require('dotenv')
const cors = require('cors') ; 
const connectDb = require('./config/db');
const UserRouter = require('./Routers/user.route');
const authRouter = require('./Routers/auth.route');
const postRouter = require('./Routers/post.route');
const commentRouter = require('./Routers/comment.route');

dotenv.config() ; 
const port  = process.env.PORT || 5000;

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()) ; 
app.use(cookieParser());
app.use(express.urlencoded({extended: true})) ; 


// ROUTER IMPORT
app.use('/api/user', UserRouter);
app.use('/api/auth', authRouter);
app.use("/api/post", postRouter); 
app.use('/api/comment' , commentRouter) ; 

app.use((err,req,res,next)=>{
  const StatusCode = err.statusCode || 500; 
  const message = err.message || "INTERNAL SERVER ERROR" ; 
  res.status(StatusCode).json({
    success : false, 
    StatusCode , 
    message 
  })
})


app.get('/' , async(req,res)=>{
  res.send("HELLOOOOOOOOOO BLOGPOST")
})



app.listen(port , async() => {
  await connectDb() ; 
  console.log(`Server is running at the server - ${port}`);
});

