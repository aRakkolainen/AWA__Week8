//Based on lecture materials!
const jwt = require("jsonwebtoken");



module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    let token; 
    if (authHeader) {
        token = authHeader.split(" ")[1];
    } else {
        token = null; 
    } if (token == null) {
        return res.sendStatus(401);
    } else {
        console.log("Token found!");
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if(err) return res.sendStatus(401);
                req.email = user.email;
                next(); 
            //return res.send({email: user.email})
            
        })
    }
}