var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({message: "welcome to xcx!!"})
  //res.render('index', { title: 'Express' });
});

router.post('/welcome', function(req, res, next) {
  res.json({message: "welcome to xcx!!"})
  //res.render('index', { title: 'Express' });
});


module.exports = router;
