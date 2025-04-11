// Main JavaScript for ProfessorPhD2025v1

// DOM Elements
const loginSection = document.getElementById('login-section');
const chatSection = document.getElementById('chat-section');
const uploadSection = document.getElementById('upload-section');
const vectorStoreSection = document.getElementById('vector-store-section');
const visualizationSection = document.getElementById('visualization-section');
const settingsSection = document.getElementById('settings-section');

const navItems = document.querySelectorAll('.nav-item');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const apiKeyInput = document.getElementById('api-key');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const chatMessages = document.getElementById('chat-messages');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const fileList = document.getElementById('file-list');
const saveSettingsBtn = document.getElementById('save-settings');

// Default credentials
const DEFAULT_USERNAME = 'disraeli';
const DEFAULT_PASSWORD = 'torrent77';

// Application State
let isLoggedIn = false;
let currentSection = 'login';
let chatHistory = [];
let uploadedFiles = [];
let settings = {
    model: 'gpt-4.5-preview',
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4000,
    systemMessage: 'You are an academic research assistant helping PhD students with their research.',
    chunkSize: 500,
    chunkOverlap: 50,
    retrievalCount: 5
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is already logged in (could use localStorage in a real app)
    if (isLoggedIn) {
        showSection('chat');
    } else {
        showSection('login');
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Initialize range sliders
    updateRangeValues();
});

// Initialize Event Listeners
function initEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            showSection(section);
        });
    });
    
    // Login
    loginBtn.addEventListener('click', handleLogin);
    
    // Logout
    logoutBtn.addEventListener('click', handleLogout);
    
    // Chat
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // File Upload
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#1e3a8a';
    });
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd';
    });
    uploadArea.addEventListener('drop', handleFileDrop);
    fileInput.addEventListener('change', handleFileSelect);
    
    // Settings
    document.getElementById('temperature').addEventListener('input', updateRangeValues);
    document.getElementById('top-p').addEventListener('input', updateRangeValues);
    document.getElementById('system-message-preset').addEventListener('change', handleSystemMessagePreset);
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // Vector Store buttons
    document.querySelectorAll('.vector-store-actions button').forEach(btn => {
        btn.addEventListener('click', handleVectorStoreAction);
    });
    
    document.querySelector('.btn-create-store').addEventListener('click', createVectorStore);
    
    // Visualization buttons
    document.querySelectorAll('.btn-generate').forEach(btn => {
        btn.addEventListener('click', generateVisualization);
    });
}

// Show Section
function showSection(section) {
    // Hide all sections
    loginSection.classList.add('hidden');
    chatSection.classList.add('hidden');
    uploadSection.classList.add('hidden');
    vectorStoreSection.classList.add('hidden');
    visualizationSection.classList.add('hidden');
    settingsSection.classList.add('hidden');
    
    // Show selected section
    if (section === 'login') {
        loginSection.classList.remove('hidden');
    } else if (section === 'chat') {
        chatSection.classList.remove('hidden');
    } else if (section === 'upload') {
        uploadSection.classList.remove('hidden');
    } else if (section === 'vector-store') {
        vectorStoreSection.classList.remove('hidden');
    } else if (section === 'visualization') {
        visualizationSection.classList.remove('hidden');
    } else if (section === 'settings') {
        settingsSection.classList.remove('hidden');
    }
    
    // Update navigation
    navItems.forEach(item => {
        if (item.getAttribute('data-section') === section) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    currentSection = section;
}

// Handle Login
function handleLogin() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }
    
    // Check credentials (in a real app, this would be a server request)
    if (username === DEFAULT_USERNAME && password === DEFAULT_PASSWORD) {
        isLoggedIn = true;
        
        // Store API key if provided
        if (apiKey) {
            // In a real app, this would be stored securely
            console.log('API Key provided:', apiKey);
        }
        
        // Show chat section
        showSection('chat');
        
        // Add welcome message
        setTimeout(() => {
            addSystemMessage('Login successful. Welcome to ProfessorPhD2025v1! How can I assist with your research today?');
        }, 500);
    } else {
        alert('Invalid credentials. Please try again or use the default credentials.');
    }
}

// Handle Logout
function handleLogout() {
    isLoggedIn = false;
    showSection('login');
    
    // Clear inputs
    usernameInput.value = '';
    passwordInput.value = '';
    apiKeyInput.value = '';
    
    // Clear chat
    chatMessages.innerHTML = `
        <div class="message system">
            <div class="message-content">
                Welcome to ProfessorPhD2025v1, your Academic Intelligence Assistant. How can I help with your research today?
            </div>
        </div>
    `;
    chatInput.value = '';
    chatHistory = [];
}

// Send Message
function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input
    chatInput.value = '';
    
    // Simulate AI response (in a real app, this would call the OpenAI API)
    simulateAIResponse(message);
}

// Add User Message
function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({ role: 'user', content: message });
}

// Add System Message
function addSystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message system';
    messageElement.innerHTML = `
        <div class="message-content">${message}</div>
    `;
    chatMessages.appendChild(messageElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Add to history
    chatHistory.push({ role: 'system', content: message });
}

// Simulate AI Response
function simulateAIResponse(userMessage) {
    // Show typing indicator
    const typingElement = document.createElement('div');
    typingElement.className = 'message system';
    typingElement.innerHTML = `
        <div class="message-content">Thinking...</div>
    `;
    chatMessages.appendChild(typingElement);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Simulate delay
    setTimeout(() => {
        // Remove typing indicator
        chatMessages.removeChild(typingElement);
        
        // Generate response based on user message
        let response = '';
        
        if (userMessage.toLowerCase().includes('hello') || userMessage.toLowerCase().includes('hi')) {
            response = 'Hello! How can I assist with your academic research today?';
        } else if (userMessage.toLowerCase().includes('help')) {
            response = 'I can help you with literature reviews, data analysis, research questions, and more. What specific area are you working on?';
        } else if (userMessage.toLowerCase().includes('research')) {
            response = 'Research is at the heart of academic progress. Could you tell me more about your research topic or question?';
        } else if (userMessage.toLowerCase().includes('paper') || userMessage.toLowerCase().includes('article')) {
            response = 'Academic papers require careful planning and execution. Are you looking for help with structuring, writing, or reviewing your paper?';
        } else if (userMessage.toLowerCase().includes('data')) {
            response = 'Data analysis is crucial for research. What kind of data are you working with, and what insights are you hoping to extract?';
        } else if (userMessage.toLowerCase().includes('literature') || userMessage.toLowerCase().includes('review')) {
            response = 'Literature reviews help establish the foundation of your research. Would you like assistance with finding relevant papers, organizing information, or synthesizing findings?';
        } else if (userMessage.toLowerCase().includes('methodology')) {
            response = 'Research methodology defines the validity of your work. Are you considering qualitative, quantitative, or mixed methods approaches?';
        } else if (userMessage.toLowerCase().includes('citation') || userMessage.toLowerCase().includes('reference')) {
            response = 'Proper citations are essential in academic work. Which citation style are you using (APA, MLA, Chicago, etc.)?';
        } else if (userMessage.toLowerCase().includes('thank')) {
            response = "You're welcome! If you have any other questions or need further assistance with your research, don't hesitate to ask.";
        } else {
            response = "That's an interesting point. In academic research, it's important to approach topics with critical thinking and methodological rigor. Could you elaborate more on what specific aspects you're interested in exploring?";
        }
        
        // Add AI response
        addSystemMessage(response);
    }, 1500);
}

// Handle File Drop
function handleFileDrop(e) {
    e.preventDefault();
    uploadArea.style.borderColor = '#ddd';
    
    if (e.dataTransfer.items) {
        // Use DataTransferItemList interface
        for (let i = 0; i < e.dataTransfer.items.length; i++) {
            if (e.dataTransfer.items[i].kind === 'file') {
                const file = e.dataTransfer.items[i].getAsFile();
                processFile(file);
            }
        }
    } else {
        // Use DataTransfer interface
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
            processFile(e.dataTransfer.files[i]);
        }
    }
}

// Handle File Select
function handleFileSelect(e) {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
        processFile(files[i]);
    }
}

// Process File
function processFile(file) {
    // Check if file is already in the list
    if (uploadedFiles.some(f => f.name === file.name && f.size === file.size)) {
        alert(`File "${file.name}" is already in the list.`);
        return;
    }
    
    // Add file to list
    uploadedFiles.push(file);
    
    // Create file item element
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    // Determine file icon based on type
    let fileIcon = '📄';
    if (file.name.endsWith('.pdf')) {
        fileIcon = '📕';
    } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
        fileIcon = '📝';
    } else if (file.name.endsWith('.txt')) {
        fileIcon = '📃';
    } else if (file.name.endsWith('.epub')) {
        fileIcon = '📚';
    }
    
    fileItem.innerHTML = `
        <div class="file-name">
            <span class="file-icon">${fileIcon}</span>
            ${file.name}
        </div>
        <div class="file-actions">
            <button class="btn-view" data-file="${file.name}">View</button>
            <button class="btn-delete" data-file="${file.name}">Delete</button>
        </div>
    `;
    
    // Add file item to list
    fileList.appendChild(fileItem);
    
    // Add event listeners to buttons
    fileItem.querySelector('.btn-view').addEventListener('click', () => viewFile(file.name));
    fileItem.querySelector('.btn-delete').addEventListener('click', () => deleteFile(file.name));
    
    // Show success message
    alert(`File "${file.name}" uploaded successfully.`);
}

// View File
function viewFile(fileName) {
    alert(`Viewing file: ${fileName}`);
    // In a real app, this would open a preview of the file
}

// Delete File
function deleteFile(fileName) {
    // Remove file from list
    uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
    
    // Remove file item from DOM
    const fileItems = fileList.querySelectorAll('.file-item');
    fileItems.forEach(item => {
        if (item.querySelector('.file-name').textContent.trim().includes(fileName)) {
            fileList.removeChild(item);
        }
    });
    
    alert(`File "${fileName}" deleted.`);
}

// Update Range Values
function updateRangeValues() {
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');
    const topPSlider = document.getElementById('top-p');
    const topPValue = document.getElementById('top-p-value');
    
    temperatureValue.textContent = temperatureSlider.value;
    topPValue.textContent = topPSlider.value;
}

// Handle System Message Preset
function handleSystemMessagePreset() {
    const preset = document.getElementById('system-message-preset').value;
    const systemMessageTextarea = document.getElementById('system-message');
    
    if (preset === 'academic-researcher') {
        systemMessageTextarea.value = 'You are an academic research assistant helping PhD students with their research. Provide detailed, scholarly responses with references to academic literature when possible.';
    } else if (preset === 'literature-review') {
        systemMessageTextarea.value = 'You are a literature review specialist. Help researchers identify key papers, synthesize findings, and identify gaps in the literature. Organize information in a structured manner.';
    } else if (preset === 'data-analysis') {
        systemMessageTextarea.value = 'You are a data analysis expert. Help researchers with statistical methods, data visualization, and interpretation of results. Provide code examples when relevant.';
    } else if (preset === 'custom') {
        // Keep current value or clear
        if (!systemMessageTextarea.value) {
            systemMessageTextarea.value = '';
        }
    }
}

// Save Settings
function saveSettings() {
    settings.model = document.getElementById('model-select').value;
    settings.temperature = parseFloat(document.getElementById('temperature').value);
    settings.topP = parseFloat(document.getElementById('top-p').value);
    settings.maxTokens = parseInt(document.getElementById('max-tokens').value);
    settings.systemMessage = document.getElementById('system-message').value;
    settings.chunkSize = parseInt(document.getElementById('chunk-size').value);
    settings.chunkOverlap = parseInt(document.getElementById('chunk-overlap').value);
    settings.retrievalCount = parseInt(document.getElementById('retrieval-count').value);
    
    alert('Settings saved successfully!');
    console.log('Settings saved:', settings);
}

// Handle Vector Store Action
function handleVectorStoreAction(e) {
    const action = e.target.classList.contains('btn-view') ? 'view' :
                  e.target.classList.contains('btn-update') ? 'update' :
                  e.target.classList.contains('btn-delete') ? 'delete' : '';
    
    const storeName = e.target.closest('.vector-store-item').querySelector('h3').textContent;
    
    if (action === 'view') {
        alert(`Viewing vector store: ${storeName}`);
    } else if (action === 'update') {
        alert(`Updating vector store: ${storeName}`);
    } else if (action === 'delete') {
        if (confirm(`Are you sure you want to delete the vector store "${storeName}"?`)) {
            alert(`Vector store "${storeName}" deleted.`);
            e.target.closest('.vector-store-item').remove();
        }
    }
}

// Create Vector Store
function createVectorStore() {
    const storeName = prompt('Enter a name for the new vector store:');
    
    if (storeName) {
        const vectorStoresList = document.querySelector('.vector-stores-list');
        
        const vectorStoreItem = document.createElement('div');
        vectorStoreItem.className = 'vector-store-item';
        vectorStoreItem.innerHTML = `
            <div class="vector-store-info">
                <h3>${storeName}</h3>
                <p>0 documents, 0 chunks</p>
            </div>
            <div class="vector-store-actions">
                <button class="btn-view">View</button>
                <button class="btn-update">Update</button>
                <button class="btn-delete">Delete</button>
            </div>
        `;
        
        vectorStoresList.appendChild(vectorStoreItem);
        
        // Add event listeners
        vectorStoreItem.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', handleVectorStoreAction);
        });
        
        alert(`Vector store "${storeName}" created successfully.`);
    }
}

// Generate Visualization
function generateVisualization(e) {
    const visualizationType = e.target.closest('.visualization-option').querySelector('h3').textContent;
    const previewArea = document.querySelector('.preview-area');
    
    previewArea.innerHTML = `<p>Generating ${visualizationType.toLowerCase()}...</p>`;
    
    // Simulate delay
    setTimeout(() => {
        previewArea.innerHTML = `
            <p>This is a simulated preview of the ${visualizationType.toLowerCase()}.</p>
            <div style="width: 100%; height: 250px; background-color: #e9ecef; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 48px;">📊</span>
            </div>
            <p style="margin-top: 10px; font-style: italic;">In a real application, this would display an actual visualization based on your research data.</p>
        `;
    }, 1500);
}
