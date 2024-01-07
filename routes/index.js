//This code is based on the course material from week 7 in course Advanced Web Applications, not my own code

var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
//const validateToken = require("../auth/validateToken.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//Registering is done here because users.js isn't working for some reason!
router.post("/api/user/register", async function(req, res) {
    let StatusNum; 
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

router.post("/api/user/login", function(req, res){

})
module.exports = router;