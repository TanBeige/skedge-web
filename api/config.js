const dotenv = require('dotenv')
dotenv.config({path: __dirname + '/.env'});



exports.S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || 's3-access-key-id';
exports.S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || 's3-secret-access-key';
exports.S3_ENDPOINT = process.env.S3_ENDPOINT || 's3-endpoint';
exports.S3_BUCKET = process.env.S3_BUCKET || 's3-bucketname';
exports.S3_REGION = process.env.S3_REGION || 's3-region';

exports.PORT = process.env.PORT;