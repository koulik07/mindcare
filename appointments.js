// Appointments JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAppointments();
    setupAppointmentForm();
    setupTabs();
    setMinDate();
});

function initializeAppointments() {
    // Check authentication
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    loadAppointments();
}

function setupAppointmentForm() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentBooking);
    }
}

function setMinDate() {
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
    }
}

function handleAppointmentBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointmentData = {
        id: Date.now(),
        counselor: formData.get('counselor'),
        date: formData.get('date'),
        time: formData.get('time'),
        sessionType: formData.get('sessionType'),
        notes: formData.get('notes'),
        status: 'upcoming',
        createdAt: new Date().toISOString()
    };
    
    // Validation
    if (!appointmentData.counselor || !appointmentData.date || !appointmentData.time || !appointmentData.sessionType) {
        showAlert('Please fill in all required fields', 'error');
        return;
    }
    
    // Save appointment
    saveAppointment(appointmentData);
    
    // Show success message
    showAlert('Appointment booked successfully!', 'success');
    
    // Reset form
    e.target.reset();
    
    // Reload appointments
    loadAppointments();
}

function saveAppointment(appointment) {
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
}

function getAppointments() {
    return JSON.parse(localStorage.getItem('appointments') || '[]');
}

function loadAppointments() {
    const appointments = getAppointments();
    
    // Clear existing appointments
    document.getElementById('upcoming').innerHTML = '';
    document.getElementById('completed').innerHTML = '';
    document.getElementById('cancelled').innerHTML = '';
    
    if (appointments.length === 0) {
        showEmptyState();
        return;
    }
    
    appointments.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        const container = document.getElementById(appointment.status);
        if (container) {
            container.appendChild(appointmentCard);
        }
    });
}

function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = `appointment-card ${appointment.status}`;
    
    const counselorNames = {
        'dr-smith': 'Dr. Sarah Smith',
        'dr-johnson': 'Dr. Mike Johnson',
        'dr-williams': 'Dr. Emma Williams'
    };
    
    const sessionTypes = {
        'individual': 'Individual Counseling',
        'group': 'Group Therapy',
        'crisis': 'Crisis Intervention',
        'academic': 'Academic Stress Support'
    };
    
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
    
    const formattedTime = formatTime(appointment.time);
    
    if (appointment.status === 'upcoming') {
        card.innerHTML = `
            <div class="appointment-info">
                <h3>${counselorNames[appointment.counselor] || appointment.counselor}</h3>
                <p>${sessionTypes[appointment.sessionType] || appointment.sessionType}</p>
                <div class="appointment-details">
                    <span>📅 ${formattedDate}</span>
                    <span>🕐 ${formattedTime}</span>
                </div>
            </div>
            <div class="appointment-actions">
                <button class="btn-secondary" onclick="rescheduleAppointment(${appointment.id})">Reschedule</button>
                <button class="btn-danger" onclick="cancelAppointment(${appointment.id})">Cancel</button>
            </div>
        `;
    } else {
        card.innerHTML = `
            <div class="appointment-info">
                <h3>${counselorNames[appointment.counselor] || appointment.counselor}</h3>
                <p>${sessionTypes[appointment.sessionType] || appointment.sessionType}</p>
                <div class="appointment-details">
                    <span>📅 ${formattedDate}</span>
                    <span>🕐 ${formattedTime}</span>
                </div>
            </div>
            <div class="appointment-status">
                <span class="status-badge ${appointment.status}">${appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}</span>
            </div>
        `;
    }
    
    return card;
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.textContent.toLowerCase();
            showTab(tabName);
        });
    });
}

function showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll('.appointment-list');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Show selected tab
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to clicked button
    const activeButton = Array.from(buttons).find(btn => 
        btn.textContent.toLowerCase() === tabName
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

function rescheduleAppointment(appointmentId) {
    showAlert('Reschedule functionality would open a date/time picker', 'info');
    // In a real app, this would open a modal with date/time selection
}

function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        const appointments = getAppointments();
        const appointmentIndex = appointments.findIndex(apt => apt.id === appointmentId);
        
        if (appointmentIndex !== -1) {
            appointments[appointmentIndex].status = 'cancelled';
            localStorage.setItem('appointments', JSON.stringify(appointments));
            loadAppointments();
            showAlert('Appointment cancelled successfully', 'success');
        }
    }
}

function showEmptyState() {
    const upcomingContainer = document.getElementById('upcoming');
    if (upcomingContainer && upcomingContainer.children.length === 0) {
        upcomingContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <div style="font-size: 3rem; margin-bottom: 15px;">📅</div>
                <h3>No upcoming appointments</h3>
                <p>Book your first appointment above to get started!</p>
            </div>
        `;
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
