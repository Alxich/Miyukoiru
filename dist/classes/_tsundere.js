"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const readline = require("readline");
class Tsundere {
    constructor(language) {
        this.language = "UA";
        language && this.language;
    }
    getFilename() {
        return this.language === "UA"
            ? "./public/8_ball_responses_tsundere.txt"
            : "./public/8_ball_responses_tsundere_ua.txt";
    }
    loadAnswersArray() {
        return new Promise((resolve, reject) => {
            const filename = this.getFilename();
            const answersArray = [];
            const rl = readline.createInterface({
                input: fs.createReadStream(filename),
                output: process.stdout,
                terminal: false,
            });
            rl.on("line", (line) => {
                answersArray.push(line.trim());
            });
            rl.on("close", () => {
                resolve(answersArray);
            });
            rl.on("error", (err) => {
                reject(err);
            });
        });
    }
    async initialize() {
        const answersArray = await this.loadAnswersArray();
        // Now you can work with the loaded answersArray
        console.log(answersArray);
    }
}
exports.default = Tsundere;
//# sourceMappingURL=_tsundere.js.map