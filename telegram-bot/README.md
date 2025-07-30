# 🤖 Telegram Bot für Webseite

Ein moderner Telegram-Bot mit Web-Interface für die Integration in Ihre Webseite.

## ✨ Features

- **Real-time Chat**: Live-Nachrichten zwischen Telegram und Web-Interface
- **Automatische Antworten**: Intelligente Bot-Antworten auf häufige Fragen
- **Modernes Dashboard**: Schönes, responsives Web-Interface
- **Multi-Chat Support**: Verwaltung mehrerer Chat-Konversationen
- **Statistiken**: Live-Statistiken über aktive Chats und Nachrichten
- **REST API**: Vollständige API für externe Integrationen

## 🚀 Installation

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. Telegram Bot erstellen

1. Öffnen Sie Telegram und suchen Sie nach `@BotFather`
2. Senden Sie `/newbot`
3. Folgen Sie den Anweisungen und wählen Sie einen Namen und Username
4. Kopieren Sie den Bot-Token

### 3. Umgebungsvariablen konfigurieren

```bash
cp env.example .env
```

Bearbeiten Sie die `.env` Datei:

```env
TELEGRAM_BOT_TOKEN=your_actual_bot_token_here
PORT=3000
```

### 4. Bot starten

```bash
npm start
```

Für Entwicklung mit Auto-Reload:

```bash
npm run dev
```

## 🌐 Verwendung

### Web-Interface

Öffnen Sie `http://localhost:3000` in Ihrem Browser.

### Telegram Bot

1. Suchen Sie Ihren Bot in Telegram
2. Starten Sie eine Konversation mit `/start`
3. Senden Sie Nachrichten - diese erscheinen im Web-Interface

### API Endpoints

- `GET /api/chats` - Alle aktiven Chats abrufen
- `GET /api/chat/:chatId` - Spezifischen Chat abrufen
- `POST /api/send-message` - Nachricht senden

## 🔧 Konfiguration

### Automatische Antworten anpassen

Bearbeiten Sie die `generateResponse()` Funktion in `server.js`:

```javascript
function generateResponse(text) {
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('preis')) {
    return 'Unsere Preise finden Sie unter: https://ihre-domain.de/preise';
  }
  
  // Weitere Antworten hinzufügen...
}
```

### Web-Interface anpassen

Das Web-Interface befindet sich in `public/index.html` und `public/script.js`.

## 📱 Webseite Integration

### Einbettung in bestehende Webseite

Fügen Sie diesen Code in Ihre Webseite ein:

```html
<!-- Telegram Chat Widget -->
<div id="telegram-chat-widget" style="position: fixed; bottom: 20px; right: 20px; z-index: 1000;">
  <button onclick="openTelegramChat()" style="background: #0088cc; color: white; border: none; padding: 15px; border-radius: 50%; cursor: pointer;">
    <i class="fab fa-telegram"></i>
  </button>
</div>

<script>
function openTelegramChat() {
  window.open('http://localhost:3000', 'telegram-chat', 'width=400,height=600');
}
</script>
```

### Cloudflare Integration

Für die Bereitstellung auf Cloudflare:

1. **Cloudflare Pages**:
   - Repository zu GitHub/GitLab pushen
   - In Cloudflare Pages verbinden
   - Build-Kommando: `npm install && npm start`

2. **Cloudflare Workers**:
   - Server-Code für Workers anpassen
   - Webhook-URL in Bot-Einstellungen setzen

## 🔒 Sicherheit

- **HTTPS**: Verwenden Sie immer HTTPS in Produktion
- **Token-Schutz**: Teilen Sie Ihren Bot-Token niemals öffentlich
- **Rate Limiting**: Implementieren Sie Rate Limiting für die API
- **Input Validation**: Validieren Sie alle Benutzereingaben

## 📊 Monitoring

Der Bot bietet folgende Statistiken:

- Aktive Chats
- Nachrichten pro Tag
- Online-Status
- Chat-Historie

## 🛠️ Entwicklung

### Projektstruktur

```
telegram-web-bot/
├── server.js          # Hauptserver
├── package.json       # Abhängigkeiten
├── public/            # Web-Interface
│   ├── index.html
│   └── script.js
├── .env              # Umgebungsvariablen
└── README.md         # Diese Datei
```

### Debugging

Aktivieren Sie Debug-Logs:

```bash
DEBUG=* npm start
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch
3. Committen Sie Ihre Änderungen
4. Pushen Sie zum Branch
5. Erstellen Sie einen Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.

## 🆘 Support

Bei Problemen:

1. Überprüfen Sie die Logs: `npm start`
2. Stellen Sie sicher, dass der Bot-Token korrekt ist
3. Überprüfen Sie die Netzwerkverbindung
4. Erstellen Sie ein Issue im Repository

## 🔄 Updates

```bash
git pull origin main
npm install
npm start
```

---

**Viel Spaß mit Ihrem Telegram Bot! 🎉** 