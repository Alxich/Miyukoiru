import * as dotenv from "dotenv";

import { Tsundere } from "./classes";
import { helloServer } from "./lib/functions";

const app = async () => {
  dotenv.config();

  const tsundere = new Tsundere({
    platform: "telegram",
    language: "UA",
  });
  await tsundere.Initialize();

  helloServer();
};

app().catch((err) => {
  throw new Error(err);
});
