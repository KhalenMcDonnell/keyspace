
var express = require('express');
var mysql = require('mysql');
var app = express();

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

app.use(express.bodyParser());
app.use(express.static(__dirname + '/'));

//login Authentication.

exports.login = function(user, callback){
        accounts.findOne({username: user}, function(err, result){
                if (err) throw err;
                callback(result);
        });
};

var readAccount = function(user, callback){
        AM.login(user, function(acct){
                callback(acct);
        });
};

exports.loginHandler = function(req, res) {
        username = req.body.username;
        password = req.body.password;
        readAccount(username, function(acct){
                if (acct.password = password){
                        req.session.username = username;
                        console.log(username+' logged in'+' pass: '+ acct.password);
                };
                res.redirect('/')
        });
};




app.post('/loginAuth', function(req, res, err) { 
        var loginUser = req.body.username;
        var loginPass = req.body.password;
        connection.query('SELECT username,password FROM user WHERE username = ? && password = ?', [loginUser, loginPass], function(err, rows, fields) {
                console.log("this is an error " + err);
        });

        if (!err) {
                console.log("Success!");
                res.redirect('/easyform.html');
        } else {
                console.log('post error: ' + err);
                res.redirect('/loginfailed.html');
        }
});

/*res.statusCode = 302;
                res.setHeader("Order Form", "/easyform.html");
                res.end(); */


//Route for IMEI Order
app.post('/keys', function(req, res) {
        var IMEI = req.body.imei,
                phoneType = req.body.model,
                activeUser = req.body.username;
        connection.query('INSERT INTO imei_order (imei, model, username) VALUES (?, ?, ?)', [IMEI, phoneType, activeUser], function(err, rows, fields) {
                console.log(err, rows, fields);
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
