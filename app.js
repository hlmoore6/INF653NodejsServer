const http = require("http");

const fs = require("fs");

const path = require("path");
const events = require("events");

const logEvents = require("./logEvents");

const hostname = "localhost";
const port = 3000;

const myEvent = new events.EventEmitter();

myEvent.on("log", (msg) => {
    logEvents(msg);
});

const server = http.createServer((req, res) => {
    const imageLoc = path.join(__dirname, "images", req.url);

    if(fs.existsSync(imageLoc)){
        fs.readFile(imageLoc, (err, data) => {
            if (err != null) {
                myEvent.emit("log", `Unable to read file "${req.url}" in location ${imageLoc}`);
                res.writeHead(500, {"Content-Type": "text/html"});
                res.write("<html><head><title>500</title></head><body><h1>Internal Server Error</h1></body></html>");
                return res.end();
            }

            myEvent.emit("log", "Successfully sent image");

            res.writeHead(200, {"Content-Type": `image/${path.extname(req.url)}`});
            res.write(data);
            return res.end();
        });
    }
    else {
        myEvent.emit("log", `File "${req.url}" could not be found!`);
        res.writeHead(404, {"Content-Type": "text/html"});
        res.write("<html><head><title>404</title></head><body><h1>404 Not Found!</h1></body></html>");

        return res.end();
    }
});

server.listen(port, hostname, () => {
    myEvent.emit("log", `Server running at http://${hostname}:${port}/`);
});