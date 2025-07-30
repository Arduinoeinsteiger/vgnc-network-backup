# 🖥️ VGNC Network - System Backup

## 📋 Übersicht
Dieses Repository enthält ein vollständiges Backup des VGNC-Netzwerks mit allen Services, Konfigurationen und Dokumentationen.

## 🚀 Aktive Services

### Docker Container
- **n8n** (Port 5678) - Workflow-Automatisierung
- **Homepage** (Port 8080) - Dashboard
- **Netdata** (Port 19999) - System-Monitoring
- **Portainer** (Port 9000) - Docker-Management

### Telegram Bot
- **Port 3000** - Chat-Bot mit Web-Interface
- **Features:** Automatische Antworten, Dashboard, Widget

## 🌐 Externe Zugriffe (Cloudflare)

| Service | URL | Status |
|---------|-----|--------|
| **n8n** | https://n8n.vgnc.org | ✅ Aktiv |
| **Homepage** | https://home.vgnc.org | ✅ Aktiv |
| **Portainer** | https://portainer.vgnc.org | ✅ Aktiv |
| **Netdata** | https://netdata.vgnc.org | ✅ Aktiv |

## 📁 Projektstruktur

```
vgnc-backup/
├── README.md                    # Diese Datei
├── homepage-index.html          # Homepage HTML
├── cloudflared-config.yml       # Cloudflare Tunnel Konfiguration
├── docker-services.txt          # Aktuelle Docker Services
└── telegram-bot/                # Telegram Bot Projekt
    ├── server.js               # Hauptserver
    ├── package.json            # Dependencies
    ├── public/                 # Web-Interface
    │   ├── index.html         # Dashboard
    │   ├── script.js          # Frontend Logic
    │   ├── widget.js          # Website Widget
    │   └── example.html       # Integration Beispiel
    ├── env.example            # Umgebungsvariablen
    └── README.md              # Bot Dokumentation
```

## 🔧 Installation & Setup

### 1. Docker Services starten
```bash
# n8n
docker run -d --name n8n -p 5678:5678 n8nio/n8n

# Homepage
docker run -d --name homepage -p 8080:80 -v ./homepage-index.html:/usr/share/nginx/html/index.html:ro nginx:alpine

# Netdata
docker run -d --name netdata -p 19999:19999 netdata/netdata

# Portainer
docker run -d --name portainer -p 9000:9000 portainer/portainer-ce:latest
```

### 2. Telegram Bot starten
```bash
cd telegram-bot
npm install
cp env.example .env
# TELEGRAM_BOT_TOKEN in .env eintragen
node server.js
```

### 3. Cloudflare Tunnel konfigurieren
```bash
sudo cp cloudflared-config.yml /etc/cloudflared/config.yml
sudo systemctl restart cloudflared
```

## 🔑 Wichtige Passwörter & Tokens

- **Telegram Bot Token:** In `.env` Datei
- **Cloudflare API:** Manuell in Cloudflare Dashboard
- **Docker Volumes:** Automatisch verwaltet

## 📊 System-Status

- **Betriebssystem:** Debian 12 (Bookworm)
- **Kernel:** 6.1.0-37-amd64
- **RAM:** 192GB (12GB belegt)
- **Festplatte:** 865GB (51GB belegt)
- **Docker:** Aktiv mit 4 Containern

## 🚨 Backup-Informationen

**Erstellt:** 30. Juli 2025
**Status:** Alle Services funktionsfähig
**Letzte Änderung:** n8n Domain von test.vgnc.org → n8n.vgnc.org

## 📞 Support

Bei Problemen:
1. Docker Container Status prüfen: `docker ps`
2. Logs anzeigen: `docker logs [container-name]`
3. Cloudflare Tunnel Status: `sudo systemctl status cloudflared`

## 🔄 Updates

- **n8n:** `docker pull n8nio/n8n && docker restart n8n`
- **Telegram Bot:** `cd telegram-bot && git pull && npm install`
- **Homepage:** HTML-Datei bearbeiten und Container neu starten

---

**VGNC Network** - Dein privates Cloud-Ökosystem 🚀 