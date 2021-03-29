var express = require('express');
var router = express.Router();

/* GET 404 page. */
router.get('/', function (req, res, next) {
    res.render('404', { title: 'Not Found' });
});

module.exports = router;
