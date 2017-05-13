var http = require('http');
var fs = require('fs');
var express = require('express');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

//Client ID,Client Secret,Callback URL

const ClientID = "670330944058-dbaor6mvj7i6helnkrb6dft9megc4514.apps.googleusercontent.com";
const ClientSecret = "yiKczp9FZS_wSFpyVJTwsd0q";
const CallbackURL = "http://127.0.0.1:8005/authCallback";

//Starting app
var app= express();

//creating OAuth URL
function getOauthClient() {
	return new OAuth2(ClientID, ClientSecret, CallbackURL);
}
function getAuthURL(){
	var oauth2client = getOauthClient();
	var scopes = ['https://www.googleapis.com/auth/plus.me'];
	var url = oauth2client.generateAuthUrl({
		access_type: 'offline',
		scope: scopes
	});
	return url;
}

//Callback route
app.use("/authCallback", function(req,res){
	var oauth2client = getOauthClient();
	var code = req.query.code;
	oauth2client.getToken(code,function(err,tokens){
		if(!err){
			oauth2client.setCredentials(tokens);
			res.send('<h3>Login successful!!</h3>')
		}else{
        res.send(`<h3>Login failed!!</h3>`)
      }
	});
});

//main route
app.use("/",function(req,res){
	var url = getAuthURL();
	res.send(`<h1>Authentication using google oAuth</h1>`+
        `<a href= "${url}">Login</a>`)
});

//defining port number for app
var port = 8005;
var server = http.createServer(app);
server.listen(port);
server.on('listening',function() {
	console.log(`${port}`);
});
