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
    folder: "moment",
    allowedFormats: ["jpg", "png"],
    transformation: function(req, res, cb) {

        //console.log("req.query", req)

        const inX = req.query.x;
        const inY = req.query.y;
        const inHeight = req.query.height;
        const inWidth = req.query.width;

        let transformation = [
            { x: inX, y: inY, width: inWidth, height: inHeight, crop:'crop' },
            { if: "w_gt_1900", width: 1900, crop: "scale" },
            { if: "h_gt_1900", height: 1900, crop: "scale" },
            { quality: "auto" },
            { format: 'jpg' }
        ]
        cb(undefined, transformation)
    },
    // transformation: [
    //     { x: inX, y: inY, width: inWidth, height: inHeight, crop:'crop' },
    //     { quality: "auto" },
    //     { format: 'jpg' }
    // ]
});

const parser = multer({ storage: storage });

router.post('/upload', parser.single('file'), (req, res) => {

    const image = {};
    image.id = req.file.public_id;

    // res.send(image);
    res.json(image);  // Returns image url and id to be stored
});

module.exports = router;