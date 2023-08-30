"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var languages_json_1 = __importDefault(require("../languages/languages.json"));
var options_1 = require("../lib/options");
var fs = require("fs");
var readline = require("readline");
var https = require("https");
var Tsundere = /** @class */ (function () {
    function Tsundere(language) {
        this.language = "UA";
        this.isCyrillic = false;
        this.answersArray = [];
        this.chats = [];
        this.language = language || this.language;
        this.isCyrillic = this.language !== "EN";
    }
    Tsundere.prototype.getFilename = function () {
        return this.isCyrillic
            ? "./public/8_ball_responses_tsundere_ua.txt"
            : "./public/8_ball_responses_tsundere.txt";
    };
    Tsundere.prototype.loadAnswersArray = function () {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var rl, _d, rl_1, rl_1_1, line, e_1_1;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        rl = readline.createInterface({
                            input: fs.createReadStream(this.getFilename()),
                            output: process.stdout,
                            terminal: false,
                        });
                        this.answersArray = []; // Clear the existing answersArray
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 6, 7, 12]);
                        _d = true, rl_1 = __asyncValues(rl);
                        _e.label = 2;
                    case 2: return [4 /*yield*/, rl_1.next()];
                    case 3:
                        if (!(rl_1_1 = _e.sent(), _a = rl_1_1.done, !_a)) return [3 /*break*/, 5];
                        _c = rl_1_1.value;
                        _d = false;
                        line = _c;
                        this.answersArray.push(line.trim());
                        _e.label = 4;
                    case 4:
                        _d = true;
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 12];
                    case 6:
                        e_1_1 = _e.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 12];
                    case 7:
                        _e.trys.push([7, , 10, 11]);
                        if (!(!_d && !_a && (_b = rl_1.return))) return [3 /*break*/, 9];
                        return [4 /*yield*/, _b.call(rl_1)];
                    case 8:
                        _e.sent();
                        _e.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                    case 11: return [7 /*endfinally*/];
                    case 12: return [2 /*return*/];
                }
            });
        });
    };
    Tsundere.prototype.randomIntFromInterval = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Tsundere.prototype.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadAnswersArray()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Tsundere.prototype.Greeting = function (ctx) {
        var _a, _b;
        return this.language != "UA"
            ? "Geez, finally decided to show ".concat((_a = ctx.from) === null || _a === void 0 ? void 0 : _a.username, " up, huh? Don't drag your feet or anything, I'm not exactly here to wait around for you. So, let's get this over with already, okay? I'm your so-called chatbot, here to assist... I guess. Don't make me spell out the basics for you \u2013 use those commands down below. And don't even think about keeping me waiting, got it? Now, chop chop, start using them already! It's not like I've got all day for your dilly-dallying.")
            : "\u0423\u0445, \u043D\u0430\u0440\u0435\u0448\u0442\u0456 ".concat((_b = ctx.from) === null || _b === void 0 ? void 0 : _b.username, " \u0437'\u044F\u0432\u0438\u0432\u0441\u044F, \u0433\u0430? \u041D\u0435 \u0431\u0430\u0432\u0441\u044F \u0442\u0443\u0442 \u043D\u0456 \u0437 \u0447\u0438\u043C, \u044F \u0432\u0437\u0430\u0433\u0430\u043B\u0456 \u043D\u0435 \u0434\u043B\u044F \u0442\u043E\u0433\u043E \u0442\u0443\u0442, \u0449\u043E\u0431 \u0447\u0435\u043A\u0430\u0442\u0438 \u043D\u0430 \u0442\u0435\u0431\u0435. \u0422\u0430\u043A \u043E\u0442\u043E\u0436, \u0434\u0430\u0432\u0430\u0439 \u0432\u0436\u0435 \u0448\u0432\u0438\u0434\u0448\u0435 \u0437\u0430\u043A\u0456\u043D\u0447\u0438\u043C\u043E \u0446\u0435, \u0434\u043E\u0431\u0440\u0435? \u042F \u0442\u0432\u0456\u0439, \u044F\u043A \u0442\u0443\u0442 \u043A\u0430\u0436\u0443\u0442\u044C, \u0447\u0430\u0442-\u0431\u043E\u0442, \u0433\u043E\u0442\u043E\u0432\u0438\u0439, \u044F\u043A\u0449\u043E \u043C\u043E\u0436\u043D\u0430 \u0442\u0430\u043A \u0441\u043A\u0430\u0437\u0430\u0442\u0438. \u041D\u0435 \u0437\u0430\u0441\u0442\u0430\u0432\u043B\u044F\u0439 \u043C\u0435\u043D\u0435 \u043F\u043E\u044F\u0441\u043D\u044E\u0432\u0430\u0442\u0438 \u0431\u0430\u0437\u043E\u0432\u0456 \u0440\u0435\u0447\u0456 \u2013 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0439\u0441\u044F \u0442\u0438\u043C\u0438 \u043A\u043E\u043C\u0430\u043D\u0434\u0430\u043C\u0438 \u0432\u043D\u0438\u0437\u0443. \u0406 \u043D\u0435 \u043D\u0430\u0432\u0430\u0436\u0441\u044F \u043C\u0435\u043D\u0435 \u0437\u0430\u0442\u0440\u0438\u043C\u0443\u0432\u0430\u0442\u0438, \u0437\u0440\u043E\u0437\u0443\u043C\u0456\u0432? \u041D\u0443 \u0434\u0430\u0432\u0430\u0439, \u0434\u0430\u0432\u0430\u0439, \u043F\u043E\u0447\u043D\u0438 \u0432\u0436\u0435 \u0437 \u043D\u0438\u043C\u0438 \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0442\u0438\u0441\u044F! \u041D\u0435 \u0434\u0443\u043C\u0430\u0439, \u0449\u043E \u044F \u0442\u0443\u0442 \u0432\u0435\u0441\u044C \u0434\u0435\u043D\u044C \u0433\u043E\u0442\u043E\u0432\u0430 \u0447\u0435\u043A\u0430\u0442\u0438 \u043D\u0430 \u0442\u0432\u043E\u0457 \u043F\u0438\u0442\u0430\u043D\u043D\u044F");
    };
    Tsundere.prototype.AnswerQuestion = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            var regExp, regExpUA, randomAnswerId, errorText, errorText;
            return __generator(this, function (_a) {
                regExp = /[a-zA-Z]/g;
                regExpUA = /[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/g;
                if (question &&
                    (this.isCyrillic ? regExpUA.test(question) : regExp.test(question))) {
                    if (this.answersArray.length > 0) {
                        randomAnswerId = this.randomIntFromInterval(0, this.answersArray.length - 1);
                        return [2 /*return*/, this.answersArray[randomAnswerId]];
                    }
                    else {
                        errorText = "Error on loading answers file or no answers loaded.";
                        console.error(errorText);
                        return [2 /*return*/, errorText];
                    }
                }
                else {
                    errorText = "Error! User must provide a question to have an answer ヽ(｀Д´)ﾉ";
                    console.error(errorText);
                    return [2 /*return*/, errorText];
                }
                return [2 /*return*/];
            });
        });
    };
    Tsundere.prototype.ReturnMeme = function (_a) {
        var spoiler = _a.spoiler, nsfw = _a.nsfw, subreddit = _a.subreddit;
        return __awaiter(this, void 0, void 0, function () {
            var queryParams, options;
            return __generator(this, function (_b) {
                queryParams = "?spoiler=".concat(spoiler).concat(subreddit ? "&subreddit=".concat(subreddit) : "", "&nsfw=").concat(nsfw);
                options = {
                    hostname: "meme-api.com",
                    path: "/gimme".concat(queryParams),
                    method: "GET",
                };
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var req = https.request(options, function (response) {
                            var data = "";
                            response.on("data", function (chunk) {
                                data += chunk;
                            });
                            response.on("end", function () {
                                try {
                                    var memeData = JSON.parse(data);
                                    resolve(memeData);
                                    // Display the meme information
                                    // console.log(memeData);
                                }
                                catch (error) {
                                    reject(error);
                                    console.error("Error parsing meme data:", error.message);
                                }
                            });
                        });
                        req.on("error", function (error) {
                            console.error("Error fetching meme:", error.message);
                        });
                        req.end();
                    })];
            });
        });
    };
    Tsundere.prototype.PageInstruction = function (helpMenu) {
        var startPage = this.language != "UA"
            ? languages_json_1.default.startPage.en
            : languages_json_1.default.startPage.ua;
        switch (helpMenu) {
            case "/help":
                return startPage;
            case "/help/info":
                return this.language != "UA"
                    ? languages_json_1.default.infoPage.en
                    : languages_json_1.default.infoPage.ua;
            case "/help/commands":
                return this.language != "UA"
                    ? languages_json_1.default.commandsPage.en
                    : languages_json_1.default.commandsPage.ua;
            case "/help/aboutApi":
                return this.language != "UA"
                    ? languages_json_1.default.aboutApiPage.en
                    : languages_json_1.default.aboutApiPage.ua;
            default:
                return this.language != "UA"
                    ? languages_json_1.default.errorNoCommand.en
                    : languages_json_1.default.errorNoCommand.ua;
        }
    };
    Tsundere.prototype.changeLanguage = function (changer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this.language !== changer)) return [3 /*break*/, 2];
                        this.language = changer;
                        this.isCyrillic = this.language !== "EN";
                        return [4 /*yield*/, this.loadAnswersArray()];
                    case 1:
                        _a.sent(); // Load answers for the new language
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Tsundere.prototype.StartGame = function (_a) {
        var bot = _a.bot, ctx = _a.ctx;
        return __awaiter(this, void 0, void 0, function () {
            var chatId, textGreeting, randomNumber;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        chatId = ctx.chat.id;
                        textGreeting = this.language != "UA"
                            ? languages_json_1.default.quizPage.info.en
                            : languages_json_1.default.quizPage.info.ua;
                        randomNumber = this.randomIntFromInterval(0, 9);
                        this.chats[chatId] = randomNumber;
                        return [4 /*yield*/, ctx.telegram.sendMessage(chatId, textGreeting, options_1.gameOptions)];
                    case 1:
                        _b.sent();
                        bot.on("callback_query", function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                            var data, chatId, randomNum;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        data = ctx.update.callback_query.data;
                                        chatId = ctx.chat.id;
                                        if (data === "/again") {
                                            return [2 /*return*/, this.StartGame({ bot: bot, ctx: ctx })];
                                        }
                                        randomNum = this.chats[chatId];
                                        if (!(data == randomNum)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, bot.telegram.sendMessage(chatId, "".concat(this.language != "UA"
                                                ? languages_json_1.default.quizPage.results.success.en
                                                : languages_json_1.default.quizPage.results.success.ua), options_1.againOptions)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 4];
                                    case 2: return [4 /*yield*/, bot.telegram.sendMessage(chatId, "".concat(this.language != "UA"
                                            ? languages_json_1.default.quizPage.results.error.en
                                            : languages_json_1.default.quizPage.results.error.ua), options_1.againOptions)];
                                    case 3:
                                        _a.sent();
                                        _a.label = 4;
                                    case 4: return [2 /*return*/];
                                }
                            });
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Tsundere.prototype.AnswerToUserMsg = function (_a) {
        var bot = _a.bot, ctx = _a.ctx, text = _a.text;
        return __awaiter(this, void 0, void 0, function () {
            var _b, memeData, selectedLang, translatedText;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (!(text && text.startsWith("/help"))) return [3 /*break*/, 1];
                        return [2 /*return*/, this.PageInstruction(text)];
                    case 1:
                        _b = text;
                        switch (_b) {
                            case "/info": return [3 /*break*/, 2];
                            case "/meme": return [3 /*break*/, 3];
                            case "/quiz": return [3 /*break*/, 5];
                            case "/lang": return [3 /*break*/, 7];
                        }
                        return [3 /*break*/, 9];
                    case 2: return [2 /*return*/, this.PageInstruction("/help/info")];
                    case 3: return [4 /*yield*/, this.ReturnMeme({})];
                    case 4:
                        memeData = _c.sent();
                        return [2 /*return*/, memeData.url];
                    case 5: return [4 /*yield*/, this.StartGame({ bot: bot, ctx: ctx })];
                    case 6:
                        _c.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        selectedLang = this.language === "UA" ? "EN" : "UA";
                        return [4 /*yield*/, this.changeLanguage(selectedLang)];
                    case 8:
                        _c.sent();
                        translatedText = this.language != "UA"
                            ? languages_json_1.default.changeLanguage.en
                            : languages_json_1.default.changeLanguage.ua;
                        return [2 /*return*/, (translatedText +
                                "\n\n ".concat(this.language != "UA"
                                    ? "There it is your change language to "
                                    : "Вот і все! Я вам змінила мову на ").concat(selectedLang))];
                    case 9: return [4 /*yield*/, this.AnswerQuestion(text)];
                    case 10: return [2 /*return*/, _c.sent()];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    return Tsundere;
}());
exports.default = Tsundere;
