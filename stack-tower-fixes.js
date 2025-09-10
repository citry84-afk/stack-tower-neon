// STACK TOWER NEON - FIXES CRÍTICOS v2.1
// Arreglar bugs y mejorar monetización

// ========================================
// 1. FIXES CRÍTICOS DE BUGS
// ========================================

// Fix: Logros no bloquean el juego
function showAchievementFixed(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification-fixed';
    notification.innerHTML = `
        <div class="achievement-content-fixed">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <h4>¡Logro Desbloqueado!</h4>
                <p>${achievement.name}</p>
                <span class="reward">+${achievement.reward} monedas</span>
            </div>
            <button onclick="closeAchievementFixed()" class="close-achievement-btn">✕</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-cerrar después de 3 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            closeAchievementFixed();
        }
    }, 3000);
    
    // Añadir monedas
    gameCoins += achievement.reward;
    localStorage.setItem('stackTowerCoins', gameCoins.toString());
    updateCoinsDisplay();
}

function closeAchievementFixed() {
    const modal = document.querySelector('.achievement-notification-fixed');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Fix: Sharing viral funcional
function shareScoreFixed() {
    const score = gameState.score || 0;
    const level = gameState.level || 1;
    
    // Capturar momento épico
    captureEpicMomentFixed();
    
    // Mostrar modal de sharing
    showShareModalFixed(score, level);
}

function captureEpicMomentFixed() {
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL('image/png');
    
    // Crear elemento temporal para descarga
    const link = document.createElement('a');
    link.download = `stack-tower-epic-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
}

function showShareModalFixed(score, level) {
    const modal = document.createElement('div');
    modal.className = 'share-modal-fixed';
    modal.innerHTML = `
        <div class="share-content-fixed">
            <h3>🎉 ¡Momento Épico Capturado!</h3>
            <p>¡Comparte tu torre de ${score} bloques!</p>
            <div class="share-buttons-fixed">
                <button onclick="shareToTwitterFixed(${score}, ${level})" class="share-btn twitter">🐦 Twitter</button>
                <button onclick="shareToFacebookFixed(${score}, ${level})" class="share-btn facebook">📘 Facebook</button>
                <button onclick="shareToWhatsAppFixed(${score}, ${level})" class="share-btn whatsapp">💬 WhatsApp</button>
                <button onclick="shareToInstagramFixed(${score}, ${level})" class="share-btn instagram">📷 Instagram</button>
            </div>
            <button onclick="closeShareModalFixed()" class="close-btn">✕</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function shareToTwitterFixed(score, level) {
    const text = `🏗️ ¡Acabo de construir una torre de ${score} bloques en el nivel ${level}! #StackTowerNeon #Gaming #Challenge`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    closeShareModalFixed();
}

function shareToFacebookFixed(score, level) {
    const text = `🏗️ ¡Mira mi torre de ${score} bloques en Stack Tower Neon!`;
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    closeShareModalFixed();
}

function shareToWhatsAppFixed(score, level) {
    const text = `🏗️ ¡Acabo de construir una torre de ${score} bloques! Juega aquí: ${window.location.href}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    closeShareModalFixed();
}

function shareToInstagramFixed(score, level) {
    const modal = document.createElement('div');
    modal.className = 'instagram-modal-fixed';
    modal.innerHTML = `
        <div class="instagram-content-fixed">
            <h3>📷 Compartir en Instagram</h3>
            <p>1. La imagen épica se ha descargado</p>
            <p>2. Abre Instagram Stories</p>
            <p>3. Sube la imagen</p>
            <p>4. Añade el hashtag #StackTowerNeon</p>
            <button onclick="closeInstagramModalFixed()" class="btn">✅ Entendido</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function closeShareModalFixed() {
    const modal = document.querySelector('.share-modal-fixed');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function closeInstagramModalFixed() {
    const modal = document.querySelector('.instagram-modal-fixed');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// ========================================
// 2. MONETIZACIÓN MEJORADA
// ========================================

// Reward ads cuando te matan
function showRewardAdOnDeath() {
    const modal = document.createElement('div');
    modal.className = 'reward-ad-death-modal';
    modal.innerHTML = `
        <div class="reward-ad-death-content">
            <h3>💀 ¡Has caído!</h3>
            <p>Mira un anuncio para revivir y continuar tu torre</p>
            <div class="ad-simulation">
                <div class="ad-video">
                    <div class="ad-progress"></div>
                    <p>Anuncio en reproducción...</p>
                </div>
            </div>
            <button onclick="reviveWithAd()" class="btn revive-btn">🎬 REVIVIR GRATIS</button>
            <button onclick="restartGame()" class="btn secondary">🔄 REINICIAR</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
    
    // Simular progreso del anuncio
    const progressBar = modal.querySelector('.ad-progress');
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        progressBar.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(interval);
            modal.querySelector('.revive-btn').disabled = false;
        }
    }, 100);
}

function reviveWithAd() {
    // Revivir el juego
    gameState.gameOver = false;
    gameState.score = Math.max(0, gameState.score - 10); // Penalización pequeña
    
    // Cerrar modal
    const modal = document.querySelector('.reward-ad-death-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Continuar el juego
    startGame();
}

function restartGame() {
    // Cerrar modal
    const modal = document.querySelector('.reward-ad-death-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Reiniciar juego
    gameState.score = 0;
    gameState.level = 1;
    gameState.gameOver = false;
    startGame();
}

// Interstitial ads estratégicos
function showInterstitialAdFixed() {
    const lastAdTime = parseInt(localStorage.getItem('lastInterstitialAd') || '0');
    const currentTime = Date.now();
    const adInterval = 3 * 60 * 1000; // 3 minutos
    
    if (currentTime - lastAdTime > adInterval) {
        const modal = document.createElement('div');
        modal.className = 'interstitial-ad-fixed-modal';
        modal.innerHTML = `
            <div class="interstitial-ad-fixed-content">
                <h3>📺 Anuncio</h3>
                <div class="ad-banner">
                    <p>Anuncio de 30 segundos</p>
                    <div class="ad-timer">30</div>
                </div>
                <button onclick="closeInterstitialAdFixed()" class="btn">Continuar</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 100);
        
        // Timer del anuncio
        let timeLeft = 30;
        const timer = setInterval(() => {
            timeLeft--;
            modal.querySelector('.ad-timer').textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                modal.querySelector('button').disabled = false;
            }
        }, 1000);
        
        localStorage.setItem('lastInterstitialAd', currentTime.toString());
    }
}

function closeInterstitialAdFixed() {
    const modal = document.querySelector('.interstitial-ad-fixed-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// ========================================
// 3. GAMEPLAY MEJORADO
// ========================================

// Sistema de combos más llamativo
function showComboFixed(combo) {
    const comboElement = document.createElement('div');
    comboElement.className = 'combo-display-fixed';
    comboElement.innerHTML = `
        <div class="combo-text">COMBO x${combo}</div>
        <div class="combo-particles"></div>
    `;
    
    document.body.appendChild(comboElement);
    
    // Animación del combo
    setTimeout(() => {
        comboElement.classList.add('show');
    }, 100);
    
    // Remover después de 2 segundos
    setTimeout(() => {
        comboElement.classList.remove('show');
        setTimeout(() => comboElement.remove(), 300);
    }, 2000);
}

// Velocidad más agresiva
function updateSpeedFixed() {
    const baseSpeed = 2;
    const speedIncrease = Math.floor(gameState.score / 50) * 0.5;
    gameState.speed = baseSpeed + speedIncrease;
    
    // Límite máximo de velocidad
    gameState.speed = Math.min(gameState.speed, 8);
}

// ========================================
// 4. ESTILOS CSS FIXES
// ========================================

const fixesStyles = `
<style>
/* Fixes para logros */
.achievement-notification-fixed {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #333;
    padding: 1rem;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s;
    max-width: 300px;
    animation: achievementSlideIn 0.5s ease-out;
}

@keyframes achievementSlideIn {
    0% { transform: translateX(100%) scale(0.8); }
    100% { transform: translateX(0) scale(1); }
}

.achievement-notification-fixed.show {
    transform: translateX(0);
}

.achievement-content-fixed {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
}

.close-achievement-btn {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4444;
    color: white;
    border: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    cursor: pointer;
    font-size: 0.8rem;
}

/* Fixes para sharing */
.share-modal-fixed, .instagram-modal-fixed, .reward-ad-death-modal, .interstitial-ad-fixed-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s;
}

.share-modal-fixed.show, .instagram-modal-fixed.show, .reward-ad-death-modal.show, .interstitial-ad-fixed-modal.show {
    opacity: 1;
}

.share-content-fixed, .instagram-content-fixed, .reward-ad-death-content, .interstitial-ad-fixed-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    color: white;
    max-width: 500px;
    width: 90%;
    position: relative;
}

.share-buttons-fixed {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
}

.share-btn {
    padding: 1rem;
    border: none;
    border-radius: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 1.1rem;
}

.share-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.share-btn.twitter { background: #1da1f2; color: white; }
.share-btn.facebook { background: #4267b2; color: white; }
.share-btn.whatsapp { background: #25d366; color: white; }
.share-btn.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white; }

/* Fixes para combos */
.combo-display-fixed {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
}

.combo-display-fixed.show {
    opacity: 1;
}

.combo-text {
    font-size: 4rem;
    font-weight: bold;
    color: #ffd700;
    text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
    animation: comboPulse 0.5s ease-out;
}

@keyframes comboPulse {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(1); opacity: 1; }
}

.combo-particles {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
    border-radius: 50%;
    animation: comboExplode 0.8s ease-out;
}

@keyframes comboExplode {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
}

/* Fixes para anuncios */
.ad-simulation {
    background: #000;
    border-radius: 15px;
    padding: 1.5rem;
    margin: 1.5rem 0;
}

.ad-progress {
    height: 6px;
    background: #333;
    border-radius: 3px;
    margin-bottom: 1rem;
    overflow: hidden;
}

.ad-progress::after {
    content: '';
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    width: 0%;
    transition: width 0.1s;
}

.ad-banner {
    background: #000;
    color: white;
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    margin: 1.5rem 0;
}

.ad-timer {
    font-size: 2.5rem;
    font-weight: bold;
    color: #ffd700;
    margin: 1rem 0;
}

.revive-btn {
    background: linear-gradient(135deg, #ff6b6b, #ee5a24);
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    font-size: 1.2rem;
    margin: 0.5rem;
}

.revive-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
}

.close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
}
</style>
`;

// Inyectar estilos fixes
document.head.insertAdjacentHTML('beforeend', fixesStyles);
