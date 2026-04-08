// Game data structure
const gameData = {
    chapters: [
        {
            id: 'woods',
            title: 'Whispers of the Woods',
            icon: '🌲',
            description: 'Enter the mystical forest where ancient secrets whisper through emerald leaves. Navigate through enchanted groves and uncover the wisdom of nature\'s guardians.',
            theme: 'theme-woods',
            textColor: 'text-success',
            accentColor: 'var(--woods-primary)',
            particles: {
                chars: ['🍃', '🌿', '🦋'],
                colors: ['#10b981', '#34d399', '#6ee7b7']
            },
            levels: [
                { name: 'Butterfly Spotter Game', difficulty: 'Easy', type: 'Strategy' },
                { name: 'Puzzle Game (Image/Tile Swap)', difficulty: 'Medium', type: 'Puzzle' },
                { name: 'Memory Card Game', difficulty: 'Medium', type: 'Memory' },
                { name: 'Ocean Cleanup', difficulty: 'Hard', type: 'Recognition' },
                { name: 'Flappy Bird Game', difficulty: 'Hard', type: 'Arcade' }
            ]
        },
        {
            id: 'cosmica',
            title: 'Echoes from Cosmica',
            icon: '🌌',
            description: 'Journey beyond the stars into the cosmic void where celestial wonders await. Master the forces of the universe and dance with cosmic entities.',
            theme: 'theme-cosmica',
            textColor: 'text-info',
            accentColor: 'var(--cosmica-primary)',
            particles: {
                chars: ['✨', '⭐', '🌟'],
                colors: ['#8b5cf6', '#a78bfa', '#c4b5fd']
            },
            levels: [
                { name: 'Comet Catcher', difficulty: 'Easy', type: 'Action' },
                { name: 'Astral Flow', difficulty: 'Medium', type: 'Flow' },
                { name: 'Orbit Match', difficulty: 'Medium', type: 'Match' },
                { name: 'Space Defender', difficulty: 'Hard', type: 'Physics' },
                { name: 'Star Constellation Memory', difficulty: 'Hard', type: 'Memory' }
            ]
        },
        {
            id: 'dark',
            title: 'The Dark Within',
            icon: '🔮',
            description: 'Descend into the shadows where darkness reveals its hidden truths. Face your fears and embrace the power that lies within the void.',
            theme: 'theme-dark',
            textColor: 'text-danger',
            accentColor: 'var(--dark-primary)',
            particles: {
                chars: ['🔮', '👻', '🕯️'],
                colors: ['#ef4444', '#f87171', '#fca5a5']
            },
            levels: [
                { name: 'Whack-a-mole', difficulty: 'Easy', type: 'Mystery' },
                { name: 'Horror Maze Escape', difficulty: 'Medium', type: 'Crafting' },
                { name: 'The Haunted Memory Match', difficulty: 'Medium', type: 'Memory' },
                { name: 'Night City Zombie Shooter', difficulty: 'Hard', type: 'Hidden Object' },
                { name: 'The Quick Draw Seance', difficulty: 'Hard', type: 'Navigation' }
            ]
        },
        {
            id: 'depth',
            title: 'Mysteries of the Depth',
            icon: '🌊',
            description: 'Dive into the mysterious depths of the ocean where ancient leviathans guard forgotten treasures. Explore the abyss and unlock its secrets.',
            theme: 'theme-depth',
            textColor: 'text-info',
            accentColor: 'var(--depth-primary)',
            particles: {
                chars: ['🐠', '🫧', '🌊'],
                colors: ['#06b6d4', '#67e8f9', '#a5f3fc']
            },
            levels: [
                { name: 'Sea Sweeper', difficulty: 'Easy', type: 'Strategy' },
                { name: 'Ocean Floor Memory', difficulty: 'Medium', type: 'Memory' },
                { name: 'Bubble Pop', difficulty: 'Medium', type: 'Action' },
                { name: 'Deep Drive Decoder', difficulty: 'Hard', type: 'Puzzle' },
                { name: 'Treasure Driver', difficulty: 'Hard', type: 'Match' }
            ]
        },
        {
            id: 'mechana',
            title: 'Rise of Mechana',
            icon: '⚙️',
            description: 'Enter the realm of gears and circuits where technology meets magic. Command mechanical marvels and hack the very fabric of reality.',
            theme: 'theme-mechana',
            textColor: 'text-warning',
            accentColor: 'var(--mechana-primary)',
            particles: {
                chars: ['⚡', '🔧', '⚙️'],
                colors: ['#f97316', '#fb923c', '#fdba74']
            },
            levels: [
                { name: 'Mech Repair Rush', difficulty: 'Easy', type: 'Logic' },
                { name: 'Circuit Flow', difficulty: 'Medium', type: 'Puzzle' },
                { name: 'Claw Machine Game', difficulty: 'Medium', type: 'Memory' },
                { name: 'Escape the Factory', difficulty: 'Hard', type: 'Clicker' },
                { name: 'Button Sequence Hacker', difficulty: 'Hard', type: 'Sequence' }
            ]
        }
    ]
};

// Function to safely get and parse progress from localStorage
function loadProgress(key, defaultValue) {
    const saved = localStorage.getItem(key);
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error(`Error parsing localStorage key: ${key}`, e);
        }
    }
    return defaultValue;
}

// --------------------------------------------------------------------------
// --- CORRECTED GAME STATE (Reads from localStorage first) ---
// --------------------------------------------------------------------------

// Retrieve the 'nextLevel' object saved by your game levels
const nextLevelProgress = loadProgress('nextLevel', { chapter: 0, level: 0 }); 

// Determine the maximum unlocked level for each chapter based on 'nextLevel'
function initializeUnlockedLevels() {
    const levels = {
        0: 0, // Chapter 1 starts with Level 1 (index 0) unlocked
        1: 0, 
        2: 0, 
        3: 0, 
        4: 0
    };

    // Unlock all levels in preceding chapters
    for (let c = 0; c < nextLevelProgress.chapter; c++) {
        // Assume 5 levels per chapter (index 0-4)
        levels[c] = 4; 
    }
    
    // Unlock levels in the current chapter
    levels[nextLevelProgress.chapter] = nextLevelProgress.level;
    
    // If the game is played for the first time, ensure C1 L1 is playable
    if (nextLevelProgress.chapter === 0 && nextLevelProgress.level === 0) {
        levels[0] = 0; // C1 L1 is the next level to play, so only L1 is unlocked.
    }

    return levels;
}

// Game state
const gameState = {
    selectedChapter: 0,
    unlockedLevels: initializeUnlockedLevels(), // NOW uses the saved progress!
    achievements: loadProgress('achievements', []), // Also load achievements if you have them
    settings: loadProgress('settings', { // Load settings or use default
        soundEnabled: true,
        musicEnabled: true,
        particleQuality: 'high',
        animationSpeed: 'normal'
    })
};
// --------------------------------------------------------------------------

// Utility functions (Keep the rest of your file as-is, AFTER this block)
// ...

// Utility functions
function getDifficultyClass(difficulty) {
    switch (difficulty) {
        case 'Easy': return 'difficulty-easy';
        case 'Medium': return 'difficulty-medium';
        case 'Hard': return 'difficulty-hard';
        default: return 'difficulty-easy';
    }
}

function isChapterUnlocked(index) {
    if (index === 0 || index === 1 || index === 2 || index === 3 || index === 4 ) return true;
    return gameState.unlockedLevels[index - 1] >= 3;
}

function getTotalUnlockedLevels() {
    return Object.values(gameState.unlockedLevels).reduce((sum, count) => sum + count, 0);
}

function getTotalLevels() {
    return gameData.chapters.reduce((sum, chapter) => sum + chapter.levels.length, 0);
}

function getOverallProgress() {
    return Math.round((getTotalUnlockedLevels() / getTotalLevels()) * 100);
}