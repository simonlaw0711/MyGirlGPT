import _ from 'lodash';
import dotenv from 'dotenv';
import KeyvRedis from '@keyv/redis';
import QuickLRU from 'quick-lru';
import Keyv from 'keyv';

dotenv.config();

const REDIS_URL = process.env.REDIS_SERVER as string;

export class UserManager {
  static usersStore: Keyv;
  static creditSystemEnabled = process.env.CREDIT_SYSTEM_ENABLED === 'true';
  static initialize() {
    let kvStore: KeyvRedis | QuickLRU<string, any>;
    if (REDIS_URL !== undefined && _.startsWith(REDIS_URL, 'redis://')) {
      kvStore = new KeyvRedis(REDIS_URL);
    } else {
      kvStore = new QuickLRU<string, any>({ maxSize: 10000 });
    }
    UserManager.usersStore = new Keyv({ store: kvStore, namespace: 'MyGirlGPT-usersStore' });
  }

  static toggleCreditSystem(state: boolean) {
    UserManager.creditSystemEnabled = state;
  }

  static async registerUser(userId: string, userInfo: { name: string; isVip: boolean }) {
    await UserManager.usersStore.set(userId, userInfo);
    console.log(`User ${userId} registered with info:`, userInfo);
  }

  static async getUserInfo(userId: string) {
    const userInfo = await UserManager.usersStore.get(userId);
    if (!userInfo) {
      console.log(`User ${userId} not found.`);
      return null;
    }
    console.log(`User ${userId} info:`, userInfo);
    return userInfo;
  }

  static async updateUserCredit(userId: string, credit: number) {
    const userInfo = await UserManager.getUserInfo(userId);
    if (userInfo) {
      userInfo.credit = credit;
      await UserManager.usersStore.set(userId, userInfo);
      console.log(`User ${userId} credit updated to: ${credit}`);
    } else {
      console.log(`User ${userId} not found.`);
    }
  }

  static async updateUserVipStatus(userId: string, isVip: boolean) {
    const userInfo = await UserManager.getUserInfo(userId);
    if (userInfo) {
      userInfo.isVip = isVip;
      await UserManager.usersStore.set(userId, userInfo);
      console.log(`User ${userId} VIP status updated to: ${isVip}`);
    }
  }
}
UserManager.initialize();