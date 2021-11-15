var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('./clinic_progress/index', {
    "header_mode": 3
  });
});

module.exports = router;
