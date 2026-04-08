// Achievement system
class AchievementSystem {
    constructor() {
        this.achievements = [];
        this.loadAchievements();
    }

    addAchievement(achievement) {
        // Check if achievement already exists
        const exists = this.achievements.some(a => a.id === achievement.id);
        if (exists) return;

        const newAchievement = {
            ...achievement,
            timestamp: Date.now()
        };

        this.achievements.push(newAchievement);
        this.saveAchievements();
        this.showNotification(newAchievement);
        this.playAchievementSound();
        
        // Update HUD
        this.updateAchievementCount();
    }

    showNotification(achievement) {
        const container = document.getElementById('achievementNotifications');
        const notification = document.createElement('div');
        notification.className = `achievement-notification ${achievement.type}`;
        
        const iconMap = {
            discovery: 'fas fa-sparkles text-primary',
            completion: 'fas fa-trophy text-warning',
            milestone: 'fas fa-crosshairs text-success',
            special: 'fas fa-star text-info'
        };

        notification.innerHTML = `
            <div class="achievement-header">
                <i class="${iconMap[achievement.type]}"></i>
                <h6>Achievement Unlocked!</h6>
                <span class="achievement-sparkle">✨</span>
            </div>
            <h6 class="achievement-title">${achievement.title}</h6>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-progress">
                <div class="achievement-progress-bar ${achievement.type}"></div>
            </div>
        `;

        container.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    playAchievementSound() {
        console.log('🏆 Achievement Unlocked!');
        console.log('🔊 Playing sound: achievement-unlock.mp3');
    }

    updateAchievementCount() {
        const countElement = document.getElementById('achievementCount');
        if (countElement) {
            countElement.textContent = this.achievements.length;
        }
    }

    saveAchievements() {
        localStorage.setItem('mystic-realms-achievements', JSON.stringify(this.achievements));
    }

    loadAchievements() {
        const saved = localStorage.getItem('mystic-realms-achievements');
        if (saved) {
            try {
                this.achievements = JSON.parse(saved);
                this.updateAchievementCount();
            } catch (error) {
                console.error('Failed to load achievements:', error);
                this.achievements = [];
            }
        }
    }
}

// Create global achievement system
const achievementSystem = new AchievementSystem();

// Add achievement function for global use
function addAchievement(achievement) {
    achievementSystem.addAchievement(achievement);
}