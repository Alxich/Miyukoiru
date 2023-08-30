import { Context, NarrowedContext, Telegraf } from "telegraf";
import {
  CallbackQuery,
  Message,
  Update,
} from "telegraf/typings/core/types/typegram";

export type HelpInstructionProps =
  | "/help"
  | "/help/info"
  | "/help/aboutApi"
  | "/help/commands";

export interface TsundereStartProps {
  bot: Telegraf<Context<Update>>;
  ctx:
    | NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
    | NarrowedContext<
        Context<Update>,
        Update.CallbackQueryUpdate<CallbackQuery>
      >;
  text?: string;
}

export type TsundereInitProps =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>;
