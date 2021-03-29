var express = require("express");
var router = express.Router();
const Accessory = require("../models/accessory");
const Cube = require("../models/cube");


/* GET details page for selected cube. */
router.get('/:uid', function (req, res, next) {
  let id = req.params.uid;
  console.log("this is attach Accessory cube id", id);

  Cube.findOne({
      _id: id
    }).populate('accessories') //get access to all accessories attach to this cube
    .then((thisCube) => {
      console.log("this is this cube", thisCube);
      // res.render('attachAccessory', {
      //   cube: thisCube
      // });
      let idArr = thisCube.accessories.map(accessory => {
        return accessory._id;
      });

      //find all accessories
      Accessory.find()
        .then((foundAccessories) => {
          let dropDownAccessoriesArr = foundAccessories.filter(accessory => !idArr.includes(accessory._id))
          res.render('attachAccessory', {
            title: 'Attach Accessory',
            cube: thisCube,
            dropDownAccessories: dropDownAccessoriesArr
          })
        })
        .catch(err => console.log(err));

    });
}); 
  

/*POST new Accessory */
router.post("/:uid", function (req, res, next) {
  let selectedCubeId = req.params.uid;
  console.log(selectedCubeId);
  let selectedAccId = req.body.accessory;

  Cube.findOneAndUpdate({
      _id: selectedCubeId
    }, {
      $push: {
        "accessories": selectedAccId
      }
    }, {
      upsert: true
    },
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  Accessory.findOneAndUpdate({
      _id: selectedAccId
    }, {
      $push: {
        "cubes": selectedCubeId
      }
    }, {
      upsert: true
    },
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  res.redirect(`/details/${selectedCubeId}`);
});
  
  module.exports = router;