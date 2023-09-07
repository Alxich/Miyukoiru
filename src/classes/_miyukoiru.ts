import * as languagesTranslate from "../languages/languages.json";

import fs from "fs";
import readline from "readline";
import https from "https";

import { Message } from "discord.js";
import {
  BotDiscordGame,
  HelpInstructionProps,
  LanguageOptions,
  MiyukoiruResolverProps,
} from "../lib/types";

import { gameOptionsTelegram } from "../lib/options";

import TelegramBot from "./_telegramBot";
import DiscordBot from "./_discordBot";

class Miyukoiru {
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
      ? "./public/8_ball_responses_miyukoiru_ua.txt"
      : "./public/8_ball_responses_miyukoiru.txt";
  }

  public randomIntFromInterval(min: number, max: number): number {
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

  public Greeting(userName: string) {
    return this.language != "UA"
      ? `Geez, finally decided to show ${userName} up, huh? Don't drag your feet or anything, I'm not exactly here to wait around for you. So, let's get this over with already, okay? I'm your so-called chatbot, here to assist... I guess. Don't make me spell out the basics for you – use those commands down below. And don't even think about keeping me waiting, got it? Now, chop chop, start using them already! It's not like I've got all day for your dilly-dallying.`
      : `Ух, нарешті ${userName} з'явився, га? Не бався тут ні з чим, я взагалі не для того тут, щоб чекати на тебе. Так отож, давай вже швидше закінчимо це, добре? Я твій, як тут кажуть, чат-бот, готовий, якщо можна так сказати. Не заставляй мене пояснювати базові речі – користуйся тими командами внизу. І не наважся мене затримувати, зрозумів? Ну давай, давай, почни вже з ними користуватися! Не думай, що я тут весь день готова чекати на твої питання`;
  }

  public async Initialize(): Promise<void> {
    // Load answers and emojis arrays
    await this.loadAnswersArray();
    await this.loadEmojisArray();

    // Check if the platform is specified
    if (!this.platform) {
      throw new Error(
        "The platform is not specified. Please choose a platform and provide a token."
      );
    }

    // Initialize the bot based on the chosen platform
    switch (this.platform) {
      case "telegram":
        // Create a new TelegramBot instance and configure it
        this.bot = new TelegramBot({
          answerToUserMsg: this.AnswerToUserMsg.bind(this),
          language: this.language,
          languagesTranslate,
          randomIntFromInterval: this.randomIntFromInterval,
        });

        // Start the Telegram bot with a greeting function
        await this.bot.StartBot(this.Greeting.bind(this));
        break;

      case "discord":
        // Create a new DiscordBot instance and configure it
        this.bot = new DiscordBot({
          answerToUserMsg: this.AnswerToUserMsg.bind(this),
          language: this.language,
          languagesTranslate,
          randomIntFromInterval: this.randomIntFromInterval,
        });

        // Start the Discord bot with a greeting function
        await this.bot.StartBot(this.Greeting.bind(this));
        break;

      default:
        throw new Error(
          "Hey! You can't run the bot without choosing its platform!"
        );
    }
  }

  public async AnswerQuestion({
    question,
    emojy,
  }: {
    question?: string;
    emojy: boolean;
  }): Promise<string> {
    // Regular expressions for detecting Latin and Cyrillic characters
    const regExp = /[a-zA-Z]/g;
    const regExpUA = /[А-ЩЬЮЯҐЄІЇа-щьюяґєії]/g;

    // Generate a random answer index for non-emoji responses
    const randomAnswerGlobal = this.randomIntFromInterval(0, 9);

    // Select a random emoji
    const randomEmoji =
      this.emojisArray[
        this.randomIntFromInterval(0, this.emojisArray.length - 1)
      ];

    if (emojy) {
      // If emojy is true, return a random emoji
      return randomEmoji;
    } else {
      if (randomAnswerGlobal !== 5) {
        // Check if it's not the 6th random answer
        if (
          question &&
          (this.isCyrillic ? regExpUA.test(question) : regExp.test(question))
        ) {
          // Check if a question is provided and contains Latin or Cyrillic characters
          if (this.answersArray.length > 0) {
            // Check if there are loaded answers
            const randomAnswerId = this.randomIntFromInterval(
              0,
              this.answersArray.length - 1
            );
            return this.answersArray[randomAnswerId];
          } else {
            // Handle the case when no answers are loaded
            const errorText =
              "Error on loading answers file or no answers loaded.";
            throw new Error(errorText);
          }
        } else {
          // Handle the case when the question doesn't contain valid characters
          const errorText =
            this.language != "UA"
              ? languagesTranslate.changeLanguage.error.en
              : languagesTranslate.changeLanguage.error.ua;

          return errorText;
        }
      } else {
        // Return a random emoji for the 6th random answer
        return randomEmoji;
      }
    }
  }

  public ReturnErrorAnswer() {
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

  private async FetchFromApi(options: {
    hostname: string;
    path: string;
    method: string;
  }): Promise<any> {
    return await new Promise<any>((resolve, reject) => {
      // Create an HTTP request using the provided options
      const req = https.request(options, (response: any) => {
        let data = "";

        // Listen for data chunks in the response
        response.on("data", (chunk: any) => {
          data += chunk;
        });

        // When the response is finished, parse the data and resolve the Promise
        response.on("end", () => {
          try {
            const parsedData = JSON.parse(data);
            resolve(parsedData);
          } catch (error: any) {
            // If there's an error parsing the data, reject the Promise
            reject(error);
            console.error("Error parsing data:", error.message);
          }
        });
      });

      // Handle errors in making the HTTP request
      req.on("error", (error: any) => {
        // Reject the Promise with the error
        reject(error);
        console.error("Error fetching data:", error.message);
      });

      // Send the HTTP request
      req.end();
    });
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

    return await this.FetchFromApi(options);
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

    const answer = await this.FetchFromApi(options);

    //@ts-ignore It will provide an array but cant change promise due another api
    return answer[0];
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
  }: MiyukoiruResolverProps) {
    // Check if a callbackQuery function is provided
    if (!callbackQuery) {
      throw new Error("Game cannot work without a callback function");
    }

    // Check if a sendMessage function is provided
    if (!sendMessage) {
      throw new Error("Game cannot work without a sendMessage function");
    }

    // Check if a chatId is provided
    if (!chatId) {
      throw new Error("Game cannot work without a chat id");
    }

    // Define a greeting message based on the bot's language
    const textGreeting =
      this.language != "UA"
        ? languagesTranslate.quizPage.info.en
        : languagesTranslate.quizPage.info.ua;

    // Generate a random number between 0 and 9
    const randomNumber = this.randomIntFromInterval(0, 9);

    // Store the random number in the "chats" object, indexed by chatId
    typeof chatId === "number" ? (this.chats[chatId] = randomNumber) : false;

    // Send the greeting message with a keyboard (presumably for game options)
    await sendMessage({
      chatId,
      message: textGreeting,
      options: this.gameKeyBoard,
    });

    // Call the provided callbackQuery function with the necessary props
    await callbackQuery({
      chats: this.chats,
      startGame: this.StartTelegramGame.bind(this),
    });
  }

  // Only optimized for discord

  private async StartDiscordGame({ user, message, buttons }: BotDiscordGame) {
    if (user.bot) return;

    const minQuessNum = 0;
    const maxQuessNum = 9;
    const randomNumber: () => number = () =>
      this.randomIntFromInterval(minQuessNum, maxQuessNum);
    let randomizedNum = randomNumber();
    let selectedNumber = 0;

    const messages = languagesTranslate.gameText;

    // Function to retrieve a message based on the selected language.
    function getMessage(
      key:
        | "greetingMessage"
        | "victoryMessage"
        | "tryAgainMessage"
        | "gameEndMessage",
      language: LanguageOptions,
      number?: number
    ) {
      const message = messages[key][language];
      if (!message) {
        // If the message for the selected language is not found, use English.
        return messages[key]["EN"];
      }
      // Replace variables in the message with specific values.
      return message
        .replace("{{user.username}}", user.username)
        .replace("{{minQuessNum}}", minQuessNum.toString())
        .replace("{{maxQuessNum}}", maxQuessNum.toString())
        .replace(
          "{{selectedNumber}}",
          number ? number.toString() : selectedNumber.toString()
        )
        .replace("{{randomizedNum}}", randomizedNum.toString());
    }

    // Use the getMessage function to retrieve game messages.
    const greetingMessage = getMessage("greetingMessage", this.language);
    const victoryMessage = getMessage("victoryMessage", this.language);
    const gameEndMessage = getMessage("gameEndMessage", this.language);
    const tryAgainMessage = (selectedNumber: number) =>
      getMessage("tryAgainMessage", this.language, selectedNumber);

    if (!message.channel) return;

    message
      .reply({
        content: greetingMessage,
        fetchReply: true,
      })
      .then(async (context: Message<boolean>) => {
        try {
          const reactionPromises = buttons.map(async (item) => {
            const contextReaction = await context.react(item);
            return contextReaction;
          });

          await Promise.all(reactionPromises);

          // Define a filter function to check which reactions should be collected.
          const filter = (reaction: any, user: any) =>
            buttons.includes(reaction.emoji.name) && !user.bot;

          // Create a reaction collector for the message context.
          const collector = context.createReactionCollector({
            filter,
          });

          // Handle reactions when they are collected.
          collector.on("collect", async (reaction: any, user) => {
            if (!reaction || !reaction.emoji.name) return;

            selectedNumber = parseInt(reaction.emoji.name);

            // If the selected number matches the randomized number, edit the message to show victory.
            if (selectedNumber === randomizedNum) {
              await context.edit(victoryMessage);
              collector.stop();
            } else {
              // If the selected number doesn't match, edit the message to encourage trying again.
              await context.edit(tryAgainMessage(selectedNumber));
            }
          });

          // Handle the end of the reaction collection.
          collector.on("end", () => {
            // Send a message to the channel indicating the end of the game.
            context.channel.send(gameEndMessage);
          });
        } catch (error) {
          throw new Error("One of the emojis failed to react:" + error);
        }
      });
  }

  private async AnswerToUserMsg({
    sendMessage,
    callbackQuery,
    text,
    chatId,
    buttons,
    message,
    user,
  }: MiyukoiruResolverProps) {
    // Check if the received message starts with "/help"
    if (text && text.startsWith("/help")) {
      // If it starts with "/help," call the PageInstruction method with the appropriate props
      return this.PageInstruction(text as HelpInstructionProps);
    } else {
      // If the message does not start with "/help," check its content
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
            callbackQuery &&
              this.StartTelegramGame({ sendMessage, callbackQuery, chatId });
            break;
          } else if (buttons && message && user) {
            this.StartDiscordGame({ buttons, message, user });
            break;
          } else {
            return this.ReturnErrorAnswer();
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
          // Handle the "/error" command by returning an error message
          return this.ReturnErrorAnswer();

        default:
          // Handle any other message by answering the user's question (without emoji)
          return await this.AnswerQuestion({ question: text, emojy: false });
      }
    }
  }
}

export default Miyukoiru;
