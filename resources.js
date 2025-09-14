// Resources JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeResources();
    setupResourceFilters();
    setupResourceActions();
});

function initializeResources() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Show all resources by default
    filterResources('all');
}

function setupResourceFilters() {
    const filterButtons = document.querySelectorAll('.category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.textContent.toLowerCase();
            filterResources(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupResourceActions() {
    // Setup featured video click
    const featuredVideo = document.querySelector('.video-card');
    if (featuredVideo) {
        featuredVideo.addEventListener('click', function() {
            openResource('featured-video');
        });
    }
    
    // Setup play button
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.addEventListener('click', function(e) {
            e.stopPropagation();
            openResource('featured-video');
        });
    }
}

function filterResources(category) {
    const resourceItems = document.querySelectorAll('.resource-item');
    
    resourceItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Update results count
    updateResultsCount(category);
}

function updateResultsCount(category) {
    const visibleItems = document.querySelectorAll('.resource-item[style*="flex"], .resource-item:not([style])');
    const totalVisible = Array.from(visibleItems).filter(item => {
        return category === 'all' || item.dataset.category === category;
    }).length;
    
    // You could add a results counter here if needed
    console.log(`Showing ${totalVisible} resources for category: ${category}`);
}

function openResource(resourceId) {
    // Track resource access
    trackResourceAccess(resourceId);
    
    // Handle different resource types
    switch(resourceId) {
        case 'featured-video':
            openVideo('Understanding Anxiety: 5 Coping Strategies');
            break;
        case 'article1':
            openArticle('Managing Stress During Exam Season');
            break;
        case 'article2':
            openArticle('Building Healthy Sleep Habits');
            break;
        case 'article3':
            openArticle('Dealing with Homesickness');
            break;
        case 'video1':
            openVideo('Mindfulness Meditation for Students');
            break;
        case 'video2':
            openVideo('Breathing Exercises for Anxiety Relief');
            break;
        case 'video3':
            openVideo('Building Confidence and Self-Esteem');
            break;
        case 'guide1':
            downloadGuide('Complete Guide to Time Management');
            break;
        case 'guide2':
            downloadGuide('Social Anxiety Toolkit');
            break;
        default:
            showAlert('Resource not found', 'error');
    }
}

function openVideo(title) {
    // Create modal for video
    const modal = createResourceModal('video', title);
    document.body.appendChild(modal);
    
    // Simulate video content
    const videoContent = `
        <div style="text-align: center; padding: 40px;">
            <div style="width: 100%; height: 300px; background: #000; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <div style="color: white; font-size: 3rem;">▶️</div>
            </div>
            <h3>${title}</h3>
            <p style="color: #666; margin-top: 10px;">This video would provide helpful guidance and techniques for mental health support.</p>
            <div style="margin-top: 20px;">
                <button onclick="closeResourceModal()" class="btn-primary">Close</button>
            </div>
        </div>
    `;
    
    modal.querySelector('.modal-body').innerHTML = videoContent;
}

function openArticle(title) {
    // Create modal for article
    const modal = createResourceModal('article', title);
    document.body.appendChild(modal);
    
    // Simulate article content
    const articleContent = `
        <div style="padding: 30px; line-height: 1.6;">
            <h2>${title}</h2>
            <div style="color: #666; margin-bottom: 20px; font-size: 0.9rem;">
                📖 Article • 5 min read
            </div>
            <div style="border-left: 4px solid #667eea; padding-left: 20px; margin: 20px 0; background: #f8f9ff; padding: 15px;">
                <p><strong>Key Takeaway:</strong> This article provides evidence-based strategies and practical tips to help students manage their mental health effectively.</p>
            </div>
            <p>This comprehensive article would contain detailed information, research-backed strategies, and practical exercises to help students improve their mental well-being.</p>
            <h3 style="margin-top: 30px; color: #333;">Key Points Covered:</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
                <li>Understanding the root causes</li>
                <li>Practical coping strategies</li>
                <li>When to seek professional help</li>
                <li>Building long-term resilience</li>
            </ul>
            <div style="margin-top: 30px; text-align: center;">
                <button onclick="closeResourceModal()" class="btn-primary">Close</button>
            </div>
        </div>
    `;
    
    modal.querySelector('.modal-body').innerHTML = articleContent;
}

function downloadGuide(title) {
    // Simulate guide download
    showAlert(`Downloading "${title}"...`, 'success');
    
    // In a real app, this would trigger an actual download
    setTimeout(() => {
        showAlert('Guide downloaded successfully!', 'success');
    }, 2000);
    
    // Track download
    trackResourceAccess(`guide-${title.toLowerCase().replace(/\s+/g, '-')}`);
}

function createResourceModal(type, title) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.id = 'resourceModal';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="close-btn" onclick="closeResourceModal()">&times;</button>
            </div>
            <div class="modal-body">
                <!-- Content will be inserted here -->
            </div>
        </div>
    `;
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeResourceModal();
        }
    });
    
    return modal;
}

function closeResourceModal() {
    const modal = document.getElementById('resourceModal');
    if (modal) {
        modal.remove();
    }
}

function trackResourceAccess(resourceId) {
    const accessLog = JSON.parse(localStorage.getItem('resourceAccess') || '{}');
    const today = new Date().toDateString();
    
    if (!accessLog[today]) {
        accessLog[today] = [];
    }
    
    accessLog[today].push({
        resourceId,
        timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('resourceAccess', JSON.stringify(accessLog));
    
    // Update user stats
    updateResourceStats();
}

function updateResourceStats() {
    const accessLog = JSON.parse(localStorage.getItem('resourceAccess') || '{}');
    const totalAccessed = Object.values(accessLog).flat().length;
    
    // Update stats in profile if elements exist
    const statElements = document.querySelectorAll('[data-stat="resources"]');
    statElements.forEach(el => {
        el.textContent = totalAccessed;
    });
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

// Initialize resource stats on load
updateResourceStats();
