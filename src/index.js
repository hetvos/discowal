const electron = require("electron")

class BrowserWindow extends electron.BrowserWindow {
    constructor(options) {
        if (!options || !options.webPreferences || !options.webPreferences.preload || !options.title) return super(options); // eslint-disable-line constructor-super
        super(options);
        require("./discowal.js")(this);
    }
}

Object.assign(BrowserWindow, electron.BrowserWindow);

const newElectron = new Proxy(electron, {
    get: function(target, prop) {
        if (prop === "BrowserWindow") return BrowserWindow;
        return target[prop];
    }
});
const electronPath = require.resolve("electron");
delete require.cache[electronPath].exports;
require.cache[electronPath].exports = newElectron;