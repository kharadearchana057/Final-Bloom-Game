// Particle system
class ParticleSystem {
    constructor() {
        this.container = document.getElementById('particleSystem');
        this.particles = [];
        this.currentTheme = 'woods';
        this.animationId = null;
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.clearParticles();
        this.createParticles();
    }

    createParticles() {
        const chapter = gameData.chapters.find(c => c.id === this.currentTheme);
        if (!chapter) return;

        const particleCount = this.getParticleCount();
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(chapter);
        }
    }

    getParticleCount() {
        const quality = gameState.settings.particleQuality;
        const baseCount = {
            woods: 30,
            cosmica: 40,
            dark: 25,
            depth: 35,
            mechana: 45
        }[this.currentTheme] || 30;

        const multiplier = {
            low: 0.5,
            medium: 0.75,
            high: 1,
            ultra: 1.5
        }[quality] || 1;

        return Math.floor(baseCount * multiplier);
    }

    createParticle(chapter) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const char = chapter.particles.chars[Math.floor(Math.random() * chapter.particles.chars.length)];
        const color = chapter.particles.colors[Math.floor(Math.random() * chapter.particles.colors.length)];
        
        particle.textContent = char;
        particle.style.color = color;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';

        this.container.appendChild(particle);
        this.particles.push(particle);
    }

    clearParticles() {
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
    }

    createIntroParticles() {
        const container = document.querySelector('.intro-particles');
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.color = 'white';
            particle.style.opacity = '0.3';
            particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
            particle.style.animation = `pulse ${2 + Math.random() * 3}s ease-in-out infinite`;
            particle.style.animationDelay = Math.random() * 3 + 's';
            particle.textContent = '✨';
            
            container.appendChild(particle);
        }
    }
}

// Create global particle system
const particleSystem = new ParticleSystem();