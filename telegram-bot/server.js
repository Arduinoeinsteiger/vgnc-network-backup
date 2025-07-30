require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Telegram Bot Konfiguration
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Chat-Speicher
const chats = new Map();

// Bot Event Handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const username = msg.from.username || msg.from.first_name;
  
  console.log(`Nachricht von ${username}: ${text}`);
  
  // Speichere Chat-Informationen
  if (!chats.has(chatId)) {
    chats.set(chatId, {
      username: username,
      firstName: msg.from.first_name,
      lastName: msg.from.last_name,
      messages: []
    });
  }
  
  const chat = chats.get(chatId);
  chat.messages.push({
    text: text,
    timestamp: new Date(),
    from: 'user'
  });
  
  // Sende Nachricht an alle verbundenen Web-Clients
  io.emit('telegram-message', {
    chatId: chatId,
    username: username,
    text: text,
    timestamp: new Date()
  });
  
  // Automatische Antwort
  const response = generateResponse(text);
  if (response) {
    await bot.sendMessage(chatId, response);
    
    chat.messages.push({
      text: response,
      timestamp: new Date(),
      from: 'bot'
    });
    
    io.emit('telegram-message', {
      chatId: chatId,
      username: 'Bot',
      text: response,
      timestamp: new Date()
    });
  }
});

// Automatische Antworten generieren
function generateResponse(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('hallo') || lowerText.includes('hi') || lowerText.includes('hello')) {
    return 'Hallo! 👋 Willkommen bei unserem Support-Chat. Wie kann ich Ihnen helfen?';
  }
  
  if (lowerText.includes('preis') || lowerText.includes('kosten') || lowerText.includes('preise')) {
    return 'Unsere Preise finden Sie auf unserer Webseite unter www.ihre-domain.de/preise';
  }
  
  if (lowerText.includes('kontakt') || lowerText.includes('support')) {
    return 'Unser Support-Team ist gerne für Sie da! Sie können uns auch per E-Mail unter support@ihre-domain.de erreichen.';
  }
  
  if (lowerText.includes('öffnungszeiten') || lowerText.includes('öffnung')) {
    return 'Wir sind Montag bis Freitag von 9:00 bis 18:00 Uhr für Sie erreichbar.';
  }
  
  return 'Vielen Dank für Ihre Nachricht! Ein Mitarbeiter wird sich in Kürze bei Ihnen melden.';
}

// Socket.IO Event Handler
io.on('connection', (socket) => {
  console.log('Web-Client verbunden');
  
  // Sende aktuelle Chats an neuen Client
  socket.emit('chats-update', Array.from(chats.entries()));
  
  // Web-Nachricht an Telegram senden
  socket.on('send-message', async (data) => {
    const { chatId, message } = data;
    
    try {
      await bot.sendMessage(chatId, message);
      
      const chat = chats.get(parseInt(chatId));
      if (chat) {
        chat.messages.push({
          text: message,
          timestamp: new Date(),
          from: 'web'
        });
      }
      
      io.emit('telegram-message', {
        chatId: chatId,
        username: 'Web-Admin',
        text: message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      socket.emit('error', 'Fehler beim Senden der Nachricht');
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Web-Client getrennt');
  });
});

// API Routes
app.get('/api/chats', (req, res) => {
  res.json(Array.from(chats.entries()));
});

app.get('/api/chat/:chatId', (req, res) => {
  const chatId = parseInt(req.params.chatId);
  const chat = chats.get(chatId);
  
  if (chat) {
    res.json(chat);
  } else {
    res.status(404).json({ error: 'Chat nicht gefunden' });
  }
});

app.post('/api/send-message', async (req, res) => {
  const { chatId, message } = req.body;
  
  try {
    await bot.sendMessage(chatId, message);
    res.json({ success: true });
  } catch (error) {
    console.error('Fehler beim Senden der Nachricht:', error);
    res.status(500).json({ error: 'Fehler beim Senden der Nachricht' });
  }
});

// Webhook für Telegram (optional)
app.post('/webhook', (req, res) => {
  bot.handleUpdate(req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Telegram Bot Server läuft auf Port ${PORT}`);
  console.log(`📱 Bot Token: ${token ? 'Konfiguriert' : 'FEHLT - Bitte TELEGRAM_BOT_TOKEN setzen'}`);
  console.log(`🌐 Web-Interface: http://localhost:${PORT}`);
}); 