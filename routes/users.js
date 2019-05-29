var express = require('express');
var router = express.Router();
router.ledDisplay = {};
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
  console.log(req.query.imageUrl);
  router.ledDisplay.setImage(req.query.imageUrl);
});

module.exports = router;
