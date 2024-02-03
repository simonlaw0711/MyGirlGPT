import { Context } from 'grammy';
import { FileFlavor } from '@grammyjs/files'
import { ExchangeMessageData } from '../types'
import { UserManager } from './user-management.mjs';

type CustomContext = FileFlavor<Context>

export class AdminMenu {
  static onMessageCallback: ((data: ExchangeMessageData) => void) | undefined;
  private static adminUserIds: string[] = process.env.ADMIN_USER_IDS?.split(',') || [];
  
  static isAdminUser(userId: number): boolean {
    return AdminMenu.adminUserIds.includes(userId.toString());
  }
 
  // impletment handleViewUsersInfo, the bot should send a message to admin to ask for the user id then return the user info
  static async handleViewUsersInfo(ctx: CustomContext) {
    if (!AdminMenu.isAdminUser(ctx.from?.id || 0)) {
      return ctx.reply('You are not an admin');
    }
    const userManager = new UserManager();
    const users = await userManager.getAllUsers();
    if (users.length === 0) {
      return ctx.reply('No user found');
    }
    const userNames = users.map(user => user.username || user.first_name);
    return ctx.reply(`Users: ${userNames.join(', ')}`);
  }
