const express = require("express");
const http = require("http");
const ws = require("ws");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "./public")));
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")) });

console.log('hello');

var tdClient = null;

var lastMessage;

const playerData = {};

const httpServer = http.createServer(app);
const wss = new ws.Server({ server: httpServer });

setInterval(function() {

    if(tdClient != null && playerData != {}) {
        tdClient.send(JSON.stringify(playerData));   
    }

}, 33);


wss.on("connection",
    (ws, req) =>
    {
        console.log("Client connected");
        if(req.url.indexOf('TOUCHDESIGNER')>-1) {
            console.log('Registering TD client');
            tdClient = ws;
        } else {
            console.log('Registering phone client');
        }

        


        ws.onmessage =
            (event) =>
            {
                if(event.data != '2::' && event.data != '') { // ignore keepalive ping
                    console.log(event.data);
                    const data = JSON.parse(event.data);
                    if(data.playerID && data.playerID=='bob' || data.playerID=='alice' || data.playerID=='chuck') {

                        playerData[data.playerID] = data.data;
                    }
                    
                }
                
                
            }
        
    });

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
