"use strict";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').load();
}

const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();

var port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.user, process.env.clientId, process.env.clientSecret,
    process.env.refreshToken);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.user,
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
    refreshToken: process.env.refreshToken
  },
});


app.get('/', (req, res) => {
    return res.json({ Hi: 'Hi, please use following url `/sendemail` to start sending the email.' });
});


app.post('/sendemail', (req, res) => {
    if( req.body.from && req.body.to && req.body.subject && req.body.body){
        const mailOptions = {
            from: req.body.from,
            to: req.body.to,
            subject: req.body.subject,
            text: req.body.body
        }
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){
                console.log(err)
                console.log('Error');
            } else {
                console.log('Email is successfully sent');
                res.json({ 'Mail sent to ' : mailOptions.to });
            }
        })
    }else{
        console.log("User didn't enter all details");
        return res.json({ Hi :'Please enter all details (from, to, subject, body)' });
    }
    
});


app.listen(port, () => {
    console.log('app running');
});


module.exports = app;
