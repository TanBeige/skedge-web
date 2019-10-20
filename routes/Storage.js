// Code from: 
// https://www.freecodecamp.org/news/how-to-allow-users-to-upload-images-with-node-express-mongoose-and-cloudinary-84cefbdff1d9/

const express = require('express');
var multer = require('multer');
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

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
    folder: "cover_images",
    allowedFormats: ["jpg", "png"],
    transformation: [
        { if: "w_gt_1900", width: 1900, crop: "scale" },
        { if: "h_gt_1900", height: 1900, crop: "scale" },
        { quality: "auto" }
    ]
});

const parser = multer({ storage: storage });

router.post('/upload', parser.single("file"), (req, res) => {
    console.log("Upload API Called")
    console.log(req.file) // to see what is returned to you
    const image = {};
    image.url = req.file.url;
    image.id = req.file.public_id;
    res.json(image);  // Returns image url and id to be stored
});

module.exports = router;