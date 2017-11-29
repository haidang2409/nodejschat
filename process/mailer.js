/**
 * Created by nguyen hai dang on 07/14/2015.
 */
/**
 * Created by nguyen hai dang on 07/12/2015.
 */
var express = require('express');
var app = module.exports = express();
var nodemailer = require('nodemailer');
app.set('views', __dirname);
app.set('view engine', 'ejs');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'dang111517@student.ctu.edu.vn',
        pass: 'jL12uGrG24'
    },
    tls: {
        rejectUnauthorized: false
    }
});
app.get('/nodemailer', function(req, res){
    var mailOption = {
        to: 'haidangdhct24@gmail.com',
        subject: 'nodemailer example ?',
        text: 'Hello world ?',
        body: '<b>Hello world ?</b>'
    };
    transporter.sendMail(mailOption, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
});
