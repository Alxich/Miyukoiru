import { Context, NarrowedContext } from "telegraf";
import {
  CallbackQuery,
  Message,
  Update,
} from "telegraf/typings/core/types/typegram";
import { TelegramBot } from "../classes";

import { User, ChatInputCommandInteraction, CacheType } from "discord.js";

export type LanguageOptions = "UA" | "EN";

export type HelpInstructionProps =
  | "/help"
  | "/help/info"
  | "/help/aboutApi"
  | "/help/commands";

export type MiyukoiruInitProps =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>;

export interface SendMessageProps {
  chatId: string | number;
  message: string;
  options?: any;
}

export interface MiyukoiruResolverProps {
  sendMessage?: ({ chatId, message, options }: SendMessageProps) => void;
  callbackQuery?: TelegramBot["CallbackQueryGame"];
  chatId?: string | number;
  emojy?: boolean;
  text?: string;
  user?: User;
  message?: ChatInputCommandInteraction<CacheType>;
  buttons?: string[];
}

export type StartGameProps = ({
  sendMessage,
  callbackQuery,
  chatId,
}: MiyukoiruResolverProps) => Promise<void>;

export type BotDiscordGame = {
  user: User;
  message: ChatInputCommandInteraction<CacheType>;
  buttons: string[];
};

export interface CallbackQueryGameProps {
  startGame: StartGameProps;
  chats: Array<any>;
}

export type AnswerToUserMsg = ({
  callbackQuery,
  chatId,
  sendMessage,
  text,
}: MiyukoiruResolverProps) => Promise<any>;

export type BotTelegramCommandsProps = {
  command: string;
  description: string;
}[];

export type BotDiscordCommandsProps = {
  name: string;
  description: string;
  options?: {
    type: number;
    name: string;
    description: string;
  }[];
}[];
