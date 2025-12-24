// Holiday Magic Application with Music Control
class HolidayMagic {
    constructor() {
        this.state = {
            userName: '',
            currentMessage: 0,
            totalMessages: 10,
            isSnowActive: true,
            isMusicPlaying: false,
            autoSlideInterval: null,
            countdownInterval: null,
            slideCountdown: 10,
            snowflakes: [],
            snowCtx: null,
            lastFrameTime: 0,
            frameRate: 60
        };
        
        this.audioManager = null;
        this.initialize();
    }
    
    initialize() {
        this.cacheElements();
        this.setupEventListeners();
        this.initSnowCanvas();
        this.startCountdown();
        this.startMessageAutoSlide();
        this.animateTypingText();
        this.initAudioManager();
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
            snowText: document.getElementById('snowText'),
            musicToggle: document.getElementById('musicToggle'),
            musicText: document.getElementById('musicText'),
            volumeSlider: document.getElementById('volumeSlider')
        };
    }
    
    setupEventListeners() {
        // Start button
        if (this.elements.startBtn) {
            this.elements.startBtn.addEventListener('click', () => this.startGreeting());
        }
        
        // Enter key in name input
        if (this.elements.userNameInput) {
            this.elements.userNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.startGreeting();
            });
        }
        
        // Music toggle
        if (this.elements.musicToggle) {
            this.elements.musicToggle.addEventListener('click', () => this.toggleMusic());
        }
        
        // Volume control
        if (this.elements.volumeSlider) {
            this.elements.volumeSlider.addEventListener('input', () => this.updateVolume());
        }
    }
    
    initAudioManager() {
        this.audioManager = {
            backgroundMusic: document.getElementById('backgroundMusic'),
            snowAudio: document.getElementById('snowSound'),
            
            playSound(soundId, options = {}) {
                try {
                    const sound = document.getElementById(soundId);
                    if (!sound) return null;
                    
                    const {
                        volume = 0.5,
                        resetTime = true,
                        allowOverlap = false,
                        loop = false
                    } = options;
                    
                    if (!allowOverlap && !sound.paused && !sound.ended) {
                        return null;
                    }
                    
                    const soundToPlay = allowOverlap ? sound.cloneNode() : sound;
                    
                    if (resetTime) soundToPlay.currentTime = 0;
                    soundToPlay.volume = volume;
                    soundToPlay.loop = loop;
                    
                    soundToPlay.play().catch(e => {
                        if (e.name === 'NotAllowedError') {
                            console.log('Audio play blocked');
                        }
                    });
                    
                    return soundToPlay;
                } catch (e) {
                    console.error('Error playing sound:', e);
                    return null;
                }
            },
            
            playClick() {
                return this.playSound('clickSound', { volume: 0.3 });
            },
            
            playMagic() {
                return this.playSound('magicSound', { volume: 0.4 });
            },
            
            playTransition() {
                return this.playSound('transitionSound', { volume: 0.5 });
            },
            
            playBell() {
                return this.playSound('bellSound', { volume: 0.4 });
            },
            
            playFirework() {
                return this.playSound('fireworkSound', { volume: 0.6, allowOverlap: true });
            },
            
            playNotification() {
                return this.playSound('notificationSound', { volume: 0.5 });
            },
            
            toggleSnowSound(play) {
                if (!this.snowAudio) return;
                
                if (play) {
                    this.snowAudio.currentTime = 0;
                    this.snowAudio.play().catch(() => {});
                } else {
                    this.snowAudio.pause();
                }
            },
            
            stopAllSounds() {
                const allAudio = document.querySelectorAll('audio');
                allAudio.forEach(audio => {
                    if (audio !== this.backgroundMusic) {
                        audio.pause();
                        audio.currentTime = 0;
                    }
                });
            }
        };
        
        // Set initial volume from slider
        if (this.elements.volumeSlider && this.audioManager.backgroundMusic) {
            const initialVolume = this.elements.volumeSlider.value / 100;
            this.audioManager.backgroundMusic.volume = initialVolume;
            if (this.audioManager.snowAudio) {
                this.audioManager.snowAudio.volume = Math.min(0.2, initialVolume);
            }
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
        
        ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        
        this.state.snowflakes.forEach(flake => {
            const wobbleX = Math.sin(Date.now() * flake.wobbleSpeed) * flake.wobble;
            
            ctx.beginPath();
            ctx.arc(flake.x + wobbleX, flake.y, flake.radius, 0, Math.PI * 2);
            ctx.globalAlpha = flake.opacity;
            ctx.fill();
            
            flake.y += flake.speed;
            flake.x += flake.wind;
            
            if (flake.y > canvas.height + 10) {
                flake.y = -10;
                flake.x = Math.random() * canvas.width;
            }
            if (flake.x > canvas.width + 10) flake.x = -10;
            if (flake.x < -10) flake.x = canvas.width + 10;
        });
    }
    
    toggleMusic() {
        if (!this.audioManager || !this.audioManager.backgroundMusic) return;
        
        if (this.audioManager.backgroundMusic.paused) {
            this.audioManager.backgroundMusic.play()
                .then(() => {
                    this.state.isMusicPlaying = true;
                    this.elements.musicText.textContent = 'Pause Music';
                    this.elements.musicToggle.querySelector('i').className = 'fas fa-volume-mute';
                    this.audioManager.playClick();
                })
                .catch(error => {
                    console.log('Music play blocked:', error);
                    this.elements.musicText.textContent = 'Play Music';
                    this.elements.musicToggle.querySelector('i').className = 'fas fa-volume-up';
                });
        } else {
            this.audioManager.backgroundMusic.pause();
            this.state.isMusicPlaying = false;
            this.elements.musicText.textContent = 'Play Music';
            this.elements.musicToggle.querySelector('i').className = 'fas fa-volume-up';
            this.audioManager.playClick();
        }
    }
    
    updateVolume() {
        if (!this.elements.volumeSlider || !this.audioManager) return;
        
        const volume = this.elements.volumeSlider.value / 100;
        
        // Update all audio elements
        const allAudio = document.querySelectorAll('audio');
        allAudio.forEach(audio => {
            if (audio.id === 'snowSound') {
                audio.volume = Math.min(0.2, volume);
            } else {
                audio.volume = volume;
            }
        });
    }
    
    startGreeting() {
        const name = this.elements.userNameInput?.value.trim();
        
        if (!name) {
            this.shakeInput();
            return;
        }
        
        this.state.userName = name;
        this.audioManager.playMagic();
        
        if (this.elements.inputSection) {
            this.elements.inputSection.style.opacity = '0';
            this.elements.inputSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                this.elements.inputSection.style.display = 'none';
                
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
            nameElement.style.transform = 'scale(1.2)';
            nameElement.style.opacity = '0.5';
            
            setTimeout(() => {
                nameElement.textContent = this.state.userName;
                nameElement.style.transform = 'scale(1)';
                nameElement.style.opacity = '1';
            }, 300);
        }
        
        if (this.elements.greetingTitle) {
            const titles = ["Special Greetings", "Holiday Wishes", "Season's Greetings", "Warmest Wishes"];
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];
            this.elements.greetingTitle.textContent = randomTitle;
        }
        
        this.showMessage(this.state.currentMessage);
        
        if (this.elements.currentMessage) {
            this.elements.currentMessage.textContent = this.state.currentMessage + 1;
        }
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
                
                // Typewriter effect
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
        this.audioManager.playClick();
    }
    
    startMessageAutoSlide() {
        if (this.state.autoSlideInterval) {
            clearInterval(this.state.autoSlideInterval);
        }
        
        this.startAutoSlideCountdown();
        
        this.state.autoSlideInterval = setInterval(() => {
            this.nextMessage();
        }, 10000);
    }
    
    startAutoSlideCountdown() {
        this.state.slideCountdown = 10;
        
        if (!this.elements.countdownDisplay) return;
        
        if (this.state.countdownInterval) {
            clearInterval(this.state.countdownInterval);
        }
        
        this.state.countdownInterval = setInterval(() => {
            this.state.slideCountdown--;
            
            if (this.elements.countdownDisplay) {
                this.elements.countdownDisplay.textContent = this.state.slideCountdown;
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
        this.updateNewYearCountdown();
        setInterval(() => this.updateNewYearCountdown(), 1000);
    }
    
    updateNewYearCountdown() {
        const now = new Date();
        const newYear = new Date(2026, 0, 1);
        const diff = newYear - now;
        
        if (diff <= 0) {
            newYear.setFullYear(2027);
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.updateCountdownElement('days', days.toString().padStart(2, '0'));
        this.updateCountdownElement('hours', hours.toString().padStart(2, '0'));
        this.updateCountdownElement('minutes', minutes.toString().padStart(2, '0'));
        this.updateCountdownElement('seconds', seconds.toString().padStart(2, '0'));
    }
    
    updateCountdownElement(id, value) {
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
        this.audioManager.playFirework();
        
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
                
                setTimeout(() => {
                    const dx = Math.cos(angle) * velocity * 50;
                    const dy = Math.sin(angle) * velocity * 50;
                    
                    particle.style.transform = `translate(${dx}px, ${dy}px)`;
                    particle.style.opacity = '0';
                    
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
        
        if (this.elements.snowText) {
            this.elements.snowText.textContent = this.state.isSnowActive ? 'Snow Off' : 'Snow On';
        }
        
        if (this.audioManager) {
            this.audioManager.toggleSnowSound(this.state.isSnowActive);
        }
        
        const btn = document.getElementById('snowToggle');
        if (btn) {
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 200);
        }
        
        this.audioManager.playClick();
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
        
        if (this.elements.greetingSection) {
            this.elements.greetingSection.style.opacity = '0';
            this.elements.greetingSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                this.elements.greetingSection.style.display = 'none';
                
                if (this.elements.inputSection) {
                    this.elements.inputSection.style.display = 'block';
                    setTimeout(() => {
                        this.elements.inputSection.style.opacity = '1';
                        this.elements.inputSection.style.transform = 'translateY(0)';
                    }, 50);
                }
                
                if (this.elements.userNameInput) {
                    this.elements.userNameInput.focus();
                }
            }, 500);
        }
        
        this.resetAutoSlide();
        this.audioManager.playClick();
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
    const holidayMagic = new HolidayMagic();
    
    // Global functions for button onclick handlers
    window.nextMessage = () => holidayMagic.nextMessage();
    window.triggerFireworks = () => holidayMagic.triggerFireworks();
    window.toggleSnow = () => holidayMagic.toggleSnow();
    window.shareGreeting = () => holidayMagic.shareGreeting();
    window.resetExperience = () => holidayMagic.resetExperience();
    window.toggleMusic = () => holidayMagic.toggleMusic();
    
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
    
    /* Music button animations */
    .music-control-btn {
        transition: all 0.3s ease !important;
    }
    
    .music-control-btn:hover {
        transform: translateY(-2px) !important;
    }
    
    .music-control-btn:active {
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
