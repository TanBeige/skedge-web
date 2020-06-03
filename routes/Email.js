var express = require('express');
const router = express.Router();
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


router.post('/add_and_send_deal', (req, res, next) => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  var subject = req.body.subject
  var name = req.body.name
  var description = req.body.description
  var phone_number = req.body.phone_number
  var web_url = req.body.web_url
  var location_name = req.body.location_name
  var city = req.body.city
  var state = req.body.state
  var street = req.body.street

  console.log(name)


  const msg = {
    to: 'tanarin12@gmail.com',
    from: 'info@theskedge.com',
    templateId: '307d8a22-d4f8-4624-aca0-e25629fc3949',
    dynamic_template_data: {
      subject: subject,
      name: name,
      description: description,

      phone_number: phone_number,
      web_url: web_url,
      location_name: location_name,
      city: city,
      state: state,
      street: street
    },
  };
  sgMail.send(msg);
});

router.post('/send', (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `name: ${name} \n email: ${email} \n message: ${message} `

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
});

module.exports = router;
