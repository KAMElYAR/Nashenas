const express = require("express");
const bodyParser = require("body-parser");
const TelegramBot = require("node-telegram-bot-api");
const { v4: uuidv4 } = require("uuid");

const app = express();
const port = 3000;

const token = "7573492339:AAGWg6UU45-bfTKx0Cs-fVUWYL-fSC9wXog";
const chatId = 1196450049;
const bot = new TelegramBot(token, { polling: true });

app.use(bodyParser.json());
app.use(express.static("public"));

let messages = {};

app.post("/api/send", (req, res) => {
  const { username, message } = req.body;
  const id = uuidv4();
  messages[id] = { username, message, reply: "" };

  const text = `📩 پیام ناشناس جدید:\n\n👤 نام: ${username}\n💬 پیام: ${message}\n\n🆔 ID: ${id}`;
  bot.sendMessage(chatId, text);

  res.status(200).json({ id });
});

app.post("/api/reply", (req, res) => {
  const { id, reply } = req.body;
  if (messages[id]) {
    messages[id].reply = reply;
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get("/api/messages", (req, res) => {
  res.json(messages);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
