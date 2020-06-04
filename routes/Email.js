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

  // Get Variables
  var toEmail = req.query.toEmail;
  var saveEmail = req.query.saveEmail;
  var subject = req.query.subject;
  var preheader = req.query.preheader;
  var deal_name = req.query.deal_name;
  var description = req.query.description;
  var phone_number = req.query.phone_number;
  var web_url = req.query.web_url;
  var location_name = req.query.location_name;
  var city = req.query.city;
  var state = req.query.state;
  var street = req.query.street;
  var cover_url = req.query.cover_url;

  console.log("req query: ", req.query);

  // If Checked the box, Add Email to Email List
  if(saveEmail){
    var request = require("request");

    var options = { method: 'PUT',
      url: 'https://api.sendgrid.com/v3/marketing/contacts',
      headers: 
        { 'content-type': 'application/json',
          authorization: `Bearer ${process.env.SENDGRID_API_KEY}` },
      body: 
        { 
          list_ids: [ '7f2f88ae-7588-4756-9b48-052f078ce5b7' ],
          contacts: [ 
            { 
              email: toEmail, 
              city: city,
              state_province_region: state
            } 
          ] 
        },
      json: true 
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);

      // console.log(response)

      console.log(body);
    });
  }

  // Send Email to user


  const msg = {
    to: toEmail,
    from: 'info@theskedge.com',
    fromname: 'Skedge',
    from: {
      email: 'info@theskedge.com',
      name: "Skedge"
    },
    templateId: 'd-2a3c360d98d74be1aaf568b8dd6ed65c',
    // html: `
    // <img src=${cover_url} width=100%/>
    // <strong>
    //   and easy to do anywhere, even with Node.js
    // </strong>`,
    dynamic_template_data: {
      subject: subject,
      preheader: preheader,
      cover_url: cover_url,
      deal_name: deal_name,
      description: description,
      web_url: "https://res.cloudinary.com/skedge/image/upload/v1590082349/deal_covers/i59qvdx6qh4knp8ubkb2.jpg",

      phone_number: phone_number,
      web_url: web_url,
      location_name: location_name,
      city: city,
      state: state,
      street: street
    },
  };
  sgMail.send(msg).then((result) => {console.log("result: ", result)}, error => {
    console.error("error: ", error);

    if (error.response) {
      console.error("error.response.body", error.response.body)
    }
  });

  // res.json({
  //   status: 'success'
  // })
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
