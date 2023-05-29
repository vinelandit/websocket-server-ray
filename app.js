const express = require("express");
const http = require("http");
const ws = require("ws");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "./public")));
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")) });

console.log('hello');

const screens = [];


const httpServer = http.createServer(app);
const wss = new ws.Server({ server: httpServer });
wss.on("connection",
    (ws, req) =>
    {
        console.log("Client connected");
        if(req.url.indexOf('SCREEN')>-1) {
            console.log('Registering screen client');
            screens.push(ws);
        } else {
            console.log('Registering phone client');
        }

        ws.onmessage =
            (event) =>
            {
                if(event.data != '2::') { // ignore keepalive ping
                    
                    for(var i in screens) {
                        console.log('relaying data to screen '+i, event.data);
                        screens[i].send(event.data);
                    }
                    

                    
                }
                
                
            }
        
    });

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
