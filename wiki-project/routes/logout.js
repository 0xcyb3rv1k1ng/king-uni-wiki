var express = require('express');
var router = express.Router();

// Logout
router.get('/', function(req, res) {
    //req.session.destroy()
    req.logout()
    res.redirect('/')
    console.log('Logging out');
});

module.exports = router;