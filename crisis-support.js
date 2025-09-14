// Crisis Support JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkAuthStatus();
    
    // Initialize crisis support functionality
    initializeCrisisSupport();
    loadSafetyPlan();
    
    // Initialize grounding exercise
    initializeGroundingExercise();
});

function initializeCrisisSupport() {
    // Emergency contact buttons
    const callButtons = document.querySelectorAll('.call-btn');
    const textButtons = document.querySelectorAll('.text-btn');
    
    callButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            makeCall(number);
        });
    });
    
    textButtons.forEach(button => {
        button.addEventListener('click', function() {
            const number = this.getAttribute('data-number');
            const message = this.getAttribute('data-message') || '';
            sendText(number, message);
        });
    });
    
    // Coping tool buttons
    document.getElementById('groundingBtn').addEventListener('click', startGroundingExercise);
    document.getElementById('breathingBtn').addEventListener('click', startEmergencyBreathing);
    document.getElementById('calmingSoundsBtn').addEventListener('click', playCalmingSounds);
    document.getElementById('safetyPlanBtn').addEventListener('click', toggleSafetyPlan);
    
    // Safety plan save button
    document.getElementById('saveSafetyPlan').addEventListener('click', saveSafetyPlan);
    
    // Support resource buttons
    document.getElementById('onlineChatBtn').addEventListener('click', startOnlineChat);
    document.getElementById('peerSupportBtn').addEventListener('click', findPeerSupport);
    document.getElementById('mentalHealthAppsBtn').addEventListener('click', showMentalHealthApps);
}

function makeCall(number) {
    // Create a confirmation dialog
    const confirmed = confirm(`Do you want to call ${number}?\n\nThis will open your phone app.`);
    
    if (confirmed) {
        // Try to initiate call
        try {
            window.location.href = `tel:${number}`;
            
            // Log the emergency call attempt
            logEmergencyAction('call', number);
            
            // Show supportive message
            showAlert('Connecting you to help...', 'success');
        } catch (error) {
            console.error('Error initiating call:', error);
            showAlert('Unable to make call. Please dial ' + number + ' manually.', 'error');
        }
    }
}

function sendText(number, message = '') {
    const confirmed = confirm(`Do you want to send a text to ${number}?\n\nThis will open your messaging app.`);
    
    if (confirmed) {
        try {
            const textUrl = message ? 
                `sms:${number}?body=${encodeURIComponent(message)}` : 
                `sms:${number}`;
            
            window.location.href = textUrl;
            
            // Log the emergency text attempt
            logEmergencyAction('text', number);
            
            showAlert('Opening messaging app...', 'success');
        } catch (error) {
            console.error('Error sending text:', error);
            showAlert('Unable to send text. Please text ' + number + ' manually.', 'error');
        }
    }
}

function logEmergencyAction(type, contact) {
    const timestamp = new Date().toISOString();
    const emergencyLog = JSON.parse(localStorage.getItem('emergencyLog') || '[]');
    
    emergencyLog.push({
        type: type,
        contact: contact,
        timestamp: timestamp
    });
    
    // Keep only last 50 entries
    if (emergencyLog.length > 50) {
        emergencyLog.splice(0, emergencyLog.length - 50);
    }
    
    localStorage.setItem('emergencyLog', JSON.stringify(emergencyLog));
}

function startGroundingExercise() {
    const modal = document.getElementById('groundingModal');
    modal.style.display = 'block';
    resetGroundingExercise();
}

function initializeGroundingExercise() {
    const modal = document.getElementById('groundingModal');
    const closeBtn = document.getElementById('closeGroundingModal');
    
    // Close modal events
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Step navigation
    document.getElementById('nextStep1').addEventListener('click', () => goToGroundingStep(2));
    document.getElementById('nextStep2').addEventListener('click', () => goToGroundingStep(3));
    document.getElementById('nextStep3').addEventListener('click', () => goToGroundingStep(4));
    document.getElementById('nextStep4').addEventListener('click', () => goToGroundingStep(5));
    document.getElementById('completeGrounding').addEventListener('click', completeGroundingExercise);
    document.getElementById('restartGrounding').addEventListener('click', resetGroundingExercise);
}

function goToGroundingStep(stepNumber) {
    // Hide all steps
    const steps = document.querySelectorAll('.grounding-step');
    steps.forEach(step => step.classList.remove('active'));
    
    // Show target step
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

function completeGroundingExercise() {
    // Save grounding exercise completion
    const completions = JSON.parse(localStorage.getItem('groundingCompletions') || '[]');
    completions.push({
        timestamp: new Date().toISOString(),
        type: 'grounding_exercise'
    });
    localStorage.setItem('groundingCompletions', JSON.stringify(completions));
    
    // Show completion step
    goToGroundingStep('Complete');
    
    // Show celebration
    showAlert('Great job completing the grounding exercise! You\'re doing amazing.', 'success');
}

function resetGroundingExercise() {
    // Clear all inputs
    const inputs = document.querySelectorAll('#groundingModal input');
    inputs.forEach(input => input.value = '');
    
    // Go to first step
    goToGroundingStep(1);
}

function startEmergencyBreathing() {
    // Redirect to breathing exercises with emergency mode
    localStorage.setItem('emergencyBreathing', 'true');
    window.location.href = 'breathing-exercises.html';
}

function playCalmingSounds() {
    showAlert('Calming sounds feature coming soon. Try the breathing exercises for now.', 'info');
    
    // Placeholder for calming sounds functionality
    // This could integrate with Web Audio API or external sound libraries
    const sounds = [
        { name: 'Rain', description: 'Gentle rainfall sounds' },
        { name: 'Ocean Waves', description: 'Peaceful ocean waves' },
        { name: 'Forest', description: 'Birds and nature sounds' },
        { name: 'White Noise', description: 'Calming white noise' }
    ];
    
    // For now, just log the attempt
    logEmergencyAction('calming_sounds', 'accessed');
}

function toggleSafetyPlan() {
    const section = document.getElementById('safetyPlanSection');
    const isVisible = section.style.display !== 'none';
    
    if (isVisible) {
        section.style.display = 'none';
    } else {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function saveSafetyPlan() {
    const safetyPlan = {
        warningSignsText: document.getElementById('warningSignsText').value,
        copingStrategiesText: document.getElementById('copingStrategiesText').value,
        supportPeopleText: document.getElementById('supportPeopleText').value,
        professionalContactsText: document.getElementById('professionalContactsText').value,
        environmentSafeText: document.getElementById('environmentSafeText').value,
        reasonsLivingText: document.getElementById('reasonsLivingText').value,
        lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('personalSafetyPlan', JSON.stringify(safetyPlan));
    showAlert('Safety plan saved successfully!', 'success');
    
    // Log safety plan update
    logEmergencyAction('safety_plan_update', 'saved');
}

function loadSafetyPlan() {
    const savedPlan = localStorage.getItem('personalSafetyPlan');
    
    if (savedPlan) {
        const plan = JSON.parse(savedPlan);
        
        document.getElementById('warningSignsText').value = plan.warningSignsText || '';
        document.getElementById('copingStrategiesText').value = plan.copingStrategiesText || '';
        document.getElementById('supportPeopleText').value = plan.supportPeopleText || '';
        document.getElementById('professionalContactsText').value = plan.professionalContactsText || '';
        document.getElementById('environmentSafeText').value = plan.environmentSafeText || '';
        document.getElementById('reasonsLivingText').value = plan.reasonsLivingText || '';
    }
}

function startOnlineChat() {
    // Placeholder for online chat integration
    const chatOptions = [
        { name: 'Crisis Text Line', url: 'https://www.crisistextline.org/text-us/', description: 'Text HOME to 741741' },
        { name: 'National Suicide Prevention Lifeline', url: 'https://suicidepreventionlifeline.org/chat/', description: 'Online chat support' },
        { name: 'Campus Counseling', description: 'Contact your campus counseling center' }
    ];
    
    let message = 'Online Chat Options:\n\n';
    chatOptions.forEach((option, index) => {
        message += `${index + 1}. ${option.name}\n   ${option.description}\n`;
        if (option.url) {
            message += `   ${option.url}\n`;
        }
        message += '\n';
    });
    
    alert(message);
    
    // Log the action
    logEmergencyAction('online_chat', 'accessed');
}

function findPeerSupport() {
    const supportGroups = [
        { name: 'NAMI Support Groups', description: 'National Alliance on Mental Illness peer support' },
        { name: 'Campus Support Groups', description: 'Check with your student counseling center' },
        { name: 'Online Communities', description: '7 Cups, Reddit Mental Health communities' },
        { name: 'Crisis Support Groups', description: 'Local crisis center group meetings' }
    ];
    
    let message = 'Peer Support Options:\n\n';
    supportGroups.forEach((group, index) => {
        message += `${index + 1}. ${group.name}\n   ${group.description}\n\n`;
    });
    
    alert(message);
    
    // Log the action
    logEmergencyAction('peer_support', 'accessed');
}

function showMentalHealthApps() {
    const apps = [
        { name: 'Headspace', description: 'Meditation and mindfulness' },
        { name: 'Calm', description: 'Sleep stories and relaxation' },
        { name: 'Sanvello', description: 'Anxiety and mood tracking' },
        { name: 'Youper', description: 'AI emotional health assistant' },
        { name: 'MindShift', description: 'Anxiety management strategies' }
    ];
    
    let message = 'Recommended Mental Health Apps:\n\n';
    apps.forEach((app, index) => {
        message += `${index + 1}. ${app.name}\n   ${app.description}\n\n`;
    });
    
    alert(message);
    
    // Log the action
    logEmergencyAction('mental_health_apps', 'accessed');
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${getAlertIcon(type)}"></i>
        <span>${message}</span>
        <button class="alert-close">&times;</button>
    `;
    
    // Add to page
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
    
    // Close button functionality
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

// Emergency detection and auto-suggestions
function detectEmergencyKeywords() {
    // This could be enhanced to detect crisis language in text inputs
    // and provide immediate suggestions or resources
    const emergencyKeywords = [
        'suicide', 'kill myself', 'end it all', 'not worth living',
        'hurt myself', 'self harm', 'overdose', 'can\'t go on'
    ];
    
    // Implementation would monitor text inputs and provide immediate help
    // This is a placeholder for more advanced crisis detection
}

// Export functions for potential use by other modules
window.crisisSupport = {
    makeCall,
    sendText,
    startGroundingExercise,
    saveSafetyPlan,
    loadSafetyPlan
};
