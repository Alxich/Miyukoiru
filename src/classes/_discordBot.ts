import { REST, Routes } from "discord.js";
import { Client, GatewayIntentBits } from "discord.js";

import {
  AnswerToUserMsg,
  BotDiscordCommandsProps,
  LanguageOptions,
  SendMessageProps,
} from "../lib/types";
import { menuReturnCommands } from "../lib/functions";

class DiscordBot {
  private token: string = process.env.DISCORD_TOKEN as string;
  private clientID: string = process.env.DISCORD_CLIENT_ID as string;
  private bot: Client<boolean>;
  private language: LanguageOptions = "UA";
  private languagesTranslate: any = [{}];
  private answerToUserMsg: AnswerToUserMsg;
  private lastActivityTime: any = new Date();
  private randomIntFromInterval: (min: number, max: number) => number;
  private botOptionts = {
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  };
  private botCommands: BotDiscordCommandsProps;

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
    if (this.token) {
      this.bot = new Client(this.botOptionts);
      this.language = language;
      this.languagesTranslate = languagesTranslate;
      this.answerToUserMsg = answerToUserMsg;
      this.randomIntFromInterval = randomIntFromInterval;
      this.botCommands = menuReturnCommands(
        this.language,
        "discord"
      ) as BotDiscordCommandsProps;
      this.PingBotCommands();
    } else {
      throw new Error(
        "Please provide a token to use this platform. You can check quide on github"
      );
    }
  }

  private async PingBotCommands(commands?: BotDiscordCommandsProps) {
    const rest = new REST({ version: "10" }).setToken(this.token);

    try {
      if (!commands && !this.botCommands) {
        ("Can`t run method applicationCommands without commands data");
      }

      console.log("Started refreshing application (/) commands.");

      if (this.clientID) {
        await rest.put(Routes.applicationCommands(this.clientID), {
          body: commands ? commands : this.botCommands,
        });
      } else {
        throw new Error(
          "Can`t run method applicationCommands without CLIENT_ID"
        );
      }

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }

  async StartBot(greeting: (userName: string) => string) {
    if (this.token) {
      if (this.bot) {
        this.bot.login(this.token);

        this.bot.on("ready", () => {
          if (this.bot.user) {
            console.log(`Logged in as ${this.bot.user.tag}!`);
          } else {
            throw new Error("The user is not fethced");
          }
        });

        this.bot.on("guildMemberAdd", (member) => {
          const welcomeChannel = member.guild.channels.cache.find(
            (channel) => channel.name === "general"
          );

          if (welcomeChannel) {
            //@ts-ignore
            welcomeChannel.send(greeting(member.user.username));
          }
        });

        this.bot.on("interactionCreate", async (interaction) => {
          if (!interaction.isChatInputCommand()) return;

          if (interaction.commandName) {
            if (interaction.commandName === "question") {
              const question = interaction.options.getString("my_question");

              if (question) {
                const answer = await this.answerToUserMsg({
                  text: question,
                });

                await interaction.reply(
                  `.\n${
                    this.language !== "UA"
                      ? `The user question to me: ${question}`
                      : `Питання юзера до мене: ${question}`
                  }\n${
                    this.language !== "UA"
                      ? `My answer to this: ${answer}`
                      : `Моя відповідь щодо цього: ${answer}`
                  }`
                );
              } else {
                interaction.reply(
                  await this.answerToUserMsg({
                    text: "/error",
                  })
                );
              }
            } else {
              const answer = await this.answerToUserMsg({
                text: "/" + interaction.commandName,
              });

              await interaction.reply(answer);
            }
          }
        });

        this.bot.on("messageCreate", async (message) => {
          if (message.author.bot) return;
          const answersAllLang = this.languagesTranslate.randomChatAnswers;
          const randomAnswerChatId = this.randomIntFromInterval(0, 15);
          const randomAnswerId = this.randomIntFromInterval(
            0,
            answersAllLang.en.length
          );
          const randomAnswerEmojyTryId = this.randomIntFromInterval(0, 5);

          const answer =
            this.language !== "UA"
              ? answersAllLang.en[randomAnswerId - 1]
              : answersAllLang.ua[randomAnswerId - 1];

          const answerEmojy = await this.answerToUserMsg({
            text: "/emojy",
            emojy: true,
          });

          randomAnswerChatId === 15 &&
            message.reply(randomAnswerEmojyTryId === 3 ? answerEmojy : answer);
        });

        // Periodic activity check every 2 hours 30 minutes
        setInterval(() => this.CheckActivity(), 2.5 * 60 * 60 * 1000);
      } else {
        throw new Error("Sorry the bot can't initialize a bot");
      }
    } else {
      throw new Error(
        "Please provide a token to use this platform. You can check quide on github"
      );
    }
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

        const { en, ua } = this.languagesTranslate.reminderText;

        const message =
          this.language !== "UA"
            ? en[this.randomIntFromInterval(0, en.length - 1)]
            : ua[this.randomIntFromInterval(0, en.length - 1)];

        chatId ? this.SendMessage({ chatId, message }) : console.log(message);
      }
    }
  }

  changeLanguage(language: LanguageOptions) {
    if (!this.bot) {
      throw new Error("Hey bot is not created yet. Check the your code!");
    }

    this.PingBotCommands(
      menuReturnCommands(language, "discord") as BotDiscordCommandsProps
    );
  }

  async SendMessage({ chatId, message, options }: SendMessageProps) {
    if (!this.bot) {
      return false;
    }

    const channel = this.bot.channels.cache.get(chatId as string);
    if (channel) {
      // @ts-ignore
      await channel.send(message);
    } else {
      throw new Error(`Text channel with ID ${chatId} not found.`);
    }
  }
}

export default DiscordBot;
