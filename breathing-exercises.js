// Breathing Exercises JavaScript
let currentExercise = null;
let exerciseTimer = null;
let isPaused = false;
let currentPhase = 'prepare';
let phaseTimer = 0;
let totalTime = 0;
let cyclesCompleted = 0;
let exerciseStartTime = null;

const exercises = {
    box: {
        name: 'Box Breathing',
        phases: [
            { name: 'Inhale', duration: 4, instruction: 'Breathe In' },
            { name: 'Hold', duration: 4, instruction: 'Hold' },
            { name: 'Exhale', duration: 4, instruction: 'Breathe Out' },
            { name: 'Hold', duration: 4, instruction: 'Hold' }
        ],
        totalDuration: 240 // 4 minutes
    },
    '478': {
        name: '4-7-8 Technique',
        phases: [
            { name: 'Inhale', duration: 4, instruction: 'Breathe In' },
            { name: 'Hold', duration: 7, instruction: 'Hold' },
            { name: 'Exhale', duration: 8, instruction: 'Breathe Out' }
        ],
        totalDuration: 180 // 3 minutes
    },
    equal: {
        name: 'Equal Breathing',
        phases: [
            { name: 'Inhale', duration: 6, instruction: 'Breathe In' },
            { name: 'Exhale', duration: 6, instruction: 'Breathe Out' }
        ],
        totalDuration: 300 // 5 minutes
    },
    triangle: {
        name: 'Triangle Breathing',
        phases: [
            { name: 'Inhale', duration: 3, instruction: 'Breathe In' },
            { name: 'Hold', duration: 3, instruction: 'Hold' },
            { name: 'Exhale', duration: 3, instruction: 'Breathe Out' }
        ],
        totalDuration: 120 // 2 minutes
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeBreathingExercises();
    loadBreathingStats();
});

function initializeBreathingExercises() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
}

function startExercise(exerciseType) {
    currentExercise = exercises[exerciseType];
    if (!currentExercise) return;
    
    // Hide selection and show interface
    document.querySelector('.exercise-selection-card').style.display = 'none';
    document.querySelector('.tips-card').style.display = 'none';
    document.getElementById('breathingInterface').style.display = 'block';
    
    // Set exercise title
    document.getElementById('exerciseTitle').textContent = currentExercise.name;
    
    // Reset variables
    totalTime = 0;
    cyclesCompleted = 0;
    isPaused = false;
    exerciseStartTime = Date.now();
    
    // Update time remaining
    updateTimeRemaining();
    
    // Start countdown
    startCountdown();
}

function startCountdown() {
    let countdown = 3;
    const breathInstruction = document.getElementById('breathInstruction');
    const breathCount = document.getElementById('breathCount');
    const circle = document.getElementById('breathingCircle');
    
    breathInstruction.textContent = 'Get Ready';
    breathCount.textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            breathCount.textContent = countdown;
        } else {
            breathCount.textContent = '';
            breathInstruction.textContent = 'Begin';
            clearInterval(countdownInterval);
            
            setTimeout(() => {
                startBreathingCycle();
            }, 1000);
        }
    }, 1000);
}

function startBreathingCycle() {
    let currentPhaseIndex = 0;
    phaseTimer = 0;
    
    function runPhase() {
        if (isPaused) return;
        
        const phase = currentExercise.phases[currentPhaseIndex];
        const breathInstruction = document.getElementById('breathInstruction');
        const breathCount = document.getElementById('breathCount');
        const circle = document.getElementById('breathingCircle');
        const guide = document.getElementById('breathingGuide');
        
        // Update instruction
        breathInstruction.textContent = phase.instruction;
        guide.querySelector('.guide-text').textContent = phase.instruction;
        
        // Animate circle based on phase
        animateBreathingCircle(phase.name, phase.duration);
        
        let phaseCountdown = phase.duration;
        breathCount.textContent = phaseCountdown;
        
        const phaseInterval = setInterval(() => {
            if (isPaused) return;
            
            phaseCountdown--;
            breathCount.textContent = phaseCountdown;
            
            if (phaseCountdown <= 0) {
                clearInterval(phaseInterval);
                
                // Move to next phase
                currentPhaseIndex++;
                if (currentPhaseIndex >= currentExercise.phases.length) {
                    currentPhaseIndex = 0;
                    cyclesCompleted++;
                    updateStats();
                }
                
                // Check if exercise should continue
                if (totalTime < currentExercise.totalDuration) {
                    runPhase();
                } else {
                    completeExercise();
                }
            }
        }, 1000);
    }
    
    // Start the exercise timer
    exerciseTimer = setInterval(() => {
        if (!isPaused) {
            totalTime++;
            updateStats();
            updateProgress();
        }
    }, 1000);
    
    runPhase();
}

function animateBreathingCircle(phaseName, duration) {
    const circle = document.getElementById('breathingCircle');
    
    // Remove existing animation classes
    circle.classList.remove('inhale', 'exhale', 'hold');
    
    // Add appropriate animation class
    if (phaseName === 'Inhale') {
        circle.classList.add('inhale');
    } else if (phaseName === 'Exhale') {
        circle.classList.add('exhale');
    } else {
        circle.classList.add('hold');
    }
    
    // Set animation duration
    circle.style.animationDuration = `${duration}s`;
}

function updateStats() {
    document.getElementById('cyclesCompleted').textContent = cyclesCompleted;
    document.getElementById('totalTime').textContent = formatTime(totalTime);
    
    // Update streak
    const streak = getBreathingStreak();
    document.getElementById('streakDays').textContent = streak;
}

function updateProgress() {
    const progress = (totalTime / currentExercise.totalDuration) * 100;
    document.getElementById('progressFill').style.width = `${Math.min(progress, 100)}%`;
}

function updateTimeRemaining() {
    const remaining = Math.max(0, currentExercise.totalDuration - totalTime);
    document.getElementById('timeRemaining').textContent = formatTime(remaining);
}

function togglePause() {
    isPaused = !isPaused;
    const pauseBtn = document.getElementById('pauseBtn');
    
    if (isPaused) {
        pauseBtn.textContent = '▶️ Resume';
        pauseBtn.innerHTML = '▶️ Resume';
    } else {
        pauseBtn.textContent = '⏸️ Pause';
        pauseBtn.innerHTML = '⏸️ Pause';
    }
}

function resetExercise() {
    if (exerciseTimer) {
        clearInterval(exerciseTimer);
    }
    
    totalTime = 0;
    cyclesCompleted = 0;
    isPaused = false;
    
    updateStats();
    updateProgress();
    updateTimeRemaining();
    
    // Reset UI
    document.getElementById('breathInstruction').textContent = 'Get Ready';
    document.getElementById('breathCount').textContent = '3';
    document.getElementById('pauseBtn').innerHTML = '⏸️ Pause';
    
    // Restart
    startCountdown();
}

function stopExercise() {
    if (exerciseTimer) {
        clearInterval(exerciseTimer);
    }
    
    // Save session data
    saveBreathingSession();
    
    // Return to selection
    document.querySelector('.exercise-selection-card').style.display = 'block';
    document.querySelector('.tips-card').style.display = 'block';
    document.getElementById('breathingInterface').style.display = 'none';
    
    // Reset state
    currentExercise = null;
    isPaused = false;
}

function completeExercise() {
    if (exerciseTimer) {
        clearInterval(exerciseTimer);
    }
    
    // Save session
    saveBreathingSession();
    
    // Show completion modal
    showCompletionModal();
}

function showCompletionModal() {
    const modal = document.getElementById('completionModal');
    const finalCycles = document.getElementById('finalCycles');
    const finalDuration = document.getElementById('finalDuration');
    
    finalCycles.textContent = cyclesCompleted;
    finalDuration.textContent = Math.round(totalTime / 60);
    
    modal.style.display = 'flex';
    
    // Add celebration animation
    setTimeout(() => {
        createCelebrationParticles();
    }, 500);
}

function closeCompletion() {
    document.getElementById('completionModal').style.display = 'none';
    stopExercise();
}

function shareProgress() {
    const text = `I just completed ${cyclesCompleted} breathing cycles with MindCare! 🧘‍♀️ Taking care of my mental health one breath at a time. #MindCare #Mindfulness`;
    
    if (navigator.share) {
        navigator.share({
            title: 'MindCare Breathing Exercise',
            text: text,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(text).then(() => {
            showAlert('Progress copied to clipboard!', 'success');
        });
    }
}

function saveBreathingSession() {
    const sessions = getBreathingSessions();
    const today = new Date().toISOString().split('T')[0];
    
    const session = {
        date: today,
        exercise: currentExercise.name,
        duration: totalTime,
        cycles: cyclesCompleted,
        completed: totalTime >= currentExercise.totalDuration,
        timestamp: new Date().toISOString()
    };
    
    sessions.push(session);
    localStorage.setItem('breathingSessions', JSON.stringify(sessions));
    
    // Update daily streak
    updateBreathingStreak();
}

function getBreathingSessions() {
    return JSON.parse(localStorage.getItem('breathingSessions') || '[]');
}

function getBreathingStreak() {
    const sessions = getBreathingSessions();
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        const hasSession = sessions.some(session => 
            session.date === dateStr && session.completed
        );
        
        if (hasSession) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    
    return streak;
}

function updateBreathingStreak() {
    const streak = getBreathingStreak();
    localStorage.setItem('breathingStreak', streak.toString());
}

function loadBreathingStats() {
    const streak = getBreathingStreak();
    const streakElements = document.querySelectorAll('[data-stat="breathing"]');
    streakElements.forEach(el => {
        el.textContent = streak;
    });
}

function createCelebrationParticles() {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${Math.random() * window.innerWidth}px;
                top: ${window.innerHeight}px;
                animation: floatUp 3s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => particle.remove(), 3000);
        }, i * 100);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
