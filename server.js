


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

// Тестовый роут
app.get('/', (req, res) => {
  res.json({ status: 'active', message: 'Сервер работает!' });
});

// Обработчик заказов
app.post('/order', async (req, res) => {
  console.log('Получен заказ:', req.body);
  
  try {
    const { name, coffee, address, message } = req.body;
    
    // Отправка в Telegram
    const telegramResponse = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: `☕ Новый заказ!\nИмя: ${name}\nКофе: ${coffee}\nАдрес: ${address}\nПожелания: ${message || 'Нет'}`
      }
    );
    
    res.json({ success: true, telegramStatus: telegramResponse.status });
  } catch (error) {
    console.error('Ошибка:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});