const { format } = require("date-fns");
const { v4: uuidv4 } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;

const path = require("path");

const logEvents = async(msg) => {
    const dateTime = `${format(new Date(), "MM-dd-yyyy\thh:mm:ss")}`;
    const logItem = `${dateTime}\t${uuidv4()}\t${msg}\n`;

    console.log(logItem);

    try {
        if(!fs.existsSync(path.join(__dirname, "logs"))) {
            await fsPromises.mkdir(path.join(__dirname, "logs"));
        }

        await fsPromises.appendFile(
            path.join(__dirname, "logs", "eventLogs.txt"),
            logItem
        );
    } catch(e) {
        console.error(e);
    }
}

module.exports = logEvents;