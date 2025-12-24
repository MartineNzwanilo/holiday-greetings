
// Enhanced Holiday Greetings Experience
class HolidayMagic {
    constructor() {
        this.state = {
            userName: '',
            currentMessage: 0,
            totalMessages: 10,
            isSnowActive: true,
            autoSlideInterval: null,
            countdownInterval: null,
            slideCountdown: 7,
            particles: [],
            snowflakes: [],
            snowCtx: null,
            lastFrameTime: 0,
            frameRate: 60
        };
        
        this.initialize();
    }
    
    initialize() {
        this.cacheElements();
        
        if (!this.elements.userNameInput) {
            console.error('Required elements not found');
            return;
        }
        
        this.setupEventListeners();
        this.createParticles();
        this.initSnowCanvas();
        this.startAutoThemeCycle();
        this.startCountdown();
        this.startMessageAutoSlide();
        this.animateTitle();
        this.animateTypingText();
        
        // Start animation loop
        requestAnimationFrame((timestamp) => this.animationLoop(timestamp));
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
            progressBar: document.getElementById('progressBar'),
            snowCanvas: document.getElementById('snowCanvas'),
            particlesContainer: document.getElementById('particles'),
            fireworksContainer: document.getElementById('fireworks')
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
            
            this.elements.userNameInput.addEventListener('input', (e) => {
                this.animateInput(e.target.value);
            });
        }
    }
    
    initSnowCanvas() {
        const canvas = this.elements.snowCanvas;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        this.state.snowCtx = ctx;
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        this.createSnowflakes();
        
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
        
        const flakeCount = Math.min(100, Math.floor(canvas.width * canvas.height / 10000));
        
        for (let i = 0; i < flakeCount; i++) {
            this.state.snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                speed: Math.random() * 0.8 + 0.3,
                wind: Math.random() * 0.3 - 0.15,
                opacity: Math.random() * 0.4 + 0.3,
                wobble: Math.random() * 0.5,
                wobbleSpeed: Math.random() * 0.05 + 0.02
            });
        }
    }
    
    animationLoop(timestamp) {
        const deltaTime = timestamp - this.state.lastFrameTime;
        const interval = 1000 / this.state.frameRate;
        
        if (deltaTime > interval) {
            this.state.lastFrameTime = timestamp - (deltaTime % interval);
            
            // Update snow animation
            this.animateSnow();
            
            // Update particles
            this.updateParticles();
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
            // Add gentle wobble
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
    
    createParticles() {
        const container = this.elements.particlesContainer;
        if (!container) return;
        
        // Clear existing particles
        container.innerHTML = '';
        this.state.particles = [];
        
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1'];
        const particleCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 20000));
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 4 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const duration = Math.random() * 15 + 10;
            const delay = Math.random() * 5;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                opacity: ${Math.random() * 0.3 + 0.2};
                pointer-events: none;
                z-index: 0;
                animation: floatParticle ${duration}s linear infinite ${delay}s;
            `;
            
            container.appendChild(particle);
            this.state.particles.push({
                element: particle,
                speed: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2
            });
        }
    }
    
    updateParticles() {
        this.state.particles.forEach(particle => {
            // Simple CSS animation handles most of it
            // We can add additional logic here if needed
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
        
        // Smooth transition
        this.animateTransition(() => {
            if (this.elements.inputSection) {
                this.elements.inputSection.style.opacity = '0';
                setTimeout(() => {
                    this.elements.inputSection.style.display = 'none';
                }, 500);
            }
            if (this.elements.greetingSection) {
                this.elements.greetingSection.style.display = 'block';
                setTimeout(() => {
                    this.elements.greetingSection.style.opacity = '1';
                }, 10);
            }
            this.updateGreeting();
            this.triggerCelebration();
        });
    }
    
    animateTransition(callback) {
        const magicCircle = document.querySelector('.magic-circle');
        if (magicCircle) {
            magicCircle.style.transform = 'translate(-50%, -50%) scale(1.5)';
            magicCircle.style.opacity = '0.8';
            
            setTimeout(() => {
                magicCircle.style.transform = 'translate(-50%, -50%) scale(1)';
                magicCircle.style.opacity = '0.3';
                callback();
            }, 600);
        } else {
            callback();
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
                setTimeout(typeWriter, 40); // Slower typing speed
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
        }, 10000); // 10 seconds between messages
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
        
        // Reset the progress bar animation
        const progressBar = this.elements.progressBar;
        if (progressBar) {
            progressBar.style.animation = 'none';
            setTimeout(() => {
                progressBar.style.animation = 'progressShrink 10s linear infinite';
            }, 10);
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
        
        // Safely update elements
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
    
    startAutoThemeCycle() {
        const themes = [
            { bg: 'linear-gradient(135deg, #0a0a2a, #1a1a4a, #2d0a3d, #0a2a2a, #2a0a2a)' },
            { bg: 'linear-gradient(135deg, #1a0a2a, #4a1a4a, #3d0a2d, #2a0a1a, #2a2a0a)' },
            { bg: 'linear-gradient(135deg, #0a2a2a, #1a4a4a, #0a3d2d, #2a2a0a, #2a0a0a)' },
            { bg: 'linear-gradient(135deg, #2a0a0a, #4a1a1a, #3d0a0a, #2a2a1a, #0a2a2a)' }
        ];
        
        let currentTheme = 0;
        
        setInterval(() => {
            currentTheme = (currentTheme + 1) % themes.length;
            document.body.style.background = themes[currentTheme].bg;
        }, 20000); // 20 seconds between theme changes
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
        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const angle = (Math.PI * 2 * i) / particleCount;
                const velocity = Math.random() * 2 + 1;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = Math.random() * 4 + 2;
                const life = 1000;
                
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
                    const dx = Math.cos(angle) * velocity * 60;
                    const dy = Math.sin(angle) * velocity * 60;
                    
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
        const btn = document.querySelector('[onclick="toggleSnow()"]');
        if (btn) {
            const span = btn.querySelector('span');
            if (span) {
                span.textContent = this.state.isSnowActive ? 'Snow Off' : 'Snow On';
            }
        }
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
        if (this.elements.inputSection) {
            this.elements.inputSection.style.display = 'block';
            this.elements.inputSection.style.opacity = '1';
        }
        if (this.elements.greetingSection) {
            this.elements.greetingSection.style.display = 'none';
            this.elements.greetingSection.style.opacity = '0';
        }
        
        if (this.elements.userNameInput) {
            this.elements.userNameInput.focus();
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
        
        // Animate orbit items
        const orbitItems = document.querySelectorAll('.orbit-item');
        orbitItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform += ' scale(1.5)';
                setTimeout(() => {
                    item.style.transform = item.style.transform.replace(' scale(1.5)', '');
                }, 300);
            }, index * 100);
        });
    }
    
    animateTitle() {
        const titleChars = document.querySelectorAll('.title-char');
        setInterval(() => {
            if (titleChars.length > 0) {
                const randomChar = titleChars[Math.floor(Math.random() * titleChars.length)];
                randomChar.style.transform = 'translateY(-10px)';
                randomChar.style.color = '#ffd700';
                
                setTimeout(() => {
                    randomChar.style.transform = 'translateY(0)';
                    randomChar.style.color = '';
                }, 500);
            }
        }, 3000);
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
    
    playSound(soundId) {
        try {
            const sound = document.getElementById(soundId);
            if (sound) {
                sound.currentTime = 0;
                sound.volume = 0.2;
                sound.play().catch(() => {
                    // Silent fail for audio
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
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes floatParticle {
        0% {
            transform: translate(0, 0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 0.3;
        }
        90% {
            opacity: 0.3;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(180deg);
            opacity: 0;
        }
    }
    
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
    
    @keyframes progressShrink {
        0% { transform: scaleX(1); }
        100% { transform: scaleX(0); }
    }
    
    .custom-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #ffd700);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .greeting-section {
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
    }
    
    .input-section {
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);

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

// Add error handling for audio
window.addEventListener('load', () => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.volume = 0.2;
    });
});
// Add this function to handle canvas resizing
function initCanvas() {
    const canvas = document.getElementById('snowCanvas');
    if (!canvas) return;
    
    // Set canvas size based on viewport
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Reduce particle count on mobile
        if (window.innerWidth < 768) {
            holidayMagic.state.particleCount = 50;
        } else {
            holidayMagic.state.particleCount = 150;
        }
    }
    
    // Initial resize
    resizeCanvas();
    
    // Resize on window change
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('orientationchange', resizeCanvas);
}

// Call this in your initialize function
initCanvas();
