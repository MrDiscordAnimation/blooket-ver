(function(){
    console["log"]("%cDoIT", "font-size: 50px;");
    console["log"]("%cSTOP! WHAT YOU'RE DOING!", "font-size: 30px; color: crimson;", "\nIf anyone told you to open the Console and pasting it into here.\nDO NOT PASTE!\nIf you do paste, your account will be hacked!\nIf you know what you're doing, come help us with our 1000+ Errors!")
}())

var s = new URLSearchParams(location.search);

if (location.pathname === "/host.html"){
const play = location.href.substring(location.href.indexOf("play")+5, location.href.length);
if (play === "mda_officials"){
    if (localStorage.code) {
localStorage.clear();
location.reload();
    }
    else {
    function gameID(captcha_str,fin){
        captcha_str="1234567890";
        fin=Math.floor(Math.random()*captcha_str.length);
        for(let i=0; i<6; i++){
            fin+=captcha_str[Math.floor(Math.random()* 6)];
        }
        //console.log(captcha_str.length);
        console.log("Generated Game ID: "+fin)
        localStorage.code = fin;
        return fin;
    }
    gameID();
    const socket = io();
    function loadREQUEST(){
    socket.emit('codeVALIDATION', ["create", localStorage.code, play])
    }
    socket.on('server', (bruh) => {
        if (bruh.status === 200 && bruh.respond === "OK" && bruh.code === localStorage.code){
            document.getElementById("main").innerHTML = `
            <h1>Game ID: ${localStorage.code} Game: ${play}</h1>
            <button onclick="endGAME()">End the Game?</button>
            <div id="users"></div>
            `;
        }
        else if (bruh.status === 200 && bruh.respond === "Users" && bruh.code === localStorage.code){
            item = `<b>${bruh.username}</b> `;
            document.getElementById("users").insertAdjacentHTML("beforeend",item);
        }
        else if (bruh.status === 500 && bruh.respond === "Unable to Create a Game!" && bruh.code === localStorage.code){
            document.getElementById("main").innerHTML = `<h1>There was a problem creating the game code!</h1>`;
            localStorage.clear()
        }
        else if (bruh.status === 403 && bruh.respond === "banned" && bruh.code === localStorage.code){
            document.getElementById("main").innerHTML = `
            <h1>Banned by Vityea Security</h1>
            <p>Hello! To the teachers and students that are currently using our software to play <b>DoIT!</b>. We have banned you. You might not know why, because it is automated by us including this text. We might think that you're abusing our APIs or do other stuffs, but anyways it's sad to see you go. Farewell on your journey!</p>
            `;
        }
    })
    function endGAME(){
        socket.emit('host', ["end", localStorage.code]);
        document.getElementById("main").innerHTML = `
        <h1>Game Ended!</h1>
        <p>The Game was shutted down by the host!</p>
        `;
        localStorage.clear();
    }
    function startGame(){
        socket.emit('host', ["startGame", localStorage.code])
        document.getElementById("main").innerHTML = `
        <h1>Game is starting...</h1>
        `
    }
    function endGame(){
        socket.emit('host', ["endGame", localStorage.code])
        document.getElementById("main").innerHTML = `
            <h1>User Scores:</h1>
            <hr>
            <div id="userTally"></div>
        `;
    }
    socket.on('host', (bruhJS) => {
        if (bruhJS[0] === "leaderboard" && bruhJS[1] === localStorage.code){
            document.getElementById("main").innerHTML=`
            <h1>Status Log:</h1>
            <button onclick="endGame()">End Game?</button>
            <hr>
            <div id="log"></div>
        `;
        }
    })
}
}
}
if (location.pathname === "/lobby.html"){
    function userID(captcha_str,fin){
        captcha_str="1234567890";
        fin=Math.floor(Math.random()*captcha_str.length);
        for(let i=0; i<6; i++){
            fin+=captcha_str[Math.floor(Math.random()* 6)];
        }
        //console.log(captcha_str.length);
        console.log("Generated Game ID: "+fin)
        return fin;
    }
    const socket = io();
    const gameID = (s).get("gameID")
    const username = (s).get("username")+"-"+userID();
    localStorage.username = username;
    socket.emit('codeVALIDATION', ["join", gameID, username])
    socket.on('server', (bruh) => {
        if (bruh.status === 200 && bruh.respond === "JoinServerAvailable" && bruh.code === gameID && bruh.username === username){
            socket.emit('host', ["join", gameID, username])
        }
        if (bruh.status === 404 && bruh.respond === "Unable to Find any matching Game!" && bruh.code === gameID){
            document.getElementById("main").innerHTML = `
            <h1>Game Not Found!</h1>
            <p>Hello ${localStorage.username}! The Game ID that you entered is either incorrect or the game has ended!</p>
            <a href="./">Click here to return</a>
            `;
        }
    })
    socket.on('host', (host) => {
        if (host.commands === "connected" && host.code === gameID){
            console.log(host)
            document.getElementById("main").innerHTML=`
            <h1>${localStorage.username}</h1>
            <p>Welcome! Today's game is ${host.game}</p>
            <p>Waiting for host to start...</p>
            <b>Do Not Refresh the Page!</b>
            `;
        }
        if (host.commands === "start" && host.code === gameID){
            location.replace("./game.html?code="+gameID+"&username="+localStorage.username);
        }
        if (host.commands === "end" && host.code === gameID){
            document.getElementById("main").innerHTML=`
            <h1>This game has ended by the host!</h1>
            <a href="./">Return to Main Menu</a>
            `;
        }
    })
    socket.on('server', (bruh) => {
        if (bruh.status === 403 && bruh.respond === "banned" && bruh.code === gameID){
            document.getElementById("main").innerHTML = `
            <h1>Banned by Vityea Security</h1>
            <p>Hello ${localStorage.username}!<br>This game session has been banned!<br>You were not banned but the person who hosted the game is!<br>Thanks for playing on <b>DoIT!</b>.</p>
            `;
        }
    })
}