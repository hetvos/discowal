function init(win) {
    const fs = require("fs");
    const path = require("path");
    const {
        homedir
    } = require("os");
    const webcont = win.webContents;

    const files = {
        discocss: undefined,
        pywalcss: undefined
    }

    webcont.on("did-finish-load", () => {
        fs.readFile(path.resolve(homedir(), ".cache/wal/colors.css"), async (error, data) => {
            if (error) {
                console.error("There was an error loading pywal CSS file.");
                console.error("Here's the error:", error);
            } else {
                files.pywalcss = await webcont.insertCSS(data.toString()).catch((error) => {
                    console.error("Failed to insert pywal CSS file.");
                    console.error("Here's the error:", error);
                });

                fs.watch(path.resolve(homedir(), ".cache/wal/colors.css"), () => {
                    fs.readFile(path.resolve(homedir(), ".cache/wal/colors.css"), async (error, data) => {
                        if (error) {
                            console.error("There was an error loading pywal CSS file.");
                            console.error("Here's the error:", error);
                        } else {
                            webcont.removeInsertedCSS(files.pywalcss).catch((error) => {
                                console.error("Failed to uninsert pywal CSS file.");
                                console.error("Here's the error:", error);
                            });

                            files.pywalcss = await webcont.insertCSS(data.toString()).catch((error) => {
                                console.error("Failed to reinsert pywal CSS file.");
                                console.error("Here's the error:", error);
                            });
                        }
                    });
                })
            }
        });

        fs.readFile(path.resolve(__dirname, "disco.css"), async (error, data) => {
            if (error) {
                console.error("There was an error loading discowal CSS file.");
                console.error("Here's the error:", error);
            } else {
                files.discocss = await webcont.insertCSS(data.toString()).catch((error) => {
                    console.error("Failed to insert discowal CSS file.");
                    console.error("Here's the error:", error);
                });
            }
        });
    });
}

module.exports = init;