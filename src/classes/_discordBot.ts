import {
  CacheType,
  ChatInputCommandInteraction,
  REST,
  Routes,
  User,
} from "discord.js";
import {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

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
              if (interaction.commandName != "quiz") {
                const answer = await this.answerToUserMsg({
                  text: "/" + interaction.commandName,
                });
                await interaction.reply(answer);
              } else if (
                interaction.commandName === "quiz" &&
                interaction.channel
              ) {
                this.StartDiscordGame({
                  user: interaction.user,
                  message: interaction,
                });
              } else {
                await interaction.reply(
                  this.language !== "UA"
                    ? "Sorry my dev sometimes can make mistake."
                    : "Вибачте, мій розробник іноді допускає помилок."
                );
              }
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

  private async StartDiscordGame({
    user,
    message,
  }: {
    user: User;
    message: ChatInputCommandInteraction<CacheType>;
  }) {
    if (user.bot) return;

    const buttons = this.CreateButtonNumbers(0, 9);
    const minQuessNum = 0;
    const maxQuessNum = 9;
    const randomNumber: () => number = () =>
      this.randomIntFromInterval(minQuessNum, maxQuessNum);
    let randomizedNum = randomNumber();

    const greetingMessage =
      this.language === "UA"
        ? `-\nНу ладно, ${user.username}, допоможу тобі розважитися. Почнемо гру! Вгадай число від ${minQuessNum} до ${maxQuessNum}. І не думай, що це щось особливе.`
        : `-\nFine, ${user.username}, I'll entertain you for a bit. The game's on! Guess a number between ${minQuessNum} and ${maxQuessNum}. And don't get any ideas, it's not that exciting.`;

    const victoryMessage =
      this.language === "UA"
        ? `-\nНу ти і молодець, ${user.username}! Вітаю, ти вгадав число ${randomizedNum}. Якщо це тобі важливо...`
        : `-\nWell, aren't you just a genius, ${user.username}! Congratulations, you guessed the number ${randomizedNum}. If that even matters to you...`;

    const tryAgainMessage = (selectedNumber: number) =>
      this.language === "UA"
        ? `-\nТвій вибір: ${selectedNumber}. Ну, що ж, спробуй ще раз, якщо зможеш.`
        : `-\nYour choice: ${selectedNumber}. Well, go ahead, give it another try, if you can handle it.`;

    const gameEndMessage =
      this.language === "UA"
        ? `-\nАгов, гра завершилася.`
        : `-\nHey, the game's over, in case you cared.`;

    if (!message.channel) return;

    message
      .reply({
        content: greetingMessage,
        fetchReply: true,
      })
      .then(async (context) => {
        try {
          const reactionPromises = buttons.map(async (item) => {
            const contextReaction = await context.react(item);
            return contextReaction;
          });

          await Promise.all(reactionPromises);

          const filter = (reaction: any, user: any) =>
            buttons.includes(reaction.emoji.name) && !user.bot;

          const collector = context.createReactionCollector({
            filter,
          });

          collector.on("collect", async (reaction: any, user) => {
            if (!reaction || !reaction.emoji.name) return;

            const selectedNumber = parseInt(reaction.emoji.name);

            if (selectedNumber === randomizedNum) {
              await context.edit(victoryMessage);
              collector.stop();
            } else {
              await context.edit(tryAgainMessage(selectedNumber));
            }
          });
          collector.on("end", () => {
            context.channel.send(gameEndMessage);
          });
        } catch (error) {
          throw new Error("One of the emojis failed to react:" + error);
        }
      });
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
