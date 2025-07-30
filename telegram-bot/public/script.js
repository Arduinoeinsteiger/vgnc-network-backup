// Socket.IO Verbindung
const socket = io();

// DOM Elemente
const statusElement = document.getElementById('status');
const activeChatsElement = document.getElementById('activeChats');
const messagesTodayElement = document.getElementById('messagesToday');
const onlineStatusElement = document.getElementById('onlineStatus');
const chatListElement = document.getElementById('chatList');
const currentChatNameElement = document.getElementById('currentChatName');
const messagesElement = document.getElementById('messages');
const messageInputElement = document.getElementById('messageInput');
const sendBtnElement = document.getElementById('sendBtn');

// Globale Variablen
let chats = new Map();
let currentChatId = null;
let messagesToday = 0;

// Socket.IO Event Handler
socket.on('connect', () => {
    console.log('Verbunden mit Server');
    statusElement.textContent = 'Online';
    statusElement.className = 'status online';
    onlineStatusElement.textContent = '🟢';
});

socket.on('disconnect', () => {
    console.log('Verbindung getrennt');
    statusElement.textContent = 'Offline';
    statusElement.className = 'status offline';
    onlineStatusElement.textContent = '🔴';
});

socket.on('chats-update', (chatsData) => {
    chats = new Map(chatsData);
    updateChatList();
    updateStats();
});

socket.on('telegram-message', (messageData) => {
    console.log('Neue Nachricht:', messageData);
    
    // Chat zur Liste hinzufügen, falls nicht vorhanden
    if (!chats.has(messageData.chatId)) {
        chats.set(messageData.chatId, {
            username: messageData.username,
            messages: []
        });
    }
    
    // Nachricht zum Chat hinzufügen
    const chat = chats.get(messageData.chatId);
    chat.messages.push({
        text: messageData.text,
        timestamp: new Date(messageData.timestamp),
        from: messageData.username === 'Bot' ? 'bot' : 'user'
    });
    
    // UI aktualisieren
    updateChatList();
    updateStats();
    
    // Nachrichten anzeigen, falls aktueller Chat
    if (currentChatId === messageData.chatId) {
        displayMessages(messageData.chatId);
    }
    
    // Nachrichten-Counter erhöhen
    messagesToday++;
    updateStats();
});

socket.on('error', (error) => {
    console.error('Socket Fehler:', error);
    showNotification('Fehler: ' + error, 'error');
});

// Chat-Liste aktualisieren
function updateChatList() {
    if (chats.size === 0) {
        chatListElement.innerHTML = '<div class="no-chat-selected">Keine aktiven Chats</div>';
        return;
    }
    
    chatListElement.innerHTML = '';
    
    chats.forEach((chat, chatId) => {
        const chatItem = document.createElement('div');
        chatItem.className = 'chat-item';
        if (currentChatId === chatId) {
            chatItem.classList.add('active');
        }
        
        const lastMessage = chat.messages.length > 0 
            ? chat.messages[chat.messages.length - 1].text 
            : 'Keine Nachrichten';
        
        chatItem.innerHTML = `
            <div class="username">${chat.username || 'Unbekannt'}</div>
            <div class="last-message">${truncateText(lastMessage, 30)}</div>
        `;
        
        chatItem.addEventListener('click', () => {
            selectChat(chatId);
        });
        
        chatListElement.appendChild(chatItem);
    });
}

// Chat auswählen
function selectChat(chatId) {
    currentChatId = chatId;
    const chat = chats.get(chatId);
    
    if (chat) {
        currentChatNameElement.textContent = chat.username || 'Unbekannt';
        messageInputElement.disabled = false;
        sendBtnElement.disabled = false;
        
        displayMessages(chatId);
        updateChatList(); // Aktive Chat hervorheben
    }
}

// Nachrichten anzeigen
function displayMessages(chatId) {
    const chat = chats.get(chatId);
    if (!chat) return;
    
    messagesElement.innerHTML = '';
    
    chat.messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.from}`;
        
        const time = new Date(message.timestamp).toLocaleTimeString('de-DE', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        messageElement.innerHTML = `
            <div class="message-content">
                ${escapeHtml(message.text)}
                <div class="message-info">${time}</div>
            </div>
        `;
        
        messagesElement.appendChild(messageElement);
    });
    
    // Zum letzten Nachricht scrollen
    messagesElement.scrollTop = messagesElement.scrollHeight;
}

// Nachricht senden
function sendMessage() {
    const message = messageInputElement.value.trim();
    if (!message || !currentChatId) return;
    
    socket.emit('send-message', {
        chatId: currentChatId,
        message: message
    });
    
    messageInputElement.value = '';
}

// Statistiken aktualisieren
function updateStats() {
    activeChatsElement.textContent = chats.size;
    messagesTodayElement.textContent = messagesToday;
}

// Hilfsfunktionen
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = 'info') {
    // Einfache Benachrichtigung
    console.log(`${type.toUpperCase()}: ${message}`);
}

// Event Listener
messageInputElement.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

sendBtnElement.addEventListener('click', sendMessage);

// Automatische Aktualisierung der Statistiken
setInterval(() => {
    updateStats();
}, 5000);

// Initialisierung
document.addEventListener('DOMContentLoaded', () => {
    console.log('Telegram Bot Dashboard geladen');
    updateStats();
}); 