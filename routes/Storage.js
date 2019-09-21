// Code from: https://blog.hasura.io/building-file-upload-downloads-for-your-hasura-app/

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
    //transformation: [{ width: 500, height: 500, crop: "limit" }]
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