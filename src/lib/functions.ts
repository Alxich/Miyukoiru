import kleur from "kleur";

import * as languagesTranslate from "../languages/languages.json";
import {
  BotDiscordCommandsProps,
  BotTelegramCommandsProps,
  LanguageOptions,
} from "./types";

export function helloServer() {
  console.log(" ");
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|--------------------------------------------------------|")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow(`|       Server is running Miyukoiru bot Good luck        |`)
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|--------------------------------------------------------|")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|                      ＼(￣▽￣)／                       |")
  );
  console.log(
    kleur
      .bold()
      .yellow(" |                                                        | ")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|             Welcome to the Miyukoiru server!           |")
  );
  console.log(
    kleur
      .bold()
      .yellow(" |                                                        | ")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|    Feel free to explore and interact with the Bot.     |")
  );
  console.log(
    kleur
      .bold()
      .yellow(" |                                                        | ")
  );
  console.log(
    " " +
      kleur
        .bold()
        .yellow("|                     Happy coding!                      |")
  );
  console.log(
    kleur
      .bold()
      .yellow(" |--------------------------------------------------------| ")
  );
}

/**
 * Generates a list of menu commands based on the selected language and platform.
 *
 * @param {LanguageOptions} language - The selected language ('UA' or 'EN').
 * @param {string} type - The platform type ('telegram' or 'discord').
 * @returns {Array} - An array of command objects with descriptions.
 */
export const menuReturnCommands = (
  language: LanguageOptions,
  type: "telegram" | "discord"
) => {
  // Define translations for menu options.
  const translations: Record<string, { en: string; ua: string }> =
    languagesTranslate.menuOptions;

  // Create an array of menu commands with descriptions based on the selected language.
  const answers = [
    "start",
    "info",
    "help",
    "meme",
    "quiz",
    "lang",
    "doge",
    "cat",
    "emojy",
  ].map((command) => ({
    ...(type !== "discord" ? { command: command } : { name: command }),
    description:
      language !== "UA" ? translations[command].en : translations[command].ua,
  }));

  // Adding an extra command for Discord to handle user questions.
  if (type === "discord") {
    answers.push({
      ...{
        options: [
          {
            type: 3,
            name: "my_question",
            description: "(≧◡≦)",
            required: true,
          },
        ],
      },
      name: "question",
      description:
        language !== "UA"
          ? languagesTranslate.discordQuestionStartCommand.en
          : languagesTranslate.discordQuestionStartCommand.ua,
    });
  }

  return answers;
};
