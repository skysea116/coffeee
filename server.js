const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

app.post('/order', async (req, res) => {
  try {
    const { name, coffee, address, message } = req.body;

    const telegramMessage = `☕ *НОВЫЙ ЗАКАЗ КОФЕ ДЛЯ КРИСТИНЫ!* 😻\n\n`
      + `*Имя:* ${name}\n`
      + `*Кофе:* ${coffee}\n`
      + `*Адрес:* ${address}\n`
      + `*Пожелания:* ${message}\n\n`
      + `_Промокод: КРИСТИНА_\n`
      + `#кофе_для_кристины #заказ`;

    await axios.post(TELEGRAM_API_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'Markdown'
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка:', error.message);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});