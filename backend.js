const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const fs = require("fs");

const app = express();
const PORT = 3000;

// اطلاعات تلگرام
const TELEGRAM_BOT_TOKEN = "7573492339:AAGWg6UU45-bfTKx0Cs-fVUWYL-fSC9wXog";
const ADMIN_CHAT_ID = "1196450049";

app.use(bodyParser.json());
app.use(express.static("public"));

// وقتی کاربر پیام می‌فرسته
app.post("/api/send", async (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).send("همه فیلدها لازم هستند!");
  }

  // ذخیره پیام در یک فایل ساده
  const msg = { username, message, reply: "" };
  let messages = [];
  if (fs.existsSync("messages.json")) {
    messages = JSON.parse(fs.readFileSync("messages.json", "utf-8"));
  }
  messages.push(msg);
  fs.writeFileSync("messages.json", JSON.stringify(messages, null, 2));

  // فرستادن به تلگرام
  const text = `پیام جدید از: ${username}\n\n${message}\n\nبرای پاسخ، روی این پیام ریپلای کن.`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: ADMIN_CHAT_ID, text })
  });

  res.send("پیام ارسال شد ✅");
});

app.listen(PORT, () => {
  console.log(`✅ سرور اجرا شد: http://localhost:${PORT}`);
});