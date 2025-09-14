// Chat JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeChat();
    setupChatForm();
    setupQuickSuggestions();
});

function initializeChat() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    loadChatHistory();
    scrollToBottom();
}

function setupChatForm() {
    const chatForm = document.getElementById('chatForm');
    if (chatForm) {
        chatForm.addEventListener('submit', handleSendMessage);
    }
    
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
            }
        });
    }
}

function setupQuickSuggestions() {
    const suggestionButtons = document.querySelectorAll('.suggestion-btn');
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.textContent.split(' ').slice(1).join(' '); // Remove emoji
            sendQuickMessage(message);
        });
    });
}

function handleSendMessage(e) {
    e.preventDefault();
    
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Add user message
    addMessage(message, 'user');
    
    // Clear input
    messageInput.value = '';
    
    // Hide suggestions after first message
    const suggestions = document.getElementById('quickSuggestions');
    if (suggestions) {
        suggestions.style.display = 'none';
    }
    
    // Simulate typing indicator
    showTypingIndicator();
    
    // Generate AI response after delay
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage(response, 'bot');
    }, 1500 + Math.random() * 1000);
}

function sendQuickMessage(message) {
    const messageInput = document.getElementById('messageInput');
    messageInput.value = message;
    
    // Trigger send
    const event = new Event('submit');
    document.getElementById('chatForm').dispatchEvent(event);
}

function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'user' ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = text;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    
    content.appendChild(messageText);
    content.appendChild(timestamp);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    
    // Save to chat history
    saveChatMessage({ text, sender, timestamp: new Date().toISOString() });
    
    scrollToBottom();
}

function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message typing-indicator';
    typingDiv.id = 'typing-indicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
    
    // Add typing animation CSS
    if (!document.getElementById('typing-styles')) {
        const style = document.createElement('style');
        style.id = 'typing-styles';
        style.textContent = `
            .typing-dots {
                display: flex;
                gap: 4px;
                padding: 12px 16px;
            }
            .typing-dots span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #666;
                animation: typing 1.4s infinite;
            }
            .typing-dots span:nth-child(2) {
                animation-delay: 0.2s;
            }
            .typing-dots span:nth-child(3) {
                animation-delay: 0.4s;
            }
            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                    opacity: 0.4;
                }
                30% {
                    transform: translateY(-10px);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const responses = {
        stress: [
            "I understand you're feeling stressed. That's completely normal, especially during challenging times. Have you tried any breathing exercises or mindfulness techniques?",
            "Stress can be overwhelming, but you're taking the right step by reaching out. What specific situation is causing you the most stress right now?",
            "It sounds like you're dealing with a lot. Remember that stress is temporary, and there are effective ways to manage it. Would you like some practical coping strategies?"
        ],
        anxiety: [
            "Anxiety can feel very intense, but you're not alone in this. Many students experience anxiety, and it's treatable. What triggers your anxiety the most?",
            "I hear that you're struggling with anxiety. That takes courage to share. Have you noticed any patterns in when your anxiety tends to be worse?",
            "Anxiety is your mind's way of trying to protect you, but sometimes it can be overwhelming. Let's work on some techniques to help you feel more grounded."
        ],
        sleep: [
            "Sleep issues are very common among students. Poor sleep can affect your mood, concentration, and overall well-being. What's your current bedtime routine like?",
            "Getting good sleep is crucial for mental health. Are you having trouble falling asleep, staying asleep, or both?",
            "Sleep problems can create a cycle with stress and anxiety. Let's talk about some sleep hygiene practices that might help."
        ],
        lonely: [
            "Feeling lonely is a very human experience, and it's brave of you to share that. College can sometimes feel isolating even when you're surrounded by people.",
            "Loneliness can be really painful. Remember that feeling lonely doesn't mean you're alone - there are people who care about you and want to help.",
            "Many students struggle with loneliness, especially when adjusting to new environments. What activities or interests do you enjoy?"
        ],
        exam: [
            "Exam stress is incredibly common. It shows you care about your performance, which is positive, but we want to make sure it doesn't become overwhelming.",
            "Preparing for exams can feel daunting. Let's break down some strategies that can help you feel more confident and prepared.",
            "Exam anxiety is very manageable with the right techniques. Have you tried any specific study methods or stress-reduction techniques before?"
        ],
        default: [
            "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what's on your mind?",
            "I appreciate you reaching out. It takes strength to talk about what you're going through. How are you feeling right now?",
            "I'm glad you're here. Remember that seeking support is a sign of strength, not weakness. What would be most helpful for you today?",
            "Your feelings are valid, and you deserve support. I'm here to help you work through whatever you're experiencing.",
            "It sounds like you're going through something challenging. Would you like to talk more about what's been on your mind lately?"
        ]
    };
    
    const lowerMessage = userMessage.toLowerCase();
    let category = 'default';
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('stressed')) {
        category = 'stress';
    } else if (lowerMessage.includes('anxiety') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
        category = 'anxiety';
    } else if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia')) {
        category = 'sleep';
    } else if (lowerMessage.includes('lonely') || lowerMessage.includes('alone') || lowerMessage.includes('isolated')) {
        category = 'lonely';
    } else if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('study')) {
        category = 'exam';
    }
    
    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

function saveChatMessage(message) {
    const chatHistory = getChatHistory();
    chatHistory.push(message);
    
    // Keep only last 50 messages
    if (chatHistory.length > 50) {
        chatHistory.splice(0, chatHistory.length - 50);
    }
    
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

function getChatHistory() {
    return JSON.parse(localStorage.getItem('chatHistory') || '[]');
}

function loadChatHistory() {
    const chatHistory = getChatHistory();
    const chatMessages = document.getElementById('chatMessages');
    
    // Clear existing messages except the initial bot message
    const initialMessage = chatMessages.querySelector('.bot-message');
    chatMessages.innerHTML = '';
    if (initialMessage) {
        chatMessages.appendChild(initialMessage);
    }
    
    // Load recent messages
    chatHistory.slice(-10).forEach(message => {
        addMessageFromHistory(message);
    });
}

function addMessageFromHistory(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = message.sender === 'user' ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const messageText = document.createElement('p');
    messageText.textContent = message.text;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-time';
    timestamp.textContent = new Date(message.timestamp).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    });
    
    content.appendChild(messageText);
    content.appendChild(timestamp);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
}

function scrollToBottom() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
