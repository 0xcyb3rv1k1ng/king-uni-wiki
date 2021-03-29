var express = require('express');
var router = express.Router();
const Cube = require('../models/cube');
const User = require('../models/user');

/* GET home page */
router.get('/', function (req, res, next) {
    Cube.find()
        .sort({id: -1})
        .limit(3)
        .then((cubes) => {
            res.render('index', {
                title: 'Welcome to KingUni Wiki',
                cube: cubes,
                loggedInUser: req.user
            });
        })
        .catch((err) => console.log(err));
        });

router.get('/ping', async function(req, res) {
    res.status(200).send("pong!");
});


module.exports = router;