var express = require('express');
var mysql = require('mysql');
var app = express();

var Mailgun = require('mailgun').Mailgun;
var mg = new Mailgun('/');

//config
app.set('views', __dirname + '/')
app.set('view engine', 'jade')

var connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "root",
        port: '8889',
        database: 'keyspace'
});
connection.connect();

//middleware
app.use(express.bodyParser());
app.use(express.static(__dirname + '/'));
//app.use(express.session());

//login Authentication

/*var user = '';

var authRequired = function(req, res, next){
    if (req.session.user) {
        next();
    } else {
        req.session.error = 'Access Denied!';
        res.redirect('/login.html');
    }
};
*/

app.post('/loginAuth', function(req, res, err) { 
        var loginUser = req.body.username;
        var loginPass = req.body.password;
        connection.query('SELECT username,password FROM user WHERE username = ? AND password = ?', [loginUser, loginPass], function(err, rows, fields) {
                console.log("the database error is: " + err);
        

                if (rows.length > 0) {
                        console.log("Success!");
                        res.redirect('/easyform.html');
                } else if (err === null) {
                        console.log('post error: ' + err);
                        res.redirect('/loginfailed.html');
                }
        });
});


//logout
app.get('/logout', function(req, res){
    req.session.destroy(`function(){
        res.redirect('/login.html');
    });
});


//Route for IMEI Order
app.post('/keys', function(req, res) {
        var IMEI = req.body.imei;
        var phoneType = req.body.model;
        
        connection.query('INSERT INTO imei_order (imei, model) VALUES (?, ?)', [IMEI, phoneType], function(err, rows, fields) {
                console.log(err, rows, fields);

                /*mg.sendRaw('test@testmail.com', 'khalenm@gmail.com',
                    'From: test@testmail.com' +
                    '\nTo: ' + 'khalenm@gmail.com' +
                    '\nContent-Type: text/html; charset=utf-8' +
                    '\nSubject: This is a test' + rows,
                    function(err) { err && console.log(err) }); 

                */ 
                });

        console.info('login PARAM ', req.body);

        res.redirect('/success.html')
});

app.get('/imei', function(req, res){
        connection.query('SELECT * FROM imei_vault', function(err, rows) {
                res.render('display', {imei_vault: rows});
        });
});

app.listen(5454);
console.log("LISTENING ON 5454");
