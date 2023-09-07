import * as dotenv from "dotenv";

import { Miyukoiru } from "./classes";
import { helloServer } from "./lib/functions";

const app = async () => {
  // We start by importing the "dotenv" library to handle environment variables.
  dotenv.config();

  /**
   * We create a new instance of the "Miyukoiru" bot,
   * configured for Telegram and set to use the EN language.
   */
  const miyukoiru = new Miyukoiru({
    platform: "telegram",
    language: "EN",
  });

  // The bot adventure begins with the "Initialize" function, and our bot is now ready to take commands!
  await miyukoiru.Initialize();

  // Using this command will allow to show as in console that server is running and there is no errors
  helloServer();
};

/**
 * Finally, we ensure that any unexpected issues are caught 
 * and handled gracefully, keeping our bot's journey smooth.
 */
app().catch((err) => {
  throw new Error(err);
});
