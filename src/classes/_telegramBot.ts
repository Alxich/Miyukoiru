import { Context, Input, Telegraf } from "telegraf";
import { Update } from "typegram";

import {
  LanguageOptions,
  SendMessageProps,
  AnswerToUserMsg,
  CallbackQueryGameProps,
  BotTelegramCommandsProps,
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
    // Check if a valid token is provided
    if (this.token) {
      // Initialize the Telegraf bot
      this.bot = new Telegraf(this.token);

      // Set the language, translations, and response generator function
      this.language = language;
      this.languagesTranslate = languagesTranslate;
      this.answerToUserMsg = answerToUserMsg;
      this.randomIntFromInterval = randomIntFromInterval;

      // Get the chat ID of the bot's context
      const chatId = this.bot.context.chat?.id;

      // Periodic activity check every 2 hours 30 minutes
      setInterval(() => this.CheckActivity(chatId), 2.5 * 60 * 60 * 1000);
    } else {
      throw new Error(
        "Please provide a token to use this platform. You can check the guide on GitHub."
      );
    }
  }

  // Private method to check user activity and send notifications
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

    // Check if the current time is within the allowed notification hours
    if (currentHour >= 10 && currentHour < 21) {
      // Calculate the time difference since the last activity
      const timeDifference =
        (currentTime - this.lastActivityTime) / (1000 * 60 * 60); // difference in hours

      // Send a notification message if the time difference is >= 4 hours
      if (timeDifference >= 4) {
        this.lastActivityTime = currentTime;

        // Get notification messages based on language
        const { en, ua } = this.languagesTranslate.reminderText;
        const message =
          this.language !== "UA"
            ? en[this.randomIntFromInterval(0, en.length - 1)]
            : ua[this.randomIntFromInterval(0, en.length - 1)];

        // Send the notification message to the specified chat or log it
        chatId ? this.SendMessage({ chatId, message }) : console.log(message);
      }
    }
  }

  // Method to start the Telegram bot
  public async StartBot(greeting: (userName: string) => string) {
    let chatId: string | number;

    if (!this.bot) {
      throw new Error("Hey, the bot is not created yet. Check your code!");
    }

    // Handle the "/start" command to greet users
    this.bot.start((ctx) => {
      ctx.reply(greeting(ctx.from?.first_name));
    });

    // Handle errors during bot execution
    this.bot.catch((err, ctx) => {
      console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });

    // Handle incoming messages and generate responses
    this.bot.on("message", async (ctx) => {
      // @ts-ignore Extract the text message from the update
      const text = ctx.update.message.text;

      // Get the chat ID for the context
      chatId = ctx.chat.id;

      // Generate a response using the answerToUserMsg function
      const answer = await this.answerToUserMsg({
        chatId,
        text,
        callbackQuery: this.CallbackQueryGame.bind(this),
        sendMessage: this.SendMessage.bind(this),
      });

      // Update the last activity time
      this.lastActivityTime = new Date();

      // Check the type of response and reply accordingly
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

    // Set the bot's commands based on the selected language
    this.bot.telegram.setMyCommands(
      menuReturnCommands(this.language, "telegram") as BotTelegramCommandsProps
    );

    // Launch the bot
    this.bot.launch();

    // Store a reference to the bot process for graceful stopping
    const botProcessVar = this.bot;

    // Enable graceful stop on SIGINT and SIGTERM signals
    process.once("SIGINT", () => botProcessVar.stop("SIGINT"));
    process.once("SIGTERM", () => botProcessVar.stop("SIGTERM"));
  }

  // Method to change the bot's language
  public changeLanguage(language: LanguageOptions) {
    if (!this.bot) {
      throw new Error("Hey, the bot is not created yet. Check your code!");
    }

    // Update the bot's commands with translations for the new language
    this.language = language;
    this.bot.telegram.setMyCommands(
      menuReturnCommands(language, "telegram") as BotTelegramCommandsProps
    );
  }

  // Method to send messages to a specific chat
  public async SendMessage({ chatId, message, options }: SendMessageProps) {
    if (!this.bot) {
      return false;
    }

    // Use the Telegram API to send a message to the specified chat
    await this.bot.telegram.sendMessage(chatId, message, options);
  }

  // Method to handle callback queries during a game or quiz
  public async CallbackQueryGame({ startGame, chats }: CallbackQueryGameProps) {
    if (!this.bot) {
      return false;
    }

    // Define a bound function for callback query handling
    const boundCallbackQueryGame = this.CallbackQueryGame.bind(this);

    // Handle callback queries
    this.bot.on("callback_query", async (ctx) => {
      // @ts-ignore Extract data from the callback query
      const data = ctx.update.callback_query.data;
      // @ts-ignore
      const chatId = ctx.chat.id;

      if (data === "/again") {
        // Restart the game when the user selects "/again"
        return startGame({
          sendMessage: this.SendMessage.bind(this),
          callbackQuery: boundCallbackQueryGame,
          chatId,
        });
      }

      const randomNum = chats[chatId];

      // Send a message with game results
      await this.SendMessage({
        chatId,
        message: `${
          this.language !== "UA"
            ? data == randomNum
              ? this.languagesTranslate.quizPage.results.success.en
              : this.languagesTranslate.quizPage.results.error.en
            : data == randomNum
            ? this.languagesTranslate.quizPage.results.success.ua
            : this.languagesTranslate.quizPage.results.error.ua
        }`,
        options: againOptionsTelegram(this.language !== "UA"
        ?"Try it again!": "Спробуй знову!"),
      });
    });
  }
}

export default TelegramBot;
