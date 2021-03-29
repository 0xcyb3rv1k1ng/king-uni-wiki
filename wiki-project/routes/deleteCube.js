var express = require("express");
var router = express.Router();
const Cube = require("../models/cube");
const User = require('../models/user');

/* GET details page for selected cube. */
router.get('/:id', function (req, res, next) {
    let id = req.params.id;

    Cube.findOne({_id: id }) 
        .then((thisCube) => {
            res.render('deleteCube', {
                title: 'Delete Cube',
                cube: thisCube
            });
        });
});

/*DELETE*/
router.post("/:id", function (req, res, next) {
    let selectedCubeId = req.params.id;
    console.log('deleting this', selectedCubeId);    

    Cube.deleteOne(
        { _id: selectedCubeId }
        
    )
    .then(()=> {
        console.log('deleted', selectedCubeId);
    })  
    .catch(err => { console.log(err);});
    res.redirect('/');

});

module.exports = router;