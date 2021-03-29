var express = require('express');
var router = express.Router();
const Cube = require('../models/cube');
const User = require('../models/user');

/* GET details page for selected cube. */
router.get('/:id', function (req, res, next) {
    let id = req.params.id; 
    console.log("this is req", req);

    Cube.findOne({ _id: id })
        .then((thisCube) => {
            res.render('details', { title: 'Article', 
                cube: thisCube, 
                loggedInUser: req.user
                
            });
        });
});

module.exports = router;