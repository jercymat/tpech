var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./find_doctor/index', {
    "header_mode": 1
  });
});

module.exports = router;
