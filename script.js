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
            snowflakes: []
        };
        
        this.initialize();
    }
    
    initialize() {
        this.cacheElements();
        this.setupEventListeners();
        this.createParticles();
        this.createSnowflakes();
        this.startAutoThemeCycle();
        this.startCountdown();
        this.startMessageAutoSlide();
        this.animateTitle();
        this.playBackgroundMusic();
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
        this.elements.startBtn.addEventListener('click', () => this.startGreeting());
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
    
    animateInput(value) {
        const inputGroup = this.elements.userNameInput.parentElement;
        if (value.length > 0) {
            inputGroup.style.transform = 'scale(1.02)';
        } else {
            inputGroup.style.transform = 'scale(1)';
        }
    }
    
    startGreeting() {
        const name = this.elements.userNameInput.value.trim();
        
        if (!name) {
            this.shakeInput();
            return;
        }
        
        this.state.userName = name;
        this.playSound('magicSound');
        
        // Animate transition
        this.animateTransition(() => {
            this.elements.inputSection.style.display = 'none';
            this.elements.greetingSection.style.display = 'block';
            this.updateGreeting();
            this.triggerCelebration();
        });
    }
    
    animateTransition(callback) {
        const magicCircle = document.querySelector('.magic-circle');
        magicCircle.style.animation = 'pulseCircle 1s ease-in-out';
        
        setTimeout(() => {
            magicCircle.style.animation = '';
            callback();
        }, 1000);
    }
    
    updateGreeting() {
        const nameElement = this.elements.nameDisplay.querySelector('.name-text');
        const greetingTitles = [
            "Special Greetings",
            "Holiday Wishes",
            "Season's Greetings",
            "Warmest Wishes",
            "Joyful Moments"
        ];
        
        // Animate name change
        this.animateTextChange(nameElement, this.state.userName);
        
        // Update greeting title
        const randomTitle = greetingTitles[Math.floor(Math.random() * greetingTitles.length)];
        this.elements.greetingTitle.textContent = randomTitle;
        
        // Update message display
        this.showMessage(this.state.currentMessage);
        
        // Update message counter
        this.elements.currentMessage.textContent = this.state.currentMessage + 1;
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
            messages[index].classList.add('active');
            messages[index].style.animation = 'messageSlideIn 0.8s ease-out';
            
            // Add text animation
            this.animateMessageText(messages[index]);
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
    }
    
    resetAutoSlide() {
        clearInterval(this.state.autoSlideInterval);
        this.startMessageAutoSlide();
        this.resetCountdown();
    }
    
    resetCountdown() {
        this.elements.countdownDisplay.textContent = '7';
        this.elements.progressBar.style.animation = 'progressShrink 7s linear infinite';
    }
    
    startCountdown() {
        // Update countdown every second
        this.state.countdownInterval = setInterval(() => {
            const countdown = parseInt(this.elements.countdownDisplay.textContent);
            if (countdown > 1) {
                this.elements.countdownDisplay.textContent = countdown - 1;
            } else {
                this.elements.countdownDisplay.textContent = '7';
            }
        }, 1000);
        
        // Update New Year countdown
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
        
        this.animateCountdownChange('days', days.toString().padStart(2, '0'));
        this.animateCountdownChange('hours', hours.toString().padStart(2, '0'));
        this.animateCountdownChange('minutes', minutes.toString().padStart(2, '0'));
        this.animateCountdownChange('seconds', seconds.toString().padStart(2, '0'));
    }
    
    animateCountdownChange(type, value) {
        const element = this.elements[type];
        if (element.textContent !== value) {
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
            this.elements.typingText.textContent = `Theme: ${themes[currentTheme].name}`;
        }, 15000); // 15 seconds
    }
    
    createParticles() {
        const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96e6a1'];
        
        for (let i = 0; i < 150; i++) {
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
            
            this.state.particles.push(particle);
            this.elements.particlesContainer.appendChild(particle);
        }
    }
    
    createSnowflakes() {
        const canvas = this.elements.snowCanvas;
        const ctx = canvas.getContext('2d');
        
        // Set canvas size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Create snowflakes
        for (let i = 0; i < 200; i++) {
            this.state.snowflakes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 4 + 1,
                speed: Math.random() * 1 + 0.5,
                wind: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
        
        // Draw snowflakes
        const drawSnow = () => {
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
            
            requestAnimationFrame(drawSnow);
        };
        
        drawSnow();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }
    
    triggerFireworks() {
        this.playSound('magicSound');
        
        for (let i = 0; i < 5; i++) {
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
        const particles = [];
        
        for (let i = 0; i < 100; i++) {
            const angle = (Math.PI * 2 * i) / 100;
            const velocity = Math.random() * 5 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push({
                x, y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                color,
                life: 100,
                size: Math.random() * 3 + 1
            });
        }
        
        const animateFirework = () => {
            const canvas = document.createElement('canvas');
            canvas.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 1000;
            `;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            document.body.appendChild(canvas);
            
            const ctx = canvas.getContext('2d');
            let alive = true;
            
            const draw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                let particlesAlive = false;
                
                particles.forEach(particle => {
                    if (particle.life > 0) {
                        particlesAlive = true;
                        particle.x += particle.vx;
                        particle.y += particle.vy;
                        particle.vx *= 0.95;
                        particle.vy *= 0.95;
                        particle.life--;
                        
                        ctx.globalAlpha = particle.life / 100;
                        ctx.fillStyle = particle.color;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                });
                
                if (particlesAlive) {
                    requestAnimationFrame(draw);
                } else {
                    document.body.removeChild(canvas);
                }
            };
            
            draw();
        };
        
        animateFirework();
    }
    
    toggleSnow() {
        this.state.isSnowActive = !this.state.isSnowActive;
        const btn = document.querySelector('[onclick="toggleSnow()"]');
        btn.innerHTML = this.state.isSnowActive ? 
            '<i class="fas fa-snowflake"></i><span>Snow Off</span>' :
            '<i class="fas fa-snowflake"></i><span>Snow On</span>';
    }
    
    shareGreeting() {
        const text = `🎄 ${this.state.userName} sent you magical holiday greetings! ✨\n\n"${this.getCurrentMessage()}"\n\nSend your own magical greetings at: ${window.location.href}`;
        
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
        return messages[this.state.currentMessage].textContent;
    }
    
    resetExperience() {
        this.state.userName = '';
        this.state.currentMessage = 0;
        
        this.elements.userNameInput.value = '';
        this.elements.inputSection.style.display = 'block';
        this.elements.greetingSection.style.display = 'none';
        
        this.elements.userNameInput.focus();
        this.playSound('clickSound');
    }
    
    shakeInput() {
        this.elements.userNameInput.style.animation = 'shake 0.5s';
        setTimeout(() => {
            this.elements.userNameInput.style.animation = '';
        }, 500);
    }
    
    triggerCelebration() {
        // Trigger multiple effects
        this.triggerFireworks();
        this.createBurstEffect();
        this.playSound('magicSound');
        
        // Animate all holiday orbit items
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
                document.body.removeChild(burst);
            }
        };
        
        grow();
    }
    
    animateTitle() {
        const titleChars = document.querySelectorAll('.title-char');
        setInterval(() => {
            const randomChar = titleChars[Math.floor(Math.random() * titleChars.length)];
            randomChar.style.animation = 'bounceIn 0.5s ease-out';
            
            setTimeout(() => {
                randomChar.style.animation = '';
            }, 500);
        }, 2000);
    }
    
    playBackgroundMusic() {
        // Optional: Add background music
         const music = new Audio('https://assets.mixkit.co/music/preview/mixkit-christmas-is-here-243.mp3');
         music.loop = true;
         music.volume = 0.3;
         music.play();
    }
    
    playSound(soundId) {
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("Audio play failed:", e));
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
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
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
    window.holidayMagic = new HolidayMagic();
    
    // Global functions for button onclick handlers
    window.nextMessage = () => holidayMagic.nextMessage();
    window.triggerFireworks = () => holidayMagic.triggerFireworks();
    window.toggleSnow = () => holidayMagic.toggleSnow();
    window.shareGreeting = () => holidayMagic.shareGreeting();
    window.resetExperience = () => holidayMagic.resetExperience();
});
