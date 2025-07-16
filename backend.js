const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

// توکن و chat_id
const token = "7573492339:AAGWg6UU45-bfTKx0Cs-fVUWYL-fSC9wXog";
const chatId = 1196450049;

// بات تلگرام
const bot = new TelegramBot(token, { polling: true });

app.use(bodyParser.json());
app.use(express.static("public"));

// لیست پیام‌ها برای ذخیره پاسخ‌ها
const messages = {};

// API برای ارسال پیام
app.post("/api/send", (req, res) => {
  const { username, message } = req.body;
  const id = uuidv4();
  messages[id] = { username, message, reply: "" };

  const text = `📩 پیام جدید ناشناس:\n\n👤 فرستنده: ${username}\n\n💬 پیام: ${message}\n\n🆔 ID: ${id}\n\nاگر میخواهید پاسخ دهید، در تلگرام ریپلای کنید.`;

  bot.sendMessage(chatId, text);
  res.sendStatus(200);
});

// گوش دادن به ریپلای‌ها
bot.on("message", (msg) => {
  if (msg.reply_to_message && msg.text) {
    const originalText = msg.reply_to_message.text;
    const regex = /ID: (.*)/;
    const match = originalText.match(regex);

    if (match) {
      const id = match[1].trim();
      if (messages[id]) {
        messages[id].reply = msg.text;
        bot.sendMessage(chatId, `✅ پاسخ ثبت شد برای پیام ID: ${id}`);
      }
    }
  }
});

// API برای دریافت پاسخ کاربر
app.get("/api/reply/:id", (req, res) => {
  const id = req.params.id;
  if (messages[id]) {
    res.json({ reply: messages[id].reply });
  } else {
    res.status(404).json({ reply: "" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
