var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('admin', { title: 'RCtajm' });
});
router.get('/db', function(req, res) {
  res.render('admin_db', { title: 'RCtajm' });
});

module.exports = router;
