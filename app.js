/**
 * HOPE Smart Recruitment Messenger (HSRM) - Frontend JavaScript
 * Handles file upload, template selection, email generation, downloads, and response tracking
 */

// State management
const state = {
    volunteers: [],
    generatedMessages: [],
    selectedTemplate: 'general',
    currentStep: 1,
    currentCategory: 'initial'
};

// Response Tracking Storage Key
const TRACKING_STORAGE_KEY = 'hsrm_tracking_data';

// DOM Elements
const elements = {
    // Upload section
    uploadZone: document.getElementById('upload-zone'),
    fileInput: document.getElementById('file-input'),
    uploadStatus: document.getElementById('upload-status'),
    errorMessage: document.getElementById('error-message'),
    
    // Preview section
    previewTbody: document.getElementById('preview-tbody'),
    volunteerCount: document.getElementById('volunteer-count'),
    templatesGrid: document.getElementById('templates-grid'),
    categoryTabs: document.getElementById('category-tabs'),
    
    // Custom template
    toggleCustomBtn: document.getElementById('toggle-custom'),
    customFields: document.getElementById('custom-fields'),
    customSubject: document.getElementById('custom-subject'),
    customBody: document.getElementById('custom-body'),
    
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
    clearTracking: document.getElementById('clear-tracking'),
    trackingModal: document.getElementById('tracking-modal'),
    trackingModalClose: document.getElementById('tracking-modal-close'),
    trackingList: document.getElementById('tracking-list'),
    
    // Steps
    steps: document.querySelectorAll('.step'),
    sections: {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        3: document.getElementById('step-3')
    }
};

// Initialize the application
function init() {
    setupEventListeners();
    selectTemplate('general');
    filterTemplatesByCategory('initial');
    loadTrackingData();
    updateTrackingDisplay();
}

// Event Listeners Setup
function setupEventListeners() {
    // File upload events
    elements.uploadZone.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // Drag and drop
    elements.uploadZone.addEventListener('dragover', handleDragOver);
    elements.uploadZone.addEventListener('dragleave', handleDragLeave);
    elements.uploadZone.addEventListener('drop', handleDrop);
    
    // Template selection
    elements.templatesGrid.addEventListener('click', handleTemplateClick);
    
    // Category tabs
    elements.categoryTabs.addEventListener('click', handleCategoryClick);
    
    // Custom template toggle
    elements.toggleCustomBtn.addEventListener('click', toggleCustomFields);
    
    // Navigation
    elements.backToUpload.addEventListener('click', () => goToStep(1));
    elements.generateBtn.addEventListener('click', generateEmails);
    elements.backToTemplate.addEventListener('click', () => goToStep(2));
    elements.startOver.addEventListener('click', resetApp);
    
    // Downloads
    elements.downloadCsv.addEventListener('click', downloadCsv);
    elements.downloadZip.addEventListener('click', downloadZip);
    
    // Template Modal
    elements.modalClose.addEventListener('click', closeModal);
    elements.templateModal.querySelector('.modal-overlay').addEventListener('click', closeModal);
    
    // Tracking events
    elements.viewTracking.addEventListener('click', openTrackingModal);
    elements.clearTracking.addEventListener('click', clearTrackingData);
    elements.trackingModalClose.addEventListener('click', closeTrackingModal);
    elements.trackingModal.querySelector('.modal-overlay').addEventListener('click', closeTrackingModal);
    
    // Tracking filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
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
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

async function processFile(file) {
    // Validate file type
    const validTypes = ['csv', 'docx', 'pdf'];
    const extension = file.name.split('.').pop().toLowerCase();
    
    if (!validTypes.includes(extension)) {
        showError('Please upload a CSV, DOCX, or PDF file.');
        return;
    }
    
    // Show loading state
    showUploadStatus(true);
    hideError();
    
    try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to process file');
        }
        
        // Store volunteers and proceed
        state.volunteers = data.data;
        showUploadStatus(false);
        
        // Populate preview table
        populatePreviewTable();
        
        // Move to step 2
        goToStep(2);
        
    } catch (error) {
        showUploadStatus(false);
        showError(error.message);
    }
}

function populatePreviewTable() {
    elements.previewTbody.innerHTML = '';
    elements.volunteerCount.textContent = `${state.volunteers.length} volunteer${state.volunteers.length !== 1 ? 's' : ''} found`;
    
    state.volunteers.forEach(volunteer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(volunteer.name || '-')}</td>
            <td>${escapeHtml(volunteer.email || '-')}</td>
            <td>${escapeHtml(volunteer.phone || '-')}</td>
            <td>${escapeHtml(volunteer.interests || '-')}</td>
            <td>${escapeHtml(volunteer.location || '-')}</td>
        `;
        elements.previewTbody.appendChild(row);
    });
}

// ============================================
// TEMPLATE SELECTION
// ============================================

function handleCategoryClick(e) {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;
    
    const category = tab.dataset.category;
    filterTemplatesByCategory(category);
    
    // Update active tab
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
}

function filterTemplatesByCategory(category) {
    state.currentCategory = category;
    
    document.querySelectorAll('.template-card').forEach(card => {
        const cardCategory = card.dataset.category;
        card.style.display = cardCategory === category ? 'block' : 'none';
    });
    
    // Select first visible template in category if current selection isn't visible
    const currentSelected = document.querySelector(`.template-card.selected`);
    if (!currentSelected || currentSelected.style.display === 'none') {
        const firstVisible = document.querySelector(`.template-card[data-category="${category}"]`);
        if (firstVisible) {
            selectTemplate(firstVisible.dataset.templateId);
        }
    }
}

function handleTemplateClick(e) {
    // Handle preview button click
    if (e.target.classList.contains('preview-template-btn')) {
        const templateId = e.target.dataset.templateId;
        showTemplatePreview(templateId);
        return;
    }
    
    // Handle template card selection
    const card = e.target.closest('.template-card');
    if (card) {
        const templateId = card.dataset.templateId;
        selectTemplate(templateId);
    }
}

function selectTemplate(templateId) {
    state.selectedTemplate = templateId;
    
    // Update UI
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

// Custom Template Toggle
function toggleCustomFields() {
    const isVisible = elements.customFields.style.display !== 'none';
    elements.customFields.style.display = isVisible ? 'none' : 'block';
}

// ============================================
// EMAIL GENERATION
// ============================================

async function generateEmails() {
    if (state.volunteers.length === 0) {
        showError('No volunteer data available. Please upload a file first.');
        return;
    }
    
    elements.generateBtn.disabled = true;
    elements.generateBtn.textContent = 'Generating...';
    
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
        
        // Add to tracking
        addToTracking(state.generatedMessages);
        
        displayGeneratedEmails();
        goToStep(3);
        
    } catch (error) {
        showError(error.message);
    } finally {
        elements.generateBtn.disabled = false;
        elements.generateBtn.textContent = 'Generate Emails →';
    }
}

function displayGeneratedEmails() {
    elements.emailCount.textContent = `${state.generatedMessages.length} email${state.generatedMessages.length !== 1 ? 's' : ''} generated`;
    elements.emailsList.innerHTML = '';
    
    state.generatedMessages.forEach((msg, index) => {
        const trackingStatus = getContactStatus(msg.email);
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        emailItem.innerHTML = `
            <div class="email-header">
                <div class="email-recipient">
                    <div class="recipient-name">${escapeHtml(msg.name || 'Unknown')}</div>
                    <div class="recipient-email">${escapeHtml(msg.email)}</div>
                </div>
                <div class="email-actions">
                    <select class="status-select" data-email="${escapeHtml(msg.email)}">
                        <option value="pending" ${trackingStatus === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                        <option value="responded" ${trackingStatus === 'responded' ? 'selected' : ''}>💬 Responded</option>
                        <option value="signed" ${trackingStatus === 'signed' ? 'selected' : ''}>✅ Signed Up</option>
                        <option value="declined" ${trackingStatus === 'declined' ? 'selected' : ''}>❌ Declined</option>
                    </select>
                    <button class="copy-btn" data-index="${index}">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                        Copy
                    </button>
                </div>
            </div>
            <div class="email-subject">Subject: ${escapeHtml(msg.subject)}</div>
            <div class="email-body" id="body-${index}">${escapeHtml(msg.body)}</div>
            <button class="expand-btn" data-index="${index}">Show more</button>
        `;
        elements.emailsList.appendChild(emailItem);
    });
    
    // Add event listeners for copy, expand, and status buttons
    elements.emailsList.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', handleCopyClick);
    });
    
    elements.emailsList.querySelectorAll('.expand-btn').forEach(btn => {
        btn.addEventListener('click', handleExpandClick);
    });
    
    elements.emailsList.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', handleStatusChange);
    });
}

function handleCopyClick(e) {
    const btn = e.currentTarget;
    const index = parseInt(btn.dataset.index);
    const msg = state.generatedMessages[index];
    
    const textToCopy = `To: ${msg.email}\nSubject: ${msg.subject}\n\n${msg.body}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        btn.classList.add('copied');
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        `;
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
            `;
        }, 2000);
    });
}

function handleExpandClick(e) {
    const btn = e.currentTarget;
    const index = btn.dataset.index;
    const bodyEl = document.getElementById(`body-${index}`);
    
    bodyEl.classList.toggle('expanded');
    btn.textContent = bodyEl.classList.contains('expanded') ? 'Show less' : 'Show more';
}

// ============================================
// RESPONSE TRACKING
// ============================================

function loadTrackingData() {
    try {
        const data = localStorage.getItem(TRACKING_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error('Error loading tracking data:', e);
        return {};
    }
}

function saveTrackingData(data) {
    try {
        localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('Error saving tracking data:', e);
    }
}

function addToTracking(messages) {
    const trackingData = loadTrackingData();
    const now = new Date().toISOString();
    
    messages.forEach(msg => {
        if (msg.email && !trackingData[msg.email]) {
            trackingData[msg.email] = {
                name: msg.name || 'Unknown',
                email: msg.email,
                status: 'pending',
                dateAdded: now,
                lastUpdated: now
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
    
    // Update tracking bar stats
    document.getElementById('bar-pending').textContent = stats.pending;
    document.getElementById('bar-responded').textContent = stats.responded;
    document.getElementById('bar-signed').textContent = stats.signed;
    document.getElementById('bar-declined').textContent = stats.declined;
    
    // Update total count
    elements.trackingTotal.textContent = `${contacts.length} total contact${contacts.length !== 1 ? 's' : ''}`;
    
    // Show/hide tracking bar based on whether there's data
    if (contacts.length > 0) {
        elements.trackingBar.classList.add('has-data');
    } else {
        elements.trackingBar.classList.remove('has-data');
    }
}

function openTrackingModal() {
    renderTrackingList('all');
    elements.trackingModal.style.display = 'flex';
}

function closeTrackingModal() {
    elements.trackingModal.style.display = 'none';
}

function handleFilterClick(e) {
    const filter = e.target.dataset.filter;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    renderTrackingList(filter);
}

function renderTrackingList(filter) {
    const trackingData = loadTrackingData();
    let contacts = Object.values(trackingData);
    
    // Apply filter
    if (filter !== 'all') {
        contacts = contacts.filter(c => c.status === filter);
    }
    
    // Sort by date added (newest first)
    contacts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    
    if (contacts.length === 0) {
        elements.trackingList.innerHTML = `
            <div class="tracking-empty">
                <p>No contacts found${filter !== 'all' ? ' with this status' : ''}.</p>
            </div>
        `;
        return;
    }
    
    elements.trackingList.innerHTML = contacts.map(contact => `
        <div class="tracking-item" data-status="${contact.status}">
            <div class="tracking-item-info">
                <div class="tracking-item-name">${escapeHtml(contact.name)}</div>
                <div class="tracking-item-email">${escapeHtml(contact.email)}</div>
                <div class="tracking-item-date">Added: ${formatDate(contact.dateAdded)}</div>
            </div>
            <select class="status-select-modal" data-email="${escapeHtml(contact.email)}">
                <option value="pending" ${contact.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
                <option value="responded" ${contact.status === 'responded' ? 'selected' : ''}>💬 Responded</option>
                <option value="signed" ${contact.status === 'signed' ? 'selected' : ''}>✅ Signed Up</option>
                <option value="declined" ${contact.status === 'declined' ? 'selected' : ''}>❌ Declined</option>
            </select>
        </div>
    `).join('');
    
    // Add event listeners for status changes in modal
    elements.trackingList.querySelectorAll('.status-select-modal').forEach(select => {
        select.addEventListener('change', (e) => {
            handleStatusChange(e);
            // Update the item's visual status
            const item = e.target.closest('.tracking-item');
            item.dataset.status = e.target.value;
        });
    });
}

function clearTrackingData() {
    if (confirm('Are you sure you want to clear all tracking data? This cannot be undone.')) {
        localStorage.removeItem(TRACKING_STORAGE_KEY);
        updateTrackingDisplay();
    }
}

function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================
// DOWNLOADS
// ============================================

async function downloadCsv() {
    if (state.generatedMessages.length === 0) return;
    
    elements.downloadCsv.disabled = true;
    
    try {
        const response = await fetch('/download/csv', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: state.generatedMessages })
        });
        
        if (!response.ok) {
            throw new Error('Failed to download CSV');
        }
        
        const blob = await response.blob();
        downloadBlob(blob, 'hope_recruitment_emails.csv');
        
    } catch (error) {
        showError(error.message);
    } finally {
        elements.downloadCsv.disabled = false;
    }
}

async function downloadZip() {
    if (state.generatedMessages.length === 0) return;
    
    elements.downloadZip.disabled = true;
    
    try {
        const response = await fetch('/download/zip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ messages: state.generatedMessages })
        });
        
        if (!response.ok) {
            throw new Error('Failed to download ZIP');
        }
        
        const blob = await response.blob();
        downloadBlob(blob, 'hope_recruitment_emails.zip');
        
    } catch (error) {
        showError(error.message);
    } finally {
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
    
    // Update step indicators
    elements.steps.forEach((stepEl, index) => {
        const stepNum = index + 1;
        stepEl.classList.remove('active', 'completed');
        
        if (stepNum < step) {
            stepEl.classList.add('completed');
        } else if (stepNum === step) {
            stepEl.classList.add('active');
        }
    });
    
    // Show/hide sections
    Object.entries(elements.sections).forEach(([sectionStep, sectionEl]) => {
        sectionEl.style.display = parseInt(sectionStep) === step ? 'block' : 'none';
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetApp() {
    state.volunteers = [];
    state.generatedMessages = [];
    state.selectedTemplate = 'general';
    
    // Reset form elements
    elements.fileInput.value = '';
    elements.customSubject.value = '';
    elements.customBody.value = '';
    elements.customFields.style.display = 'none';
    
    // Reset template selection
    selectTemplate('general');
    filterTemplatesByCategory('initial');
    
    // Reset category tabs
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === 'initial');
    });
    
    // Go back to step 1
    goToStep(1);
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
