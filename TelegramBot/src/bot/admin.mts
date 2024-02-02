import { Context } from 'grammy';
import { FileFlavor } from '@grammyjs/files'
import { ExchangeMessageData } from '../types'
import { UserManager } from './user-management.mjs';

type CustomContext = FileFlavor<Context>

export class AdminMenu {
  static onMessageCallback: ((data: ExchangeMessageData) => void) | undefined;
  private static adminUserIds: string[] = process.env.ADMIN_USER_IDS?.split(',') || [];
  
  private static isAdminUser(userId: number): boolean {
    return AdminMenu.adminUserIds.includes(userId.toString());
  }

  private static handleCommandAdminMenu(ctx: CustomContext) {
    if (!AdminMenu.isAdminUser(ctx.from?.id)) {
      ctx.reply('You are not an admin!');
      return;
    }
    const keyboard = [
      ['Check all user info'],
    ];
    ctx.reply('Admin menu', {
      reply_markup: {
        keyboard,
        resize_keyboard: true,
      },
    });
  }
  private static handleCheckAllUserInfo(ctx: CustomContext) {
    console.log('handleCommandReset');
    UserManager.getAllUserInfo(ctx.from?.id).then((users) => {
      console.log(users);
    });
    ctx
      .editMessageText('')
    ctx.reply('Done!');
  }
  
}