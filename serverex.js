var config = require('./config');

// Web application which authenticates to github
var github = require('octonode');
var qs = require('querystring');
var url = require('url');
var express = require('express');
var app = express.createServer();



// Build the authorization config and url
var auth_url = github.auth.config({
    client_id: config.github.client_id,
    client_secret: config.github.client_secret
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
      res.redirect('/app.html?token=' + token);
      console.log(token);
    });
    
    //res.render('index.html');
});

app.listen(config.web.port);

console.log("listening on: " + config.web.port)