// Wellness Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthStatus();
    
    // Initialize wellness dashboard
    initializeWellnessDashboard();
    loadWellnessData();
    setupEventListeners();
    drawMoodChart();
});

function initializeWellnessDashboard() {
    console.log('Initializing Wellness Dashboard...');
    
    // Calculate and display wellness score
    calculateWellnessScore();
    
    // Update quick stats
    updateQuickStats();
    
    // Load achievements
    loadAchievements();
    
    // Update streaks and goals
    updateStreaksAndGoals();
    
    // Generate insights
    generateWellnessInsights();
    
    // Check for new achievements
    checkForNewAchievements();
}

function loadWellnessData() {
    // Load existing wellness data from localStorage
    const wellnessData = getWellnessData();
    
    if (!wellnessData.initialized) {
        // Initialize with default data for new users
        initializeDefaultWellnessData();
    }
    
    return wellnessData;
}

function getWellnessData() {
    const defaultData = {
        initialized: false,
        totalActivities: 0,
        mindfulnessMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        moodEntries: [],
        achievements: [],
        goals: [],
        lastActivity: null,
        streaks: {
            dailyCheckin: 0,
            moodLogging: 0,
            breathingPractice: 0,
            journaling: 0
        },
        statistics: {
            weeklyMoodAverage: 0,
            monthlyMoodAverage: 0,
            activitiesThisWeek: 0,
            activitiesThisMonth: 0
        }
    };
    
    const stored = localStorage.getItem('wellnessData');
    return stored ? { ...defaultData, ...JSON.parse(stored) } : defaultData;
}

function saveWellnessData(data) {
    localStorage.setItem('wellnessData', JSON.stringify(data));
}

function initializeDefaultWellnessData() {
    const wellnessData = getWellnessData();
    
    // Add some sample data for demonstration
    wellnessData.initialized = true;
    wellnessData.totalActivities = 28;
    wellnessData.mindfulnessMinutes = 145;
    wellnessData.currentStreak = 12;
    wellnessData.longestStreak = 15;
    
    // Add sample mood entries for the last 30 days
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const mood = Math.floor(Math.random() * 5) + 1; // Random mood 1-5
        wellnessData.moodEntries.push({
            date: date.toISOString().split('T')[0],
            mood: mood,
            timestamp: date.getTime()
        });
    }
    
    // Initialize achievements
    wellnessData.achievements = [
        { id: 'first-mood', earned: true, earnedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'week-streak', earned: true, earnedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'breathing-master', earned: true, earnedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }
    ];
    
    // Initialize goals
    wellnessData.goals = [
        { id: 'mood-logs', target: 5, current: 5, completed: true },
        { id: 'breathing-exercises', target: 3, current: 2, completed: false },
        { id: 'support-group', target: 1, current: 0, completed: false }
    ];
    
    // Initialize streaks
    wellnessData.streaks = {
        dailyCheckin: 12,
        moodLogging: 8,
        breathingPractice: 3,
        journaling: 0
    };
    
    saveWellnessData(wellnessData);
    return wellnessData;
}

function calculateWellnessScore() {
    const wellnessData = getWellnessData();
    
    // Calculate wellness score based on various factors
    let score = 0;
    
    // Mood average (40% of score)
    const recentMoods = wellnessData.moodEntries.slice(-7); // Last 7 days
    if (recentMoods.length > 0) {
        const moodAverage = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
        score += (moodAverage / 5) * 40;
    }
    
    // Activity consistency (30% of score)
    const activitiesThisWeek = wellnessData.activitiesThisWeek || Math.floor(Math.random() * 15) + 10;
    score += Math.min(activitiesThisWeek / 20, 1) * 30;
    
    // Current streak (20% of score)
    score += Math.min(wellnessData.currentStreak / 30, 1) * 20;
    
    // Achievement progress (10% of score)
    const earnedAchievements = wellnessData.achievements.filter(a => a.earned).length;
    const totalAchievements = 6; // Total number of achievements
    score += (earnedAchievements / totalAchievements) * 10;
    
    const finalScore = Math.round(score);
    document.getElementById('wellnessScore').textContent = finalScore;
    
    // Animate the score circle
    animateScoreCircle(finalScore);
    
    return finalScore;
}

function animateScoreCircle(score) {
    const circle = document.querySelector('.score-circle');
    const percentage = score;
    
    // Create a circular progress indicator
    circle.style.background = `conic-gradient(#667eea ${percentage * 3.6}deg, #f0f0f0 0deg)`;
}

function updateQuickStats() {
    const wellnessData = getWellnessData();
    
    // Calculate average mood for last 7 days
    const recentMoods = wellnessData.moodEntries.slice(-7);
    if (recentMoods.length > 0) {
        const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
        document.getElementById('avgMood').textContent = avgMood.toFixed(1);
    }
    
    // Update current streak
    document.getElementById('currentStreak').textContent = wellnessData.currentStreak;
    
    // Update completed activities
    document.getElementById('completedActivities').textContent = wellnessData.totalActivities;
    
    // Update mindfulness minutes
    document.getElementById('mindfulnessMinutes').textContent = wellnessData.mindfulnessMinutes;
    
    // Add trend indicators
    updateTrendIndicators();
}

function updateTrendIndicators() {
    // Add logic to show trend changes (positive/negative)
    const trends = document.querySelectorAll('.stat-trend');
    trends.forEach(trend => {
        const value = parseFloat(trend.textContent);
        if (value > 0) {
            trend.classList.add('positive');
            trend.classList.remove('negative');
        } else if (value < 0) {
            trend.classList.add('negative');
            trend.classList.remove('positive');
        }
    });
}

function loadAchievements() {
    const wellnessData = getWellnessData();
    const achievements = document.querySelectorAll('.achievement-card');
    
    achievements.forEach(card => {
        const achievementId = card.getAttribute('data-achievement');
        const earned = wellnessData.achievements.find(a => a.id === achievementId && a.earned);
        
        if (earned) {
            card.classList.add('earned');
            card.classList.remove('locked');
            
            // Update earned date
            const dateSpan = card.querySelector('.achievement-date');
            if (dateSpan && earned.earnedDate) {
                const earnedDate = new Date(earned.earnedDate);
                const timeAgo = getTimeAgo(earnedDate);
                dateSpan.textContent = `Earned ${timeAgo}`;
            }
        } else {
            card.classList.add('locked');
            card.classList.remove('earned');
            
            // Update progress for locked achievements
            updateAchievementProgress(card, achievementId, wellnessData);
        }
    });
}

function updateAchievementProgress(card, achievementId, wellnessData) {
    const progressSpan = card.querySelector('.achievement-progress');
    if (!progressSpan) return;
    
    let progress = '';
    
    switch (achievementId) {
        case 'month-streak':
            progress = `${wellnessData.currentStreak}/30 days`;
            break;
        case 'mood-tracker-pro':
            progress = `${wellnessData.moodEntries.length}/50 days`;
            break;
        case 'wellness-guru':
            const completedActivities = 6; // Calculate based on actual completion
            progress = `${completedActivities}/8 activities`;
            break;
    }
    
    progressSpan.textContent = progress;
}

function updateStreaksAndGoals() {
    const wellnessData = getWellnessData();
    
    // Update streak items
    const streakItems = document.querySelectorAll('.streak-item');
    streakItems.forEach((item, index) => {
        const streakName = item.querySelector('.streak-name').textContent;
        const streakCount = item.querySelector('.streak-count');
        const streakBar = item.querySelector('.streak-bar');
        
        let days = 0;
        let maxDays = 14; // Default max for progress bar
        
        switch (streakName) {
            case 'Daily Check-in':
                days = wellnessData.streaks.dailyCheckin;
                break;
            case 'Mood Logging':
                days = wellnessData.streaks.moodLogging;
                break;
            case 'Breathing Practice':
                days = wellnessData.streaks.breathingPractice;
                break;
        }
        
        streakCount.textContent = `${days} days`;
        const percentage = Math.min((days / maxDays) * 100, 100);
        streakBar.style.width = `${percentage}%`;
        
        // Add active class for streaks > 0
        if (days > 0) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update goals
    updateGoalsDisplay(wellnessData);
}

function updateGoalsDisplay(wellnessData) {
    const goalItems = document.querySelectorAll('.goal-item');
    
    goalItems.forEach((item, index) => {
        const goal = wellnessData.goals[index];
        if (!goal) return;
        
        const progressSpan = item.querySelector('.goal-progress');
        const icon = item.querySelector('i');
        
        progressSpan.textContent = `${goal.current}/${goal.target}`;
        
        // Update goal status
        item.classList.remove('completed', 'in-progress', 'pending');
        
        if (goal.completed || goal.current >= goal.target) {
            item.classList.add('completed');
            icon.className = 'fas fa-check-circle';
        } else if (goal.current > 0) {
            item.classList.add('in-progress');
            icon.className = 'fas fa-clock';
        } else {
            item.classList.add('pending');
            icon.className = 'fas fa-circle';
        }
    });
}

function generateWellnessInsights() {
    const wellnessData = getWellnessData();
    const insights = [];
    
    // Mood trend insight
    const recentMoods = wellnessData.moodEntries.slice(-7);
    const previousMoods = wellnessData.moodEntries.slice(-14, -7);
    
    if (recentMoods.length > 0 && previousMoods.length > 0) {
        const recentAvg = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length;
        const previousAvg = previousMoods.reduce((sum, entry) => sum + entry.mood, 0) / previousMoods.length;
        const improvement = ((recentAvg - previousAvg) / previousAvg * 100).toFixed(0);
        
        if (improvement > 5) {
            insights.push({
                type: 'positive',
                title: 'Mood Improvement',
                message: `Your mood has improved by ${improvement}% this week. Keep up the great work with your daily practices!`
            });
        }
    }
    
    // Activity pattern insight
    const weekdayActivities = calculateWeekdayActivities(wellnessData);
    if (weekdayActivities.weekdays > weekdayActivities.weekends * 1.5) {
        insights.push({
            type: 'neutral',
            title: 'Consistency Tip',
            message: "You're most active on weekdays. Try setting weekend reminders to maintain your wellness routine."
        });
    }
    
    // Suggestion based on current activities
    if (wellnessData.streaks.breathingPractice > 5 && wellnessData.streaks.journaling === 0) {
        insights.push({
            type: 'suggestion',
            title: 'New Activity Suggestion',
            message: 'Based on your progress, you might enjoy trying meditation. It complements your breathing exercises well.'
        });
    }
    
    // Update insights in the UI
    updateInsightsDisplay(insights);
}

function calculateWeekdayActivities(wellnessData) {
    // Placeholder calculation
    return {
        weekdays: 20,
        weekends: 8
    };
}

function updateInsightsDisplay(insights) {
    const insightCards = document.querySelectorAll('.insight-card');
    
    insights.forEach((insight, index) => {
        if (index < insightCards.length) {
            const card = insightCards[index];
            const title = card.querySelector('h4');
            const message = card.querySelector('p');
            
            title.textContent = insight.title;
            message.textContent = insight.message;
            
            // Update card type
            card.className = `insight-card ${insight.type}`;
        }
    });
}

function drawMoodChart() {
    const canvas = document.getElementById('moodCanvas');
    const ctx = canvas.getContext('2d');
    const wellnessData = getWellnessData();
    
    // Get last 30 days of mood data
    const moodData = wellnessData.moodEntries.slice(-30);
    
    if (moodData.length === 0) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - 2 * padding;
    const chartHeight = canvas.height - 2 * padding;
    
    // Draw axes
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw mood line
    ctx.strokeStyle = '#667eea';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    moodData.forEach((entry, index) => {
        const x = padding + (index / (moodData.length - 1)) * chartWidth;
        const y = padding + chartHeight - (entry.mood / 5) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw data points
    ctx.fillStyle = '#667eea';
    moodData.forEach((entry, index) => {
        const x = padding + (index / (moodData.length - 1)) * chartWidth;
        const y = padding + chartHeight - (entry.mood / 5) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Add labels
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Y-axis labels
    for (let i = 1; i <= 5; i++) {
        const y = padding + chartHeight - (i / 5) * chartHeight;
        ctx.fillText(i.toString(), padding - 20, y + 4);
    }
}

function setupEventListeners() {
    // Quick mood modal
    const quickMoodModal = document.getElementById('quickMoodModal');
    const closeQuickMood = document.getElementById('closeQuickMood');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    
    closeQuickMood.addEventListener('click', () => {
        quickMoodModal.style.display = 'none';
    });
    
    moodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            moodButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            saveMoodBtn.disabled = false;
            saveMoodBtn.setAttribute('data-mood', this.getAttribute('data-mood'));
        });
    });
    
    saveMoodBtn.addEventListener('click', function() {
        const mood = parseInt(this.getAttribute('data-mood'));
        saveQuickMood(mood);
        quickMoodModal.style.display = 'none';
    });
    
    // Edit goals button
    const editGoalsBtn = document.getElementById('editGoalsBtn');
    editGoalsBtn.addEventListener('click', editGoals);
    
    // Achievement cards click handlers
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        card.addEventListener('click', () => showAchievementDetails(card));
    });
}

function logMoodQuick() {
    const modal = document.getElementById('quickMoodModal');
    modal.style.display = 'block';
    
    // Reset modal state
    document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
    document.getElementById('saveMoodBtn').disabled = true;
}

function saveQuickMood(mood) {
    const wellnessData = getWellnessData();
    
    // Add new mood entry
    const today = new Date().toISOString().split('T')[0];
    wellnessData.moodEntries.push({
        date: today,
        mood: mood,
        timestamp: Date.now()
    });
    
    // Update streak
    updateMoodStreak(wellnessData);
    
    // Save data
    saveWellnessData(wellnessData);
    
    // Refresh dashboard
    updateQuickStats();
    calculateWellnessScore();
    drawMoodChart();
    
    // Check for achievements
    checkForNewAchievements();
    
    showAlert('Mood logged successfully!', 'success');
}

function updateMoodStreak(wellnessData) {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const todayEntry = wellnessData.moodEntries.find(entry => entry.date === today);
    const yesterdayEntry = wellnessData.moodEntries.find(entry => entry.date === yesterday);
    
    if (todayEntry && yesterdayEntry) {
        wellnessData.streaks.moodLogging++;
    } else if (todayEntry && !yesterdayEntry) {
        wellnessData.streaks.moodLogging = 1;
    }
}

function startBreathingExercise() {
    localStorage.setItem('quickBreathing', 'true');
    window.location.href = 'breathing-exercises.html';
}

function viewDetailedStats() {
    // Create detailed stats modal or navigate to detailed page
    showAlert('Detailed statistics view coming soon!', 'info');
}

function exportProgress() {
    const wellnessData = getWellnessData();
    
    // Create CSV data
    let csvContent = "Date,Mood,Activities,Mindfulness Minutes\n";
    
    wellnessData.moodEntries.forEach(entry => {
        csvContent += `${entry.date},${entry.mood},1,5\n`;
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindcare-wellness-data.csv';
    a.click();
    
    showAlert('Wellness data exported successfully!', 'success');
}

function editGoals() {
    showAlert('Goal editing feature coming soon!', 'info');
}

function showAchievementDetails(card) {
    const achievementId = card.getAttribute('data-achievement');
    const title = card.querySelector('h4').textContent;
    const description = card.querySelector('p').textContent;
    
    const isEarned = card.classList.contains('earned');
    
    let message = `${title}\n${description}`;
    
    if (isEarned) {
        const earnedDate = card.querySelector('.achievement-date');
        if (earnedDate) {
            message += `\n\n${earnedDate.textContent}`;
        }
    } else {
        const progress = card.querySelector('.achievement-progress');
        if (progress) {
            message += `\n\nProgress: ${progress.textContent}`;
        }
    }
    
    alert(message);
}

function checkForNewAchievements() {
    const wellnessData = getWellnessData();
    const newAchievements = [];
    
    // Check for mood tracker pro achievement
    if (wellnessData.moodEntries.length >= 50) {
        const existing = wellnessData.achievements.find(a => a.id === 'mood-tracker-pro');
        if (!existing || !existing.earned) {
            newAchievements.push({
                id: 'mood-tracker-pro',
                title: 'Mood Tracker Pro',
                description: 'Log mood for 50 days'
            });
        }
    }
    
    // Check for monthly champion achievement
    if (wellnessData.currentStreak >= 30) {
        const existing = wellnessData.achievements.find(a => a.id === 'month-streak');
        if (!existing || !existing.earned) {
            newAchievements.push({
                id: 'month-streak',
                title: 'Monthly Champion',
                description: '30-day activity streak'
            });
        }
    }
    
    // Award new achievements
    newAchievements.forEach(achievement => {
        awardAchievement(achievement, wellnessData);
    });
    
    if (newAchievements.length > 0) {
        saveWellnessData(wellnessData);
        loadAchievements();
    }
}

function awardAchievement(achievement, wellnessData) {
    // Add to earned achievements
    const existingIndex = wellnessData.achievements.findIndex(a => a.id === achievement.id);
    
    if (existingIndex >= 0) {
        wellnessData.achievements[existingIndex].earned = true;
        wellnessData.achievements[existingIndex].earnedDate = new Date().toISOString();
    } else {
        wellnessData.achievements.push({
            id: achievement.id,
            earned: true,
            earnedDate: new Date().toISOString()
        });
    }
    
    // Show achievement notification
    showAchievementNotification(achievement);
}

function showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-content">
            <i class="fas fa-trophy"></i>
            <div>
                <h4>Achievement Unlocked!</h4>
                <p>${achievement.title}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

function getTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `wellness-alert wellness-alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 4000);
    
    // Close button
    alert.querySelector('.alert-close').addEventListener('click', function() {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    });
}

function getAlertIcon(type) {
    switch (type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-triangle';
        case 'warning': return 'exclamation-circle';
        default: return 'info-circle';
    }
}

// Export functions for use by other modules
window.wellnessDashboard = {
    logMood: logMoodQuick,
    updateStats: updateQuickStats,
    calculateScore: calculateWellnessScore,
    exportData: exportProgress
};
