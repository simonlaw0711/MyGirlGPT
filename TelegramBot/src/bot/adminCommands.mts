import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config();

const adminUserIds: string[] = process.env.ADMIN_USER_IDS?.split(',') || [];

export const isAdminUser = (userId: number): boolean => {
  return adminUserIds.includes(userId.toString());
};

export const handleAdminMenuCommand = (bot: Telegraf) => {
  bot.command('admin_menu', (ctx) => {
    const userId = ctx.from?.id;
    if (userId && isAdminUser(userId)) {
      ctx.reply('管理員菜單:', {
        reply_markup: {
          inline_keyboard: [
            [{ text: '查看用戶信息', callback_data: 'view_users' }],
            [{ text: '其他管理操作', callback_data: 'other_admin_action' }],
          ],
        },
      });
    } else {
      ctx.reply('抱歉，您不是管理員。');
    }
  });
};
