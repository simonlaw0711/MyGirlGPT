import { Bot, Context, InputFile } from 'grammy'
import { FileFlavor, hydrateFiles } from '@grammyjs/files'
import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { ExchangeMessageData } from '../types'

dotenv.config();

const onMessageCallback = (data: ExchangeMessageData) => {}
type CustomContext = FileFlavor<Context>
const adminUserIds: string[] = process.env.ADMIN_USER_IDS?.split(',') || [];

export const isAdminUser = (userId: number): boolean => {
  return adminUserIds.includes(userId.toString());
};

export const handleCommandAdminMenu = async (ctx: CustomContext) => {
  if (!isAdminUser(ctx.from?.id)) {
    ctx.reply('You are not an admin!')
    return
  }
  const keyboard = [
    ['Check all user info'],
  ]
  ctx.reply('Admin menu', {
    reply_markup: {
      keyboard,
      resize_keyboard: true,
    },
  })
}

export const handleCheckAllUserInfo = async (ctx: CustomContext) => {
  console.log('handleCommandReset')
  onMessageCallback?.({
    user: {
      id: `${ctx.from?.id}`,
    },
    chat: {
      id: `${ctx.chat?.id}`,
    },
    message: {
      id: nanoid(),
      type: 'command',
      content: 'reset',
    },
  })
  ctx.reply('Done!')
}