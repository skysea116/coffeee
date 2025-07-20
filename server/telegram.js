const axios = require('axios');
require('dotenv').config();

// Основные параметры Telegram
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = Number(process.env.TELEGRAM_CHAT_ID);

// Отправка уведомления о новом заказе
async function sendOrderNotification(name, coffee, address, message) {
  const text = `☕ *Новый заказ от ${name}!*\n\n` +
               `*Кофе:* ${coffee}\n` +
               `*Адрес:* ${address}\n` +
               `*Пожелания:* ${message || 'Нет'}`;

  return axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Принять заказ", callback_data: "accept" }],
          [{ text: "❌ Отклонить", callback_data: "reject" }]
        ]
      }
    },
    {
      timeout: 10000
    }
  );
}

// Обработка вебхука от Telegram
async function handleWebhook(update) {
  // Обработка callback_query (нажатия на кнопки)
  if (update.callback_query) {
    const { data, message, id: callback_query_id } = update.callback_query;
    const chatId = message.chat.id;

    // Ответ на callback_query (убираем "часики")
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/answerCallbackQuery`, {
      callback_query_id
    });

    // Обработка действий
    if (data === 'accept') {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "✅ Заказ принят в работу! Готовлю кофе для Кристины!"
      });
    } else if (data === 'reject') {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "❌ Заказ отклонён. Пожалуйста, проверьте детали."
      });
    }
  }
}

// Настройка вебхука
async function setupWebhook(webhookUrl) {
  return axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
    {
      url: webhookUrl,
      max_connections: 5
    }
  );
}

module.exports = {
  sendOrderNotification,
  handleWebhook,
  setupWebhook
};