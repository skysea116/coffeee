

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// В server.js добавьте явное разрешение для GitHub Pages:
app.use(cors({
  origin: ['https://skysea116.github.io/coffeee/', 'http://localhost:3000'],
  methods: ['GET', 'POST']
}));

// Настройки CORS
app.use(cors());
app.use(express.json());

// Конфигурация Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

// Добавляем обработчик для корневого пути
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'active',
    service: 'Coffee Delivery for Kristina',
    message: 'Сервер работает! Отправляйте POST-запросы на /order'
  });
});

// Обработка заказа
app.post('/order', async (req, res) => {
  try {
    const { name, coffee, address, message } = req.body;

    // Формируем сообщение для Telegram
    const telegramMessage = `☕ *НОВЫЙ ЗАКАЗ КОФЕ ДЛЯ КРИСТИНЫ!* 😻\n\n`
      + `*Имя:* ${name}\n`
      + `*Кофе:* ${coffee}\n`
      + `*Адрес:* ${address}\n`
      + `*Пожелания:* ${message}\n\n`
      + `_Промокод: КРИСТИНА_\n`
      + `#кофе_для_кристины #заказ`;

    // Отправляем сообщение в Telegram
    await axios.post(TELEGRAM_API_URL, {
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'Markdown'
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка при обработке заказа:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Ошибка сервера',
      details: error.message 
    });
  }
});

// Обработка несуществующих путей
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Используйте POST /order для отправки заказов'
  });
});

// Старт сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});