






// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

// Настройка CORS
app.use(cors({
  origin: 'https://skysea116.github.io',
  methods: ['POST', 'GET']
}));

app.use(express.json());

// Проверка работы сервера
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'Сервер работает!' });
});

// Обработка заказов
app.post('/order', async (req, res) => {
  try {
    const { name, coffee, address, message } = req.body;
    
    // Проверка обязательных полей
    if (!name || !coffee || !address) {
      return res.status(400).json({ error: 'Не заполнены обязательные поля' });
    }

    // Проверка переменных окружения
    if (!process.env.TELEGRAM_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
      console.error('Ошибка: Не настроены переменные окружения Telegram');
      return res.status(500).json({ error: 'Ошибка конфигурации сервера' });
    }

    // Формирование сообщения
    const text = `☕ *Новый заказ кофе для Кристины!*\n\n` +
                 `*Имя:* ${name}\n` +
                 `*Кофе:* ${coffee}\n` +
                 `*Адрес:* ${address}\n` +
                 `*Пожелания:* ${message || 'Нет'}\n\n` +
                 `_Промокод: КРИСТИНА_`;

    // Отправка в Telegram
    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: text,
        parse_mode: 'Markdown'
      },
      {
        timeout: 10000 // Таймаут 10 секунд
      }
    );

    console.log('Сообщение отправлено в Telegram:', telegramResponse.data);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке заказа:', error);
    
    let errorMessage = 'Server error';
    if (error.response) {
      // Ошибка от Telegram API
      errorMessage = `Telegram API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      errorMessage = 'No response from Telegram API';
    } else {
      // Ошибка при настройке запроса
      errorMessage = error.message;
    }

    res.status(500).json({ error: errorMessage });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});