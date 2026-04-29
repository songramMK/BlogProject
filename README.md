## Authentication 
Authentication যেকোনো web application এর সবচেয়ে গুরুত্বপূর্ণ অংশ।
এই লেখায় আমি দেখাবো কিভাবে Node.js + Express + MongoDB (MERN stack) দিয়ে একটি clean authentication system তৈরি করা যায়।


status Code : 

- 400 যদি কোন Data Missing থাকে যেমন form fillup করার সময় যদি কোন একটা input field empty রাখি 
- 401 user যদি authenticate না হয়ে থাকে তখন 
- 404 db এ যদি Data না থাকে । 
- 409 যদি Already data exist থাকে (যেমন User already exist db এ কিন্তু আবার user create করতে চাচ্ছি ) 
- 201 ডাটাবেস কোন একটা ডাটা সেই হয়েছে যেমন signup successfully 
- 200 কোন একটা কাজ সফল ভাবে হয়েছে যেমন sign in successfully হবে । 
- 500 internal server error 


1. প্রথম আমরা npm init --y এই কমান্ড দিবো । <br><br>
2. দরকারি সবগুলো লাইব্রেরি install করবো ঃ npm i express dotenv cors bcrypt nodemailer cookie-parser<br><br>
3. dev dependency nodemon install দিবো । (dev Dependency মানে - এই Dependency টা project যখন server লেভেল এ যাবে তখন আর প্রয়োজন হবে না শুধু project create করার সময় দরকার হবে ) <br><br>
4. folder create করবো - 
    - config  folder create করবো । এর ভিতরে dev.js নামে একটা file বানাবো যার ভিতরে mongodb connect করার code থাকবে ।<br><br> 
    - model folder create করবো এর ভিতরে mongodb এর model গুলো জন্য user.model.js file রাখবো । <br><br>
    - utils folder create করবো । এর ভিতরে প্রয়জনীয়  ফাংশন গুলোর  file গুলো  থাকবে যেমন : 
        * Database এ user এর password save করার সময় password Hash করার দরকার হলে আমরা যে ```js bcrypt.hash(UserGivenPassword, SALT)``` method use করি তারপর আবার signin করার সময় user এর দেওয়া password টা authentic কিনা তা compare করার জন্য যখন bcrypt.compare(SignInTimeUserGivenPassword , DatabaseSavePassword) method ব্যবহার করি তখন আমরা hash.utils.js file use করে থাকি । <br>
        * তারপর RefreshToken , AccessToken , CookieCreate করার জন্য আমরা যে function গুলো রাখি সেগুলো আমরা একটা file এ রাখি যেমন token.utils.js <br><br>
    - Routes folder create করে  এর ভিতরে Routes file গুলো রাখবো <br><br>
    - middleware folder create করবো এর ভিতরে middleware গুলো রাখব <br><br>
    - Controllers folder create করে এর ভিতরে auth.controllers.js file রাখব <br><br>
    
6. .env file create করবো । এর ভিতরে আমরা এই code গুলো লিখবো যেগুলো আমরা secure রাখতে চাচ্ছি । যেমন 
```js
PORT=5000  // server কোন port এ চলবে সেটা environment variable হিসেবে রাখি
MongoDb_URL=URLLINK
```
<br>

7. package.json file এ গিয়ে script এর ভিতরে start : "node index.js" , dev : "nodemon index.js" 
<br>

8. db.js file এর ভিতরে 

```js
const mongoose = require('mongoose') ; 
const connectDb = async () =>{
    try{
        const connection = await mongoose.connect(process.env.MongoDb_URL);
        console.log("Connected Mongoose....")
    }catch(error){
        console.error(error);
    }
}
module.exports = connectDb; 
```

9. index.js file create করবো 

```js
const express = require('express') ; // express library import করেছি । 
const app = express() ; 
const cookieparser = require('cookie-parser') ; 
const cors = require('cors') ; 
const connectDb = require('./config/db') ; //Mongodb connection import করবো । 



const dotenv = require('dotenv') ; 
dotenv.config() ; 


const port = process.env.PORT || 3000 ; 


// Middleware 
app.use(cors({
    origin : http://localhost:5173', 
    credential : true , 

}))
app.use(express.json()) ; 
app.use(express.urlencoded({extended : true})) ; 
app.use(cookieparser());

app.listen(port , async()=>{
    await connectDb() ; 
    console.log(`Server is Running at the port ${port}`); 
})
```

9. Controller folder এ 