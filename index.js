/*
Kahoot? More like DoIT
*/
const socket = require('socket.io');
const express = require('express');
//const session = require('express-session');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const process = require('process');
const path = require('path');
const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();
app.set('view engine', 'ejs'); 
app.use(cookieParser());
require('dotenv').config();
const server = app.listen(3000, () => {
  console.log("Project DoIT. Made by Mr Discreet Animation#8833. Not for Production!");
});
const io = socket(server);
io.on('connection', socket => {
  //Emits to the User Directly
  //socket.emit()
  socket.on('codeVALIDATION', (msg) => {
    var package = msg;
    if (package[0] === "join"){
      fs.readFile("code/"+package[1]+'.json', (err, data) => {
        if (err){
        console.log(data);
        return socket.emit('server', {status: 404, respond: "Unable to Find any matching Game!", code: package[1]})
        }
      });
      socket.emit('server', {status: 200, respond: "JoinServerAvailable", code: package[1], username: package[2]})
    }
    else if (package[0] === "create"){
      const datb = JSON.stringify({
        "game": package[2],
        "code": package[1]
      })
      fs.writeFile("code/"+package[1]+'.json', datb, err => {
        if (err) {
          console.error(err);
          return socket.emit('server', {status: 500, respond: "Unable to Create a Game!", code: package[1]});
        }
        socket.emit('server', {status: 200, respond: "OK", code: package[1]})
      });
    }
  })

  socket.on('host', (host) => {
    if (host[0] === "join"){
      io.emit('server', { status: 200, respond: "Users", code: host[1], username: host[2]})
      fs.readFile("code/"+host[1]+'.json', 'utf8', (err, dtA) => {
        if (err){
        return socket.emit('host', {commands: "end", code: host[1], game: "Unable to fetch game name!"})
        }
        socket.emit('host', { commands: "connected", code: host[1], game: dtA.game})
      });
    }
    if (host[0] === "end"){
      fs.unlink("code/"+host[1]+".json", (err) => {
        if (err) {
          console.error(err);
          return io.emit('host', { commands: "end", code: host[1] });
        }
        //file removed
        io.emit('host', { commands: "end", code: host[1] })
      });
    }
    if (host[0] === "ban"){
      fs.unlink("code/"+host[1]+".json", (err) => {
        if (err) {
          console.error(err);
          return io.emit('server', { status: 403, respond: "banned", code: host[1] });
        }
        //file removed
        io.emit('server', { status: 403, respond: "banned", code: host[1] });
      });
    }
    if (host[0] === "startGame"){
      
    }
  })

  //Emits to Everyone Except the User!
  //socket.broadcast.emit()
  //Emits to everyone!
  //io.emit('message', "Come join the fun!")
  //On Disconnect
  /*socket.on('disconnect', () => {
      //Does something when the user disconnect
  })*/

})
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname))
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/login.html', loginDetect, (req, res) => {
res.sendFile(path.join(__dirname, 'login.htm'));
})

app.post('/login.html', (req, res) => {
  let { username, password } = req.body;
  if (!username || !password){
    res.send("Username or Password cannot be blank!")
  }
  else if (username === "ACE" && password === "1234567890"){
    res.cookie("loggedIN", "true")
    res.cookie("account", "ACE")
    res.cookie("dashboard", "teacher")
    res.cookie("token", jwt.sign({"account": "ACE"}, "blooketVityeaEdition"))
    res.redirect(302, './dashboard.html?account=teacher')
  }
  else{
    res.send("The Username or Password is incorrect!")
  }
})

app.get('/lobby.html', loginDetect, (req, res) => {
  res.sendFile(path.join(__dirname, 'lobby.htm'))
})

app.get('/dashboard.html', (req, res) => {
  if (req.cookies.loggedIN === "true"){
res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>DoIT! Dashboard</title>
	<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <meta name="description" content="DoIT! Dashboard">
    <meta property="og:title" content="DoIT! Dashboard">
    <meta property="og:description" content="DoIT! Dashboard">
    <meta property="og:type" content="website">
    <script src="./assets/respond.js"></script>
</head>
<style>
body{
    background-color: aquamarine;
}
.crimson {
    color: crimson;
}
</style>
<body>
<h1>DoIT! Dashboard Panel</h1>
<hr>
<noscript>
<center class="crimson">You didn't enabled JavaScript! This website requires you to enable JavaScript to enable full functionality of this website!</center>
</noscript>
<center>
<h2>Hello and Welcome ${req.cookies.account}!</h2>
<a href="./host.html?play=mda_officials">Click here to Host a Game about MDA</a>
</center>
<hr>
<center>Vityea Dashboard V3</center>
</body>
</html>
`)
  }
  else{
    res.redirect(302, './login.html')
  }
})

app.get('/host.html', (req, res) => {
  if (req.cookies.loggedIN === "true" && !req.cookies.code){
req.cookies.code = "Secured";
req.cookies.game = req.query.play || "mda_officials";
res.sendFile(path.join(__dirname, 'host.htm'))
  }
  else if (req.cookies.loggedIN === "true" && req.cookies.code){
    res.sendFile(path.join(__dirname, 'host.htm'))
  }
  else return res.redirect(302, './login.html')
})

app.get('/debug', (req, res) => {
  var ytVids = new Array()
      //specify random image below. You can have as many as you wish
      //I got no brinks tock
      ytVids[1]="https://www.youtube.com/watch?v=ZUY4-ZRw1qc"
      //Mashup of You're mine
      ytVids[2]="https://www.youtube.com/watch?v=jaQz_8PYTgY"
      //Thanos x Verbalse
      ytVids[3]="https://www.youtube.com/watch?v=FIFQsTBKNUA"
      //Mesmerizer
      ytVids[4]="https://www.youtube.com/watch?v=19y8YTbvri8"
      //Blooket CryptoHack
      ytVids[5]="https://www.youtube.com/watch?v=vgxfySg5190"
      //You're mine x Basics in Education
      ytVids[6]="https://www.youtube.com/watch?v=ESZkHVRla4g"
      //Pedro
      ytVids[7]="https://www.youtube.com/watch?v=xEblpL1QQlg"
      //Rick Roll
      ytVids[8]="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      var ry=Math.floor(Math.random()*ytVids.length)
      if (ry==0)
      ry=1
  res.render("debug", { vas_yt: encodeURIComponent(ytVids[ry]) })
})

app.get('/bg_video', (req, res) => {
  var url = req.query.url;
  res.header("Content-Disposition", `attachment; filename="yt-video.mp4"`);
  //console.log("Downloaded URL: " + url)
  ytdl(url, {format: 'mp4'}).pipe(res);
})

app.get('/bg_audio', (req, res) => {
  var url = req.query.url;
  res.header("Content-Disposition", `attachment; filename="yt-audio.ogg"`);
  //console.log("Downloaded URL: " + url)
  ytdl(url, {quality: '140'}).pipe(res);
})

app.get('/bg_low_video', (req, res) => {
  var url = req.query.url;
  res.header("Content-Disposition", `attachment; filename="yt-low-video.mp4"`);
  //console.log("Downloaded URL: " + url)
  ytdl(url, {quality: '18'}).pipe(res);
  console.log(ytdl.getBasicInfo(url))
})

function loginDetect(req, res, next){
  if (req.cookies.loggedIN === "true" && !req.cookies.code || req.cookies.token){
    jwt.verify(req.cookies.token, "blooketVityeaEdition", (err, data) => {
      if (err){
        next();
      }
      res.redirect(302, './host.html?play='+req.cookies.game)
    })
  }
  else if (req.cookies.loggedIN === "true" && req.cookies.code && req.cookies.token){
    jwt.verify(req.cookies.token, "blooketVityeaEdition", (err, data) => {
      if (err){
        next();
      }
      res.redirect(302, './host.html?play='+req.cookies.game)
    })
  }
  else{
   next()
  }
}