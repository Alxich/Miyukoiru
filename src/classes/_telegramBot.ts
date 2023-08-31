import { Context, Input, Telegraf } from "telegraf";
import { Update } from "typegram";

import {
  LanguageOptions,
  SendMessageProps,
  AnswerToUserMsg,
  CallbackQueryGameProps,
} from "../lib/types";
import { againOptionsTelegram } from "../lib/options";
import { menuReturnCommands } from "../lib/functions";

class TelegramBot {
  private token: string = process.env.TELLEGRAM_TOKEN as string;
  private bot?: Telegraf<Context<Update>>;
  private language: LanguageOptions = "UA";
  private languagesTranslate: any = [{}];
  private answerToUserMsg: AnswerToUserMsg;
  private lastActivityTime: any = new Date();
  private randomIntFromInterval: (min: number, max: number) => number;

  constructor({
    language,
    languagesTranslate,
    answerToUserMsg,
    randomIntFromInterval,
  }: {
    language: LanguageOptions;
    languagesTranslate: any;
    answerToUserMsg: AnswerToUserMsg;
    randomIntFromInterval: (min: number, max: number) => number;
  }) {
    this.bot = new Telegraf(this.token);
    this.language = language;
    this.languagesTranslate = languagesTranslate;
    this.answerToUserMsg = answerToUserMsg;
    this.randomIntFromInterval = randomIntFromInterval;

    const chatId = this.bot.context.chat?.id;

    // Periodic activity check every 2 hours 30 minutes
    setInterval(() => this.CheckActivity(chatId), 2.5 * 60 * 60 * 1000);
  }

  private CheckActivity(chatId?: string | number) {
    const currentTime: any = new Date();
    const currentHour = currentTime.getHours();

    /**
     * This will check the last time user make activity
     * and from that last time we count 4 hours.
     * After 4 we will notify user about our bot.
     *
     * Bot will notify only at 10am to 9pm.
     * There must not be night messages.
     */
    if (currentHour >= 10 && currentHour < 21) {
      const timeDifference =
        (currentTime - this.lastActivityTime) / (1000 * 60 * 60); // difference in hours

      if (timeDifference >= 4) {
        this.lastActivityTime = currentTime;

        const { enArray, uaArray } = this.languagesTranslate.reminderText;

        const message =
          this.language !== "UA"
            ? enArray[this.randomIntFromInterval(0, enArray.length - 1)]
            : uaArray[this.randomIntFromInterval(0, enArray.length - 1)];

        chatId ? this.SendMessage({ chatId, message }) : console.log(message);
      }
    }
  }

  async StartBot(greeting: (userName: string) => string) {
    let chatId: string | number;

    if (!this.bot) {
      throw new Error("Hey bot is not created yet. Check the your code!");
    }

    this.bot.start((ctx) => {
      ctx.reply(greeting(ctx.from?.first_name));
    });

    this.bot.catch((err, ctx) => {
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });

    this.bot.on("message", async (ctx) => {
      // @ts-ignore
      const text = ctx.update.message.text;
      chatId = ctx.chat.id;
      const answer = await this.answerToUserMsg({
        chatId,
        text,
        callbackQuery: this.CallbackQueryGame.bind(this),
        sendMessage: this.SendMessage.bind(this),
      });

      this.lastActivityTime = new Date();

      switch (true) {
        case text.startsWith("/meme"):
          await ctx.reply(Input.fromURL(answer));
          break;

        case text.startsWith("/doge") || text.startsWith("/cat"):
          await ctx.replyWithPhoto(Input.fromURL(answer));
          break;

        default:
          if (answer) {
            await ctx.reply(answer);
          }
          break;
      }
    });

    this.bot.telegram.setMyCommands(menuReturnCommands(this.language));

    this.bot.launch();

    const botProccesVar = this.bot;

    // Enable graceful stop
    process.once("SIGINT", () => botProccesVar.stop("SIGINT"));
    process.once("SIGTERM", () => botProccesVar.stop("SIGTERM"));
  }

  changeLanguage(language: LanguageOptions) {
    if (!this.bot) {
      throw new Error("Hey bot is not created yet. Check the your code!");
    }

    this.bot.telegram.setMyCommands(menuReturnCommands(language));
  }

  async SendMessage({ chatId, message, options }: SendMessageProps) {
    if (!this.bot) {
      return false;
    }

    await this.bot.telegram.sendMessage(chatId, message, options);
  }

  async CallbackQueryGame({ startGame, chats }: CallbackQueryGameProps) {
    if (!this.bot) {
      return false;
    }

    const boundCallbackQueryGame = this.CallbackQueryGame.bind(this);

    this.bot.on("callback_query", async (ctx) => {
      // @ts-ignore
      const data = ctx.update.callback_query.data;
      // @ts-ignore
      const chatId = ctx.chat.id;

      if (data === "/again") {
        return startGame({
          sendMessage: this.SendMessage.bind(this),
          callbackQuery: boundCallbackQueryGame,
          chatId,
        });
      }

      const randomNum = chats[chatId];

      await this.SendMessage({
        chatId,
        message: `${
          this.language != "UA"
            ? data == randomNum
              ? this.languagesTranslate.quizPage.results.success.en
              : this.languagesTranslate.quizPage.results.error.en
            : data == randomNum
            ? this.languagesTranslate.quizPage.results.success.ua
            : this.languagesTranslate.quizPage.results.error.ua
        }`,
        options: againOptionsTelegram,
      });
    });
  }
}

export default TelegramBot;
