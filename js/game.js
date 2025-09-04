/**
 * 🌈 STACK TOWER NEON - OPTIMIZED GAME LOGIC
 * Simplified for better browser compatibility
 */

// ====== GLOBAL GAME STATE ======
const GameState = {
    score: 0,
    highScore: parseInt(localStorage.getItem('stackTowerHighScore') || '0'),
    streak: 0,
    level: 1,
    gameActive: false,
    audioEnabled: true,
    currentScreen: 'loading'
};

// ====== SIMPLE AUDIO SYSTEM ======
class SimpleAudio {
    constructor() {
        this.enabled = true;
        this.context = null;
        this.init();
    }
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio not supported');
        }
    }
    
    beep(freq = 440, duration = 200) {
        if (!this.enabled || !this.context) return;
        
        try {
            const osc = this.context.createOscillator();
            const gain = this.context.createGain();
            
            osc.connect(gain);
            gain.connect(this.context.destination);
            
            osc.frequency.value = freq;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration/1000);
            
            osc.start(this.context.currentTime);
            osc.stop(this.context.currentTime + duration/1000);
        } catch (e) {
            console.log('Audio error:', e);
        }
    }
    
    perfect() { this.beep(880, 300); }
    normal() { this.beep(440, 200); }
    gameOver() { this.beep(220, 800); }
    
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// ====== SCREEN MANAGER ======
class ScreenManager {
    constructor() {
        this.currentScreen = 'loading';
        this.screens = ['loading', 'menu', 'instructions', 'game', 'gameover'];
    }
    
    show(screenName) {
        // Hide all screens
        this.screens.forEach(name => {
            const screen = document.getElementById(`${name}-screen`);
            if (screen) screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(`${screenName}-screen`);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenName;
        }
    }
}

// ====== SIMPLE BLOCK CLASS ======
class Block {
    constructor(scene, x, y, width, height, color) {
        this.scene = scene;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.isMoving = true;
        this.direction = 1;
        this.speed = 2;
        
        // Create visual representation
        this.sprite = scene.add.rectangle(x, y, width, height, color);
        this.sprite.setStrokeStyle(2, 0x00FFFF);
        
        // Add physics
        scene.physics.add.existing(this.sprite, true);
    }
    
    update() {
        if (!this.isMoving) return;
        
        this.x += this.speed * this.direction;
        this.sprite.x = this.x;
        
        // Bounce off edges
        if (this.x <= 50 || this.x >= 750) {
            this.direction *= -1;
        }
    }
    
    stop() {
        this.isMoving = false;
    }
    
    calculateOverlap(otherBlock) {
        if (!otherBlock) return this.width;
        
        const left = Math.max(this.x - this.width/2, otherBlock.x - otherBlock.width/2);
        const right = Math.min(this.x + this.width/2, otherBlock.x + otherBlock.width/2);
        
        return Math.max(0, right - left);
    }
    
    trim(newWidth) {
        this.width = newWidth;
        this.sprite.setSize(newWidth, this.height);
    }
}

// ====== MAIN GAME SCENE ======
class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        // Initialize game
        this.blocks = [];
        this.currentBlock = null;
        this.perfectStreak = 0;
        this.baseSpeed = 2;
        this.cameraY = 0;
        
        // Audio
        this.audio = new SimpleAudio();
        
        // Input
        this.input.on('pointerdown', () => this.stackBlock());
        this.input.keyboard.on('keydown-SPACE', () => this.stackBlock());
        
        // Start first block
        this.spawnBlock();
        
        // Update UI
        this.updateUI();
    }
    
    update() {
        if (this.currentBlock) {
            this.currentBlock.update();
        }
    }
    
    spawnBlock() {
        const colors = [0xFF0080, 0x00FFFF, 0x8A2BE2, 0x39FF14, 0xFFFF00];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const previousBlock = this.blocks[this.blocks.length - 1];
        const y = previousBlock ? previousBlock.y - 60 : 500;
        
        this.currentBlock = new Block(this, 400, y, 120, 40, color);
        
        // Increase speed based on level
        this.currentBlock.speed = this.baseSpeed + (GameState.level - 1) * 0.5;
        
        this.blocks.push(this.currentBlock);
    }
    
    stackBlock() {
        if (!this.currentBlock || !this.currentBlock.isMoving) return;
        
        this.currentBlock.stop();
        
        const previousBlock = this.blocks[this.blocks.length - 2];
        const overlap = this.currentBlock.calculateOverlap(previousBlock);
        
        // Check if block fell off
        if (overlap <= 5) {
            this.gameOver();
            return;
        }
        
        // Check for perfect stack
        const isPerfect = overlap >= this.currentBlock.width * 0.95;
        
        if (isPerfect) {
            this.handlePerfect();
        } else {
            this.handleNormal(overlap);
        }
        
        // Update game state
        this.updateLevel();
        this.updateUI();
        this.updateCamera();
        
        // Spawn next block
        setTimeout(() => this.spawnBlock(), 500);
    }
    
    handlePerfect() {
        this.perfectStreak++;
        GameState.streak = this.perfectStreak;
        
        let points = 1 + 3; // base + perfect bonus
        if (this.perfectStreak >= 5) points += 5; // streak bonus
        
        GameState.score += points;
        
        // Effects
        this.showIndicator('perfect');
        this.audio.perfect();
        this.cameras.main.shake(100, 0.01);
        
        if (window.trackEvent) {
            window.trackEvent('perfect_stack', { streak: this.perfectStreak });
        }
    }
    
    handleNormal(overlap) {
        this.perfectStreak = 0;
        GameState.streak = 0;
        
        // Trim block
        this.currentBlock.trim(overlap);
        
        GameState.score += 1;
        this.audio.normal();
        
        if (window.trackEvent) {
            window.trackEvent('block_stacked');
        }
    }
    
    updateLevel() {
        const newLevel = Math.floor(GameState.score / 10) + 1;
        if (newLevel > GameState.level) {
            GameState.level = newLevel;
        }
    }
    
    updateCamera() {
        if (this.blocks.length > 8) {
            this.cameraY += 60;
            this.cameras.main.scrollY = this.cameraY;
        }
    }
    
    updateUI() {
        document.getElementById('current-score').textContent = GameState.score;
        document.getElementById('streak').textContent = GameState.streak;
        
        if (GameState.score > GameState.highScore) {
            GameState.highScore = GameState.score;
            localStorage.setItem('stackTowerHighScore', GameState.highScore.toString());
        }
        
        document.getElementById('high-score').textContent = GameState.highScore;
    }
    
    showIndicator(type) {
        const indicator = document.getElementById(`${type}-indicator`);
        if (indicator) {
            indicator.classList.remove('hidden');
            setTimeout(() => indicator.classList.add('hidden'), 1500);
        }
    }
    
    gameOver() {
        this.audio.gameOver();
        this.cameras.main.shake(500, 0.02);
        
        // Show game over screen
        setTimeout(() => {
            document.getElementById('final-score').textContent = GameState.score;
            
            // Check for new record
            if (GameState.score === GameState.highScore && GameState.score > 0) {
                document.getElementById('new-record').classList.remove('hidden');
            } else {
                document.getElementById('new-record').classList.add('hidden');
            }
            
            screenManager.show('gameover');
        }, 1000);
        
        if (window.trackEvent) {
            window.trackEvent('game_over', { 
                score: GameState.score,
                level: GameState.level 
            });
        }
    }
}

// ====== PHASER CONFIG ======
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-canvas',
    backgroundColor: '#0a0a0a',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: GameScene
};

// ====== GLOBAL VARIABLES ======
let game;
let screenManager;
let audio;

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', function() {
    console.log('🌈 Initializing Stack Tower Neon...');
    
    // Create screen manager
    screenManager = new ScreenManager();
    audio = new SimpleAudio();
    
    // Setup UI event listeners
    setupEventListeners();
    
    // Load high score
    document.getElementById('menu-high-score').textContent = GameState.highScore;
    
    console.log('✅ Game initialized successfully');
});

// ====== EVENT LISTENERS ======
function setupEventListeners() {
    // Menu buttons
    document.getElementById('play-btn').addEventListener('click', startGame);
    document.getElementById('instructions-btn').addEventListener('click', () => screenManager.show('instructions'));
    document.getElementById('back-to-menu').addEventListener('click', () => screenManager.show('menu'));
    
    // Audio toggle
    document.getElementById('audio-btn').addEventListener('click', toggleAudio);
    document.getElementById('mute-btn').addEventListener('click', toggleAudio);
    
    // Game over buttons
    document.getElementById('restart-btn').addEventListener('click', startGame);
    document.getElementById('continue-ad-btn').addEventListener('click', showContinueAd);
    document.getElementById('share-btn').addEventListener('click', shareScore);
    
    // Power-up buttons
    document.querySelectorAll('.powerup-btn').forEach(btn => {
        btn.addEventListener('click', () => showPowerUpAd(btn.dataset.powerup));
    });
    
    // Pause button
    document.getElementById('pause-btn').addEventListener('click', togglePause);
}

// ====== GAME FUNCTIONS ======
function startGame() {
    // Reset game state
    GameState.score = 0;
    GameState.streak = 0;
    GameState.level = 1;
    GameState.gameActive = true;
    
    // Show game screen
    screenManager.show('game');
    
    // Create or restart Phaser game
    if (game) {
        game.destroy(true);
    }
    
    game = new Phaser.Game(config);
    
    if (window.trackEvent) {
        window.trackEvent('game_start');
    }
}

function toggleAudio() {
    if (audio) {
        const enabled = audio.toggle();
        document.getElementById('audio-icon').textContent = enabled ? '🔊' : '🔇';
        document.getElementById('mute-btn').textContent = enabled ? '🔊' : '🔇';
    }
}

function togglePause() {
    if (game && game.scene.scenes[0]) {
        const scene = game.scene.scenes[0];
        if (scene.scene.isPaused()) {
            scene.scene.resume();
            document.getElementById('pause-btn').textContent = '⏸️';
        } else {
            scene.scene.pause();
            document.getElementById('pause-btn').textContent = '▶️';
        }
    }
}

function showContinueAd() {
    if (window.adSystem) {
        window.adSystem.showAd('rewarded', (success) => {
            if (success) {
                // Give extra lives or continue game
                console.log('Continue ad viewed - giving extra lives');
                startGame(); // For now, just restart
            }
        });
    }
}

function showPowerUpAd(powerUpType) {
    if (window.adSystem) {
        window.adSystem.showAd('rewarded', (success) => {
            if (success) {
                console.log(`Power-up ad viewed: ${powerUpType}`);
                // Grant power-up logic here
            }
        });
    }
}

function shareScore() {
    const text = `¡Conseguí ${GameState.score} puntos en Stack Tower Neon! 🌈`;
    const url = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Stack Tower Neon',
            text: text,
            url: url
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(`${text} ${url}`).then(() => {
            alert('¡Puntuación copiada al portapapeles!');
        });
    }
    
    if (window.trackEvent) {
        window.trackEvent('score_shared', { score: GameState.score });
    }
}

// ====== UTILITY FUNCTIONS ======
function showScreen(screenName) {
    if (screenManager) {
        screenManager.show(screenName);
    }
}

// Make functions global for HTML onclick handlers
window.showScreen = showScreen;
window.startGame = startGame;
window.toggleAudio = toggleAudio;

console.log('🎮 Stack Tower Neon game script loaded');