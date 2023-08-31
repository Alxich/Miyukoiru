import { Context, NarrowedContext, Telegraf } from "telegraf";
import {
  CallbackQuery,
  Message,
  Update,
} from "telegraf/typings/core/types/typegram";
import { TelegramBot } from "../classes";

export type LanguageOptions = "UA" | "EN";

export type HelpInstructionProps =
  | "/help"
  | "/help/info"
  | "/help/aboutApi"
  | "/help/commands";

export type TsundereInitProps =
  | NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>
  | NarrowedContext<Context<Update>, Update.CallbackQueryUpdate<CallbackQuery>>;

export interface SendMessageProps {
  chatId: string | number;
  message: string;
  options?: any;
}

export interface TsundereResolverProps {
  sendMessage: ({ chatId, message, options }: SendMessageProps) => void;
  callbackQuery: TelegramBot["CallbackQueryGame"];
  chatId: string | number;
  text?: string;
}

export type StartGameProps = ({
  sendMessage,
  callbackQuery,
  chatId,
}: TsundereResolverProps) => Promise<void>;

export interface CallbackQueryGameProps {
  startGame: StartGameProps;
  chats: Array<any>;
}

export type AnswerToUserMsg = ({
  callbackQuery,
  chatId,
  sendMessage,
  text,
}: TsundereResolverProps) => Promise<any>;
