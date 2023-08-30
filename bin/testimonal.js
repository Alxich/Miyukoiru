import kleur from "kleur";

console.log(
  kleur.dim(`
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠤⣄⠀⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⡇⠀⠀⠀⠀
  ⠀⠀⠀⠀⠀⢀⣤⣴⣶⣶⣶⣶⣶⣦⣤⡄⠊⠀⠀⠀⠀⠀
  ⠀⠦⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⠀⠀⠀⠀
  ⠀⠀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⡀⠀⠀
  ⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀
  ⣠⣿⣿⣿⡿⢻⣿⣿⣿⣿⣿⣿⢿⣿⣿⣿⣿⣿⣿⣿⡧⠀
  ⠉⢹⣿⣿⢓⣺⡿⠟⠛⠛⢻⣿⣼⣿⣿⣿⣿⣿⣿⣿⣇⠀
  ⠀⢸⣿⣿⠉⠀⠀⠀⠀⠀⠀⠀⠈⢀⣿⡿⠿⢿⣿⣿⣿⠀
  ⡀⠈⣿⣿⡀⠀⠀⠠⠄⠀⠀⠀⠀⢸⣿⣗⠏⢪⣿⣿⣿⡇
  ⠀⢀⡈⣿⣷⣤⣄⣀⠀⠀⠀⢀⣤⣿⣿⣷⣾⣿⣿⣿⣿⣧
  ⠀⠘⠉⢹⣿⣿⣿⣿⣿⡇⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
  ⠀⠀⠀⣾⣿⣿⠟⡿⠟⡁⠄⠚⠉⠀⠘⢿⣿⣿⣿⣿⣿⡇
  ⠀⠀⠀⣿⠟⠁⠈⠉⠁⠀⠀⠀⠀⠀⠀⠀⠙⡿⠿⠏⠿⠃
  ⠀⠀⠀⡜⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⡄⠀⠀⠀
`)
);

console.log(
  kleur.underline().bold("Mph") +
    kleur.reset(
      ", you actually ran the test?\n" +
        "I guess you're not completely useless after all.\n" +
        "Don't get too " +
        kleur.green("proud") +
        ", though.\n\n" +
        "There's still a long way to go before you earn my approval. " +
        kleur.bgWhite().black("\uFF08\uFF03\uFF1E\uFF0C\uFF1C\uFF09") //(＃＞＜)
    ) +
    "\n"
);
