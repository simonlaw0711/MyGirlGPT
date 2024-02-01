from python_dotenv import load_dotenv
import os
import logging
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters
import websocket
import json

# 載入環境變量
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")
WEBSOCKET_PORT = os.getenv("WEBSOCKET_PORT")

# 設置日誌
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

# WebSocket 連接
def create_websocket():
    ws = websocket.WebSocketApp(f"ws://localhost:{WEBSOCKET_PORT}",
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.run_forever()

def on_message(ws, message):
    # 處理 WebSocket 接收的消息
    print("Received message from WebSocket:", message)

def on_error(ws, error):
    print("WebSocket error:", error)

def on_close(ws, close_status_code, close_msg):
    print("WebSocket closed")

# Telegram 機器人的消息處理
def handle_bot_message(update, context):
    print("Received message from Telegram bot:", update.message.text)
    # 在這裡可以添加代碼將消息發送到 WebSocket

def main():
    updater = Updater(BOT_TOKEN, use_context=True)

    # 添加消息處理器
    dp = updater.dispatcher
    dp.add_handler(MessageHandler(Filters.text, handle_bot_message))

    # 啟動機器人
    updater.start_polling()
    updater.idle()

    # 啟動 WebSocket
    create_websocket()

if __name__ == '__main__':
    main()
