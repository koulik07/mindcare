// Authentication JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
});

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate authentication (in real app, this would be an API call)
    if (email && password.length >= 6) {
        // Store user session
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', extractNameFromEmail(email));
        
        showAlert('Login successful! Redirecting...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showAlert('Invalid credentials. Please try again.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Password must be at least 6 characters long', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
        showAlert('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate account creation
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', username);
    localStorage.setItem('joinDate', new Date().toLocaleDateString());
    
    showAlert('Account created successfully! Redirecting...', 'success');
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function extractNameFromEmail(email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        alert.style.background = '#28a745';
    } else {
        alert.style.background = '#dc3545';
    }
    
    alert.textContent = message;
    document.body.appendChild(alert);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Check if user is already logged in
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Allow fresh start if URL has ?fresh parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('fresh')) {
        localStorage.clear();
        return;
    }
    
    if (isLoggedIn && (currentPage === 'login.html' || currentPage === 'signup.html' || currentPage === 'index.html')) {
        window.location.href = 'dashboard.html';
    }
    
    if (!isLoggedIn && currentPage !== 'login.html' && currentPage !== 'signup.html' && currentPage !== 'index.html') {
        window.location.href = 'login.html';
    }
}

// Logout function
function logout() {
    localStorage.clear();
    window.location.href = 'login.html';
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Check auth status on page load
checkAuthStatus();
