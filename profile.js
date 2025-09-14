// Profile JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    setupSettingsMenu();
    updateProfileStats();
});

function initializeProfile() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    loadUserProfile();
}

function loadUserProfile() {
    const userEmail = localStorage.getItem('userEmail') || 'student@university.edu';
    const userName = localStorage.getItem('userName') || extractNameFromEmail(userEmail);
    const joinDate = localStorage.getItem('joinDate') || new Date().toLocaleDateString();
    
    // Update profile information
    const profileName = document.querySelector('.profile-name');
    const profileEmail = document.querySelector('.profile-email');
    const profileJoinDate = document.querySelector('.join-date');
    
    if (profileName) profileName.textContent = userName;
    if (profileEmail) profileEmail.textContent = userEmail;
    if (profileJoinDate) profileJoinDate.textContent = `Joined ${joinDate}`;
}

function extractNameFromEmail(email) {
    const username = email.split('@')[0];
    return username.charAt(0).toUpperCase() + username.slice(1);
}

function setupSettingsMenu() {
    // Setup settings menu items
    const settingsItems = document.querySelectorAll('.settings-item');
    settingsItems.forEach(item => {
        item.addEventListener('click', function() {
            const action = this.dataset.action;
            handleSettingsAction(action);
        });
    });
}

function handleSettingsAction(action) {
    switch(action) {
        case 'edit-profile':
            showEditProfileModal();
            break;
        case 'notifications':
            showNotificationSettings();
            break;
        case 'privacy':
            showPrivacySettings();
            break;
        case 'help':
            showHelp();
            break;
        case 'about':
            showAbout();
            break;
        case 'logout':
            logout(); // Use the logout function from auth.js
            break;
        default:
            showAlert('Feature not implemented yet', 'info');
    }
}

function showEditProfileModal() {
    const modal = createModal('Edit Profile', `
        <form id="editProfileForm">
            <div class="form-group">
                <label for="editName">Display Name</label>
                <input type="text" id="editName" name="name" value="${localStorage.getItem('userName') || ''}" required>
            </div>
            <div class="form-group">
                <label for="editEmail">Email</label>
                <input type="email" id="editEmail" name="email" value="${localStorage.getItem('userEmail') || ''}" required>
            </div>
            <div class="form-group">
                <label for="editBio">Bio (Optional)</label>
                <textarea id="editBio" name="bio" placeholder="Tell us about yourself...">${localStorage.getItem('userBio') || ''}</textarea>
            </div>
            <div class="modal-actions">
                <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Save Changes</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('editProfileForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        localStorage.setItem('userName', formData.get('name'));
        localStorage.setItem('userEmail', formData.get('email'));
        localStorage.setItem('userBio', formData.get('bio'));
        
        loadUserProfile();
        closeModal();
        showAlert('Profile updated successfully!', 'success');
    });
}

function showNotificationSettings() {
    const currentSettings = JSON.parse(localStorage.getItem('notificationSettings') || '{}');
    
    const modal = createModal('Notification Settings', `
        <form id="notificationForm">
            <div class="settings-section">
                <h3>Email Notifications</h3>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="emailAppointments" ${currentSettings.emailAppointments ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Appointment reminders</span>
                </div>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="emailForum" ${currentSettings.emailForum ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Forum replies</span>
                </div>
            </div>
            <div class="settings-section">
                <h3>Push Notifications</h3>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="pushChat" ${currentSettings.pushChat ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Chat messages</span>
                </div>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="pushDaily" ${currentSettings.pushDaily ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Daily inspiration</span>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Save Settings</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('notificationForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const settings = {
            emailAppointments: formData.has('emailAppointments'),
            emailForum: formData.has('emailForum'),
            pushChat: formData.has('pushChat'),
            pushDaily: formData.has('pushDaily')
        };
        
        localStorage.setItem('notificationSettings', JSON.stringify(settings));
        closeModal();
        showAlert('Notification settings saved!', 'success');
    });
}

function showPrivacySettings() {
    const currentSettings = JSON.parse(localStorage.getItem('privacySettings') || '{}');
    
    const modal = createModal('Privacy Settings', `
        <form id="privacyForm">
            <div class="settings-section">
                <h3>Profile Visibility</h3>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="profilePublic" ${currentSettings.profilePublic !== false ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Make profile visible to other students</span>
                </div>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="showActivity" ${currentSettings.showActivity ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Show activity status</span>
                </div>
            </div>
            <div class="settings-section">
                <h3>Data Sharing</h3>
                <div class="setting-item">
                    <label class="toggle-switch">
                        <input type="checkbox" name="shareAnalytics" ${currentSettings.shareAnalytics ? 'checked' : ''}>
                        <span class="slider"></span>
                    </label>
                    <span>Share anonymous usage data</span>
                </div>
            </div>
            <div class="modal-actions">
                <button type="button" onclick="closeModal()" class="btn-secondary">Cancel</button>
                <button type="submit" class="btn-primary">Save Settings</button>
            </div>
        </form>
    `);
    
    document.body.appendChild(modal);
    
    // Handle form submission
    const form = document.getElementById('privacyForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const settings = {
            profilePublic: formData.has('profilePublic'),
            showActivity: formData.has('showActivity'),
            shareAnalytics: formData.has('shareAnalytics')
        };
        
        localStorage.setItem('privacySettings', JSON.stringify(settings));
        closeModal();
        showAlert('Privacy settings saved!', 'success');
    });
}

function showHelp() {
    const modal = createModal('Help & Support', `
        <div class="help-content">
            <div class="help-section">
                <h3>🚀 Getting Started</h3>
                <p>Welcome to MindCare! Here's how to make the most of our platform:</p>
                <ul>
                    <li>Book appointments with counselors</li>
                    <li>Chat with our AI support assistant</li>
                    <li>Access mental health resources</li>
                    <li>Connect with other students in the forum</li>
                </ul>
            </div>
            <div class="help-section">
                <h3>📞 Contact Support</h3>
                <p>Need help? We're here for you:</p>
                <ul>
                    <li>Email: support@mindcare.edu</li>
                    <li>Phone: 1-800-MINDCARE</li>
                    <li>Emergency: 988 (Suicide & Crisis Lifeline)</li>
                </ul>
            </div>
            <div class="help-section">
                <h3>🔒 Privacy & Safety</h3>
                <p>Your privacy and safety are our top priorities. All conversations are confidential and secure.</p>
            </div>
            <div class="modal-actions">
                <button onclick="closeModal()" class="btn-primary">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function showAbout() {
    const modal = createModal('About MindCare', `
        <div class="about-content">
            <div class="about-section">
                <h3>🌟 Our Mission</h3>
                <p>MindCare is dedicated to supporting student mental health and well-being through accessible, comprehensive resources and community support.</p>
            </div>
            <div class="about-section">
                <h3>🎯 What We Offer</h3>
                <ul>
                    <li>Professional counseling appointments</li>
                    <li>24/7 AI chat support</li>
                    <li>Curated mental health resources</li>
                    <li>Peer support community forum</li>
                    <li>Daily inspiration and wellness tips</li>
                </ul>
            </div>
            <div class="about-section">
                <h3>📱 Version Information</h3>
                <p>MindCare Web App v1.0.0<br>
                Built with care for students, by students.</p>
            </div>
            <div class="modal-actions">
                <button onclick="closeModal()" class="btn-primary">Close</button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

function updateProfileStats() {
    // Get stats from various sources
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const resourceAccess = JSON.parse(localStorage.getItem('resourceAccess') || '{}');
    const forumPosts = JSON.parse(localStorage.getItem('forumPosts') || '[]');
    const userName = localStorage.getItem('userName') || 'Anonymous Student';
    
    // Calculate stats
    const totalAppointments = appointments.length;
    const totalResourcesRead = Object.values(resourceAccess).flat().length;
    const userForumPosts = forumPosts.filter(post => post.author === userName).length;
    
    // Update stat elements
    const appointmentStat = document.querySelector('[data-stat="appointments"]');
    const resourceStat = document.querySelector('[data-stat="resources"]');
    const forumStat = document.querySelector('[data-stat="forum"]');
    
    if (appointmentStat) appointmentStat.textContent = totalAppointments;
    if (resourceStat) resourceStat.textContent = totalResourcesRead;
    if (forumStat) forumStat.textContent = userForumPosts;
}

function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'profileModal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
        </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    return modal;
}

function closeModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.remove();
    }
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
    } else if (type === 'info') {
        alert.style.background = '#17a2b8';
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
