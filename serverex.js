process.env.PORT = 9099;


// Web application which authenticates to github
var github = require('octonode');
var qs = require('querystring');
var url = require('url');
var express = require('express');
var app = express.createServer();



// Build the authorization config and url
var auth_url = github.auth.config({
    client_id: '9b811fa8146dbd5d0b35',
    client_secret: '503ad50e04a62b1e01df184d951a204dbca3d77d'
}).login(['user', 'repo', 'gist']);

app.configure(function(){
    app.use(express.static(__dirname + '/public'));
});


app.register('.html', require('jade'));

app.get('/connect', function(req, res){
    res.writeHead(301, {'Content-Type': 'text/plain', 'Location': auth_url})
    res.end('Redirecting to ' + auth_url);
});

app.get('/auth', function(req, res){
    uri = url.parse(req.url);
    github.auth.login(qs.parse(uri.query).code, function (err, token) {
      console.log(token);
    });
    
    res.render('index.html');
});

app.listen(process.env.PORT);

console.log("listening on: " + process.env.PORT)