import { REST, Routes, Client, GatewayIntentBits } from "discord.js";

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
  private language: LanguageOptions = "UA"; // Default language is Ukrainian
  private languagesTranslate: any = [{}];
  private answerToUserMsg: AnswerToUserMsg;
  private lastActivityTime: any = new Date();
  private randomIntFromInterval: (min: number, max: number) => number;
  private botOptions = {
    // Configuration for Discord bot.
    intents: [
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.GuildMessageReactions,
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
    // Constructor initializes the bot with necessary settings.
    language: LanguageOptions;
    languagesTranslate: any;
    answerToUserMsg: AnswerToUserMsg;
    randomIntFromInterval: (min: number, max: number) => number;
  }) {
    if (this.token) {
      this.bot = new Client(this.botOptions);
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
        "Please provide a token to use this platform. You can check the guide on GitHub."
      );
    }
  }

  private async PingBotCommands(commands?: BotDiscordCommandsProps) {
    // Method to refresh application commands (slash commands).
    const rest = new REST({ version: "10" }).setToken(this.token);

    try {
      if (!commands && !this.botCommands) {
        throw new Error(
          "Can't run the method applicationCommands without commands data"
        );
      }

      console.log("Started refreshing application (/) commands.");

      if (this.clientID) {
        await rest.put(Routes.applicationCommands(this.clientID), {
          body: commands ? commands : this.botCommands,
        });
      } else {
        throw new Error(
          "Can't run the method applicationCommands without CLIENT_ID."
        );
      }

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }
  }

  public async StartBot(greeting: (userName: string) => string) {
    // Method to start the bot, log in, and handle interactions.
    if (this.token) {
      if (this.bot) {
        this.bot.login(this.token);

        // Event listener when the bot is ready.
        this.bot.on("ready", () => {
          if (this.bot.user) {
            console.log(`Logged in as ${this.bot.user.tag}!`);
          } else {
            throw new Error("The user is not fetched.");
          }
        });

        // Event listener when a user joins a guild (server).
        this.bot.on("guildMemberAdd", (member) => {
          const welcomeChannel = member.guild.channels.cache.find(
            (channel) => channel.name === "general"
          );

          if (welcomeChannel) {
            //@ts-ignore
            welcomeChannel.send(greeting(member.user.username));
          }
        });

        // Event listener for interactions with the bot (slash commands).
        this.bot.on("interactionCreate", async (interaction) => {
          if (!interaction.isChatInputCommand()) return;

          if (interaction.commandName) {
            // Check if an interaction has a commandName (i.e., a slash command was used).
            if (interaction.commandName === "question") {
              // Check if the used command is "question".
              const question = interaction.options.getString("my_question");

              if (question) {
                // If a valid question is provided as an option.
                const answer = await this.answerToUserMsg({
                  text: question,
                });

                await interaction.reply(
                  `.\n${
                    this.language !== "UA"
                      ? `The user's question to me: ${question}`
                      : `Питання юзера до мене: ${question}`
                  }\n${
                    this.language !== "UA"
                      ? `My answer to this: ${answer}`
                      : `Моя відповідь щодо цього: ${answer}`
                  }`
                );
              } else {
                // If no valid question is provided as an option, reply with an error message.
                interaction.reply(
                  await this.answerToUserMsg({
                    text: "/error",
                  })
                );
              }
            } else {
              // Handle other slash commands.
              if (interaction.commandName != "quiz") {
                // If the command is not "quiz", retrieve an answer and reply.
                const answer = await this.answerToUserMsg({
                  text: "/" + interaction.commandName,
                });
                answer
                  ? await interaction.reply(answer)
                  : // If no valid question is provided as an option, reply with an error message.
                    interaction.reply(
                      await this.answerToUserMsg({
                        text: "/error",
                      })
                    );
              } else if (
                interaction.commandName === "quiz" &&
                interaction.channel
              ) {
                // If the command is "quiz" and there's a channel available, initiate a quiz game.
                await this.answerToUserMsg({
                  text: "/" + interaction.commandName,
                  buttons: this.CreateButtonNumbers(0, 9),
                  user: interaction.user,
                  message: interaction,
                });
              } else {
                // Handle any other cases, typically responding to incorrect command usage.
                await interaction.reply(
                  this.language !== "UA"
                    ? "Sorry, my dev sometimes can make mistakes."
                    : "Вибачте, мій розробник іноді допускає помилок."
                );
              }
            }
          }
        });

        // Event listener for incoming messages (e.g., random chat responses).
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
            text: "/emoji", // Corrected from '/emojy' to '/emoji'
            emojy: true,
          });

          randomAnswerChatId === 15 &&
            message.reply(randomAnswerEmojyTryId === 3 ? answerEmojy : answer);
        });

        // Periodic activity check every 2 hours 30 minutes
        setInterval(() => this.CheckActivity(), 2.5 * 60 * 60 * 1000);
      } else {
        throw new Error("Sorry, the bot can't initialize.");
      }
    } else {
      throw new Error(
        "Please provide a token to use this platform. You can check the guide on GitHub."
      );
    }
  }

  // Helper method to create an array of buttons with emoji numbers.
  private CreateButtonNumbers = (min: number, max: number) => {
    const createRowButtons = (min: number, max: number) => {
      const emojiToNumberMap: { [key: number]: string } = {
        0: "1️⃣",
        1: "2️⃣",
        2: "3️⃣",
        3: "4️⃣",
        4: "5️⃣",
        5: "6️⃣",
        6: "7️⃣",
        7: "8️⃣",
        8: "9️⃣",
      };

      const buttons = [];

      for (let i = min; i !== max; i++) {
        buttons.push(emojiToNumberMap[i].toString());
      }

      return buttons;
    };

    return createRowButtons(min, max);
  };

  // Method to check user activity and send reminders.
  private CheckActivity(chatId?: string | number) {
    const currentTime: any = new Date();
    const currentHour = currentTime.getHours();

    // Check the last time the user made activity and notify after 4 hours.
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

  // Method to change the bot's language.
  public changeLanguage(language: LanguageOptions) {
    if (!this.bot) {
      throw new Error("Hey, the bot is not created yet. Check your code!");
    }

    this.language = language;
    this.PingBotCommands(
      menuReturnCommands(language, "discord") as BotDiscordCommandsProps
    );
  }

  // Method to send a message using the bot.
  public async SendMessage({ chatId, message, options }: SendMessageProps) {
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
