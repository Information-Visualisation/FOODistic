"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger() {
    }
    Logger.prototype.info = function (logText) {
        if (logText.length > 100) {
            logText = logText.substring(0, 70) + "...";
        }
        console.log(new Date() + " - info:::::" + logText);
    };
    Logger.prototype.debug = function (logText) {
        console.log(new Date() + " - debug:::::" + logText);
    };
    Logger.prototype.error = function (logText) {
        console.log(new Date() + " - error:::::" + logText);
    };
    return Logger;
}());
exports.Logger = Logger;
module.exports = { Logger: Logger };
