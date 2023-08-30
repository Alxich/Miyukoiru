import * as dotenv from "dotenv";
import { Context, Input, Telegraf } from "telegraf";
import { Update } from "typegram";

import { Tsundere } from "./classes";

import { helloServer } from "./lib/functions";

const app = async () => {
  dotenv.config();

  const bot: Telegraf<Context<Update>> = new Telegraf(
    "6043588883:AAHD6PF7q8x64eFT7zZFv0rgw-C0tjIaMoA"
  );

  const tsundere = new Tsundere("UA");
  await tsundere.Initialize();

  bot.start((ctx) => {
    ctx.reply(tsundere.Greeting(ctx));
  });

  bot.on("message", async (ctx) => {
    // @ts-ignore
    const text = ctx.update.message.text;
    const answer = await tsundere.AnswerToUserMsg({ bot, ctx, text });

    if (text.startsWith("/meme")) {
      await ctx.reply(Input.fromURL(answer));
    } else {
      (await answer) && ctx.reply(answer);
    }
  });

  bot.launch();

  helloServer();
};

app().catch((err) => console.error(err));
