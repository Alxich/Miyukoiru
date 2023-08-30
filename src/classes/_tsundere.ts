import languagesTranslate from "../languages/languages.json";
import {
  HelpInstructionProps,
  TsundereInitProps,
  TsundereStartProps,
} from "../lib/types";
import { againOptions, gameOptions } from "../lib/options";

const fs = require("fs");
const readline = require("readline");
const https = require("https");

class Tsundere {
  private language: "UA" | "EN" = "UA";
  private isCyrillic: boolean = false;
  private answersArray: string[] = [];

  public chats: Array<any> = [];

  constructor(language?: "UA" | "EN") {
    this.language = language || this.language;
    this.isCyrillic = this.language !== "EN";
  }

  private getFilename(): string {
    return this.isCyrillic
      ? "./public/8_ball_responses_tsundere_ua.txt"
      : "./public/8_ball_responses_tsundere.txt";
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

  private randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async Initialize(): Promise<void> {
    await this.loadAnswersArray();
  }

  Greeting(ctx: TsundereInitProps) {
    return this.language != "UA"
      ? `Geez, finally decided to show ${ctx.from?.username} up, huh? Don't drag your feet or anything, I'm not exactly here to wait around for you. So, let's get this over with already, okay? I'm your so-called chatbot, here to assist... I guess. Don't make me spell out the basics for you – use those commands down below. And don't even think about keeping me waiting, got it? Now, chop chop, start using them already! It's not like I've got all day for your dilly-dallying.`
      : `Ух, нарешті ${ctx.from?.username} з'явився, га? Не бався тут ні з чим, я взагалі не для того тут, щоб чекати на тебе. Так отож, давай вже швидше закінчимо це, добре? Я твій, як тут кажуть, чат-бот, готовий, якщо можна так сказати. Не заставляй мене пояснювати базові речі – користуйся тими командами внизу. І не наважся мене затримувати, зрозумів? Ну давай, давай, почни вже з ними користуватися! Не думай, що я тут весь день готова чекати на твої питання`;
  }

  async AnswerQuestion(question?: string): Promise<string> {
    const regExp = /[a-zA-Z]/g;
    const regExpUA = /[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/g;

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
        const errorText = "Error on loading answers file or no answers loaded.";
        console.error(errorText);
        return errorText;
      }
    } else {
      const errorText =
        "Error! User must provide a question to have an answer ヽ(｀Д´)ﾉ";
      console.error(errorText);
      return errorText;
    }
  }

  async ReturnMeme({
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

            // Display the meme information
            // console.log(memeData);
          } catch (error: any) {
            reject(error);
            console.error("Error parsing meme data:", error.message);
          }
        });
      });

      req.on("error", (error: any) => {
        console.error("Error fetching meme:", error.message);
      });

      req.end();
    });
  }

  PageInstruction(helpMenu: HelpInstructionProps) {
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

  async changeLanguage(changer: "UA" | "EN") {
    if (this.language !== changer) {
      this.language = changer;
      this.isCyrillic = this.language !== "EN";
      await this.loadAnswersArray(); // Load answers for the new language
    }
  }

  async StartGame({ bot, ctx }: TsundereStartProps) {
    // @ts-ignore
    const chatId = ctx.chat.id;
    const textGreeting =
      this.language != "UA"
        ? languagesTranslate.quizPage.info.en
        : languagesTranslate.quizPage.info.ua;

    const randomNumber = this.randomIntFromInterval(0, 9);
    this.chats[chatId] = randomNumber;

    await ctx.telegram.sendMessage(chatId, textGreeting, gameOptions);

    bot.on("callback_query", async (ctx) => {
      // @ts-ignore
      const data = ctx.update.callback_query.data;
      // @ts-ignore
      const chatId = ctx.chat.id;

      if (data === "/again") {
        return this.StartGame({ bot, ctx });
      }

      const randomNum = this.chats[chatId];

      if (data == randomNum) {
        await bot.telegram.sendMessage(
          chatId,
          `${
            this.language != "UA"
              ? languagesTranslate.quizPage.results.success.en
              : languagesTranslate.quizPage.results.success.ua
          }`,
          againOptions
        );
      } else {
        await bot.telegram.sendMessage(
          chatId,
          `${
            this.language != "UA"
              ? languagesTranslate.quizPage.results.error.en
              : languagesTranslate.quizPage.results.error.ua
          }`,
          againOptions
        );
      }
    });
  }

  async AnswerToUserMsg({ bot, ctx, text }: TsundereStartProps) {
    if (text && text.startsWith("/help")) {
      return this.PageInstruction(text as HelpInstructionProps);
    } else {
      switch (text) {
        case "/info":
          return this.PageInstruction("/help/info");

        case "/meme":
          const memeData = await this.ReturnMeme({});
          return memeData.url;

        case "/quiz":
          await this.StartGame({ bot, ctx });
          break;

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

        default:
          return await this.AnswerQuestion(text);
      }
    }
  }
}

export default Tsundere;
