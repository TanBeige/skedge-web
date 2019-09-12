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


// Uplooad TO digitalocean
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
            console.log(req.s3_key_prefix);
            const key = `${req.s3_key_prefix}${uuid}`;

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
    
    try {
        req.s3_key_prefix = req.headers['x-path'].replace(/^\/+/g, '');
    } catch(e) {
        return next(Boom.badImplementation('x-path header incorrect'))
    }

    req.saved_files = [];

    next()
}

router.post('/upload', upload_auth, upload.array('files', 50), function (req, res) {
    res.json(req.saved_files);
});

// Read FROM digitalocean to grab images
router.get('/file', (req, res, next) => {
    const key = `/${req.query.key}`;
    console.log("KEY: ", key)

    const params = {
        Bucket: S3_BUCKET,
        Key: key,
    };

    s3.headObject(params, function (err, data) {
        if (err) {
            //console.error(err);
            console.log("Error")
            if(err.code === 'NotFound') {
                return next(Boom.notFound())
            }
            return next(Boom.badImplementation('Unable to retrieve file.'));
        }

        const stream = s3.getObject(params).createReadStream();

        //forward errors
        stream.on('error', function error(err) {
            console.error(err);
            return next(Boom.badImplementation());
        });

        console.log("Another TEst");

        res.set('Content-Type', data.ContentType);
        res.set('Content-Length', data.ContentLength);
        res.set('Last-Modified', data.LastModified);
        res.set('Content-Disposition', `inline; filename="${data.Metadata.originalname}"`);
        res.set('ETag', data.ETag);

        //pipe the s3 object to the response
        stream.pipe(res);
    })
});

module.exports = router;