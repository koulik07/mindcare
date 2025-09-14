// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    setupEmojiReactions();
    updateDateTime();
    
    // Update time every minute
    setInterval(updateDateTime, 60000);
});

function initializeDashboard() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Update greeting and user info
    updateGreeting();
    updateUserInfo();
}

function updateGreeting() {
    const userName = localStorage.getItem('userName') || 'Student';
    const greetingElement = document.getElementById('greetingMessage');
    
    if (greetingElement) {
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = 'Good Morning';
        } else if (hour < 17) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        
        greetingElement.textContent = `${greeting}, ${userName}!`;
    }
}

function updateDateTime() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

function updateUserInfo() {
    const userName = localStorage.getItem('userName') || 'Student';
    const userEmail = localStorage.getItem('userEmail') || 'student@college.edu';
    
    // Update profile elements if they exist
    const userNameElements = document.querySelectorAll('#userName');
    const userEmailElements = document.querySelectorAll('#userEmail');
    
    userNameElements.forEach(el => el.textContent = userName);
    userEmailElements.forEach(el => el.textContent = userEmail);
}

function setupEmojiReactions() {
    const emojiButtons = document.querySelectorAll('.emoji-btn');
    
    emojiButtons.forEach(button => {
        button.addEventListener('click', function() {
            const emoji = this.dataset.emoji;
            reactWithEmoji(emoji);
        });
    });
}

function reactWithEmoji(emoji) {
    // Create floating emoji animation
    const emojiFloat = document.createElement('div');
    emojiFloat.textContent = emoji;
    emojiFloat.style.cssText = `
        position: fixed;
        font-size: 2rem;
        pointer-events: none;
        z-index: 1000;
        animation: floatUp 2s ease-out forwards;
    `;
    
    // Position randomly around the inspiration card
    const inspirationCard = document.querySelector('.inspiration-card');
    const rect = inspirationCard.getBoundingClientRect();
    emojiFloat.style.left = (rect.left + Math.random() * rect.width) + 'px';
    emojiFloat.style.top = (rect.top + rect.height / 2) + 'px';
    
    document.body.appendChild(emojiFloat);
    
    // Remove after animation
    setTimeout(() => {
        emojiFloat.remove();
    }, 2000);
    
    // Store reaction in localStorage
    const reactions = JSON.parse(localStorage.getItem('dailyReactions') || '{}');
    const today = new Date().toDateString();
    if (!reactions[today]) reactions[today] = [];
    reactions[today].push(emoji);
    localStorage.setItem('dailyReactions', JSON.stringify(reactions));
}

function navigateTo(page) {
    window.location.href = page;
}

// Daily inspiration quotes
const inspirationQuotes = [
    "Every day is a new opportunity to grow and learn. You've got this! 💪",
    "Your mental health matters. Take time to care for yourself today. 🌟",
    "Progress, not perfection. Every small step counts. 🚀",
    "You are stronger than you think and braver than you feel. ❤️",
    "It's okay to not be okay. Seeking help is a sign of strength. 🤗",
    "Your journey is unique. Don't compare your chapter 1 to someone else's chapter 20. 📖",
    "Breathe in peace, breathe out stress. You're doing great! 🧘‍♀️",
    "Every storm runs out of rain. This too shall pass. 🌈",
    "You are worthy of love, support, and happiness. 💝",
    "Small steps every day lead to big changes over time. 🌱"
];

function updateDailyInspiration() {
    const inspirationText = document.getElementById('inspirationText');
    if (inspirationText) {
        const today = new Date().getDate();
        const quote = inspirationQuotes[today % inspirationQuotes.length];
        inspirationText.textContent = quote;
    }
}

// Add CSS for emoji animation
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Update inspiration on load
updateDailyInspiration();
