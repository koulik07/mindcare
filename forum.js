// Forum JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeForum();
    setupForumFilters();
    setupNewPostModal();
});

function initializeForum() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    loadForumPosts();
    filterForum('all');
}

function setupForumFilters() {
    const filterButtons = document.querySelectorAll('.forum-categories .category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.textContent.toLowerCase();
            filterForum(category);
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function setupNewPostModal() {
    const newPostForm = document.getElementById('newPostForm');
    if (newPostForm) {
        newPostForm.addEventListener('submit', handleNewPost);
    }
}

function filterForum(category) {
    const forumPosts = document.querySelectorAll('.forum-post');
    
    forumPosts.forEach(post => {
        const postCategory = post.dataset.category;
        
        if (category === 'all' || postCategory === category) {
            post.style.display = 'block';
        } else {
            post.style.display = 'none';
        }
    });
}

function showNewPostModal() {
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.classList.add('active');
        modal.style.display = 'flex';
    }
}

function closeNewPostModal() {
    const modal = document.getElementById('newPostModal');
    if (modal) {
        modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Reset form
        const form = document.getElementById('newPostForm');
        if (form) {
            form.reset();
        }
    }
}

function handleNewPost(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const postData = {
        id: Date.now(),
        category: formData.get('category'),
        title: formData.get('title'),
        content: formData.get('content'),
        author: localStorage.getItem('userName') || 'Anonymous Student',
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: 0
    };
    
    // Validation
    if (!postData.category || !postData.title || !postData.content) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    // Save post
    saveForumPost(postData);
    
    // Add post to UI
    addPostToForum(postData);
    
    // Close modal
    closeNewPostModal();
    
    // Show success message
    showAlert('Post created successfully!', 'success');
    
    // Update forum stats
    updateForumStats();
}

function saveForumPost(post) {
    const forumPosts = getForumPosts();
    forumPosts.unshift(post); // Add to beginning
    localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
}

function getForumPosts() {
    return JSON.parse(localStorage.getItem('forumPosts') || '[]');
}

function loadForumPosts() {
    const savedPosts = getForumPosts();
    const forumContainer = document.getElementById('forumPosts');
    
    // Add saved posts to the beginning
    savedPosts.forEach(post => {
        const postElement = createPostElement(post);
        forumContainer.insertBefore(postElement, forumContainer.firstChild);
    });
}

function addPostToForum(postData) {
    const forumContainer = document.getElementById('forumPosts');
    const postElement = createPostElement(postData);
    forumContainer.insertBefore(postElement, forumContainer.firstChild);
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'forum-post';
    postDiv.dataset.category = post.category;
    
    const timeAgo = getTimeAgo(new Date(post.timestamp));
    
    postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-user">
                <span class="user-avatar">👤</span>
                <div class="user-info">
                    <h4>${post.author}</h4>
                    <span class="post-time">${timeAgo}</span>
                </div>
            </div>
            <span class="post-category ${post.category}">${post.category.charAt(0).toUpperCase() + post.category.slice(1)}</span>
        </div>
        <div class="post-content">
            <h3>${post.title}</h3>
            <p>${post.content}</p>
        </div>
        <div class="post-actions">
            <button class="action-btn" onclick="likePost(${post.id})">
                <span>👍</span> <span id="likes-${post.id}">${post.likes}</span>
            </button>
            <button class="action-btn" onclick="showComments(${post.id})">
                <span>💬</span> <span id="replies-${post.id}">${post.replies}</span> replies
            </button>
            <button class="action-btn" onclick="sharePost(${post.id})">
                <span>📤</span> Share
            </button>
        </div>
    `;
    
    return postDiv;
}

function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

function likePost(postId) {
    // Get current likes from localStorage
    const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
    const likesElement = document.getElementById(`likes-${postId}`);
    
    if (likedPosts.includes(postId)) {
        // Unlike
        const index = likedPosts.indexOf(postId);
        likedPosts.splice(index, 1);
        const currentLikes = parseInt(likesElement.textContent);
        likesElement.textContent = currentLikes - 1;
        showAlert('Post unliked', 'info');
    } else {
        // Like
        likedPosts.push(postId);
        const currentLikes = parseInt(likesElement.textContent);
        likesElement.textContent = currentLikes + 1;
        showAlert('Post liked!', 'success');
        
        // Add like animation
        animateLike(likesElement.parentElement);
    }
    
    localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    
    // Update forum posts data
    updatePostLikes(postId, parseInt(likesElement.textContent));
}

function animateLike(button) {
    button.style.transform = 'scale(1.2)';
    button.style.color = '#667eea';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        button.style.color = '';
    }, 200);
}

function updatePostLikes(postId, newLikeCount) {
    const forumPosts = getForumPosts();
    const postIndex = forumPosts.findIndex(post => post.id === postId);
    
    if (postIndex !== -1) {
        forumPosts[postIndex].likes = newLikeCount;
        localStorage.setItem('forumPosts', JSON.stringify(forumPosts));
    }
}

function showComments(postId) {
    showAlert('Comments feature would open a detailed view with replies', 'info');
    // In a real app, this would open a detailed post view with comments
}

function sharePost(postId) {
    // Simulate sharing
    if (navigator.share) {
        navigator.share({
            title: 'MindCare Forum Post',
            text: 'Check out this helpful post from the MindCare community',
            url: window.location.href
        });
    } else {
        // Fallback for browsers without native sharing
        navigator.clipboard.writeText(window.location.href).then(() => {
            showAlert('Post link copied to clipboard!', 'success');
        }).catch(() => {
            showAlert('Sharing feature not available', 'error');
        });
    }
}

function updateForumStats() {
    const forumPosts = getForumPosts();
    const userPosts = forumPosts.filter(post => 
        post.author === (localStorage.getItem('userName') || 'Anonymous Student')
    );
    
    // Update stats in profile if elements exist
    const statElements = document.querySelectorAll('[data-stat="forum"]');
    statElements.forEach(el => {
        el.textContent = userPosts.length;
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

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('newPostModal');
    if (modal && e.target === modal) {
        closeNewPostModal();
    }
});

// Initialize forum stats on load
updateForumStats();
