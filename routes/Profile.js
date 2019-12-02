// Code from: 
// https://www.freecodecamp.org/news/how-to-allow-users-to-upload-images-with-node-express-mongoose-and-cloudinary-84cefbdff1d9/

const express = require('express');
var multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const defaultProfilePicture = "profile/mvy0pe3fmidzjfp9qg6y";

const {
    CLOUD_NAME,
    API_KEY,
    API_SECRET
} = require('../config');

const router = express.Router() 

// Upload TO cloudinary
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "profile",
    allowedFormats: ["jpg", "png"],
    transformation: [
        { if: "w_gt_200", width: 200, crop: "scale" },
        { if: "h_gt_200", height: 200, crop: "scale" },
        { quality: "auto" },
        { format: 'jpg' }
    ]
});

const parser = multer({ storage: storage });

router.post('/upload', parser.single("file"), (req, res) => {
    //console.log(req.file) // to see what is returned to you
    const image = {};
    //Editing URL to store jpeg version
    let tempImageUrl = req.file.secure_url.replace(".png",".jpg");
    image.url = tempImageUrl;
    image.id = req.file.public_id;

    let param = req.query.picId;

    if(param !== defaultProfilePicture) {
        cloudinary.v2.uploader.destroy(param, function(error,result) {
            console.log("Params: ", param)
            console.log("result: ", result, "error ", error) 
        });
    }
    else {
        console.log("\n\n Deleting \n")
    }


    res.json(image);  // Returns image url and id to be stored
});

module.exports = router;