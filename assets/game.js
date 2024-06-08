(function(){
    console["log"]("%cDoIT", "font-size: 50px;");
    console["log"]("%cSTOP! WHAT YOU'RE DOING!", "font-size: 30px; color: crimson;", "\nIf anyone told you to open the Console and pasting it into here.\nDO NOT PASTE!\nIf you do paste, your account will be hacked!\nIf you know what you're doing, come help us with our 1000+ Errors!")
}())

var s = new URLSearchParams(location.search);

if (location.pathname === "/game.html"){
    const socket = io();
    socket.emit('host')
}