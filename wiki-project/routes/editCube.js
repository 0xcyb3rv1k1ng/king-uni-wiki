var express = require("express");
var router = express.Router();
const Cube = require("../models/cube");
const User = require('../models/user');

/* GET details page for selected cube. */
router.get('/:id', function (req, res, next) {
    let id = req.params.id;

    Cube.findOne({ _id: id}) 
        .then((thisCube) => {
            res.render('editCube', {
                title: 'Edit Cube',
                cube: thisCube
            });
        });
});

// POST
router.post("/:id", function (req, res, next) {
    Cube.updateOne(
        { _id: req.params.id },
        {
            name: req.body.name,
            description: req.body.description,
            
        }
        
        
    )
    .catch(err => { console.log(err);});

    res.redirect('/');
});

module.exports = router;