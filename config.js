const dotenv = require('dotenv')
dotenv.config({path: __dirname + '/.env'});

exports.CLOUD_NAME = process.env.CLOUD_NAME || 'cloud-name';
exports.API_KEY = process.env.API_KEY || 'api-key'
exports.API_SECRET = process.env.API_SECRET || 'secret-key'

exports.PORT = process.env.PORT;

exports.AUTHDOMAIN = process.env.AUTHDOMAIN || "auth-domain";

exports.EMAIL_ADDRESS = process.env.EMAIL_ADDRESS || "";
exports.EMAIL_PW = process.env.EMAIL_PW || "";
