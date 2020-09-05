var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

app.get('/', function(req,res){
    res.render('index')
});


app.get('/about', function(req,res){
    res.render('about')
});

app.get('/contact', function(req,res){
    res.render('contact')
});

// it wont work if you dont use allow less secure apps https://myaccount.google.com/lesssecureapps
app.post('/contact/send', function(req,res){
    var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {user: 'sender@gmail.com',pass: 'password'}
    });

    var mailOptions = { 
        from: 'Sheeraz ali <sender@gmail.com>',
        to: 'hacker.ascool@gmail.com',
        subject: 'websiite submision',
        text: 'You have submisson with soo and so things in it Name: ' + req.body.name + 'Email ' + req.body.email + 'Message ' + req.body.message,
        email: '<p>you have mail from so and so </p>'
    }

    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error)
            res.redirect('/');
        }else{
            console.log('Message Sent' + info.response);
        }
    })
});


app.listen(3000);

console.log('server is running on port 3000');