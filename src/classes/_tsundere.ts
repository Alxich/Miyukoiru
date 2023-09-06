import * as languagesTranslate from "../languages/languages.json";
import {
  HelpInstructionProps,
  LanguageOptions,
  TsundereResolverProps,
} from "../lib/types";

const fs = require("fs");
const readline = require("readline");
const https = require("https");

import { gameOptionsTelegram } from "../lib/options";

import TelegramBot from "./_telegramBot";
import DiscordBot from "./_discordBot";
import {
  ActionRowBuilder,
  AnyComponentBuilder,
  CacheType,
  ChatInputCommandInteraction,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  TextBasedChannel,
  User,
} from "discord.js";

class Tsundere {
  private language: LanguageOptions = "UA";
  private isCyrillic: boolean = false;
  private answersArray: string[] = [];
  private emojisArray: string[] = [];
  private chats: Array<any> = [];
  private gameKeyBoard: any;
  private bot: any;
  private platform?: "telegram" | "discord";

  constructor({
    platform,
    language,
  }: {
    platform: "telegram" | "discord";
    language?: LanguageOptions;
  }) {
    this.language = language || this.language;
    this.isCyrillic = this.language !== "EN";
    this.platform = platform;

    /**
     * We modify that code later for discord
     *
     * The idea is use one class for few platforms.
     * This allow initialize project easily from begining,
     * developer just need specify what platform he need to use,
     * and later class choose diferent method for it.
     */

    switch (this.platform) {
      case "telegram":
        this.gameKeyBoard = gameOptionsTelegram;
      case "discord":
        break;
      default:
        throw new Error(
          "Hey! You can`t run the bot without choosing its platform!"
        );
    }
  }

  private getFilename(emojis?: boolean): string {
    return emojis
      ? "./public/8_ball_responses_emojis.txt"
      : this.isCyrillic
      ? "./public/8_ball_responses_tsundere_ua.txt"
      : "./public/8_ball_responses_tsundere.txt";
  }

  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private async loadAnswersArray(): Promise<void> {
    const rl = readline.createInterface({
      input: fs.createReadStream(this.getFilename()),
      output: process.stdout,
      terminal: false,
    });

    this.answersArray = []; // Clear the existing answersArray

    for await (const line of rl) {
      this.answersArray.push(line.trim());
    }
  }

  private async loadEmojisArray(): Promise<void> {
    const rl = readline.createInterface({
      input: fs.createReadStream(this.getFilename(true)),
      output: process.stdout,
      terminal: false,
    });

    this.emojisArray = []; // Clear the existing emojisArray

    for await (const line of rl) {
      this.emojisArray.push(line.trim());
    }
  }

  Greeting(userName: string) {
    return this.language != "UA"
      ? `Geez, finally decided to show ${userName} up, huh? Don't drag your feet or anything, I'm not exactly here to wait around for you. So, let's get this over with already, okay? I'm your so-called chatbot, here to assist... I guess. Don't make me spell out the basics for you – use those commands down below. And don't even think about keeping me waiting, got it? Now, chop chop, start using them already! It's not like I've got all day for your dilly-dallying.`
      : `Ух, нарешті ${userName} з'явився, га? Не бався тут ні з чим, я взагалі не для того тут, щоб чекати на тебе. Так отож, давай вже швидше закінчимо це, добре? Я твій, як тут кажуть, чат-бот, готовий, якщо можна так сказати. Не заставляй мене пояснювати базові речі – користуйся тими командами внизу. І не наважся мене затримувати, зрозумів? Ну давай, давай, почни вже з ними користуватися! Не думай, що я тут весь день готова чекати на твої питання`;
  }

  async Initialize(): Promise<void> {
    await this.loadAnswersArray();
    await this.loadEmojisArray();

    if (!this.platform) {
      throw new Error(
        "The platform its not specified. Please choose platform and token"
      );
    }

    switch (this.platform) {
      case "telegram":
        this.bot = new TelegramBot({
          answerToUserMsg: this.AnswerToUserMsg.bind(this),
          language: this.language,
          languagesTranslate,
          randomIntFromInterval: this.randomIntFromInterval,
        });

        await this.bot.StartBot(this.Greeting.bind(this));
        break;

      case "discord":
        this.bot = new DiscordBot({
          answerToUserMsg: this.AnswerToUserMsg.bind(this),
          language: this.language,
          languagesTranslate,
          randomIntFromInterval: this.randomIntFromInterval,
        });

        await this.bot.StartBot(this.Greeting.bind(this));
        break;

      default:
        throw new Error(
          "Hey! You can`t run the bot without choosing its platform!"
        );
    }
  }

  async AnswerQuestion({
    question,
    emojy,
  }: {
    question?: string;
    emojy: boolean;
  }): Promise<string> {
    const regExp = /[a-zA-Z]/g;
    const regExpUA = /[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/g;

    const randomAnswerGlobal = this.randomIntFromInterval(0, 9);
    const randomEmoji =
      this.emojisArray[
        this.randomIntFromInterval(0, this.emojisArray.length - 1)
      ];

    if (emojy) {
      return randomEmoji;
    } else {
      if (randomAnswerGlobal !== 5) {
        if (
          question &&
          (this.isCyrillic ? regExpUA.test(question) : regExp.test(question))
        ) {
          if (this.answersArray.length > 0) {
            const randomAnswerId = this.randomIntFromInterval(
              0,
              this.answersArray.length - 1
            );
            return this.answersArray[randomAnswerId];
          } else {
            const errorText =
              "Error on loading answers file or no answers loaded.";
            throw new Error(errorText);
          }
        } else {
          const errorText =
            this.language != "UA"
              ? languagesTranslate.changeLanguage.error.en
              : languagesTranslate.changeLanguage.error.ua;

          return errorText;
        }
      } else {
        return randomEmoji;
      }
    }
  }

  ReturnErrorAnswer() {
    const randomAnswerId = this.randomIntFromInterval(
      0,
      languagesTranslate.errorText.en.length
    );
    const error =
      this.language != "UA"
        ? languagesTranslate.errorText.en[randomAnswerId]
        : languagesTranslate.errorText.ua[randomAnswerId];

    return error;
  }

  private async ReturnMeme({
    spoiler,
    nsfw,
    subreddit,
  }: {
    spoiler?: boolean;
    nsfw?: boolean;
    subreddit?: string;
  }) {
    /**
     * Must return the memes from reddit via json data
     *
     * Author of api: https://github.com/D3vd/Meme_Api
     */

    const queryParams = `?spoiler=${spoiler}${
      subreddit ? `&subreddit=${subreddit}` : ``
    }&nsfw=${nsfw}`;

    const options = {
      hostname: "meme-api.com",
      path: `/gimme${queryParams}`,
      method: "GET",
    };

    return new Promise<any>((resolve, reject) => {
      const req = https.request(options, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const memeData = JSON.parse(data);
            resolve(memeData);
          } catch (error: any) {
            reject(error);
            throw new Error("Error parsing meme data:" + error.message);
          }
        });
      });

      req.on("error", (error: any) => {
        throw new Error("Error fetching meme:" + error.message);
      });

      req.end();
    });
  }

  private async ReturnAnimal({
    type = "shibes",
    count = 1,
    urls = true,
    httpsUrls = true,
  }: {
    type?: "shibes" | "cats";
    count?: number;
    urls?: boolean;
    httpsUrls?: boolean;
  }) {
    /**
     * Must return the doge from api via json data
     *
     * Author of api: http://shibe.online/api/
     */
    const queryParams = `${type}?count=${count}&urls=${urls}&httpsUrls=${httpsUrls}`;

    const options = {
      hostname: "shibe.online",
      path: `/api/${queryParams}`,
      method: "GET",
    };

    return new Promise<any>((resolve, reject) => {
      const req = https.request(options, (response: any) => {
        let data = "";

        response.on("data", (chunk: any) => {
          data += chunk;
        });

        response.on("end", () => {
          try {
            const dogeData = JSON.parse(data);
            resolve(dogeData[0]);
          } catch (error: any) {
            reject(error);
            throw new Error("Error parsing doge data:" + error.message);
          }
        });
      });

      req.on("error", (error: any) => {
        throw new Error("Error fetching doge:" + error.message);
      });

      req.end();
    });
  }

  private PageInstruction(helpMenu: HelpInstructionProps) {
    const startPage =
      this.language != "UA"
        ? languagesTranslate.startPage.en
        : languagesTranslate.startPage.ua;

    switch (helpMenu) {
      case "/help":
        return startPage;

      case "/help/info":
        return this.language != "UA"
          ? languagesTranslate.infoPage.en
          : languagesTranslate.infoPage.ua;

      case "/help/commands":
        return this.language != "UA"
          ? languagesTranslate.commandsPage.en
          : languagesTranslate.commandsPage.ua;

      case "/help/aboutApi":
        return this.language != "UA"
          ? languagesTranslate.aboutApiPage.en
          : languagesTranslate.aboutApiPage.ua;

      default:
        return this.language != "UA"
          ? languagesTranslate.errorNoCommand.en
          : languagesTranslate.errorNoCommand.ua;
    }
  }

  private async changeLanguage(changer: LanguageOptions) {
    if (this.language !== changer) {
      this.language = changer;
      this.isCyrillic = this.language !== "EN";
      await this.loadAnswersArray(); // Load answers for the new language

      this.bot.changeLanguage(this.language);
    }
  }

  // Only optimized for telegram

  private async StartTelegramGame({
    sendMessage,
    callbackQuery,
    chatId,
  }: TsundereResolverProps) {
    if (!callbackQuery) {
      throw new Error("Game cannot work without a callback function");
    }

    if (!sendMessage) {
      throw new Error("Game cannot work without a sendMessage function");
    }

    if (!chatId) {
      throw new Error("Game cannot work without a chat id");
    }

    const textGreeting =
      this.language != "UA"
        ? languagesTranslate.quizPage.info.en
        : languagesTranslate.quizPage.info.ua;

    const randomNumber = this.randomIntFromInterval(0, 9);

    typeof chatId === "number" ? (this.chats[chatId] = randomNumber) : false;

    await sendMessage({
      chatId,
      message: textGreeting,
      options: this.gameKeyBoard,
    });

    await callbackQuery({
      chats: this.chats,
      startGame: this.StartTelegramGame.bind(this),
    });
  }

  private async AnswerToUserMsg({
    sendMessage,
    callbackQuery,
    text,
    chatId,
  }: TsundereResolverProps) {
    if (text && text.startsWith("/help")) {
      return this.PageInstruction(text as HelpInstructionProps);
    } else {
      switch (text) {
        case "/info":
          return this.PageInstruction("/help/info");

        case "/meme":
          const memeData = await this.ReturnMeme({});
          return memeData.url;

        case "/doge":
          const dogeData = await this.ReturnAnimal({});
          return dogeData;

        case "/cat":
          const catData = await this.ReturnAnimal({ type: "cats" });
          return catData;

        case "/quiz":
          if (this.platform !== "discord") {
            (await callbackQuery) &&
              this.StartTelegramGame({ sendMessage, callbackQuery, chatId });
            break;
          } else {
               this.ReturnErrorAnswer();
          }

        case "/lang":
          const selectedLang = this.language === "UA" ? "EN" : "UA";
          await this.changeLanguage(selectedLang);

          const translatedText =
            this.language != "UA"
              ? languagesTranslate.changeLanguage.en
              : languagesTranslate.changeLanguage.ua;

          return (
            translatedText +
            `\n\n ${
              this.language != "UA"
                ? "There it is your change language to "
                : "Вот і все! Я вам змінила мову на "
            }${selectedLang}`
          );

        case "/question":
          return await this.AnswerQuestion({ question: text, emojy: false });

        case "/emojy":
          return await this.AnswerQuestion({ emojy: true });

        case "/error":
          return this.ReturnErrorAnswer();

        default:
          return await this.AnswerQuestion({ question: text, emojy: false });
      }
    }
  }
}

export default Tsundere;
