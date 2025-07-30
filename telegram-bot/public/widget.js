// Telegram Chat Widget für Webseiten
(function() {
    'use strict';
    
    // Widget-Konfiguration
    const config = {
        botUrl: window.location.origin || 'http://localhost:3000',
        position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
        size: 'medium', // small, medium, large
        theme: 'light', // light, dark
        autoOpen: false,
        welcomeMessage: 'Haben Sie Fragen? Chatten Sie mit uns!'
    };
    
    // Widget-HTML erstellen
    function createWidget() {
        const widgetHTML = `
            <div id="telegram-widget" style="
                position: fixed;
                ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
                ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
                z-index: 9999;
                font-family: Arial, sans-serif;
            ">
                <!-- Chat Button -->
                <div id="telegram-chat-button" style="
                    background: #0088cc;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: ${config.size === 'small' ? '50px' : config.size === 'large' ? '70px' : '60px'};
                    height: ${config.size === 'small' ? '50px' : config.size === 'large' ? '70px' : '60px'};
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: ${config.size === 'small' ? '20px' : config.size === 'large' ? '28px' : '24px'};
                    transition: all 0.3s ease;
                " onclick="openTelegramChat()">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.05-.2-.06-.06-.14-.04-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
                    </svg>
                </div>
                
                <!-- Notification Badge -->
                <div id="telegram-notification" style="
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4444;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    display: none;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                ">0</div>
                
                <!-- Welcome Tooltip -->
                <div id="telegram-tooltip" style="
                    position: absolute;
                    ${config.position.includes('right') ? 'right: 70px;' : 'left: 70px;'}
                    top: 50%;
                    transform: translateY(-50%);
                    background: white;
                    color: #333;
                    padding: 10px 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    font-size: 14px;
                    max-width: 200px;
                    display: none;
                    white-space: nowrap;
                ">${config.welcomeMessage}</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', widgetHTML);
    }
    
    // Chat-Fenster öffnen
    window.openTelegramChat = function() {
        const chatWindow = window.open(
            config.botUrl,
            'telegram-chat',
            'width=400,height=600,scrollbars=yes,resizable=yes'
        );
        
        // Tooltip ausblenden
        const tooltip = document.getElementById('telegram-tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
        }
        
        // Notification zurücksetzen
        const notification = document.getElementById('telegram-notification');
        if (notification) {
            notification.style.display = 'none';
            notification.textContent = '0';
        }
    };
    
    // Hover-Effekte
    function addHoverEffects() {
        const button = document.getElementById('telegram-chat-button');
        const tooltip = document.getElementById('telegram-tooltip');
        
        if (button && tooltip) {
            button.addEventListener('mouseenter', function() {
                tooltip.style.display = 'block';
                button.style.transform = 'scale(1.1)';
            });
            
            button.addEventListener('mouseleave', function() {
                tooltip.style.display = 'none';
                button.style.transform = 'scale(1)';
            });
        }
    }
    
    // Notification anzeigen
    window.showTelegramNotification = function(count) {
        const notification = document.getElementById('telegram-notification');
        if (notification) {
            notification.style.display = 'flex';
            notification.textContent = count;
        }
    };
    
    // Widget initialisieren
    function init() {
        createWidget();
        addHoverEffects();
        
        // Auto-Open nach 30 Sekunden (optional)
        if (config.autoOpen) {
            setTimeout(function() {
                const tooltip = document.getElementById('telegram-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                    setTimeout(function() {
                        tooltip.style.display = 'none';
                    }, 5000);
                }
            }, 30000);
        }
    }
    
    // Widget-Konfiguration anpassen
    window.configureTelegramWidget = function(newConfig) {
        Object.assign(config, newConfig);
    };
    
    // Initialisierung
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})(); 