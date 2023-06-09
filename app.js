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

const playerStates = {};

const httpServer = http.createServer(app);
const wss = new ws.Server({ server: httpServer });
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

        setInterval(function() {

            if(tdClient != null) {
                tdClient.send(event.data);   
            }
        }, 33);


        ws.onmessage =
            (event) =>
            {
                if(event.data != '2::' && event.data != '') { // ignore keepalive ping
                    // console.log(event.data);
                    const data = JSON.parse(event.data);

                    playerStates[data.playerID] = data.data;
                    
                }
                
                
            }
        
    });

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
