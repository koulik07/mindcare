// Mood Tracker JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeMoodTracker();
    setupMoodSelector();
    setupPeriodSelector();
    loadMoodChart();
    loadRecentEntries();
    generateInsights();
});

function initializeMoodTracker() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    // Set today's date
    const today = new Date();
    document.getElementById('todayDate').textContent = today.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Check if mood already logged today
    checkTodaysMood();
}

function setupMoodSelector() {
    const moodOptions = document.querySelectorAll('.mood-option');
    moodOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            moodOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to selected option
            this.classList.add('active');
            
            // Show note section
            document.getElementById('moodNoteSection').style.display = 'block';
            
            // Store selected mood
            const mood = this.dataset.mood;
            const label = this.dataset.label;
            document.getElementById('moodNoteSection').dataset.selectedMood = mood;
            document.getElementById('moodNoteSection').dataset.selectedLabel = label;
        });
    });
    
    // Setup mood tags
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

function setupPeriodSelector() {
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(button => {
        button.addEventListener('click', function() {
            periodButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const period = parseInt(this.dataset.period);
            loadMoodChart(period);
        });
    });
}

function saveMoodEntry() {
    const noteSection = document.getElementById('moodNoteSection');
    const mood = parseInt(noteSection.dataset.selectedMood);
    const label = noteSection.dataset.selectedLabel;
    const note = document.getElementById('moodNote').value;
    
    // Get selected tags
    const selectedTags = Array.from(document.querySelectorAll('.tag.active'))
        .map(tag => tag.dataset.tag);
    
    const entry = {
        date: new Date().toISOString().split('T')[0],
        mood: mood,
        label: label,
        note: note,
        tags: selectedTags,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const moodEntries = getMoodEntries();
    
    // Remove existing entry for today if any
    const today = entry.date;
    const filteredEntries = moodEntries.filter(e => e.date !== today);
    filteredEntries.push(entry);
    
    localStorage.setItem('moodEntries', JSON.stringify(filteredEntries));
    
    // Show success message
    showAlert('Mood entry saved successfully! 🎉', 'success');
    
    // Refresh displays
    loadMoodChart();
    loadRecentEntries();
    generateInsights();
    
    // Hide note section and reset form
    document.getElementById('moodNoteSection').style.display = 'none';
    document.getElementById('moodNote').value = '';
    document.querySelectorAll('.mood-option').forEach(opt => opt.classList.remove('active'));
    document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active'));
}

function getMoodEntries() {
    return JSON.parse(localStorage.getItem('moodEntries') || '[]');
}

function checkTodaysMood() {
    const today = new Date().toISOString().split('T')[0];
    const moodEntries = getMoodEntries();
    const todayEntry = moodEntries.find(entry => entry.date === today);
    
    if (todayEntry) {
        // Show that mood is already logged
        const checkinCard = document.querySelector('.mood-checkin-card');
        checkinCard.innerHTML = `
            <h2>Today's Mood Logged ✅</h2>
            <p class="checkin-date">${new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</p>
            <div class="logged-mood">
                <span class="logged-emoji">${getMoodEmoji(todayEntry.mood)}</span>
                <span class="logged-label">${todayEntry.label}</span>
            </div>
            ${todayEntry.note ? `<p class="logged-note">"${todayEntry.note}"</p>` : ''}
            <button class="btn-secondary" onclick="updateTodaysMood()">Update Today's Mood</button>
        `;
    }
}

function updateTodaysMood() {
    location.reload(); // Simple way to reset the form
}

function getMoodEmoji(mood) {
    const emojis = ['', '😢', '😞', '😐', '😊', '😄'];
    return emojis[mood] || '😐';
}

function loadMoodChart(days = 7) {
    const canvas = document.getElementById('moodCanvas');
    const ctx = canvas.getContext('2d');
    const moodEntries = getMoodEntries();
    
    // Get data for the specified period
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    const chartData = [];
    const labels = [];
    
    for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const entry = moodEntries.find(e => e.date === dateStr);
        chartData.push(entry ? entry.mood : null);
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw chart
    drawMoodChart(ctx, chartData, labels, canvas.width, canvas.height);
    
    // Update stats
    updateMoodStats(moodEntries, days);
}

function drawMoodChart(ctx, data, labels, width, height) {
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;
    
    // Set up chart area
    ctx.strokeStyle = '#e1e5e9';
    ctx.lineWidth = 1;
    
    // Draw grid lines
    for (let i = 1; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * (5 - i);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw mood line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    let firstPoint = true;
    for (let i = 0; i < data.length; i++) {
        if (data[i] !== null) {
            const x = padding + (chartWidth / (data.length - 1)) * i;
            const y = padding + chartHeight - (chartHeight / 5) * data[i];
            
            if (firstPoint) {
                ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                ctx.lineTo(x, y);
            }
            
            // Draw point
            ctx.fillStyle = '#667eea';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < labels.length; i++) {
        const x = padding + (chartWidth / (labels.length - 1)) * i;
        ctx.fillText(labels[i], x, height - 10);
    }
    
    // Draw mood scale labels
    ctx.textAlign = 'right';
    const moodLabels = ['😢', '😞', '😐', '😊', '😄'];
    for (let i = 0; i < 5; i++) {
        const y = padding + (chartHeight / 5) * (4 - i) + 5;
        ctx.fillText(moodLabels[i], padding - 10, y);
    }
}

function updateMoodStats(entries, days) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days + 1);
    
    const periodEntries = entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= startDate && entryDate <= endDate;
    });
    
    // Calculate average mood
    const avgMood = periodEntries.length > 0 
        ? (periodEntries.reduce((sum, entry) => sum + entry.mood, 0) / periodEntries.length).toFixed(1)
        : 0;
    
    // Find best day
    const bestEntry = periodEntries.reduce((best, entry) => 
        !best || entry.mood > best.mood ? entry : best, null);
    const bestDay = bestEntry 
        ? new Date(bestEntry.date).toLocaleDateString('en-US', { weekday: 'short' })
        : '-';
    
    // Calculate good days streak
    let streak = 0;
    const sortedEntries = entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    for (const entry of sortedEntries) {
        if (entry.mood >= 4) {
            streak++;
        } else {
            break;
        }
    }
    
    // Update UI
    document.getElementById('avgMood').textContent = avgMood;
    document.getElementById('bestDay').textContent = bestDay;
    document.getElementById('streakDays').textContent = streak;
}

function loadRecentEntries() {
    const entries = getMoodEntries();
    const recentEntries = entries
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);
    
    const entriesList = document.getElementById('entriesList');
    
    if (recentEntries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries">No mood entries yet. Start tracking your mood today!</p>';
        return;
    }
    
    entriesList.innerHTML = recentEntries.map(entry => `
        <div class="entry-item">
            <div class="entry-date">
                <span class="entry-emoji">${getMoodEmoji(entry.mood)}</span>
                <div class="entry-info">
                    <span class="entry-day">${new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                    <span class="entry-full-date">${new Date(entry.date).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="entry-content">
                <span class="entry-mood">${entry.label}</span>
                ${entry.note ? `<p class="entry-note">${entry.note}</p>` : ''}
                ${entry.tags.length > 0 ? `
                    <div class="entry-tags">
                        ${entry.tags.map(tag => `<span class="entry-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function generateInsights() {
    const entries = getMoodEntries();
    const insightContent = document.getElementById('insightContent');
    
    if (entries.length < 3) {
        insightContent.innerHTML = `
            <p>Keep tracking your mood daily to unlock personalized insights! 📊</p>
            <p>After a few entries, you'll see patterns and helpful tips.</p>
        `;
        return;
    }
    
    // Analyze patterns
    const avgMood = entries.reduce((sum, entry) => sum + entry.mood, 0) / entries.length;
    const recentAvg = entries.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(7, entries.length);
    
    let insight = '';
    if (recentAvg > avgMood + 0.5) {
        insight = "🎉 Great news! Your mood has been improving lately. Keep up the positive momentum!";
    } else if (recentAvg < avgMood - 0.5) {
        insight = "💙 Your mood seems lower recently. Consider reaching out to a counselor or trying some self-care activities.";
    } else {
        insight = "📈 Your mood has been stable. Consistency is great for mental health!";
    }
    
    // Tag analysis
    const tagCounts = {};
    entries.forEach(entry => {
        entry.tags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });
    });
    
    const mostCommonTag = Object.keys(tagCounts).reduce((a, b) => 
        tagCounts[a] > tagCounts[b] ? a : b, null);
    
    if (mostCommonTag) {
        insight += ` Your most common mood factor is "${mostCommonTag}". Consider focusing on this area.`;
    }
    
    insightContent.innerHTML = `<p>${insight}</p>`;
}

function showAlert(message, type) {
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
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
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}
