// DocumentChat Widget v1.0
(function() {
    const chatbotId = "{{CHATBOT_ID}}";
    const primaryColor = "{{PRIMARY_COLOR}}";
    const welcomeMessage = "{{WELCOME_MESSAGE}}";
    const placeholderText = "{{PLACEHOLDER_TEXT}}";
    
    // Crear estilos
    const style = document.createElement('style');
    style.innerHTML = `
        .dc-widget-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', sans-serif;
        }
        .dc-chat-button {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: ${primaryColor};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
            transition: all 0.3s ease;
        }
        .dc-chat-button:hover {
            transform: scale(1.05);
        }
        .dc-chat-window {
            display: none;
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 350px;
            height: 500px;
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
            flex-direction: column;
        }
        .dc-chat-header {
            background-color: ${primaryColor};
            color: white;
            padding: 15px;
            font-weight: 500;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .dc-chat-close {
            cursor: pointer;
            opacity: 0.8;
        }
        .dc-chat-close:hover {
            opacity: 1;
        }
        .dc-chat-messages {
            flex: 1;
            padding: 15px;
            overflow-y: auto;
        }
        .dc-message {
            margin-bottom: 10px;
            max-width: 80%;
            padding: 10px 14px;
            border-radius: 18px;
            line-height: 1.4;
            word-wrap: break-word;
            position: relative;
        }
        .dc-bot-message {
            background-color: #f1f1f1;
            color: #333;
            border-top-left-radius: 4px;
            margin-right: auto;
        }
        .dc-user-message {
            background-color: ${primaryColor};
            color: white;
            border-top-right-radius: 4px;
            margin-left: auto;
        }
        .dc-chat-input-container {
            border-top: 1px solid #eaeaea;
            padding: 12px;
            display: flex;
        }
        .dc-chat-input {
            flex: 1;
            padding: 10px 14px;
            border: 1px solid #ddd;
            border-radius: 20px;
            outline: none;
            font-size: 14px;
        }
        .dc-chat-input:focus {
            border-color: ${primaryColor};
        }
        .dc-send-button {
            margin-left: 8px;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: ${primaryColor};
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border: none;
        }
        .dc-send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .dc-loading {
            display: flex;
            padding: 10px;
            align-items: center;
        }
        .dc-loading-dots {
            display: flex;
        }
        .dc-loading-dots span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #888;
            margin: 0 2px;
            animation: dc-loading 1.4s infinite ease-in-out both;
        }
        .dc-loading-dots span:nth-child(1) {
            animation-delay: -0.32s;
        }
        .dc-loading-dots span:nth-child(2) {
            animation-delay: -0.16s;
        }
        @keyframes dc-loading {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Crear el HTML del widget
    const container = document.createElement('div');
    container.className = 'dc-widget-container';
    
    // Botón de chat
    const chatButton = document.createElement('div');
    chatButton.className = 'dc-chat-button';
    chatButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    container.appendChild(chatButton);
    
    // Ventana de chat
    const chatWindow = document.createElement('div');
    chatWindow.className = 'dc-chat-window';
    
    // Encabezado
    const chatHeader = document.createElement('div');
    chatHeader.className = 'dc-chat-header';
    chatHeader.innerHTML = `
        <div>DocumentChat</div>
        <div class="dc-chat-close">✕</div>
    `;
    chatWindow.appendChild(chatHeader);
    
    // Contenedor de mensajes
    const messagesContainer = document.createElement('div');
    messagesContainer.className = 'dc-chat-messages';
    chatWindow.appendChild(messagesContainer);
    
    // Contenedor de entrada
    const inputContainer = document.createElement('div');
    inputContainer.className = 'dc-chat-input-container';
    inputContainer.innerHTML = `
        <input type="text" class="dc-chat-input" placeholder="${placeholderText}">
        <button class="dc-send-button" disabled>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        </button>
    `;
    chatWindow.appendChild(inputContainer);
    
    container.appendChild(chatWindow);
    document.body.appendChild(container);
    
    // Funcionalidad
    const chatInput = document.querySelector('.dc-chat-input');
    const sendButton = document.querySelector('.dc-send-button');
    let chatHistory = [];
    
    // Mensaje de bienvenida
    function addWelcomeMessage() {
        const welcomeDiv = document.createElement('div');
        welcomeDiv.className = 'dc-message dc-bot-message';
        welcomeDiv.textContent = welcomeMessage;
        messagesContainer.appendChild(welcomeDiv);
    }
    
    // Mostrar mensaje de carga
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'dc-message dc-bot-message dc-loading';
        loadingDiv.innerHTML = `
            <div class="dc-loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        loadingDiv.id = 'dc-loading-indicator';
        messagesContainer.appendChild(loadingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Ocultar mensaje de carga
    function hideLoading() {
        const loadingDiv = document.getElementById('dc-loading-indicator');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
    
    // Añadir un mensaje al chat
    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'dc-message dc-user-message' : 'dc-message dc-bot-message';
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Enviar pregunta al servidor
    async function sendQuestion(question) {
        try {
            showLoading();
            
            const response = await fetch('{{BASE_URL}}/api/ask-question/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    question: question,
                    document_id: "{{DOCUMENT_ID}}",
                    chat_history: chatHistory
                })
            });
            
            hideLoading();
            
            if (response.ok) {
                const data = await response.json();
                addMessage(data.answer);
                
                // Añadir a historial
                chatHistory.push({
                    question: question,
                    answer: data.answer
                });
                
                // Mantener historial manejable
                if (chatHistory.length > 10) {
                    chatHistory.shift();
                }
            } else {
                const error = await response.json();
                addMessage('Lo siento, hubo un problema al procesar tu pregunta.');
                console.error('Error:', error);
            }
        } catch (error) {
            hideLoading();
            addMessage('Lo siento, no pude conectarme con el servidor. Por favor intenta de nuevo más tarde.');
            console.error('Error:', error);
        }
    }
    
    // Event listeners
    chatButton.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
        chatButton.style.display = 'none';
        
        // Si no hay mensajes, añadir mensaje de bienvenida
        if (messagesContainer.children.length === 0) {
            addWelcomeMessage();
        }
        
        chatInput.focus();
    });
    
    document.querySelector('.dc-chat-close').addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatButton.style.display = 'flex';
    });
    
    chatInput.addEventListener('input', () => {
        sendButton.disabled = chatInput.value.trim() === '';
    });
    
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const question = chatInput.value.trim();
            addMessage(question, true);
            chatInput.value = '';
            sendButton.disabled = true;
            sendQuestion(question);
        }
    });
    
    sendButton.addEventListener('click', () => {
        if (chatInput.value.trim() !== '') {
            const question = chatInput.value.trim();
            addMessage(question, true);
            chatInput.value = '';
            sendButton.disabled = true;
            sendQuestion(question);
        }
    });
})();
