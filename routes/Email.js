var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('../config');

var transport = {
    host: 'mail.privateemail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    secureConnection: true,
    auth: {
        user: creds.EMAIL_ADDRESS,
        pass: creds.EMAIL_PW
    },
    tls: {
        secureProtocol: "TLSv1_method"
    }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');
  }
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `
  console.log(content);

  var mail = {
    from: `"${name}" <${creds.EMAIL_ADDRESS}>`,
    to: creds.EMAIL_ADDRESS,  // Change to email address that you want to receive messages on
    subject: 'New Message from Contact Form',
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(data));
    if (err) {
        // console.log(err)
        res.json({
            status: 'fail'
        })
    } else {
        
        res.json({
            status: 'success'
        })
    }
  })
})
module.exports = router;
