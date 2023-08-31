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

  constructor({
    language,
    languagesTranslate,
    answerToUserMsg,
  }: {
    language: LanguageOptions;
    languagesTranslate: any;
    answerToUserMsg: AnswerToUserMsg;
  }) {
    this.bot = new Telegraf(this.token);
    this.language = language;
    this.languagesTranslate = languagesTranslate;
    this.answerToUserMsg = answerToUserMsg;
  }

  async startBot(greeting: (userName: string) => string) {
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
      const chatId = ctx.chat.id;
      const answer = await this.answerToUserMsg({
        chatId,
        text,
        callbackQuery: this.CallbackQueryGame.bind(this),
        sendMessage: this.SendMessage.bind(this),
      });

      if (text.startsWith("/meme")) {
        await ctx.reply(Input.fromURL(answer));
      }else if(text.startsWith("/doge"))  {
        await ctx.replyWithPhoto(Input.fromURL(answer));
      } else {
        (await answer) && ctx.reply(answer);
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
