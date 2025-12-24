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
            particles: [],
            fireworks: [],
            snowflakes: [],
            snowCtx: null
        };
        
        this.initialize();
    }
    
    initialize() {
        this.cacheElements();
        
        // Check if elements exist before proceeding
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
            
            this.elements.userNameInput.addEventListener('focus', () => {
                this.elements.userNameInput.parentElement.classList.add('focused');
            });
            
            this.elements.userNameInput.addEventListener('blur', () => {
                this.elements.userNameInput.parentElement.classList.remove('focused');
            });
        }
    }
    
    initSnowCanvas() {
        const canvas = this.elements.snowCanvas;
        if (!canvas) {
            console.warn('Snow canvas not found, skipping snow effect');
            return;
        }
        
        const ctx = canvas.getContext('2d');
        this.state.snowCtx = ctx;
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create snowflakes
        this.createSnowflakes();
        
        // Start animation
        this.animateSnow();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    createSnowflakes() {
        const canvas = this.elements.snowCanvas;
        if (!canvas) return;
        
        // Create 150 snowflakes
        for (let i = 0; i < 150; i++) {
            this.state.snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 4 + 1,
                speed: Math.random() * 1 + 0.5,
                wind: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }
    
    animateSnow() {
        if (!this.elements.snowCanvas || !this.state.snowCtx) return;
        
        const ctx = this.state.snowCtx;
        const canvas = this.elements.snowCanvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.state.isSnowActive) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            
            this.state.snowflakes.forEach(flake => {
                ctx.beginPath();
                ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
                ctx.globalAlpha = flake.opacity;
                ctx.fill();
                
                // Update position
                flake.y += flake.speed;
                flake.x += flake.wind;
                
                // Reset if out of bounds
                if (flake.y > canvas.height) {
                    flake.y = -10;
                    flake.x = Math.random() * canvas.width;
                }
                if (flake.x > canvas.width) flake.x = 0;
                if (flake.x < 0) flake.x = canvas.width;
            });
        }
        
        requestAnimationFrame(() => this.animateSnow());
    }
    
    animateInput(value) {
        const inputGroup = this.elements.userNameInput?.parentElement;
        if (inputGroup) {
            if (value.length > 0) {
                inputGroup.style.transform = 'scale(1.02)';
            } else {
                inputGroup.style.transform = 'scale(1)';
            }
        }
    }
    
    startGreeting() {
        const name = this.elements.userNameInput?.value.trim();
        
        if (!name) {
            this.shakeInput();
            return;
        }
        
        this.state.userName = name;
        this.playSound('magicSound');
        
        // Animate transition
        this.animateTransition(() => {
            if (this.elements.inputSection) {
                this.elements.inputSection.style.display = 'none';
            }
            if (this.elements.greetingSection) {
                this.elements.greetingSection.style.display = 'block';
            }
            this.updateGreeting();
            this.triggerCelebration();
        });
    }
    
    animateTransition(callback) {
        const magicCircle = document.querySelector('.magic-circle');
        if (magicCircle) {
            magicCircle.style.animation = 'pulseCircle 1s ease-in-out';
            
            setTimeout(() => {
                magicCircle.style.animation = '';
                callback();
            }, 1000);
        } else {
            callback();
        }
    }
    
    updateGreeting() {
        const nameElement = this.elements.nameDisplay?.querySelector('.name-text');
        const greetingTitles = [
            "Special Greetings",
            "Holiday Wishes",
            "Season's Greetings",
            "Warmest Wishes",
            "Joyful Moments"
        ];
        
        // Animate name change
        if (nameElement && this.state.userName) {
            this.animateTextChange(nameElement, this.state.userName);
        }
        
        // Update greeting title
        if (this.elements.greetingTitle) {
            const randomTitle = greetingTitles[Math.floor(Math.random() * greetingTitles.length)];
            this.elements.greetingTitle.textContent = randomTitle;
        }
        
        // Update message display
        this.showMessage(this.state.currentMessage);
        
        // Update message counter
        if (this.elements.currentMessage) {
            this.elements.currentMessage.textContent = this.state.currentMessage + 1;
        }
    }
    
    animateTextChange(element, newText) {
        element.style.animation = 'textFadeOut 0.3s ease-out';
        
        setTimeout(() => {
            element.textContent = newText;
            element.style.animation = 'textFadeIn 0.3s ease-out';
            
            setTimeout(() => {
                element.style.animation = '';
            }, 300);
        }, 300);
    }
    
    showMessage(index) {
        const messages = document.querySelectorAll('.message');
        const activeMessage = document.querySelector('.message.active');
        
        if (activeMessage) {
            activeMessage.classList.remove('active');
            activeMessage.style.animation = 'messageSlideOut 0.8s ease-out';
        }
        
        setTimeout(() => {
            if (messages[index]) {
                messages[index].classList.add('active');
                messages[index].style.animation = 'messageSlideIn 0.8s ease-out';
                
                // Add text animation
                this.animateMessageText(messages[index]);
            }
        }, 400);
    }
    
    animateMessageText(element) {
        const text = element.textContent;
        element.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        typeWriter();
    }
    
    nextMessage() {
        this.state.currentMessage = (this.state.currentMessage + 1) % this.state.totalMessages;
        this.updateGreeting();
        this.resetAutoSlide();
        this.playSound('clickSound');
    }
    
    startMessageAutoSlide() {
        this.state.autoSlideInterval = setInterval(() => {
            this.nextMessage();
        }, 7000); // 7 seconds
        
        // Start countdown display
        this.startAutoSlideCountdown();
    }
    
    startAutoSlideCountdown() {
        let count = 7;
        const updateCountdown = () => {
            if (this.elements.countdownDisplay) {
                this.elements.countdownDisplay.textContent = count;
                count--;
                
                if (count < 0) {
                    count = 7;
                }
            }
        };
        
        // Update immediately and every second
        updateCountdown();
        setInterval(updateCountdown, 1000);
    }
    
    resetAutoSlide() {
        clearInterval(this.state.autoSlideInterval);
        this.startMessageAutoSlide();
    }
    
    startCountdown() {
        // Update New Year countdown every second
        this.updateNewYearCountdown();
        setInterval(() => this.updateNewYearCountdown(), 1000);
    }
    
    updateNewYearCountdown() {
        const now = new Date();
        const newYear = new Date(now.getFullYear() + 1, 0, 1);
        const diff = newYear - now;
        
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
            }, 500);
        }
    }
    
    startAutoThemeCycle() {
        const themes = [
            { bg: 'linear-gradient(135deg, #0a0a2a, #1a1a4a, #2d0a3d, #0a2a2a, #2a0a2a)', name: 'Cosmic Night' },
            { bg: 'linear-gradient(135deg, #1a0a2a, #4a1a4a, #3d0a2d, #2a0a1a, #2a2a0a)', name: 'Royal Velvet' },
            { bg: 'linear-gradient(135deg, #0a2a2a, #1a4a4a, #0a3d2d, #2a2a0a, #2a0a0a)', name: 'Emerald Forest' },
            { bg: 'linear-gradient(135deg, #2a0a0a, #4a1a1a, #3d0a0a, #2a2a1a, #0a2a2a)', name: 'Crimson Dawn' }
        ];
        
        let currentTheme = 0;
        
        setInterval(() => {
            currentTheme = (currentTheme + 1) % themes.length;
            document.body.style.background = themes[currentTheme].bg;
            
            if (this.elements.typingText) {
                this.elements.typingText.textContent = `Theme: ${themes[currentTheme].name}`;
            }
        }, 15000); // 15 seconds
    }
    
    createParticles() {
        const container = this.elements.particlesContainer;
        if (!container) return;
        
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1'];
        
        for (let i = 0; i < 100; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                opacity: ${Math.random() * 0.5 + 0.3};
                animation: floatParticle ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            
            container.appendChild(particle);
            this.state.particles.push(particle);
        }
    }
    
    triggerFireworks() {
        this.playSound('magicSound');
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.createFirework(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight * 0.5
                );
            }, i * 300);
        }
    }
    
    createFirework(x, y) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        // Create firework container
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 50;
            const velocity = Math.random() * 3 + 1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 4 + 2;
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                left: ${x}px;
                top: ${y}px;
                opacity: 1;
                transform: translate(0, 0);
                transition: all 1s ease-out;
            `;
            
            container.appendChild(particle);
            
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
                }, 1000);
            }, 10);
        }
        
        document.body.appendChild(container);
        
        // Remove container after animation
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
        }, 1100);
    }
    
    toggleSnow() {
        this.state.isSnowActive = !this.state.isSnowActive;
        const btn = document.querySelector('[onclick="toggleSnow()"]');
        if (btn) {
            btn.innerHTML = this.state.isSnowActive ? 
                '<i class="fas fa-snowflake"></i><span>Snow Off</span>' :
                '<i class="fas fa-snowflake"></i><span>Snow On</span>';
        }
    }
    
    shareGreeting() {
        const message = this.getCurrentMessage();
        const text = `🎄 ${this.state.userName || 'Someone'} sent you magical holiday greetings! ✨\n\n"${message}"\n\nSend your own magical greetings!`;
        
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
        return activeMessage ? activeMessage.textContent : 
               (messages[this.state.currentMessage] ? messages[this.state.currentMessage].textContent : 'Happy Holidays!');
    }
    
    resetExperience() {
        this.state.userName = '';
        this.state.currentMessage = 0;
        
        if (this.elements.userNameInput) {
            this.elements.userNameInput.value = '';
        }
        if (this.elements.inputSection) {
            this.elements.inputSection.style.display = 'block';
        }
        if (this.elements.greetingSection) {
            this.elements.greetingSection.style.display = 'none';
        }
        
        if (this.elements.userNameInput) {
            this.elements.userNameInput.focus();
        }
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
        this.createBurstEffect();
        this.playSound('magicSound');
        
        // Animate orbit items
        const orbitItems = document.querySelectorAll('.orbit-item');
        orbitItems.forEach(item => {
            item.style.animation = 'orbitItemFloat 1s ease-out';
            setTimeout(() => {
                item.style.animation = 'orbitItemFloat 3s ease-in-out infinite';
            }, 1000);
        });
    }
    
    createBurstEffect() {
        const burst = document.createElement('div');
        burst.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,215,0,0.8), transparent 70%);
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(burst);
        
        // Animate burst
        let size = 0;
        const grow = () => {
            size += 20;
            burst.style.width = `${size}px`;
            burst.style.height = `${size}px`;
            burst.style.opacity = 1 - (size / 400);
            
            if (size < 400) {
                requestAnimationFrame(grow);
            } else {
                if (burst.parentNode) {
                    burst.parentNode.removeChild(burst);
                }
            }
        };
        
        grow();
    }
    
    animateTitle() {
        const titleChars = document.querySelectorAll('.title-char');
        setInterval(() => {
            if (titleChars.length > 0) {
                const randomChar = titleChars[Math.floor(Math.random() * titleChars.length)];
                randomChar.style.animation = 'bounceIn 0.5s ease-out';
                
                setTimeout(() => {
                    randomChar.style.animation = '';
                }, 500);
            }
        }, 2000);
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
        
        const type = () => {
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
                    setTimeout(type, 2000);
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    setTimeout(type, 500);
                } else {
                    setTimeout(type, isDeleting ? 50 : 100);
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
                sound.volume = 0.3;
                sound.play().catch(e => {
                    // Silent fail for audio
                });
            }
        } catch (e) {
            // Silent fail
        }
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b6b, #ffd700);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out, fadeOut 0.3s ease-out 2.7s;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            font-weight: bold;
        `;
        
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
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    @keyframes textFadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }
    
    @keyframes textFadeIn {
        from { opacity: 0; transform: scale(1.1); }
        to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes messageSlideOut {
        from { opacity: 1; transform: translateX(0) scale(1); }
        to { opacity: 0; transform: translateX(-100%) scale(0.9); }
    }
    
    @keyframes messageSlideIn {
        from { opacity: 0; transform: translateX(100%) scale(0.9); }
        to { opacity: 1; transform: translateX(0) scale(1); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
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
    
    // Make it globally available for debugging
    window.holidayMagic = holidayMagic;
    
    console.log('Holiday Magic initialized!');
});

// Add error handling for audio
window.addEventListener('load', () => {
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
        audio.addEventListener('error', (e) => {
            console.log('Audio failed to load:', e.target.src);
        });
    });
});
