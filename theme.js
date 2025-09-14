// Theme Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
});

function initializeTheme() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
    updateThemeToggle(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
    
    // Show theme change notification
    showThemeNotification(newTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

function updateThemeToggle(theme) {
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
}

function showThemeNotification(theme) {
    const notification = document.createElement('div');
    notification.className = 'theme-notification';
    notification.innerHTML = `
        <span>${theme === 'dark' ? '🌙' : '☀️'}</span>
        <span>${theme === 'dark' ? 'Dark' : 'Light'} mode activated</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${theme === 'dark' ? '#333' : '#fff'};
        color: ${theme === 'dark' ? '#fff' : '#333'};
        padding: 12px 20px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        font-weight: 500;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Add CSS for dark theme and animations
const themeStyle = document.createElement('style');
themeStyle.textContent = `
    /* Dark Theme Variables */
    :root {
        --bg-primary: #f8f9fa;
        --bg-secondary: #ffffff;
        --text-primary: #333333;
        --text-secondary: #666666;
        --border-color: #e1e5e9;
        --shadow: rgba(0,0,0,0.05);
        --gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .dark-theme {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2d2d2d;
        --text-primary: #ffffff;
        --text-secondary: #cccccc;
        --border-color: #404040;
        --shadow: rgba(0,0,0,0.3);
        --gradient: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
    }
    
    /* Apply theme variables */
    body {
        background-color: var(--bg-primary);
        color: var(--text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .auth-card,
    .dashboard-container,
    .page-container,
    .action-card,
    .recent-activity,
    .appointment-booking,
    .appointment-card,
    .chat-messages .message-content,
    .chat-header,
    .chat-input-container,
    .video-card,
    .resource-item,
    .forum-post,
    .profile-section,
    .stat-card,
    .settings-menu,
    .mood-checkin-card,
    .mood-chart-card,
    .recent-entries-card,
    .mood-insights-card {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-color: var(--border-color);
        box-shadow: 0 4px 6px var(--shadow);
        transition: all 0.3s ease;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea,
    .chat-input input {
        background-color: var(--bg-secondary);
        color: var(--text-primary);
        border-color: var(--border-color);
    }
    
    .bottom-nav {
        background-color: var(--bg-secondary);
        border-color: var(--border-color);
    }
    
    .inspiration-card {
        background: var(--gradient);
    }
    
    .theme-toggle {
        background: var(--bg-secondary);
        border: 2px solid var(--border-color);
        color: var(--text-primary);
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.3s ease;
    }
    
    .theme-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px var(--shadow);
    }
    
    /* Dark theme specific adjustments */
    .dark-theme .activity-item {
        background-color: #3a3a3a;
    }
    
    .dark-theme .suggestion-btn {
        background-color: var(--bg-secondary);
        border-color: var(--border-color);
        color: var(--text-primary);
    }
    
    .dark-theme .category-btn {
        background-color: var(--bg-secondary);
        border-color: var(--border-color);
        color: var(--text-primary);
    }
    
    .dark-theme .mood-option {
        background-color: var(--bg-secondary);
        border: 2px solid var(--border-color);
    }
    
    .dark-theme .mood-option.active {
        border-color: #667eea;
        background-color: rgba(102, 126, 234, 0.1);
    }
    
    .dark-theme .tag {
        background-color: #404040;
        color: var(--text-secondary);
    }
    
    .dark-theme .tag.active {
        background-color: #667eea;
        color: white;
    }
    
    /* Animations */
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideUp {
        from {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
        to {
            transform: translateX(-50%) translateY(-100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(themeStyle);
