// STACK TOWER NEON - OPTIMIZACIONES VIRAL + RETENCIÓN + MONETIZACIÓN
// v2.0 - Revenue Optimization

// ========================================
// 1. VIRAL FEATURES
// ========================================

// Screenshot automático en momentos épicos
function captureEpicMoment() {
    const canvas = document.getElementById('gameCanvas');
    const dataURL = canvas.toDataURL('image/png');
    
    // Crear elemento temporal para descarga
    const link = document.createElement('a');
    link.download = `stack-tower-epic-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
    
    // Mostrar prompt de sharing
    showSharePrompt();
}

// Prompt de sharing mejorado
function showSharePrompt() {
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.innerHTML = `
        <div class="share-content">
            <h3>🎉 ¡Momento Épico Capturado!</h3>
            <p>¡Comparte tu torre increíble!</p>
            <div class="share-buttons">
                <button onclick="shareToTwitter()" class="share-btn twitter">🐦 Twitter</button>
                <button onclick="shareToFacebook()" class="share-btn facebook">📘 Facebook</button>
                <button onclick="shareToWhatsApp()" class="share-btn whatsapp">💬 WhatsApp</button>
                <button onclick="shareToInstagram()" class="share-btn instagram">📷 Instagram</button>
            </div>
            <button onclick="closeShareModal()" class="close-btn">✕</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

// Sharing mejorado con hashtags y emojis
function shareToTwitter() {
    const score = gameState.score || 0;
    const level = gameState.level || 1;
    const text = `🏗️ ¡Acabo de construir una torre de ${score} bloques en el nivel ${level}! #StackTowerNeon #Gaming #Challenge`;
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank');
    closeShareModal();
}

function shareToFacebook() {
    const score = gameState.score || 0;
    const text = `🏗️ ¡Mira mi torre de ${score} bloques en Stack Tower Neon!`;
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    closeShareModal();
}

function shareToWhatsApp() {
    const score = gameState.score || 0;
    const text = `🏗️ ¡Acabo de construir una torre de ${score} bloques! Juega aquí: ${window.location.href}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
    closeShareModal();
}

function shareToInstagram() {
    // Para Instagram, abrir en nueva pestaña con instrucciones
    const modal = document.createElement('div');
    modal.className = 'instagram-modal';
    modal.innerHTML = `
        <div class="instagram-content">
            <h3>📷 Compartir en Instagram</h3>
            <p>1. Descarga la imagen épica</p>
            <p>2. Abre Instagram Stories</p>
            <p>3. Sube la imagen</p>
            <p>4. Añade el hashtag #StackTowerNeon</p>
            <button onclick="captureEpicMoment()" class="btn">📸 Capturar Imagen</button>
            <button onclick="closeInstagramModal()" class="close-btn">✕</button>
        </div>
    `;
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('show'), 100);
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function closeInstagramModal() {
    const modal = document.querySelector('.instagram-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// ========================================
// 2. RETENCIÓN & ENGAGEMENT
// ========================================

// Sistema de logros y recompensas
const achievements = {
    firstTower: { unlocked: false, name: "Primera Torre", reward: 100 },
    tenBlocks: { unlocked: false, name: "10 Bloques", reward: 200 },
    fiftyBlocks: { unlocked: false, name: "50 Bloques", reward: 500 },
    hundredBlocks: { unlocked: false, name: "100 Bloques", reward: 1000 },
    perfectStack: { unlocked: false, name: "Apilado Perfecto", reward: 300 },
    speedBuilder: { unlocked: false, name: "Constructor Rápido", reward: 400 }
};

// Sistema de power-ups
const powerUps = {
    slowMotion: { name: "Cámara Lenta", cost: 100, duration: 5000 },
    perfectGuide: { name: "Guía Perfecta", cost: 200, duration: 10000 },
    extraLife: { name: "Vida Extra", cost: 500, duration: 0 },
    doublePoints: { name: "Puntos Dobles", cost: 300, duration: 15000 }
};

// Monedas del juego
let gameCoins = parseInt(localStorage.getItem('stackTowerCoins') || '0');

// Mostrar notificación de logro
function showAchievement(achievement) {
    const notification = document.createElement('div');
    notification.className = 'achievement-notification';
    notification.innerHTML = `
        <div class="achievement-content">
            <div class="achievement-icon">🏆</div>
            <div class="achievement-text">
                <h4>¡Logro Desbloqueado!</h4>
                <p>${achievement.name}</p>
                <span class="reward">+${achievement.reward} monedas</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Añadir monedas
    gameCoins += achievement.reward;
    localStorage.setItem('stackTowerCoins', gameCoins.toString());
    updateCoinsDisplay();
}

// Verificar logros
function checkAchievements() {
    const score = gameState.score || 0;
    
    if (score >= 1 && !achievements.firstTower.unlocked) {
        achievements.firstTower.unlocked = true;
        showAchievement(achievements.firstTower);
    }
    
    if (score >= 10 && !achievements.tenBlocks.unlocked) {
        achievements.tenBlocks.unlocked = true;
        showAchievement(achievements.tenBlocks);
    }
    
    if (score >= 50 && !achievements.fiftyBlocks.unlocked) {
        achievements.fiftyBlocks.unlocked = true;
        showAchievement(achievements.fiftyBlocks);
    }
    
    if (score >= 100 && !achievements.hundredBlocks.unlocked) {
        achievements.hundredBlocks.unlocked = true;
        showAchievement(achievements.hundredBlocks);
    }
}

// ========================================
// 3. MONETIZACIÓN MEJORADA
// ========================================

// Reward ads para power-ups
function showRewardAd(powerUpType, callback) {
    // Simular reward ad (en producción sería AdMob o similar)
    const modal = document.createElement('div');
    modal.className = 'reward-ad-modal';
    modal.innerHTML = `
        <div class="reward-ad-content">
            <h3>🎬 Ver Anuncio para ${powerUps[powerUpType].name}</h3>
            <p>Mira un anuncio de 30 segundos para obtener este power-up gratis</p>
            <div class="ad-simulation">
                <div class="ad-video">
                    <div class="ad-progress"></div>
                    <p>Anuncio en reproducción...</p>
                </div>
            </div>
            <button onclick="completeRewardAd('${powerUpType}', ${callback})" class="btn">✅ Obtener Power-up</button>
            <button onclick="closeRewardAd()" class="btn secondary">❌ Cancelar</button>
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
            modal.querySelector('button').disabled = false;
        }
    }, 100);
}

function completeRewardAd(powerUpType, callback) {
    // Aplicar power-up
    if (callback) callback();
    
    // Cerrar modal
    const modal = document.querySelector('.reward-ad-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
    
    // Mostrar confirmación
    showNotification(`¡${powerUps[powerUpType].name} activado!`, 'success');
}

function closeRewardAd() {
    const modal = document.querySelector('.reward-ad-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// Interstitial ads estratégicos
function showInterstitialAd() {
    // Mostrar ad cada 3 partidas o cada 5 minutos
    const lastAdTime = parseInt(localStorage.getItem('lastInterstitialAd') || '0');
    const currentTime = Date.now();
    const adInterval = 5 * 60 * 1000; // 5 minutos
    
    if (currentTime - lastAdTime > adInterval) {
        const modal = document.createElement('div');
        modal.className = 'interstitial-ad-modal';
        modal.innerHTML = `
            <div class="interstitial-ad-content">
                <h3>📺 Anuncio</h3>
                <div class="ad-banner">
                    <p>Anuncio de 30 segundos</p>
                    <div class="ad-timer">30</div>
                </div>
                <button onclick="closeInterstitialAd()" class="btn">Continuar</button>
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

function closeInterstitialAd() {
    const modal = document.querySelector('.interstitial-ad-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

// ========================================
// 4. UI MEJORADA
// ========================================

// Actualizar display de monedas
function updateCoinsDisplay() {
    let coinsDisplay = document.getElementById('coinsDisplay');
    if (!coinsDisplay) {
        coinsDisplay = document.createElement('div');
        coinsDisplay.id = 'coinsDisplay';
        coinsDisplay.className = 'coins-display';
        document.querySelector('.game-ui').appendChild(coinsDisplay);
    }
    coinsDisplay.innerHTML = `💰 ${gameCoins}`;
}

// Mostrar notificación
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// 5. ESTILOS CSS ADICIONALES
// ========================================

const additionalStyles = `
<style>
/* Modales de sharing */
.share-modal, .instagram-modal, .reward-ad-modal, .interstitial-ad-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
}

.share-modal.show, .instagram-modal.show, .reward-ad-modal.show, .interstitial-ad-modal.show {
    opacity: 1;
}

.share-content, .instagram-content, .reward-ad-content, .interstitial-ad-content {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
    border-radius: 20px;
    text-align: center;
    color: white;
    max-width: 400px;
    width: 90%;
    position: relative;
}

.share-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin: 1.5rem 0;
}

.share-btn {
    padding: 1rem;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
}

.share-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}

.share-btn.twitter { background: #1da1f2; color: white; }
.share-btn.facebook { background: #4267b2; color: white; }
.share-btn.whatsapp { background: #25d366; color: white; }
.share-btn.instagram { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color: white; }

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

/* Notificaciones de logros */
.achievement-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ffd700, #ffed4e);
    color: #333;
    padding: 1rem;
    border-radius: 10px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    z-index: 1000;
    transform: translateX(100%);
    transition: transform 0.3s;
}

.achievement-notification.show {
    transform: translateX(0);
}

.achievement-content {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.achievement-icon {
    font-size: 2rem;
}

.achievement-text h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
}

.achievement-text p {
    margin: 0 0 0.5rem 0;
    font-weight: bold;
}

.reward {
    color: #059669;
    font-weight: bold;
}

/* Display de monedas */
.coins-display {
    position: fixed;
    top: 20px;
    left: 20px;
    background: rgba(0, 0, 0, 0.8);
    color: #ffd700;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: bold;
    z-index: 100;
}

/* Notificaciones generales */
.notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: white;
    padding: 1rem 2rem;
    border-radius: 10px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
}

.notification.show {
    opacity: 1;
}

.notification.success { background: #059669; }
.notification.error { background: #dc2626; }
.notification.warning { background: #f59e0b; }

/* Anuncios simulados */
.ad-simulation {
    background: #000;
    border-radius: 10px;
    padding: 1rem;
    margin: 1rem 0;
}

.ad-progress {
    height: 4px;
    background: #333;
    border-radius: 2px;
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
    border-radius: 10px;
    text-align: center;
    margin: 1rem 0;
}

.ad-timer {
    font-size: 2rem;
    font-weight: bold;
    color: #ffd700;
    margin: 1rem 0;
}
</style>
`;

// Inyectar estilos adicionales
document.head.insertAdjacentHTML('beforeend', additionalStyles);
