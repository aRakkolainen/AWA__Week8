var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/api', function(req, res, next) {
  res.send('respond with a resource');
});

/*router.post("/api/user/register", function(req, res) {
  console.log(req.body)
  res.send("Registering!");
})*/
module.exports = router;
