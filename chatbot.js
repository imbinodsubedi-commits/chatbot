/**
 * FCF Chatbot - Main JavaScript File
 * Handles chatbot logic, JSON data loading, and user interactions
 */

// ============================================
// Global Variables
// ============================================
let chatbotData = null;
let currentState = 'language_select';
const chatBox = document.getElementById('chatBox');
const clearChatBtn = document.getElementById('clearChatBtn');

// ============================================
// Initialize Chatbot
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  loadChatbotData();
  setupEventListeners();
});

// ============================================
// Load JSON Data
// ============================================
async function loadChatbotData() {
  try {
    const response = await fetch('chatbot-data.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    chatbotData = await response.json();
    startChat();
  } catch (error) {
    console.error('Error loading chatbot data:', error);
    displayErrorMessage();
  }
}

// ============================================
// Start Chat - Display Greeting with Robot Avatar
// ============================================
function startChat() {
  if (!chatbotData) return;

  chatBox.innerHTML = '';

  const topAvatarDiv = document.createElement('div');
  topAvatarDiv.className = 'top-avatar-container';
  const topRobotImg = document.createElement('img');
  topRobotImg.src = 'robot.gif';
  topRobotImg.alt = 'FCF Buddy Robot';
  topRobotImg.className = 'top-avatar';
  topAvatarDiv.appendChild(topRobotImg);
  chatBox.appendChild(topAvatarDiv);

  currentState = 'language_select';
  displayMessage(chatbotData[currentState]);
}

// ============================================
// Display Message with Products, Images & Options
// ============================================
function displayMessage(stateData) {
  if (!stateData) return;

  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot';

  const robotEmoji = document.createElement('span');
  robotEmoji.className = 'bot-emoji';
  robotEmoji.textContent = '🤖';

  const botMessageContent = document.createElement('div');
  botMessageContent.className = 'bot-message-content';

  // Bot message (now supports \n and HTML)
  const messagePara = document.createElement('p');
  messagePara.innerHTML = stateData.message.replace(/\n/g, "<br>");
  botMessageContent.appendChild(messagePara);

  // === Product display section ===
  if (stateData.products && Array.isArray(stateData.products)) {
    stateData.products.forEach(product => {
      const productBlock = document.createElement('div');
      productBlock.className = 'product-block';

      const title = document.createElement('h4');
      title.textContent = product.title;
      productBlock.appendChild(title);

      const desc = document.createElement('p');
      desc.textContent = product.description;
      productBlock.appendChild(desc);

      if (product.images && Array.isArray(product.images)) {
        const imgContainer = document.createElement('div');
        imgContainer.className = 'bot-image-container';
        product.images.forEach(imgSrc => {
          const img = document.createElement('img');
          img.src = imgSrc;
          img.alt = product.title;
          img.className = 'product-image';
          imgContainer.appendChild(img);
        });
        productBlock.appendChild(imgContainer);
      }

      const price = document.createElement('p');
      price.className = 'product-price';
      price.textContent = product.price;
      productBlock.appendChild(price);

      botMessageContent.appendChild(productBlock);
    });
  }

  messageDiv.appendChild(robotEmoji);
  messageDiv.appendChild(botMessageContent);
  chatBox.appendChild(messageDiv);

  // Display options
  if (stateData.options && stateData.options.length > 0) {
    displayOptions(stateData.options);
  }

  scrollToBottom();
}

// ============================================
// Display Options as Buttons
// ============================================
function displayOptions(options) {
  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'options-container';

  options.forEach(option => {
    const button = document.createElement('button');
    button.className = 'option-btn';
    button.innerHTML = option.label;
    button.setAttribute('data-next', option.next);
    button.addEventListener('click', handleOptionClick);
    optionsContainer.appendChild(button);
  });

  chatBox.appendChild(optionsContainer);
}

// ============================================
// Handle Option Click
// ============================================
function handleOptionClick(event) {
  const button = event.target;
  const nextState = button.getAttribute('data-next');
  const selectedText = button.textContent;

  displayUserMessage(selectedText);
  removeAllOptions();

  if (nextState && chatbotData[nextState]) {
    currentState = nextState;
    setTimeout(() => displayMessage(chatbotData[nextState]), 300);
  }
}

// ============================================
// Display User Message
// ============================================
function displayUserMessage(text) {
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'user-message';

  const userMessageContent = document.createElement('div');
  userMessageContent.className = 'user-message-content';
  userMessageContent.textContent = text;

  userMessageDiv.appendChild(userMessageContent);
  chatBox.appendChild(userMessageDiv);

  scrollToBottom();
}

// ============================================
// Remove All Options
// ============================================
function removeAllOptions() {
  const optionsContainers = chatBox.querySelectorAll('.options-container');
  optionsContainers.forEach(container => container.remove());
}

// ============================================
// Clear Chat
// ============================================
function clearChat() {
  chatBox.innerHTML = '';
  startChat();
}

// ============================================
// Setup Listeners
// ============================================
function setupEventListeners() {
  clearChatBtn.addEventListener('click', clearChat);
}

// ============================================
// Scroll to Bottom
// ============================================
function scrollToBottom() {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ============================================
// Error Message
// ============================================
function displayErrorMessage() {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message bot';
  const robotEmoji = document.createElement('span');
  robotEmoji.className = 'bot-emoji';
  robotEmoji.textContent = '🤖';
  const botMessageContent = document.createElement('div');
  botMessageContent.className = 'bot-message-content';
  const errorPara = document.createElement('p');
  errorPara.textContent = '⚠️ Unable to load chatbot data. Please refresh the page or contact support.';
  botMessageContent.appendChild(errorPara);
  errorDiv.appendChild(robotEmoji);
  errorDiv.appendChild(botMessageContent);
  chatBox.appendChild(errorDiv);
}

// ============================================
// Debug Utility
// ============================================
function logCurrentState() {
  console.log('Current State:', currentState);
  console.log('State Data:', chatbotData[currentState]);
}

window.chatbotDebug = {
  getCurrentState: () => currentState,
  getChatbotData: () => chatbotData,
  logState: logCurrentState
};
