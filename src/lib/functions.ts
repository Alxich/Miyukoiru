import kleur from "kleur";

import * as languagesTranslate from "../languages/languages.json";
import { LanguageOptions } from "./types";

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
        .yellow(`|   Server is running Miyukoiru telegram bot Good luck   |`)
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

export const menuReturnCommands = (language: LanguageOptions) => {
  const translations: Record<string, { en: string; ua: string }> =
    languagesTranslate.menuOptions;

  return ["start", "info", "help", "meme", "quiz", "lang"].map((command) => ({
    command,
    description:
      language !== "UA" ? translations[command].en : translations[command].ua,
  }));
};
