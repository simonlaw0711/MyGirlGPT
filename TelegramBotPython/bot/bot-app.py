from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackQueryHandler
from telegram import InputFile, InlineKeyboardMarkup, InlineKeyboardButton, ParseMode
import os
from python_dotenv import load_dotenv
import logging

# 載入環境變量
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")

# 設置日誌
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                    level=logging.INFO)
logger = logging.getLogger(__name__)

class BotApp:
    def __init__(self, token):
        self.updater = Updater(token, use_context=True)
        self.dp = self.updater.dispatcher
        self.voice_settings = {}

        # 註冊命令和消息處理器
        self.dp.add_handler(CommandHandler('start', self.handle_command_start))
        self.dp.add_handler(CommandHandler('voice', self.handle_command_voice))
        self.dp.add_handler(CommandHandler('reset', self.handle_command_reset))
        self.dp.add_handler(MessageHandler(Filters.text & ~Filters.command, self.handle_message_text))
        self.dp.add_handler(CallbackQueryHandler(self.handle_callback_query))

    def handle_command_start(self, update, context):
        chat_id = update.effective_chat.id
        user_id = update.effective_user.id

        # 根據環境變量處理回覆
        start_reply_photo = os.getenv("START_COMMAND_REPLY_PHOTO")
        start_reply_text = os.getenv("START_COMMAND_REPLY_TEXT")
        start_reply_voice = os.getenv("START_COMMAND_REPLY_VOICE")

        if start_reply_photo:
            context.bot.send_photo(chat_id, photo=open(start_reply_photo, 'rb'))
        if start_reply_text:
            context.bot.send_message(chat_id, text=open(start_reply_text, 'r').read())
        if start_reply_voice:
            context.bot.send_voice(chat_id, voice=open(start_reply_voice, 'rb'))

        if not any([start_reply_photo, start_reply_text, start_reply_voice]):
            context.bot.send_message(chat_id, text="Hello!")

    def handle_command_voice(self, update, context):
        chat_id = update.effective_chat.id
        voice_setting = self.voice_settings.get(chat_id, False)

        if voice_setting:
            reply_markup = InlineKeyboardMarkup([[InlineKeyboardButton("Turn off", callback_data='turn-off-voice')]])
            context.bot.send_message(chat_id, text="The feature of voice is *enabled* now, you can:",
                                     parse_mode=ParseMode.MARKDOWN, reply_markup=reply_markup)
        else:
            reply_markup = InlineKeyboardMarkup([[InlineKeyboardButton("Turn on", callback_data='turn-on-voice')]])
            context.bot.send_message(chat_id, text="The feature of voice is *disabled* now, you can:",
                                     parse_mode=ParseMode.MARKDOWN, reply_markup=reply_markup)

    def handle_command_reset(self, update, context):
        # 根據需要實現重置邏輯
        chat_id = update.effective_chat.id
        context.bot.send_message(chat_id, text="Done!")

    def handle_message_text(self, update, context):
        chat_id = update.effective_chat.id
        text = update.message.text
        # 處理文本消息邏輯
        # ...

    def handle_callback_query(self, update, context):
        query = update.callback_query
        query.answer()

        chat_id = update.effective_chat.id
        data = query.data

        if data == 'turn-on-voice':
            self.voice_settings[chat_id] = True
            query.edit_message_text(text="The feature of voice is *enabled* now.",
                                    parse_mode=ParseMode.MARKDOWN)
        elif data == 'turn-off-voice':
            self.voice_settings[chat_id] = False
            query.edit_message_text(text="The feature of voice is *disabled* now.",
                                    parse_mode=ParseMode.MARKDOWN)

    def start(self):
        self.updater.start_polling()
        self.updater.idle()

    def stop(self):
        self.updater.stop()

if __name__ == '__main__':
    bot_app = BotApp(BOT_TOKEN)
    bot_app.start()
