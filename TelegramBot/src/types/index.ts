// TelegramBot/src/types/index.ts

export interface ExchangeMessageData {
  user: {
    id: string;
  };
  chat: {
    id: string;
  };
  message: {
    type: 'text' | 'image' | 'voice' | 'command';
    content: string;
    id: string;
    duration?: number; // 為 voice 消息類型添加可選的 duration 屬性
  };
  options?: {
    voice: boolean;
  };
}

export interface GPTResponseData {
  content: string;
  imageBase64: string;
}
