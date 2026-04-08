// Custom cursor system
class CustomCursor {
    constructor() {
        this.cursor = document.getElementById('customCursor');
        this.trail = [];
        this.isClicking = false;
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => this.updatePosition(e));
        document.addEventListener('mousedown', () => this.setClicking(true));
        document.addEventListener('mouseup', () => this.setClicking(false));
        
        // Clean up trail periodically
        setInterval(() => this.cleanupTrail(), 50);
    }

    updatePosition(e) {
        const x = e.clientX;
        const y = e.clientY;
        
        // Update cursor position
        this.cursor.style.left = (x - 12) + 'px';
        this.cursor.style.top = (y - 12) + 'px';
        
        // Add trail point
        this.addTrailPoint(x, y);
    }

    addTrailPoint(x, y) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = (x - 2) + 'px';
        trail.style.top = (y - 2) + 'px';
        
        document.body.appendChild(trail);
        
        this.trail.push({
            element: trail,
            timestamp: Date.now()
        });
        
        // Limit trail length
        if (this.trail.length > 8) {
            const oldest = this.trail.shift();
            if (oldest.element.parentNode) {
                oldest.element.parentNode.removeChild(oldest.element);
            }
        }
    }

    setClicking(clicking) {
        this.isClicking = clicking;
        this.cursor.style.transform = clicking ? 'scale(0.75)' : 'scale(1)';
    }

    cleanupTrail() {
        const now = Date.now();
        this.trail = this.trail.filter(point => {
            if (now - point.timestamp > 500) {
                if (point.element.parentNode) {
                    point.element.parentNode.removeChild(point.element);
                }
                return false;
            }
            return true;
        });
    }
}

// Ripple effect system
function createRipple(e, element) {
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = (x - 25) + 'px';
    ripple.style.top = (y - 25) + 'px';
    ripple.style.width = '50px';
    ripple.style.height = '50px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// Initialize cursor system
let customCursor;