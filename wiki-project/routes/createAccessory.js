var express = require('express');
var router = express.Router();
const Accessory = require('../models/accessory');

/*GET createAccessory page */
router.get('/', function (req, res, next) {
    res.render('createAccessory', {
            title: 'Create Accessory'
        })
});

/*POST new Accessory */
router.post('/', function (req, res, next) {
    console.log("incoming form submission", req.body);

    const newAccessory = new Accessory({
        name: req.body.name,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        cubes: [],
    });

    newAccessory.save()
        .then((result) => {
            console.log(result);
            res.redirect('/');
        });
});

module.exports = router;