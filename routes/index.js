//This code is based on the course material from week 7 in course Advanced Web Applications, not my own code
//How to use findOne: https://mongoosejs.com/docs/api/model.html#Model.findOne() 
var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const validateToken = require("../auth/validateToken.js");
const {body, validationResult } = require("express-validator");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//Registering is done here because users.js isn't working for some reason!
router.post("/api/user/register", 
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1, 
    minNumbers: 1,
    minSymbols: 1 
  }),
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
      }
      let statusNum; 
      let message; 
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
      
    })
// Login with json webtoken is implemented based on course material!
router.post("/api/user/login",  
  body("email").isEmail(),
  body("password").isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1, 
    minNumbers: 1,
    minSymbols: 1 
  }), async function(req, res) {
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
          const jwtPayload = {
            email: user.email
          }
          jwt.sign(
            jwtPayload, 
            process.env.SECRET, 
            {
              expiresIn: 120
            }, 
            (err, token) => {
              res.json({success: true, token});
            }
          )

        }
      })
    }
  }
    

})

router.get("/api/private", validateToken, (req, res) => {
  donsole.log("Secret route accessed")
})
module.exports = router;
