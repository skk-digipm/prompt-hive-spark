// Content script for text selection handling
let selectedText = '';
let menuPosition = { x: 0, y: 0 };
let showMenu = false;
let menuElement: HTMLElement | null = null;

// Create and inject the floating button
function createFloatingButton() {
  const button = document.createElement('button');
  button.id = 'prompts-hive-button';
  button.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
    Save to PromptHive
  `;
  button.style.cssText = `
    position: fixed;
    z-index: 10000;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    border: none;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    display: none;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
  `;
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.05)';
    button.style.opacity = '0.9';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
    button.style.opacity = '1';
  });
  
  button.addEventListener('click', handleSavePrompt);
  document.body.appendChild(button);
  return button;
}

// Handle text selection
function handleTextSelection() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  
  const text = selection.toString().trim();
  if (text.length < 10) {
    hideMenu();
    return;
  }
  
  selectedText = text;
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  menuPosition = {
    x: Math.min(rect.left + window.scrollX, window.innerWidth - 200),
    y: Math.max(rect.top + window.scrollY - 50, 10)
  };
  
  showFloatingButton();
}

// Show floating button
function showFloatingButton() {
  if (!menuElement) {
    menuElement = createFloatingButton();
  }
  
  menuElement.style.left = `${menuPosition.x}px`;
  menuElement.style.top = `${menuPosition.y}px`;
  menuElement.style.display = 'flex';
  showMenu = true;
}

// Hide menu
function hideMenu() {
  if (menuElement) {
    menuElement.style.display = 'none';
  }
  showMenu = false;
  selectedText = '';
}

// Handle save prompt
async function handleSavePrompt() {
  if (!selectedText) return;
  
  const url = window.location.href;
  const domain = window.location.hostname;
  
  // Generate title from first 50 characters
  const title = selectedText.length > 50 
    ? selectedText.substring(0, 50) + '...'
    : selectedText;
  
  // Auto-categorize based on domain
  let category = 'General';
  if (domain.includes('chatgpt') || domain.includes('openai')) {
    category = 'ChatGPT';
  } else if (domain.includes('claude') || domain.includes('anthropic')) {
    category = 'Claude';
  } else if (domain.includes('reddit')) {
    category = 'Community';
  } else if (domain.includes('github')) {
    category = 'Development';
  }
  
  const promptData = {
    title,
    content: selectedText,
    category,
    tags: [domain.split('.')[0]],
    metadata: {
      sourceUrl: url,
      sourceDomain: domain,
      capturedAt: new Date().toISOString(),
      selectionContext: document.title
    }
  };
  
  // Send message to extension popup
  try {
    (window as any).chrome.runtime.sendMessage({
      type: 'SAVE_PROMPT',
      data: promptData
    });
    
    // Show success feedback
    showSuccessMessage();
    hideMenu();
  } catch (error) {
    console.error('Failed to save prompt:', error);
  }
}

// Show success message
function showSuccessMessage() {
  const message = document.createElement('div');
  message.textContent = '✓ Prompt saved to PromptHive!';
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10001;
    background: #10b981;
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.remove();
    style.remove();
  }, 3000);
}

// Handle clicks outside menu
function handleClickOutside(event: MouseEvent) {
  const target = event.target as Element;
  if (showMenu && !target.closest('#prompts-hive-button')) {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      hideMenu();
    }
  }
}

// Handle selection change
function handleSelectionChange() {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim().length < 10) {
    hideMenu();
  }
}

// Event listeners
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('selectionchange', handleSelectionChange);
document.addEventListener('click', handleClickOutside);

// Handle messages from popup
if ((window as any).chrome?.runtime) {
  (window as any).chrome.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
    if (message.type === 'PROMPT_SAVED') {
      showSuccessMessage();
    }
  });
}