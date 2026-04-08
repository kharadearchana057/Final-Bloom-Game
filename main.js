// Main game logic
let introCompleted = false;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Start cinematic intro
    startCinematicIntro();
    
    // Initialize particle system for intro
    particleSystem.createIntroParticles();
    
    // Auto-complete intro after 4 seconds
    setTimeout(() => {
        if (!introCompleted) {
            completeIntro();
        }
    }, 4000);
});

function startCinematicIntro() {
    console.log('🎵 Playing: Epic Cinematic Intro Theme');
    
    // Animate intro elements
    setTimeout(() => {
        const logo = document.querySelector('.intro-logo');
        logo.style.opacity = '1';
        logo.style.transform = 'scale(1)';
    }, 500);
    
    setTimeout(() => {
        const title = document.querySelector('.intro-title');
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 1500);
    
    setTimeout(() => {
        const loading = document.querySelector('.intro-loading');
        loading.style.opacity = '1';
    }, 2500);
}

function skipIntro() {
    completeIntro();
}

function completeIntro() {
    if (introCompleted) return;
    introCompleted = true;
    
    const intro = document.getElementById('cinematicIntro');
    const gameInterface = document.getElementById('gameInterface');
    
    intro.style.opacity = '0';
    intro.style.transform = 'scale(1.1)';
    
    setTimeout(() => {
        intro.classList.add('d-none');
        gameInterface.classList.remove('d-none');
        
        // Initialize game interface
        initializeGame();
    }, 500);
}

function initializeGame() {
    // Initialize custom cursor
    customCursor = new CustomCursor();
    
    // Initialize particle system
    particleSystem.setTheme('woods');
    
    // Render chapters and levels
    renderChapters();
    renderLevels();
    updateHUD();
    
    // Apply initial theme
    applyTheme('woods');
    
    console.log('🎮 Game interface initialized');
}

function renderChapters() {
    const container = document.getElementById('chaptersContainer');
    container.innerHTML = '';
    
    gameData.chapters.forEach((chapter, index) => {
        const isUnlocked = isChapterUnlocked(index);
        const isSelected = gameState.selectedChapter === index;
        const completedLevels = gameState.unlockedLevels[index] || 0;
        const totalLevels = chapter.levels.length;
        const progressPercent = (completedLevels / totalLevels) * 100;
        
        const chapterCard = document.createElement('div');
        chapterCard.className = `chapter-card ripple-container ${isSelected ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;
        chapterCard.style.borderColor = isSelected ? chapter.accentColor : '';
        
        chapterCard.innerHTML = `
            ${!isUnlocked ? '<i class="fas fa-lock lock-icon"></i>' : ''}
            <div class="chapter-content">
                <div class="chapter-icon">${chapter.icon}</div>
                <div class="chapter-info">
                    <h5 class="chapter-name ${chapter.textColor}">${chapter.title}</h5>
                    <div class="chapter-progress">
                        <span class="progress-text-small">${completedLevels}/${totalLevels} completed</span>
                        ${completedLevels === totalLevels ? '<span class="completed-badge">✨</span>' : ''}
                    </div>
                    <div class="chapter-progress-bar">
                        <div class="chapter-progress-fill" style="width: ${progressPercent}%; background: ${isSelected ? chapter.accentColor : '#6b7280'}"></div>
                    </div>
                </div>
            </div>
        `;
        
        if (isUnlocked) {
            chapterCard.addEventListener('click', (e) => {
                selectChapter(index);
                createRipple(e, chapterCard);
                playChapterSelectSound(chapter.id);
            });
        }
        
        container.appendChild(chapterCard);
    });
}

function renderLevels() {
    const container = document.getElementById('levelsContainer');
    const chapter = gameData.chapters[gameState.selectedChapter];
    const unlockedCount = gameState.unlockedLevels[gameState.selectedChapter] || 0;
    
    container.innerHTML = '';
    
    chapter.levels.forEach((level, index) => {
        const isUnlocked = index <= unlockedCount;
        const isCompleted = index < unlockedCount;
        const isNext = index === unlockedCount;
        
        const levelCard = document.createElement('div');
        levelCard.className = `level-card ripple-container ${!isUnlocked ? 'locked' : ''} ${isNext ? 'next' : ''}`;
        
        const statusIcon = isCompleted || isNext
  ? (isNext
      ? `<button class="play-btn" data-level="${index + 1}">
           <i class="fas fa-play"></i>
         </button>`
      : `<i class="fas fa-check"></i>`)
  : `<i class="fas fa-lock"></i>`;

            
        const statusClass = isCompleted ? 'completed' : isNext ? 'next' : 'locked';
        
        levelCard.innerHTML = `
            ${isNext ? '<div class="next-badge">NEXT</div>' : ''}
            <div class="level-content">
                <div class="level-info">
                    <div class="level-status-icon ${statusClass}">
                        ${statusIcon}
                    </div>
                    <div class="level-details">
                        <h5>${level.name}</h5>
                        <div class="level-meta">
                            <span class="${getDifficultyClass(level.difficulty)}">${level.difficulty}</span>
                            <span class="text-muted">•</span>
                            <span class="level-type text-muted">${level.type}</span>
                        </div>
                    </div>
                </div>
                ${isCompleted ? '<div class="completed-text">✓ COMPLETED</div>' : ''}
            </div>
            <div class="level-stars">
                ${[...Array(3)].map((_, i) => 
                    `<i class="fas fa-star ${isCompleted ? 'filled' : ''}"></i>`
                ).join('')}
            </div>
        `;
        
        if (isUnlocked) {
            levelCard.addEventListener('click', (e) => {
                handleLevelClick(index);
                createRipple(e, levelCard);
            });
        }
        
        container.appendChild(levelCard);
    });
}

function selectChapter(index) {
    gameState.selectedChapter = index;
    const chapter = gameData.chapters[index];
    
    // Update theme
    applyTheme(chapter.id);
    particleSystem.setTheme(chapter.id);
    
    // Update UI
    renderChapters();
    renderLevels();
    updateHUD();
    
    // Show chapter modal
    showChapterModal(chapter);
    
    // Add achievement for exploring chapters
    if (index > 0) {
        addAchievement({
            id: `chapter-${index}`,
            title: 'Chapter Explorer',
            description: `Discovered ${chapter.title}`,
            type: 'discovery'
        });
    }
}

function handleLevelClick(levelIndex) {
    const chapterIndex = gameState.selectedChapter;
    const chapter = gameData.chapters[chapterIndex];
    const level = chapter.levels[levelIndex];
    const unlockedCount = gameState.unlockedLevels[chapterIndex] || 0;

    if (levelIndex < unlockedCount) {
        // Replay completed level
        console.log(`🎮 Replaying level: ${level.name}`);
    } else if (levelIndex === unlockedCount) {
        // Play next available level
        console.log(`🎮 Starting level: ${level.name}`);
        window.location.href = `chapter${chapterIndex + 1}/level${levelIndex + 1}.html`;
    } else {
        console.log("🔒 Level is locked!");
    }
}


function completeLevelSimulation(chapterIndex, levelIndex) {
    // Update unlocked levels
    gameState.unlockedLevels[chapterIndex] = Math.max(gameState.unlockedLevels[chapterIndex], levelIndex + 1);
    
    // Unlock next chapter if current chapter is completed
    if (levelIndex >= 4 && chapterIndex < 4) {
        gameState.unlockedLevels[chapterIndex + 1] = Math.max(gameState.unlockedLevels[chapterIndex + 1] || 0, 0);
    }
    
    // Add achievement
    const chapter = gameData.chapters[chapterIndex];
    addAchievement({
        id: `level-${chapterIndex}-${levelIndex}`,
        title: 'Level Master',
        description: `Completed ${chapter.levels[levelIndex].name}`,
        type: 'completion'
    });
    
    // Add first level achievement
    if (levelIndex === 0) {
        addAchievement({
            id: `first-${chapter.id}`,
            title: 'First Steps',
            description: `Completed your first level in ${chapter.title}`,
            type: 'milestone'
        });
    }
    
    // Re-render UI
    renderChapters();
    renderLevels();
    updateHUD();
    
    console.log('🎉 Level completed!');
    console.log('🔊 Playing sound: level-complete.mp3');
}

function applyTheme(themeId) {
    const gameInterface = document.getElementById('gameInterface');
    const chapter = gameData.chapters.find(c => c.id === themeId);
    
    // Remove all theme classes
    gameInterface.className = gameInterface.className.replace(/theme-\w+/g, '');
    
    // Add new theme class
    gameInterface.classList.add(chapter.theme);
    
    // Update chapter title color
    const chapterTitle = document.getElementById('chapterTitle');
    chapterTitle.className = `chapter-title ${chapter.textColor}`;
    chapterTitle.textContent = chapter.title;
}

function updateHUD() {
    document.getElementById('currentChapter').textContent = gameState.selectedChapter + 1;
    document.getElementById('totalChapters').textContent = gameData.chapters.length;
    document.getElementById('unlockedLevels').textContent = getTotalUnlockedLevels();
    document.getElementById('totalLevels').textContent = getTotalLevels();
    
    const progress = getOverallProgress();
    document.getElementById('overallProgress').style.width = progress + '%';
    document.getElementById('progressText').textContent = progress + '%';
}

function showChapterModal(chapter) {
    const modal = new bootstrap.Modal(document.getElementById('chapterModal'));
    
    // Update modal content
    document.getElementById('modalChapterIcon').textContent = chapter.icon;
    document.getElementById('modalChapterTitle').textContent = chapter.title;
    document.getElementById('modalChapterTitle').className = `modal-chapter-title ${chapter.textColor}`;
    document.getElementById('modalChapterDescription').textContent = chapter.description;
    
    const beginBtn = document.getElementById('beginJourneyBtn');
    beginBtn.style.background = chapter.accentColor;
    beginBtn.style.borderColor = chapter.accentColor;
    
    modal.show();
}

function openSettings() {
    const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
    modal.show();
}

function clearCache() {
    console.log('🔄 Clearing cache...');
    setTimeout(() => {
        console.log('✅ Cache cleared');
        // Show success feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Cleared!';
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-success');
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('btn-success');
            btn.classList.add('btn-danger');
        }, 2000);
    }, 1000);
}

function playChapterSelectSound(chapterId) {
    console.log(`🔊 Playing sound: chapter-select-${chapterId}.mp3`);
}

// Settings event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Sound toggle
    document.getElementById('soundToggle').addEventListener('change', function(e) {
        gameState.settings.soundEnabled = e.target.checked;
        console.log('🔊 Sound effects:', e.target.checked ? 'enabled' : 'disabled');
    });
    
    // Music toggle
    document.getElementById('musicToggle').addEventListener('change', function(e) {
        gameState.settings.musicEnabled = e.target.checked;
        console.log('🎵 Background music:', e.target.checked ? 'enabled' : 'disabled');
    });
    
    // Particle quality
    document.getElementById('particleQuality').addEventListener('change', function(e) {
        gameState.settings.particleQuality = e.target.value;
        particleSystem.setTheme(gameData.chapters[gameState.selectedChapter].id);
        console.log('✨ Particle quality set to:', e.target.value);
    });
    
    // Animation speed
    document.getElementById('animationSpeed').addEventListener('change', function(e) {
        gameState.settings.animationSpeed = e.target.value;
        console.log('⚡ Animation speed set to:', e.target.value);
    });
});

// Add CSS animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);



// --- Add this near the end of main.js ---
document.addEventListener("DOMContentLoaded", () => {
    const lastCompleted = JSON.parse(localStorage.getItem("lastCompleted"));
    if (lastCompleted) {
        completeLevelSimulation(lastCompleted.chapter, lastCompleted.level);
        localStorage.removeItem("lastCompleted"); // run only once
    }
});





// Handle play button clicks (redirect to level pages dynamically per chapter)
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".play-btn");
  if (btn) {
    const level = btn.dataset.level;
    const chapter = gameState.selectedChapter + 1; // since selectedChapter is 0-based
    window.location.href = `chapter${chapter}/level${level}.html`;
  }








});
