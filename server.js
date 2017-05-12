var http = require('http');
var fs = require('fs');
var express = require('express');
var Session = require('express-session');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

//Client ID,Client Secret,Callback URL

const ClientID = "670330944058-dbaor6mvj7i6helnkrb6dft9megc4514.apps.googleusercontent.com";
const ClientSecret = "yiKczp9FZS_wSFpyVJTwsd0q";
const CallbackURL = "http://127.0.0.1:8005/auth/google/";

//Starting app
var app= express();

//Using session in express
app.use(Session({
	secret : "127845",
	resave : true,
    saveUninitialized:true 
}));

//defining port number for app
var port = 8005;
var server = http.createServer(app);
server.listen(port);
server.on('listening',function() {
	console.log(`listening on ${port}`);
});

//creating OAuth URL
function getOauthClient() {
	return new OAuth2(ClientID, ClientSecret, CallbackURL);
}

function getAuthURL(){
	var oauth2client = getOauthClient();
	var scopes = ['profile','email'];
	var url = oauth2client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	});
	return url;
}

//routes
app.use("/",function(req,res){
	var url = getAuthURL();
	res.sendfile('index.html', ({root: __dirname}))
});

//Callback route
app.use("/auth/google", function(req,res){
	var oauth2client = getOauthClient();
	var session = require.session;
	var code = req.query.code;
	oauth2client.getToken(code,function(err,tokens){
		if(!err){
			oauth2client.setCredentials(tokens);
			session["tokens"] = "tokens";
			res.send(`
            &lt;h3&gt;Login successful!!&lt;/h3&gt;
            &lt;a href="/details"&gt;Go to details page&lt;/a&gt;
        `);
		}else{
        res.send(`
            &lt;h3&gt;Login failed!!&lt;/h3&gt;
        `);
      }
	});
});
