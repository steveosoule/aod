var express = require('express');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Compile stuff!');
});

router.get('/sass', function(req, res, next) {
  var aod_sass = require('../aod/aod_sass.js');

  // res.contentType('css');
  res.send(aod_sass.compile_from_request(req));
});

module.exports = router;
