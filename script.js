
// Holiday Magic Application
class HolidayMagic {
    constructor() {
        this.state = {
            userName: '',
            currentMessage: 0,
            totalMessages: 10,
            isSnowActive: true,
            autoSlideInterval: null,
            countdownInterval: null,
            slideCountdown: 10,
            snowflakes: [],
            snowCtx: null,
            lastFrameTime: 0,
            frameRate: 60
        };
        
        this.initialize();
    }
    
    initialize() {
        this.cacheElements();
        this.setupEventListeners();
        this.initSnowCanvas();
        this.startCountdown();
        this.startMessageAutoSlide();
        this.animateTypingText();
        requestAnimationFrame((timestamp) => this.animationLoop(timestamp));
        
        // Ensure greeting section is hidden initially
        if (this.elements.greetingSection) {
            this.elements.greetingSection.style.display = 'none';
        }
        
        // Ensure input section is visible
        if (this.elements.inputSection) {
            this.elements.inputSection.style.display = 'block';
        }
    }
    
    cacheElements() {
        this.elements = {
            userNameInput: document.getElementById('userName'),
            startBtn: document.getElementById('startBtn'),
            inputSection: document.getElementById('inputSection'),
            greetingSection: document.getElementById('greetingSection'),
            nameDisplay: document.getElementById('nameDisplay'),
            greetingTitle: document.getElementById('greetingTitle'),
            typingText: document.getElementById('typingText'),
            currentMessage: document.querySelector('.current-message'),
            totalMessages: document.querySelector('.total-messages'),
            countdownDisplay: document.getElementById('countdown'),
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds'),
            snowCanvas: document.getElementById('snowCanvas'),
            snowText: document.getElementById('snowText')
        };
    }
    
    setupEventListeners() {
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startGreeting());
        }
        
        if (this.elements.userNameInput) {
            this.elements.userNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.startGreeting();
            });
        }
    }
    
    initSnowCanvas() {
        const canvas = this.elements.snowCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.state.snowCtx = ctx;
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create snowflakes
        this.createSnowflakes();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            this.state.snowflakes = [];
            this.createSnowflakes();
        });
    }
    
    createSnowflakes() {
        const canvas = this.elements.snowCanvas;
        if (!canvas) return;
        
        const flakeCount = Math.min(80, Math.floor(canvas.width * canvas.height / 15000));
        
        for (let i = 0; i < flakeCount; i++) {
            this.state.snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 0.7 + 0.3,
                wind: Math.random() * 0.2 - 0.1,
                opacity: Math.random() * 0.4 + 0.3,
                wobble: Math.random() * 0.3,
                wobbleSpeed: Math.random() * 0.03 + 0.01
            });
        }
    }
    
    animationLoop(timestamp) {
        const deltaTime = timestamp - this.state.lastFrameTime;
        const interval = 1000 / this.state.frameRate;
        
        if (deltaTime > interval) {
            this.state.lastFrameTime = timestamp - (deltaTime % interval);
            this.animateSnow();
        }
        
        requestAnimationFrame((ts) => this.animationLoop(ts));
    }
    
    animateSnow() {
        if (!this.elements.snowCanvas || !this.state.snowCtx || !this.state.isSnowActive) return;
        
        const ctx = this.state.snowCtx;
        const canvas = this.elements.snowCanvas;
        
        // Clear with slight transparency for trail effect
        ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        this.state.snowflakes.forEach(flake => {
            const wobbleX = Math.sin(Date.now() * flake.wobbleSpeed) * flake.wobble;
            
            ctx.beginPath();
            ctx.arc(flake.x + wobbleX, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.globalAlpha = flake.opacity;
            ctx.fill();
            
            // Update position
            flake.y += flake.speed;
            flake.x += flake.wind;
            
            // Reset if out of bounds
            if (flake.y > canvas.height + 10) {
                flake.y = -10;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x > canvas.width + 10) flake.x = -10;
            if (flake.x < -10) flake.x = canvas.width + 10;
        });
    }
    
    startGreeting() {
        const name = this.elements.userNameInput?.value.trim();
        
        if (!name) {
            this.shakeInput();
            return;
        }
        
        this.state.userName = name;
        this.playSound('magicSound');
        
        // Hide input section, show greeting section
        if (this.elements.inputSection) {
            this.elements.inputSection.style.opacity = '0';
            this.elements.inputSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                this.elements.inputSection.style.display = 'none';
                
                // Show greeting section with animation
                if (this.elements.greetingSection) {
                    this.elements.greetingSection.style.display = 'block';
                    setTimeout(() => {
                        this.elements.greetingSection.style.opacity = '1';
                        this.elements.greetingSection.style.transform = 'translateY(0)';
                    }, 50);
                }
                
                this.updateGreeting();
                this.triggerCelebration();
            }, 500);
        }
    }
    
    updateGreeting() {
        const nameElement = this.elements.nameDisplay?.querySelector('.name-text');
        
        if (nameElement && this.state.userName) {
            this.animateTextChange(nameElement, this.state.userName);
        }
        
        // Update greeting title
        if (this.elements.greetingTitle) {
            const titles = ["Special Greetings", "Holiday Wishes", "Season's Greetings", "Warmest Wishes"];
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];
            this.elements.greetingTitle.textContent = randomTitle;
        }
        
        // Show current message
        this.showMessage(this.state.currentMessage);
        
        // Update message counter
        if (this.elements.currentMessage) {
            this.elements.currentMessage.textContent = this.state.currentMessage + 1;
        }
    }
    
    animateTextChange(element, newText) {
        element.style.transform = 'scale(1.2)';
        element.style.opacity = '0.5';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.transform = 'scale(1)';
            element.style.opacity = '1';
        }, 300);
    }
    
    showMessage(index) {
        const messages = document.querySelectorAll('.message');
        const activeMessage = document.querySelector('.message.active');
        
        if (activeMessage) {
            activeMessage.classList.remove('active');
            activeMessage.style.animation = 'messageSlideOut 0.8s ease-out forwards';
        }
        
        setTimeout(() => {
            if (messages[index]) {
                messages[index].classList.add('active');
                messages[index].style.animation = 'messageSlideIn 0.8s ease-out forwards';
                
                // Add typing effect
                this.typeMessageText(messages[index]);
            }
        }, 400);
    }
    
    typeMessageText(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 40);
            }
        };
        
        setTimeout(typeWriter, 200);
    }
    
    nextMessage() {
        this.state.currentMessage = (this.state.currentMessage + 1) % this.state.totalMessages;
        this.updateGreeting();
        this.resetAutoSlide();
        this.playSound('clickSound');
    }
    
    startMessageAutoSlide() {
        // Clear any existing interval
        if (this.state.autoSlideInterval) {
            clearInterval(this.state.autoSlideInterval);
        }
        
        // Start auto-slide countdown
        this.startAutoSlideCountdown();
        
        // Start auto-slide interval
        this.state.autoSlideInterval = setInterval(() => {
            this.nextMessage();
        }, 10000); // 10 seconds
    }
    
    startAutoSlideCountdown() {
        this.state.slideCountdown = 10;
        
        const countdownElement = this.elements.countdownDisplay;
        if (!countdownElement) return;
        
        // Clear any existing countdown interval
        if (this.state.countdownInterval) {
            clearInterval(this.state.countdownInterval);
        }
        
        this.state.countdownInterval = setInterval(() => {
            this.state.slideCountdown--;
            
            if (countdownElement) {
                countdownElement.textContent = this.state.slideCountdown;
            }
            
            if (this.state.slideCountdown <= 0) {
                this.state.slideCountdown = 10;
            }
        }, 1000);
    }
    
    resetAutoSlide() {
        this.state.slideCountdown = 10;
        if (this.elements.countdownDisplay) {
            this.elements.countdownDisplay.textContent = '10';
        }
    }
    
    startCountdown() {
        // Update New Year 2026 countdown every second
        this.updateNewYearCountdown();
        setInterval(() => this.updateNewYearCountdown(), 1000);
    }
    
    updateNewYearCountdown() {
        const now = new Date();
        const newYear = new Date(2026, 0, 1); // January 1, 2026
        const diff = newYear - now;
        
        if (diff <= 0) {
            // If New Year has passed, set to next year
            newYear.setFullYear(2027);
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update elements
        this.safeUpdateElement('days', days.toString().padStart(2, '0'));
        this.safeUpdateElement('hours', hours.toString().padStart(2, '0'));
        this.safeUpdateElement('minutes', minutes.toString().padStart(2, '0'));
        this.safeUpdateElement('seconds', seconds.toString().padStart(2, '0'));
    }
    
    safeUpdateElement(id, value) {
        const element = document.getElementById(id);
        if (element && element.textContent !== value) {
            element.classList.add('flip');
            setTimeout(() => {
                element.textContent = value;
                element.classList.remove('flip');
            }, 300);
        }
    }
    
    triggerFireworks() {
        this.playSound('magicSound');
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFirework(
                    Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1,
                    Math.random() * window.innerHeight * 0.4 + window.innerHeight * 0.2
                );
            }, i * 400);
        }
    }
    
    createFirework(x, y) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        const particleCount = 25;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = Math.random() * 2 + 1;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 4 + 2;
                
                particle.style.cssText = `
                    position: fixed;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    left: ${x}px;
                    top: ${y}px;
                    opacity: 1;
                    pointer-events: none;
                    z-index: 1000;
                    transform: translate(0, 0);
                    transition: all 0.8s ease-out;
                `;
                
                document.body.appendChild(particle);
                
                // Animate particle
                setTimeout(() => {
                    const dx = Math.cos(angle) * velocity * 50;
                    const dy = Math.sin(angle) * velocity * 50;
                    
                    particle.style.transform = `translate(${dx}px, ${dy}px)`;
                    particle.style.opacity = '0';
                    
                    // Remove after animation
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 800);
                }, 10);
            }, Math.random() * 200);
        }
    }
    
    toggleSnow() {
        this.state.isSnowActive = !this.state.isSnowActive;
        
        // Update button text
        if (this.elements.snowText) {
            this.elements.snowText.textContent = this.state.isSnowActive ? 'Snow Off' : 'Snow On';
        }
        
        // Visual feedback
        const btn = document.getElementById('snowToggle');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
        
        // Play sound
        this.playSound('clickSound');
        
        // Show notification
        this.showNotification(
            this.state.isSnowActive ? 
            '❄️ Snow effect enabled!' : 
            '✨ Snow effect disabled!'
        );
    }
    
    shareGreeting() {
        const message = this.getCurrentMessage();
        const userName = this.state.userName || 'Someone';
        const text = `🎄 ${userName} sent you magical holiday greetings! ✨\n\n"${message}"\n\nSend your own magical greetings!`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Magical Holiday Greetings',
                text: text,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('✨ Magical greeting copied! Share the joy! ✨');
            });
        }
    }
    
    getCurrentMessage() {
        const messages = document.querySelectorAll('.message');
        const activeMessage = document.querySelector('.message.active');
        return activeMessage ? activeMessage.textContent : 'Happy Holidays!';
    }
    
    resetExperience() {
        this.state.userName = '';
        this.state.currentMessage = 0;
        
        if (this.elements.userNameInput) {
            this.elements.userNameInput.value = '';
        }
        
        // Hide greeting section
        if (this.elements.greetingSection) {
            this.elements.greetingSection.style.opacity = '0';
            this.elements.greetingSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                this.elements.greetingSection.style.display = 'none';
                
                // Show input section with animation
                if (this.elements.inputSection) {
                    this.elements.inputSection.style.display = 'block';
                    setTimeout(() => {
                        this.elements.inputSection.style.opacity = '1';
                        this.elements.inputSection.style.transform = 'translateY(0)';
                    }, 50);
                }
                
                // Focus on input
                if (this.elements.userNameInput) {
                    this.elements.userNameInput.focus();
                }
            }, 500);
        }
        
        this.resetAutoSlide();
        this.playSound('clickSound');
    }
    
    shakeInput() {
        if (this.elements.userNameInput) {
            this.elements.userNameInput.style.animation = 'shake 0.5s';
            setTimeout(() => {
                this.elements.userNameInput.style.animation = '';
            }, 500);
        }
    }
    
    triggerCelebration() {
        this.triggerFireworks();
        
        // Animate icons
        const icons = document.querySelectorAll('.holiday-icons i');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    icon.style.transform = '';
                }, 300);
            }, index * 100);
        });
    }
    
    animateTypingText() {
        const texts = [
            "Your magical holiday experience awaits...",
            "Spread joy and happiness...",
            "Season's greetings!",
            "Make wonderful memories...",
            "Share the holiday spirit!"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isWaiting = false;
        
        const type = () => {
            if (isWaiting) return;
            
            const currentText = texts[textIndex];
            
            if (this.elements.typingText) {
                if (isDeleting) {
                    this.elements.typingText.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    this.elements.typingText.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }
                
                if (!isDeleting && charIndex === currentText.length) {
                    isDeleting = true;
                    isWaiting = true;
                    setTimeout(() => {
                        isWaiting = false;
                        type();
                    }, 2000);
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    isWaiting = true;
                    setTimeout(() => {
                        isWaiting = false;
                        type();
                    }, 500);
                } else {
                    setTimeout(type, isDeleting ? 30 : 70);
                }
            }
        };
        
        setTimeout(type, 1000);
    }
    
    playSound(soundId, options = {}) {
    try {
        const sound = document.getElementById(soundId);
        if (!sound) {
            console.warn(`Sound element with id "${soundId}" not found`);
            return;
        }
        
        // Apply options with defaults
        const { 
            volume = 0.2, 
            resetTime = true,
            allowOverlap = false 
        } = options;
        
        // Don't play if already playing and overlap not allowed
        if (!allowOverlap && !sound.paused) {
            return;
        }
        
        if (resetTime) {
            sound.currentTime = 0;
        }
        
        sound.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0-1
        
        const playPromise = sound.play();
        
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                // Handle autoplay restrictions
                if (error.name === 'NotAllowedError') {
                    console.warn('Audio play was blocked by browser policy');
                }
                // Silent fail for other audio errors
            });
        }
    } catch (e) {
        // Silent fail
    }
}
    
    showNotification(message) {
        const existingNotification = document.querySelector('.custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #FF6B6B, #FFD700);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: bold;
            font-size: 0.9rem;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create the HolidayMagic instance
    const holidayMagic = new HolidayMagic();
    
    // Global functions for button onclick handlers
    window.nextMessage = () => holidayMagic.nextMessage();
    window.triggerFireworks = () => holidayMagic.triggerFireworks();
    window.toggleSnow = () => holidayMagic.toggleSnow();
    window.shareGreeting = () => holidayMagic.shareGreeting();
    window.resetExperience = () => holidayMagic.resetExperience();
    
    // Make it globally available
    window.holidayMagic = holidayMagic;
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes messageSlideOut {
        from { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
        }
        to { 
            opacity: 0; 
            transform: translateX(-50px) scale(0.95); 
        }
    }
    
    @keyframes messageSlideIn {
        from { 
            opacity: 0; 
            transform: translateX(50px) scale(0.95); 
        }
        to { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
        }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes flipAnimation {
        0% { transform: rotateX(0deg); }
        50% { transform: rotateX(90deg); }
        100% { transform: rotateX(0deg); }
    }
    
    .flip {
        animation: flipAnimation 0.5s ease-out;
    }
    
    .greeting-section {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .input-section {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
`;
document.head.appendChild(style);
