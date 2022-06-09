const express = require("express");
const http = require("http");
const ws = require("ws");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname, "./public")));
app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")) });


var td = null; // will contain touch designer websocket client

const httpServer = http.createServer(app);
const wss = new ws.Server({ server: httpServer });
wss.on("connection",
    (ws, req) =>
    {
        console.log("Client connected");
        if(req.url.indexOf('TOUCHDESIGNER')>-1) {
            console.log('Registering Touchdesigner client');
            td = ws;
        } else {
            ws.onmessage =
                (event) =>
                {
                    if(td!==null) {
                        const msg = event.data;
                        td.send(msg);
                    }
                    
                }
        }
        
    });

const port = process.env.PORT || 3000;
httpServer.listen(port, () => { console.log("Server started. Port: ", port); });
