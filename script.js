// Configuration
const CONFIG = {
    AUTO_THEME_INTERVAL: 10000, // 10 seconds
    MESSAGE_COUNT: 10
};

// Theme Definitions
const THEMES = [
    {
        name: "Winter Magic",
        background: "linear-gradient(135deg, #0d2b2b, #1a1a2e, #16213e)",
        colors: ["#4ecdc4", "#ffd700", "#ff6b6b"]
    },
    {
        name: "Christmas Classic",
        background: "linear-gradient(135deg, #0f3b1f, #b91d1d, #1a1a2e)",
        colors: ["#ffd700", "#ff0000", "#00ff00"]
    },
    {
        name: "New Year Gold",
        background: "linear-gradient(135deg, #1a1a2e, #ffd700, #b8860b)",
        colors: ["#ffd700", "#ffffff", "#ff6b6b"]
    },
    {
        name: "Northern Lights",
        background: "linear-gradient(135deg, #003366, #0099cc, #00cc99)",
        colors: ["#00ffcc", "#0099ff", "#ff00ff"]
    },
    {
        name: "Festive Red",
        background: "linear-gradient(135deg, #660000, #b30000, #ff3333)",
        colors: ["#ffd700", "#ffffff", "#00ff00"]
    },
    {
        name: "Midnight Blue",
        background: "linear-gradient(135deg, #000033, #000066, #000099)",
        colors: ["#ffd700", "#00ffff", "#ff6b6b"]
    }
];

// Personalized Messages Database
const MESSAGES = [
    "May your Christmas sparkle with moments of love, laughter, and goodwill!",
    "Wishing you a season full of light and laughter for you and your family!",
    "May the magic of Christmas fill every corner of your heart and home!",
    "Here's to a Christmas that's merry and bright, and a New Year that's full of light!",
    "May your holidays be wrapped in happiness and tied with love!",
    "Sending you warm wishes for a joyful Christmas and a wonderful New Year!",
    "May your Christmas be decorated with cheer and filled with love!",
    "Wishing you peace, joy, and all the best this wonderful holiday!",
    "May the spirit of Christmas bring you peace, the gladness of Christmas give you hope!",
    "Here's hoping your Christmas is filled with wonderful surprises and happiness!"
];

// State Management
let state = {
    userName: "",
    currentMessageIndex: 0,
    currentThemeIndex: 0,
    autoThemeInterval: null,
    isAutoTheme: true
};

// DOM Elements
const elements = {
    userNameInput: document.getElementById('userName'),
    startBtn: document.getElementById('startBtn'),
    inputSection: document.getElementById('inputSection'),
    greetingSection: document.getElementById('greetingSection'),
    nameDisplay: document.getElementById('nameDisplay'),
    greetingText: document.getElementById('greetingText'),
    messageContent: document.getElementById('messageContent'),
    messageCount: document.getElementById('messageCount'),
    animatedIcons: document.getElementById('animatedIcons'),
    mainTitle: document.getElementById('mainTitle'),
    subtitle: document.getElementById('subtitle'),
    themeToggle: document.getElementById('themeToggle'),
    themeMode: document.getElementById('themeMode'),
    days: document.getElementById('days'),
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds')
};

// Initialize Application
function init() {
    createSnowflakes();
    createConfetti();
    startCountdown();
    setupEventListeners();
    setRandomSubtitle();
    
    // Auto-cycle themes if enabled
    if (state.isAutoTheme) {
        startAutoThemeCycle();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Enter key in name input
    elements.userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            startGreeting();
        }
    });
    
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleThemeMode);
    
    // Input focus effect
    elements.userNameInput.addEventListener('focus', () => {
        elements.userNameInput.style.transform = 'scale(1.02)';
    });
    
    elements.userNameInput.addEventListener('blur', () => {
        elements.userNameInput.style.transform = 'scale(1)';
    });
}

// Start Personalized Greeting
function startGreeting() {
    const name = elements.userNameInput.value.trim();
    
    if (!name) {
        shakeInput();
        return;
    }
    
    state.userName = name;
    
    // Show greeting section with animation
    elements.inputSection.style.display = 'none';
    elements.greetingSection.style.display = 'block';
    
    // Update display
    updateGreetingDisplay();
    
    // Animate entrance
    animateGreetingEntrance();
    
    // Trigger confetti
    triggerConfetti();
}

// Update Greeting Display
function updateGreetingDisplay() {
    const message = MESSAGES[state.currentMessageIndex];
    const nameSpan = elements.nameDisplay.querySelector('.name-highlight');
    
    // Update name with animation
    nameSpan.style.animation = 'none';
    nameSpan.offsetHeight; // Trigger reflow
    nameSpan.textContent = state.userName;
    nameSpan.style.animation = 'nameGlow 2s infinite alternate';
    
    // Update message with typewriter effect
    typeWriterEffect(elements.messageContent, message);
    
    // Update greeting text with random phrase
    const greetings = [
        "Special Greetings for",
        "Holiday Wishes for",
        "Season's Greetings to",
        "Warmest Wishes for",
        "Joyful Moments for"
    ];
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    elements.greetingText.textContent = `${randomGreeting} ${state.userName}!`;
    
    // Update message count
    elements.messageCount.textContent = state.currentMessageIndex + 1;
}

// Typewriter Effect
function typeWriterEffect(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Change to Next Message
function changeMessage() {
    state.currentMessageIndex = (state.currentMessageIndex + 1) % MESSAGES.length;
    updateGreetingDisplay();
    
    // Animate change
    elements.greetingSection.style.animation = 'none';
    elements.greetingSection.offsetHeight;
    elements.greetingSection.style.animation = 'slideUp 0.5s ease-out';
    
    // Trigger icon animation
    animateIcons();
}

// Theme Management
function changeTheme(themeIndex) {
    const theme = THEMES[themeIndex];
    
    // Update background
    document.body.style.background = theme.background;
    
    // Update CSS variables for colors
    document.documentElement.style.setProperty('--primary-color', theme.colors[0]);
    document.documentElement.style.setProperty('--secondary-color', theme.colors[1]);
    document.documentElement.style.setProperty('--accent-color', theme.colors[2]);
    
    // Update theme name in subtitle
    elements.subtitle.textContent = `Theme: ${theme.name}`;
    
    // Update state
    state.currentThemeIndex = themeIndex;
}

function startAutoThemeCycle() {
    if (state.autoThemeInterval) {
        clearInterval(state.autoThemeInterval);
    }
    
    state.autoThemeInterval = setInterval(() => {
        const nextTheme = (state.currentThemeIndex + 1) % THEMES.length;
        changeTheme(nextTheme);
    }, CONFIG.AUTO_THEME_INTERVAL);
}

function toggleThemeMode() {
    state.isAutoTheme = !state.isAutoTheme;
    
    if (state.isAutoTheme) {
        elements.themeMode.textContent = 'Auto';
        startAutoThemeCycle();
    } else {
        elements.themeMode.textContent = 'Manual';
        if (state.autoThemeInterval) {
            clearInterval(state.autoThemeInterval);
        }
        // Cycle to next theme manually
        const nextTheme = (state.currentThemeIndex + 1) % THEMES.length;
        changeTheme(nextTheme);
    }
}

// Animation Effects
function animateGreetingEntrance() {
    const icons = document.querySelectorAll('.icon-row i');
    icons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.1}s`;
        icon.style.animation = 'iconFloat 3s ease-in-out infinite';
    });
}

function animateIcons() {
    const icons = document.querySelectorAll('.icon-row i');
    icons.forEach(icon => {
        icon.style.animation = 'none';
        icon.offsetHeight;
        icon.style.animation = 'iconFloat 3s ease-in-out infinite';
    });
}

function shakeInput() {
    elements.userNameInput.style.animation = 'shake 0.5s';
    setTimeout(() => {
        elements.userNameInput.style.animation = '';
    }, 500);
}

// Create Snowflakes
function createSnowflakes() {
    const container = document.querySelector('.snowflakes');
    const snowflakeCount = 100;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        
        const size = Math.random() * 10 + 5;
        const posX = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        snowflake.style.width = `${size}px`;
        snowflake.style.height = `${size}px`;
        snowflake.style.left = `${posX}%`;
        snowflake.style.top = `-${size}px`;
        snowflake.style.opacity = Math.random() * 0.5 + 0.3;
        snowflake.style.animation = `fall ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(snowflake);
    }
}

// Create Confetti
function createConfetti() {
    const container = document.querySelector('.confetti-container');
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#ffffff', '#00ff00'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const posX = Math.random() * 100;
        const rotation = Math.random() * 360;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 5;
        
        confetti.style.backgroundColor = color;
        confetti.style.left = `${posX}%`;
        confetti.style.top = `-20px`;
        confetti.style.transform = `rotate(${rotation}deg)`;
        confetti.style.animation = `confettiFall ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(confetti);
    }
}

function triggerConfetti() {
    const confetti = document.querySelectorAll('.confetti');
    confetti.forEach((piece, index) => {
        piece.style.animation = 'none';
        piece.offsetHeight;
        piece.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear ${index * 0.01}s`;
    });
}

// Countdown Timer
function startCountdown() {
    function updateCountdown() {
        const now = new Date();
        const newYear = new Date(now.getFullYear() + 1, 0, 1);
        const diff = newYear - now;
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        elements.days.textContent = days.toString().padStart(2, '0');
        elements.hours.textContent = hours.toString().padStart(2, '0');
        elements.minutes.textContent = minutes.toString().padStart(2, '0');
        elements.seconds.textContent = seconds.toString().padStart(2, '0');
        
        // Add animation to changing numbers
        if (seconds === 59) {
            animateCountdownChange();
        }
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

function animateCountdownChange() {
    const timeUnits = [elements.days, elements.hours, elements.minutes, elements.seconds];
    timeUnits.forEach(unit => {
        unit.style.transform = 'scale(1.2)';
        setTimeout(() => {
            unit.style.transform = 'scale(1)';
        }, 300);
    });
}

// Random Subtitle
function setRandomSubtitle() {
    const subtitles = [
        "Spread Joy & Happiness!",
        "Season's Greetings!",
        "Make Memories!",
        "Share the Love!",
        "Festive Cheer!",
        "Holiday Magic!",
        "Winter Wonderland!",
        "Celebrate Together!"
    ];
    
    setInterval(() => {
        const randomSubtitle = subtitles[Math.floor(Math.random() * subtitles.length)];
        elements.subtitle.textContent = randomSubtitle;
    }, 5000);
}

// Share Functionality
function shareGreeting() {
    const shareText = `🎄 ${state.userName} sent you holiday greetings! 🎉\n\n"${MESSAGES[state.currentMessageIndex]}"\n\nSend your own at: ${window.location.href}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Holiday Greetings',
            text: shareText,
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Greeting copied to clipboard! Share it with your friends!');
        });
    }
}

// Reset Application
function resetGreeting() {
    state.userName = "";
    state.currentMessageIndex = 0;
    
    elements.userNameInput.value = "";
    elements.inputSection.style.display = 'block';
    elements.greetingSection.style.display = 'none';
    
    // Reset to first theme
    changeTheme(0);
    
    // Focus on input
    elements.userNameInput.focus();
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize when page loads
document.addEventListener('DOMContentLoaded', init);
