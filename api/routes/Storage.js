// Code from: https://blog.hasura.io/building-file-upload-downloads-for-your-hasura-app/

const express = require('express');
//const Joi = require('joi');
const Boom = require('boom');
const uuidv4 = require('uuid/v4');
var multer = require('multer');
var multerS3 = require('multer-s3');
const AWS = require('aws-sdk');

const {
    S3_ACCESS_KEY_ID,
    S3_SECRET_ACCESS_KEY,
    S3_ENDPOINT,
    S3_BUCKET
} = require('../config');

const router = express.Router()

const s3 = new AWS.S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    endpoint: S3_ENDPOINT,
    s3ForcePathStyle: true,
    signatureVersion: 'v4'
})


const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: S3_BUCKET,
        metadata: (req, file, cb) => {
            cb(null, {
                originalname: file.originalname,
            });
        },
        contentType: function (req, file, cb) {
            cb(null, file.mimetype)
        },
        key: function(req, file, cb) {

            const uuid = uuidv4();
            const key = `${uuid}`;

            console.log(file);

            req.saved_files.push({
                originalname: file.originalname,
                mimetype: file.mimetype,
                encoding: file.encoding,
                key,
            });

            cb(null, key);
        }
    })
});


const upload_auth = (req, res, next) => {
    console.log("upload_auth test")
    req.saved_files = [];

    next()
}

router.post('/upload', upload_auth, upload.array('files', 50), function (req, res) {
    res.json(req.saved_files);
});

module.exports = router;