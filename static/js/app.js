/**
 * HOPE Smart Recruitment Messenger (HSRM) - Frontend JavaScript
 * Version 2.0 - Enhanced with animations, caching, encryption, and analytics
 */

// ============================================
// ENCRYPTION UTILITIES
// ============================================
const Encryption = {
    key: 'HSRM_2024_HOPE_KEY',
    
    encrypt(data) {
        try {
            const str = JSON.stringify(data);
            const encoded = btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                (match, p1) => String.fromCharCode('0x' + p1)));
            // Simple XOR with key
            let result = '';
            for (let i = 0; i < encoded.length; i++) {
                result += String.fromCharCode(encoded.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
            }
            return btoa(result);
        } catch (e) {
            console.error('Encryption error:', e);
            return null;
        }
    },
    
    decrypt(encrypted) {
        try {
            const decoded = atob(encrypted);
            let result = '';
            for (let i = 0; i < decoded.length; i++) {
                result += String.fromCharCode(decoded.charCodeAt(i) ^ this.key.charCodeAt(i % this.key.length));
            }
            const str = decodeURIComponent(atob(result).split('').map(c => 
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(str);
        } catch (e) {
            console.error('Decryption error:', e);
            return null;
        }
    }
};

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    volunteers: [],
    generatedMessages: [],
    selectedTemplate: 'general',
    currentStep: 1,
    currentCategory: 'initial',
    searchQuery: '',
    sortBy: 'name-asc',
    selectedFile: null
};

// Storage Keys
const STORAGE_KEYS = {
    TRACKING: 'hsrm_tracking_v2',
    VOLUNTEERS: 'hsrm_volunteers_cache',
    THEME: 'hsrm_theme',
    MESSAGES: 'hsrm_messages_cache',
    BATCHES: 'hsrm_batches'
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    // Upload section
    uploadZone: document.getElementById('upload-zone'),
    fileInput: document.getElementById('file-input'),
    uploadStatus: document.getElementById('upload-status'),
    errorMessage: document.getElementById('error-message'),
    filePreview: document.getElementById('file-preview'),
    previewFileName: document.getElementById('preview-file-name'),
    previewFileSize: document.getElementById('preview-file-size'),
    removeFile: document.getElementById('remove-file'),
    formatToggle: document.getElementById('format-toggle'),
    formatContent: document.getElementById('format-content'),
    validationWarnings: document.getElementById('validation-warnings'),
    validationList: document.getElementById('validation-list'),
    
    // Preview section
    previewTbody: document.getElementById('preview-tbody'),
    volunteerCount: document.getElementById('volunteer-count'),
    duplicateCount: document.getElementById('duplicate-count'),
    templatesGrid: document.getElementById('templates-grid'),
    categoryTabs: document.getElementById('category-tabs'),
    
    // Custom template
    toggleCustomBtn: document.getElementById('toggle-custom'),
    customFields: document.getElementById('custom-fields'),
    customSubject: document.getElementById('custom-subject'),
    customBody: document.getElementById('custom-body'),
    subjectCounter: document.getElementById('subject-counter'),
    bodyCounter: document.getElementById('body-counter'),
    
    // Navigation buttons
    backToUpload: document.getElementById('back-to-upload'),
    generateBtn: document.getElementById('generate-btn'),
    backToTemplate: document.getElementById('back-to-template'),
    startOver: document.getElementById('start-over'),
    
    // Results section
    emailCount: document.getElementById('email-count'),
    emailsList: document.getElementById('emails-list'),
    downloadCsv: document.getElementById('download-csv'),
    downloadZip: document.getElementById('download-zip'),
    emailSearch: document.getElementById('email-search'),
    emailSort: document.getElementById('email-sort'),
    noResultsState: document.getElementById('no-results-state'),
    
    // Template Modal
    templateModal: document.getElementById('template-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalClose: document.getElementById('modal-close'),
    previewSubjectText: document.getElementById('preview-subject-text'),
    previewBodyText: document.getElementById('preview-body-text'),
    
    // Tracking elements
    trackingBar: document.getElementById('tracking-bar'),
    trackingTotal: document.getElementById('tracking-total'),
    viewTracking: document.getElementById('view-tracking'),
    viewDashboard: document.getElementById('view-dashboard'),
    clearTracking: document.getElementById('clear-tracking'),
    exportTracking: document.getElementById('export-tracking'),
    trackingModal: document.getElementById('tracking-modal'),
    trackingModalClose: document.getElementById('tracking-modal-close'),
    trackingList: document.getElementById('tracking-list'),
    
    // Dashboard elements
    dashboardModal: document.getElementById('dashboard-modal'),
    dashboardModalClose: document.getElementById('dashboard-modal-close'),
    
    // Help elements
    helpBtn: document.getElementById('help-btn-header'),
    helpModal: document.getElementById('help-modal'),
    helpModalClose: document.getElementById('help-modal-close'),
    
    // Theme toggle
    themeToggle: document.getElementById('theme-toggle'),
    
    // Toast container
    toastContainer: document.getElementById('toast-container'),
    confettiContainer: document.getElementById('confetti-container'),
    
    // Steps
    steps: document.querySelectorAll('.step'),
    sections: {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        3: document.getElementById('step-3')
    }
};

// ============================================
// INITIALIZATION
// ============================================
function init() {
    setupEventListeners();
    loadTheme();
    loadCachedData();
    selectTemplate('general');
    filterTemplatesByCategory('initial');
    loadTrackingData();
    updateTrackingDisplay();
    setupCharacterCounters();
    setupKeyboardShortcuts();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // File upload events
    if (elements.uploadZone) {
        elements.uploadZone.addEventListener('click', (e) => {
            if (!e.target.closest('.format-guidelines') && !e.target.closest('.upload-file-preview')) {
                elements.fileInput?.click();
            }
        });
        elements.uploadZone.addEventListener('dragover', handleDragOver);
        elements.uploadZone.addEventListener('dragleave', handleDragLeave);
        elements.uploadZone.addEventListener('drop', handleDrop);
    }
    
    elements.fileInput?.addEventListener('change', handleFileSelect);
    elements.removeFile?.addEventListener('click', (e) => {
        e.stopPropagation();
        clearSelectedFile();
    });
    
    // Format guidelines toggle
    elements.formatToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.formatToggle.classList.toggle('expanded');
        elements.formatContent?.classList.toggle('show');
    });
    
    // Template selection
    elements.templatesGrid?.addEventListener('click', handleTemplateClick);
    
    // Category tabs
    elements.categoryTabs?.addEventListener('click', handleCategoryClick);
    
    // Custom template toggle
    elements.toggleCustomBtn?.addEventListener('click', toggleCustomFields);
    
    // Navigation
    elements.backToUpload?.addEventListener('click', () => goToStep(1));
    elements.generateBtn?.addEventListener('click', generateEmails);
    elements.backToTemplate?.addEventListener('click', () => goToStep(2));
    elements.startOver?.addEventListener('click', resetApp);
    
    // Downloads
    elements.downloadCsv?.addEventListener('click', downloadCsv);
    elements.downloadZip?.addEventListener('click', downloadZip);
    
    // Search and Sort
    elements.emailSearch?.addEventListener('input', debounce(filterEmails, 300));
    elements.emailSort?.addEventListener('change', sortEmails);
    
    // Template Modal
    elements.modalClose?.addEventListener('click', closeModal);
    elements.templateModal?.querySelector('.modal-overlay')?.addEventListener('click', closeModal);
    
    // Tracking events
    elements.viewTracking?.addEventListener('click', openTrackingModal);
    elements.viewDashboard?.addEventListener('click', openDashboardModal);
    elements.clearTracking?.addEventListener('click', clearTrackingData);
    elements.exportTracking?.addEventListener('click', exportTrackingData);
    elements.trackingModalClose?.addEventListener('click', closeTrackingModal);
    elements.trackingModal?.querySelector('.modal-overlay')?.addEventListener('click', closeTrackingModal);
    
    // Dashboard modal
    elements.dashboardModalClose?.addEventListener('click', closeDashboardModal);
    elements.dashboardModal?.querySelector('.modal-overlay')?.addEventListener('click', closeDashboardModal);
    
    // Help modal
    elements.helpBtn?.addEventListener('click', openHelpModal);
    elements.helpModalClose?.addEventListener('click', closeHelpModal);
    elements.helpModal?.querySelector('.modal-overlay')?.addEventListener('click', closeHelpModal);
    
    // Theme toggle
    elements.themeToggle?.addEventListener('click', toggleTheme);
    
    // Tracking filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Close modals on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeTrackingModal();
            closeDashboardModal();
            closeHelpModal();
        }
    });
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to generate
        if (e.ctrlKey && e.key === 'Enter' && state.currentStep === 2) {
            e.preventDefault();
            generateEmails();
        }
        // Ctrl+S to download CSV
        if (e.ctrlKey && e.key === 's' && state.currentStep === 3) {
            e.preventDefault();
            downloadCsv();
        }
    });
}

// ============================================
// THEME MANAGEMENT
// ============================================
function loadTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    showToast(`Switched to ${newTheme} mode`, 'info');
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// CONFETTI ANIMATION
// ============================================
function triggerConfetti() {
    const colors = ['#5AAFE0', '#27ae60', '#f39c12', '#e74c3c', '#9b59b6', '#3498db'];
    const container = elements.confettiContainer;
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        container.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ============================================
// CHARACTER COUNTERS
// ============================================
function setupCharacterCounters() {
    if (elements.customSubject && elements.subjectCounter) {
        elements.customSubject.addEventListener('input', () => {
            const len = elements.customSubject.value.length;
            const max = elements.customSubject.getAttribute('maxlength') || 150;
            elements.subjectCounter.textContent = `${len}/${max}`;
            elements.subjectCounter.className = 'char-counter' + (len > max * 0.9 ? ' warning' : '');
        });
    }
    
    if (elements.customBody && elements.bodyCounter) {
        elements.customBody.addEventListener('input', () => {
            const len = elements.customBody.value.length;
            const max = elements.customBody.getAttribute('maxlength') || 5000;
            elements.bodyCounter.textContent = `${len}/${max}`;
            elements.bodyCounter.className = 'char-counter' + (len > max * 0.9 ? ' warning' : '');
        });
    }
}

// ============================================
// CACHING
// ============================================
function loadCachedData() {
    try {
        // Load cached volunteers
        const cachedVolunteers = localStorage.getItem(STORAGE_KEYS.VOLUNTEERS);
        if (cachedVolunteers) {
            const decrypted = Encryption.decrypt(cachedVolunteers);
            if (decrypted && decrypted.volunteers && decrypted.volunteers.length > 0) {
                state.volunteers = decrypted.volunteers;
                showToast('Restored cached volunteer data', 'info');
            }
        }
        
        // Load cached messages
        const cachedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
        if (cachedMessages) {
            const decrypted = Encryption.decrypt(cachedMessages);
            if (decrypted && decrypted.messages) {
                state.generatedMessages = decrypted.messages;
            }
        }
    } catch (e) {
        console.error('Error loading cached data:', e);
    }
}

function cacheVolunteerData() {
    try {
        const encrypted = Encryption.encrypt({ volunteers: state.volunteers, timestamp: Date.now() });
        if (encrypted) {
            localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, encrypted);
        }
    } catch (e) {
        console.error('Error caching volunteer data:', e);
    }
}

function cacheMessageData() {
    try {
        const encrypted = Encryption.encrypt({ messages: state.generatedMessages, timestamp: Date.now() });
        if (encrypted) {
            localStorage.setItem(STORAGE_KEYS.MESSAGES, encrypted);
        }
    } catch (e) {
        console.error('Error caching message data:', e);
    }
}

// ============================================
// FILE HANDLING
// ============================================
function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadZone.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadZone.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadZone.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        showFilePreview(files[0]);
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        showFilePreview(files[0]);
        processFile(files[0]);
    }
}

function showFilePreview(file) {
    state.selectedFile = file;
    elements.previewFileName.textContent = file.name;
    elements.previewFileSize.textContent = formatFileSize(file.size);
    elements.filePreview.style.display = 'flex';
}

function clearSelectedFile() {
    state.selectedFile = null;
    elements.fileInput.value = '';
    elements.filePreview.style.display = 'none';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function processFile(file) {
    // Validate file type
    const validTypes = ['csv', 'docx', 'pdf'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(extension)) {
        showToast('Please upload a CSV, DOCX, or PDF file.', 'error');
        return;
    }
    
    // Show loading state
    showUploadStatus(true);
    hideError();
    hideValidationWarnings();
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Recovery mode: show partial data if available
            if (data.partial_data && data.partial_data.length > 0) {
                state.volunteers = data.partial_data;
                showValidationWarnings([`Partial extraction: ${data.error}. ${data.partial_data.length} contacts recovered.`]);
                showToast(`Recovered ${data.partial_data.length} contacts`, 'warning');
            } else {
                throw new Error(data.error || 'Failed to process file');
            }
        } else {
            state.volunteers = data.data;
            showToast(`Successfully extracted ${data.count} contacts!`, 'success');
        }
        
        showUploadStatus(false);
        
        // Validate and detect duplicates
        const validationIssues = validateVolunteerData();
        if (validationIssues.length > 0) {
            showValidationWarnings(validationIssues);
        }
        
        // Cache the data
        cacheVolunteerData();
        
        // Populate preview table
        populatePreviewTable();
        
        // Move to step 2
        goToStep(2);
        
    } catch (error) {
        showUploadStatus(false);
        showError(error.message);
        showToast(error.message, 'error');
    }
}

// ============================================
// DATA VALIDATION & DUPLICATE DETECTION
// ============================================
function validateVolunteerData() {
    const issues = [];
    const emailCounts = {};
    let missingNames = 0;
    let missingPhones = 0;
    let invalidEmails = 0;
    
    state.volunteers.forEach((v, index) => {
        // Check for duplicates
        const email = v.email?.toLowerCase();
        if (email) {
            emailCounts[email] = (emailCounts[email] || 0) + 1;
        }
        
        // Check for missing data
        if (!v.name || v.name.trim() === '') missingNames++;
        if (!v.phone || v.phone.trim() === '' || v.phone === '-') missingPhones++;
        
        // Check for invalid email
        if (!email || !email.includes('@')) {
            invalidEmails++;
        }
    });
    
    // Report issues
    const duplicates = Object.entries(emailCounts).filter(([_, count]) => count > 1);
    if (duplicates.length > 0) {
        issues.push(`${duplicates.length} duplicate email(s) found`);
    }
    
    if (missingNames > 0) {
        issues.push(`${missingNames} contact(s) missing names`);
    }
    
    if (missingPhones > 0) {
        issues.push(`${missingPhones} contact(s) missing phone numbers`);
    }
    
    if (invalidEmails > 0) {
        issues.push(`${invalidEmails} contact(s) with invalid emails`);
    }
    
    // Mark duplicates in state
    state.volunteers.forEach(v => {
        const email = v.email?.toLowerCase();
        v._isDuplicate = email && emailCounts[email] > 1;
    });
    
    return issues;
}

function showValidationWarnings(issues) {
    if (issues.length === 0) {
        hideValidationWarnings();
        return;
    }
    
    elements.validationList.innerHTML = issues.map(issue => `<li>${issue}</li>`).join('');
    elements.validationWarnings.style.display = 'block';
}

function hideValidationWarnings() {
    elements.validationWarnings.style.display = 'none';
}

// ============================================
// PREVIEW TABLE WITH INLINE EDITING
// ============================================
function populatePreviewTable() {
    elements.previewTbody.innerHTML = '';
    
    const duplicateEmails = state.volunteers.filter(v => v._isDuplicate).length;
    elements.volunteerCount.textContent = `${state.volunteers.length} volunteer${state.volunteers.length !== 1 ? 's' : ''} found`;
    
    if (duplicateEmails > 0) {
        elements.duplicateCount.textContent = `⚠️ ${duplicateEmails} duplicate(s)`;
        elements.duplicateCount.style.display = 'inline';
    } else {
        elements.duplicateCount.style.display = 'none';
    }
    
    state.volunteers.forEach((volunteer, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        
        if (volunteer._isDuplicate) {
            row.classList.add('duplicate-row');
        }
        
        row.innerHTML = `
            <td><span class="editable-cell" data-field="name" data-index="${index}" contenteditable="true">${escapeHtml(volunteer.name || '-')}</span></td>
            <td><span class="editable-cell" data-field="email" data-index="${index}" contenteditable="true">${escapeHtml(volunteer.email || '-')}</span></td>
            <td><span class="editable-cell" data-field="phone" data-index="${index}" contenteditable="true">${escapeHtml(volunteer.phone || '-')}</span></td>
            <td><span class="editable-cell" data-field="interests" data-index="${index}" contenteditable="true">${escapeHtml(volunteer.interests || '-')}</span></td>
            <td><span class="editable-cell" data-field="location" data-index="${index}" contenteditable="true">${escapeHtml(volunteer.location || '-')}</span></td>
            <td>
                <button class="btn-icon delete-volunteer" data-index="${index}" data-tooltip="Remove contact">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </td>
        `;
        
        elements.previewTbody.appendChild(row);
    });
    
    // Add inline editing listeners
    document.querySelectorAll('.editable-cell').forEach(cell => {
        cell.addEventListener('blur', handleCellEdit);
        cell.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                cell.blur();
            }
        });
    });
    
    // Add delete listeners
    document.querySelectorAll('.delete-volunteer').forEach(btn => {
        btn.addEventListener('click', handleDeleteVolunteer);
    });
}

function handleCellEdit(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);
    const field = cell.dataset.field;
    const newValue = cell.textContent.trim();
    
    if (index >= 0 && index < state.volunteers.length) {
        const oldValue = state.volunteers[index][field];
        if (oldValue !== newValue) {
            state.volunteers[index][field] = newValue === '-' ? '' : newValue;
            
            // Update first_name if name changed
            if (field === 'name' && newValue) {
                state.volunteers[index].first_name = newValue.split(' ')[0];
            }
            
            // Revalidate
            const issues = validateVolunteerData();
            showValidationWarnings(issues);
            
            // Update cache
            cacheVolunteerData();
            
            // Refresh table to show duplicate highlighting
            populatePreviewTable();
            
            showToast('Data updated', 'success');
        }
    }
}

function handleDeleteVolunteer(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (index >= 0 && index < state.volunteers.length) {
        const name = state.volunteers[index].name || 'Contact';
        state.volunteers.splice(index, 1);
        
        // Revalidate
        const issues = validateVolunteerData();
        showValidationWarnings(issues);
        
        // Update cache
        cacheVolunteerData();
        
        // Refresh table
        populatePreviewTable();
        
        showToast(`${name} removed`, 'info');
    }
}

// ============================================
// TEMPLATE SELECTION
// ============================================
function handleCategoryClick(e) {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;
    
    const category = tab.dataset.category;
    filterTemplatesByCategory(category);
    
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
}

function filterTemplatesByCategory(category) {
    state.currentCategory = category;
    
    document.querySelectorAll('.template-card').forEach(card => {
        const cardCategory = card.dataset.category;
        card.style.display = cardCategory === category ? 'block' : 'none';
    });
    
    const currentSelected = document.querySelector('.template-card.selected');
    if (!currentSelected || currentSelected.style.display === 'none') {
        const firstVisible = document.querySelector(`.template-card[data-category="${category}"]`);
        if (firstVisible) {
            selectTemplate(firstVisible.dataset.templateId);
        }
    }
}

function handleTemplateClick(e) {
    if (e.target.classList.contains('preview-template-btn')) {
        e.stopPropagation();
        const templateId = e.target.dataset.templateId;
        showTemplatePreview(templateId);
        return;
    }
    
    if (e.target.classList.contains('use-template-btn')) {
        e.stopPropagation();
        const templateId = e.target.dataset.templateId;
        selectTemplate(templateId);
        showToast(`Selected: ${window.TEMPLATES.find(t => t.id === templateId)?.name || templateId}`, 'success');
        return;
    }
    
    const card = e.target.closest('.template-card');
    if (card && !e.target.closest('.template-card-actions')) {
        const templateId = card.dataset.templateId;
        selectTemplate(templateId);
    }
}

function selectTemplate(templateId) {
    state.selectedTemplate = templateId;
    
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.toggle('selected', card.dataset.templateId === templateId);
    });
}

function showTemplatePreview(templateId) {
    const template = window.TEMPLATES.find(t => t.id === templateId);
    if (!template) return;
    
    elements.modalTitle.textContent = template.name;
    elements.previewSubjectText.textContent = template.subject;
    elements.previewBodyText.textContent = template.body;
    
    elements.templateModal.style.display = 'flex';
}

function closeModal() {
    elements.templateModal.style.display = 'none';
}

function toggleCustomFields() {
    const isVisible = elements.customFields.style.display !== 'none';
    elements.customFields.style.display = isVisible ? 'none' : 'block';
}

// ============================================
// EMAIL GENERATION
// ============================================
async function generateEmails() {
    if (state.volunteers.length === 0) {
        showToast('No volunteer data available. Please upload a file first.', 'error');
        return;
    }
    
    // Add loading state
    elements.generateBtn.classList.add('loading');
    elements.generateBtn.disabled = true;
    const originalText = elements.generateBtn.innerHTML;
    elements.generateBtn.innerHTML = '<span class="btn-spinner"></span>';
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                volunteers: state.volunteers,
                template_id: state.selectedTemplate,
                custom_subject: elements.customSubject.value.trim(),
                custom_body: elements.customBody.value.trim()
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate emails');
        }
        
        state.generatedMessages = data.messages;
        
        // Cache messages
        cacheMessageData();
        
        // Create batch and add to tracking
        const emails = state.generatedMessages.map(m => m.email);
        const batchId = createBatch(state.selectedFile?.name || 'Manual Entry', data.count, emails);
        addToTracking(state.generatedMessages, batchId);
        
        // Show success with confetti!
        triggerConfetti();
        showToast(`🎉 ${data.count} emails generated successfully!`, 'success');
        
        displayGeneratedEmails();
        goToStep(3);
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        elements.generateBtn.classList.remove('loading');
        elements.generateBtn.disabled = false;
        elements.generateBtn.innerHTML = originalText;
    }
}

function displayGeneratedEmails() {
    elements.emailCount.textContent = `${state.generatedMessages.length} email${state.generatedMessages.length !== 1 ? 's' : ''} generated`;
    renderEmailList(state.generatedMessages);
}

function renderEmailList(messages) {
    elements.emailsList.innerHTML = '';
    
    if (messages.length === 0) {
        elements.noResultsState.style.display = 'block';
        return;
    }
    
    elements.noResultsState.style.display = 'none';
    
    messages.forEach((msg, index) => {
        const trackingStatus = getContactStatus(msg.email);
        const statusBadge = getStatusBadge(trackingStatus);
        
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item collapsible';
        emailItem.dataset.email = msg.email;
        emailItem.dataset.name = msg.name;
        emailItem.dataset.status = trackingStatus;
        
        emailItem.innerHTML = `
            <button class="email-expand-toggle">
                <div class="email-header-left">
                    <div class="email-recipient">
                        <div class="recipient-name">${escapeHtml(msg.name || 'Unknown')}</div>
                        <div class="recipient-email">${escapeHtml(msg.email)}</div>
                    </div>
                    ${statusBadge}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>
            <div class="email-body-wrapper">
                <div class="email-content-inner">
                    <div class="email-actions">
                        <select class="status-select" data-email="${escapeHtml(msg.email)}">
                            <option value="pending" ${trackingStatus === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                            <option value="responded" ${trackingStatus === 'responded' ? 'selected' : ''}>💬 Responded</option>
                            <option value="signed" ${trackingStatus === 'signed' ? 'selected' : ''}>✅ Signed Up</option>
                            <option value="declined" ${trackingStatus === 'declined' ? 'selected' : ''}>❌ Declined</option>
                        </select>
                        <button class="copy-btn" data-index="${index}" data-tooltip="Copy email to clipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                            </svg>
                            Copy
                        </button>
                    </div>
                    <div class="email-subject">Subject: ${escapeHtml(msg.subject)}</div>
                    <div class="email-body">${escapeHtml(msg.body)}</div>
                </div>
            </div>
        `;
        
        elements.emailsList.appendChild(emailItem);
    });
    
    // Add event listeners
    document.querySelectorAll('.email-expand-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.email-item');
            item.classList.toggle('expanded');
        });
    });
    
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', handleCopyClick);
    });
    
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', handleStatusChange);
    });
}

function getStatusBadge(status) {
    const badges = {
        pending: '<span class="status-badge status-badge-pending"><span class="status-badge-icon">⏳</span> Pending</span>',
        responded: '<span class="status-badge status-badge-responded"><span class="status-badge-icon">💬</span> Responded</span>',
        signed: '<span class="status-badge status-badge-signed"><span class="status-badge-icon">✅</span> Signed Up</span>',
        declined: '<span class="status-badge status-badge-declined"><span class="status-badge-icon">❌</span> Declined</span>'
    };
    return badges[status] || badges.pending;
}

// ============================================
// SEARCH & SORT
// ============================================
function filterEmails() {
    const query = elements.emailSearch.value.toLowerCase().trim();
    state.searchQuery = query;
    
    let filtered = state.generatedMessages;
    
    if (query) {
        filtered = state.generatedMessages.filter(msg => 
            (msg.name && msg.name.toLowerCase().includes(query)) ||
            (msg.email && msg.email.toLowerCase().includes(query))
        );
    }
    
    // Apply current sort
    filtered = applySorting(filtered);
    
    renderEmailList(filtered);
}

function sortEmails() {
    state.sortBy = elements.emailSort.value;
    filterEmails();
}

function applySorting(messages) {
    const sorted = [...messages];
    
    switch (state.sortBy) {
        case 'name-asc':
            sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
            break;
        case 'name-desc':
            sorted.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
            break;
        case 'email-asc':
            sorted.sort((a, b) => (a.email || '').localeCompare(b.email || ''));
            break;
        case 'status':
            const statusOrder = { signed: 0, responded: 1, pending: 2, declined: 3 };
            sorted.sort((a, b) => {
                const statusA = getContactStatus(a.email);
                const statusB = getContactStatus(b.email);
                return (statusOrder[statusA] || 2) - (statusOrder[statusB] || 2);
            });
            break;
    }
    
    return sorted;
}

// ============================================
// COPY TO CLIPBOARD
// ============================================
function handleCopyClick(e) {
    const btn = e.currentTarget;
    const index = parseInt(btn.dataset.index);
    const msg = state.generatedMessages[index];
    
    const textToCopy = `To: ${msg.email}\nSubject: ${msg.subject}\n\n${msg.body}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        
        showToast('Email copied to clipboard!', 'success');
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
            `;
        }, 2000);
    });
}

// ============================================
// BATCH TRACKING
// ============================================
function loadBatches() {
    try {
        const encrypted = localStorage.getItem(STORAGE_KEYS.BATCHES);
        if (encrypted) {
            const data = Encryption.decrypt(encrypted);
            return data || [];
        }
        return [];
    } catch (e) {
        console.error('Error loading batches:', e);
        return [];
    }
}

function saveBatches(batches) {
    try {
        const encrypted = Encryption.encrypt(batches);
        if (encrypted) {
            localStorage.setItem(STORAGE_KEYS.BATCHES, encrypted);
        }
    } catch (e) {
        console.error('Error saving batches:', e);
    }
}

function createBatch(filename, contactCount, emails) {
    const batches = loadBatches();
    const batchId = 'batch_' + Date.now();
    const newBatch = {
        id: batchId,
        name: filename || `Batch ${batches.length + 1}`,
        timestamp: new Date().toISOString(),
        contactCount: contactCount,
        emails: emails // Array of email addresses in this batch
    };
    batches.unshift(newBatch); // Add to beginning
    saveBatches(batches);
    return batchId;
}

function getBatchById(batchId) {
    const batches = loadBatches();
    return batches.find(b => b.id === batchId);
}

// ============================================
// RESPONSE TRACKING (ENCRYPTED)
// ============================================
function loadTrackingData() {
    try {
        const encrypted = localStorage.getItem(STORAGE_KEYS.TRACKING);
        if (encrypted) {
            const data = Encryption.decrypt(encrypted);
            return data || {};
        }
        return {};
    } catch (e) {
        console.error('Error loading tracking data:', e);
        return {};
    }
}

function saveTrackingData(data) {
    try {
        const encrypted = Encryption.encrypt(data);
        if (encrypted) {
            localStorage.setItem(STORAGE_KEYS.TRACKING, encrypted);
        }
    } catch (e) {
        console.error('Error saving tracking data:', e);
    }
}

function addToTracking(messages, batchId = null) {
    const trackingData = loadTrackingData();
    const now = new Date().toISOString();
    
    messages.forEach(msg => {
        if (msg.email && !trackingData[msg.email]) {
            trackingData[msg.email] = {
                name: msg.name || 'Unknown',
                email: msg.email,
                status: 'pending',
                dateAdded: now,
                lastUpdated: now,
                batchId: batchId
            };
        }
    });
    
    saveTrackingData(trackingData);
    updateTrackingDisplay();
}

function getContactStatus(email) {
    const trackingData = loadTrackingData();
    return trackingData[email]?.status || 'pending';
}

function handleStatusChange(e) {
    const email = e.target.dataset.email;
    const newStatus = e.target.value;
    
    const trackingData = loadTrackingData();
    if (trackingData[email]) {
        trackingData[email].status = newStatus;
        trackingData[email].lastUpdated = new Date().toISOString();
        saveTrackingData(trackingData);
        updateTrackingDisplay();
        
        // Update badge in the email item
        const emailItem = document.querySelector(`.email-item[data-email="${email}"]`);
        if (emailItem) {
            const badge = emailItem.querySelector('.status-badge');
            if (badge) {
                badge.outerHTML = getStatusBadge(newStatus);
            }
            emailItem.dataset.status = newStatus;
        }
        
        showToast(`Status updated to ${newStatus}`, 'success');
    }
}

function updateTrackingDisplay() {
    const trackingData = loadTrackingData();
    const contacts = Object.values(trackingData);
    
    const stats = {
        pending: contacts.filter(c => c.status === 'pending').length,
        responded: contacts.filter(c => c.status === 'responded').length,
        signed: contacts.filter(c => c.status === 'signed').length,
        declined: contacts.filter(c => c.status === 'declined').length
    };
    
    document.getElementById('bar-pending').textContent = stats.pending;
    document.getElementById('bar-responded').textContent = stats.responded;
    document.getElementById('bar-signed').textContent = stats.signed;
    document.getElementById('bar-declined').textContent = stats.declined;
    
    elements.trackingTotal.textContent = `${contacts.length} total contact${contacts.length !== 1 ? 's' : ''}`;
    
    if (contacts.length > 0) {
        elements.trackingBar.classList.add('has-data');
    } else {
        elements.trackingBar.classList.remove('has-data');
    }
}

// Track current filters
let currentStatusFilter = 'all';
let currentBatchFilter = 'all';

function openTrackingModal() {
    renderBatchSelector();
    renderTrackingList('all', 'all');
    elements.trackingModal.style.display = 'flex';
}

function closeTrackingModal() {
    elements.trackingModal.style.display = 'none';
}

function handleFilterClick(e) {
    const filter = e.target.dataset.filter;
    currentStatusFilter = filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderTrackingList(currentStatusFilter, currentBatchFilter);
}

function handleBatchFilterClick(batchId) {
    currentBatchFilter = batchId;
    document.querySelectorAll('.batch-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.batchId === batchId);
    });
    renderTrackingList(currentStatusFilter, currentBatchFilter);
}

function renderBatchSelector() {
    const batches = loadBatches();
    const batchContainer = document.getElementById('batch-filters');
    
    if (!batchContainer) return;
    
    if (batches.length === 0) {
        batchContainer.innerHTML = '<p class="no-batches">No upload batches yet</p>';
        return;
    }
    
    batchContainer.innerHTML = `
        <button class="batch-filter-btn active" data-batch-id="all">All Batches</button>
        ${batches.map(batch => `
            <button class="batch-filter-btn" data-batch-id="${batch.id}" data-tooltip="${formatDateTime(batch.timestamp)}">
                📁 ${escapeHtml(batch.name.length > 20 ? batch.name.substring(0, 17) + '...' : batch.name)}
                <span class="batch-count">${batch.contactCount}</span>
            </button>
        `).join('')}
    `;
    
    batchContainer.querySelectorAll('.batch-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => handleBatchFilterClick(btn.dataset.batchId));
    });
}

function renderTrackingList(statusFilter, batchFilter) {
    const trackingData = loadTrackingData();
    let contacts = Object.values(trackingData);
    
    // Apply status filter
    if (statusFilter !== 'all') {
        contacts = contacts.filter(c => c.status === statusFilter);
    }
    
    // Apply batch filter
    if (batchFilter !== 'all') {
        contacts = contacts.filter(c => c.batchId === batchFilter);
    }
    
    contacts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    if (contacts.length === 0) {
        elements.trackingList.innerHTML = `
            <div class="tracking-empty">
                <div class="empty-state-icon">📭</div>
                <p>No contacts found${statusFilter !== 'all' ? ' with this status' : ''}${batchFilter !== 'all' ? ' in this batch' : ''}.</p>
            </div>
        `;
        return;
    }
    
    // Get batch info for display
    const batches = loadBatches();
    const getBatchName = (batchId) => {
        const batch = batches.find(b => b.id === batchId);
        return batch ? batch.name : 'Unknown';
    };
    
    elements.trackingList.innerHTML = contacts.map(contact => `
        <div class="tracking-item" data-status="${contact.status}">
            <div class="tracking-item-info">
                <div class="tracking-item-name">${escapeHtml(contact.name)}</div>
                <div class="tracking-item-email">${escapeHtml(contact.email)}</div>
                <div class="tracking-item-meta">
                    <span class="tracking-item-date">Added: ${formatDate(contact.dateAdded)}</span>
                    ${contact.batchId ? `<span class="tracking-item-batch">📁 ${escapeHtml(getBatchName(contact.batchId))}</span>` : ''}
                </div>
            </div>
            <select class="status-select-modal" data-email="${escapeHtml(contact.email)}">
                <option value="pending" ${contact.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="responded" ${contact.status === 'responded' ? 'selected' : ''}>💬 Responded</option>
                <option value="signed" ${contact.status === 'signed' ? 'selected' : ''}>✅ Signed Up</option>
                <option value="declined" ${contact.status === 'declined' ? 'selected' : ''}>❌ Declined</option>
            </select>
        </div>
    `).join('');
    
    elements.trackingList.querySelectorAll('.status-select-modal').forEach(select => {
        select.addEventListener('change', (e) => {
            handleStatusChange(e);
            const item = e.target.closest('.tracking-item');
            item.dataset.status = e.target.value;
        });
    });
}

function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

function clearTrackingData() {
    if (confirm('Are you sure you want to clear all tracking data? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEYS.TRACKING);
        updateTrackingDisplay();
        renderTrackingList('all');
        showToast('Tracking data cleared', 'info');
    }
}

function exportTrackingData() {
    const trackingData = loadTrackingData();
    const contacts = Object.values(trackingData);
    
    if (contacts.length === 0) {
        showToast('No tracking data to export', 'warning');
        return;
    }
    
    // Create CSV
    let csv = 'Name,Email,Status,Date Added,Last Updated\n';
    contacts.forEach(c => {
        csv += `"${c.name}","${c.email}","${c.status}","${c.dateAdded}","${c.lastUpdated}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, 'tracking_data.csv');
    showToast('Tracking data exported!', 'success');
}

// ============================================
// DASHBOARD
// ============================================
function openDashboardModal() {
    renderDashboard();
    elements.dashboardModal.style.display = 'flex';
}

function closeDashboardModal() {
    elements.dashboardModal.style.display = 'none';
}

function renderDashboard() {
    const trackingData = loadTrackingData();
    const contacts = Object.values(trackingData);
    
    const stats = {
        total: contacts.length,
        pending: contacts.filter(c => c.status === 'pending').length,
        responded: contacts.filter(c => c.status === 'responded').length,
        signed: contacts.filter(c => c.status === 'signed').length,
        declined: contacts.filter(c => c.status === 'declined').length
    };
    
    const responseRate = stats.total > 0 ? Math.round(((stats.responded + stats.signed + stats.declined) / stats.total) * 100) : 0;
    const conversionRate = stats.total > 0 ? Math.round((stats.signed / stats.total) * 100) : 0;
    
    // Update stat cards
    document.getElementById('stat-total').textContent = stats.total;
    document.getElementById('stat-response-rate').textContent = responseRate + '%';
    document.getElementById('stat-conversion').textContent = conversionRate + '%';
    document.getElementById('stat-signed').textContent = stats.signed;
    
    // Render pie chart
    renderPieChart(stats);
    
    // Render funnel
    renderFunnel(stats);
}

function renderPieChart(stats) {
    const container = document.getElementById('pie-chart-container');
    const total = stats.total || 1;
    
    const data = [
        { label: 'Pending', value: stats.pending, color: '#f39c12' },
        { label: 'Responded', value: stats.responded, color: '#3498db' },
        { label: 'Signed Up', value: stats.signed, color: '#27ae60' },
        { label: 'Declined', value: stats.declined, color: '#e74c3c' }
    ].filter(d => d.value > 0);
    
    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><p>No data to display</p></div>';
        return;
    }
    
    // Simple CSS pie chart
    let gradientParts = [];
    let currentAngle = 0;
    
    data.forEach(segment => {
        const angle = (segment.value / total) * 360;
        gradientParts.push(`${segment.color} ${currentAngle}deg ${currentAngle + angle}deg`);
        currentAngle += angle;
    });
    
    const pieStyle = `background: conic-gradient(${gradientParts.join(', ')});`;
    
    container.innerHTML = `
        <div style="display: flex; align-items: center; gap: 2rem; justify-content: center; height: 100%;">
            <div class="pie-chart" style="${pieStyle}"></div>
            <div class="pie-legend">
                ${data.map(d => `
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <div style="width: 12px; height: 12px; border-radius: 2px; background: ${d.color};"></div>
                        <span>${d.label}: ${d.value} (${Math.round(d.value / total * 100)}%)</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderFunnel(stats) {
    const funnel = document.getElementById('funnel-chart');
    const total = stats.total || 1;
    
    const steps = [
        { label: 'Contacted', value: stats.total, color: '#5AAFE0' },
        { label: 'Responded', value: stats.responded + stats.signed, color: '#3498db' },
        { label: 'Signed Up', value: stats.signed, color: '#27ae60' }
    ];
    
    funnel.innerHTML = steps.map(step => `
        <div class="funnel-step">
            <span class="funnel-label">${step.label}</span>
            <div class="funnel-bar" style="width: ${(step.value / total) * 100}%; background: ${step.color};">
                ${step.value}
            </div>
        </div>
    `).join('');
}

// ============================================
// HELP MODAL
// ============================================
function openHelpModal() {
    elements.helpModal.style.display = 'flex';
}

function closeHelpModal() {
    elements.helpModal.style.display = 'none';
}

// ============================================
// DOWNLOADS
// ============================================
async function downloadCsv() {
    if (state.generatedMessages.length === 0) return;
    
    elements.downloadCsv.classList.add('loading');
    elements.downloadCsv.disabled = true;
    
    try {
        const response = await fetch('/download/csv', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: state.generatedMessages })
        });
        
        if (!response.ok) throw new Error('Failed to download CSV');
        
        const blob = await response.blob();
        downloadBlob(blob, 'hope_recruitment_emails.csv');
        showToast('CSV downloaded successfully!', 'success');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        elements.downloadCsv.classList.remove('loading');
        elements.downloadCsv.disabled = false;
    }
}

async function downloadZip() {
    if (state.generatedMessages.length === 0) return;
    
    elements.downloadZip.classList.add('loading');
    elements.downloadZip.disabled = true;
    
    try {
        const response = await fetch('/download/zip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages: state.generatedMessages })
        });
        
        if (!response.ok) throw new Error('Failed to download ZIP');
        
        const blob = await response.blob();
        downloadBlob(blob, 'hope_recruitment_emails.zip');
        showToast('ZIP downloaded successfully!', 'success');
        
    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        elements.downloadZip.classList.remove('loading');
        elements.downloadZip.disabled = false;
    }
}

function downloadBlob(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// ============================================
// NAVIGATION
// ============================================
function goToStep(step) {
    state.currentStep = step;
    
    elements.steps.forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });
    
    Object.entries(elements.sections).forEach(([sectionStep, sectionEl]) => {
        sectionEl.style.display = parseInt(sectionStep) === step ? 'block' : 'none';
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetApp() {
    state.volunteers = [];
    state.generatedMessages = [];
    state.selectedTemplate = 'general';
    state.searchQuery = '';
    state.sortBy = 'name-asc';
    
    // Clear form elements
    elements.fileInput.value = '';
    elements.customSubject.value = '';
    elements.customBody.value = '';
    elements.customFields.style.display = 'none';
    elements.filePreview.style.display = 'none';
    
    // Clear caches
    localStorage.removeItem(STORAGE_KEYS.VOLUNTEERS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
    
    // Reset template selection
    selectTemplate('general');
    filterTemplatesByCategory('initial');
    
    // Reset category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === 'initial');
    });
    
    // Reset search/sort
    if (elements.emailSearch) elements.emailSearch.value = '';
    if (elements.emailSort) elements.emailSort.value = 'name-asc';
    
    goToStep(1);
    showToast('Ready for a new batch!', 'info');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showUploadStatus(show) {
    elements.uploadStatus.style.display = show ? 'block' : 'none';
}

function showError(message) {
    elements.errorMessage.textContent = message;
    elements.errorMessage.style.display = 'block';
}

function hideError() {
    elements.errorMessage.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', init);
