//This code is based on the course material from week 7 in course Advanced Web Applications, not my own code
//How to use findOne: https://mongoosejs.com/docs/api/model.html#Model.findOne() 
var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
//const validateToken = require("../auth/validateToken.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//Registering is done here because users.js isn't working for some reason!
router.post("/api/user/register", async function(req, res) {
    let statusNum; 
    let message; 
    //Checking if email and password were provided with request
    if (req.body.email && req.body.password) {
      //Checking whether user already exists
      let user = await User.findOne({email: req.body.email}).exec(); 
      // User with this particular email doesn't exists, adding new one to the database
      if (!user) {
        //Hashing the password: 
        let hashedPassword = await bcrypt.hash(req.body.password, 10);
        let newUser = new User({email: req.body.email, password: hashedPassword});
        await newUser.save(); 
        statusNum = 200; 
        message = "ok"
    } else {
      statusNum = 403; 
      message = {email: "Email already in use"};
    }
      res.status(statusNum).send(message);
    } else {
      console.log("Email was not provided!");
    }

})
// Login with json webtoken is implemented based on course material!
router.post("/api/user/login", async function(req, res) {
  let secret = process.env.SECRET;

  // First checking if user with given email exists, in case that req.body is not empty!)
  if (req.body.email && req.body.password) {
    //Checking whether user already exists
    let user = await User.findOne({email: req.body.email}).exec(); 
    if (!user) {
      res.status(403).json({message: "Login failed!"});
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) throw err; 
        if (isMatch) {
          // Creates the token!
          jwt.sign({
            data: req.body.email, 
            exp: 120
          }, 'SECRET', (err, token) => {
            console.log(token)
            res.json({success: true, token});
          });

        }
      })
    }
  }
    

})
module.exports = router;
