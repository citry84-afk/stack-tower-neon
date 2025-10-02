// 🏆 LIPA STUDIOS - DAILY LEADERBOARD SYSTEM WITH BADGES & NOTIFICATIONS
// Sistema de clasificación diaria con badges, logros y notificaciones

class DailyLeaderboard {
    constructor(gameName) {
        this.gameName = gameName;
        this.storageKey = `lipa_leaderboard_${gameName}`;
        this.userKey = `lipa_user_${gameName}`;
        this.badgesKey = `lipa_badges_${gameName}`;
        this.today = this.getTodayString();
        this.leaderboard = this.loadLeaderboard();
        this.currentUser = this.loadCurrentUser();
        this.badges = this.loadBadges();
        this.notifications = [];
    }

    getTodayString() {
        return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }

    loadLeaderboard() {
        try {
            const data = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            if (data.date !== this.today) {
                // Nuevo día - reiniciar leaderboard
                return { date: this.today, scores: [] };
            }
            return data;
        } catch (e) {
            return { date: this.today, scores: [] };
        }
    }

    loadCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem(this.userKey) || 'null');
        } catch (e) {
            return null;
        }
    }

    loadBadges() {
        try {
            return JSON.parse(localStorage.getItem(this.badgesKey) || '[]');
        } catch (e) {
            return [];
        }
    }

    saveLeaderboard() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.leaderboard));
        } catch (e) {
            console.error('Error saving leaderboard:', e);
        }
    }

    saveCurrentUser() {
        try {
            localStorage.setItem(this.userKey, JSON.stringify(this.currentUser));
        } catch (e) {
            console.error('Error saving user:', e);
        }
    }

    saveBadges() {
        try {
            localStorage.setItem(this.badgesKey, JSON.stringify(this.badges));
        } catch (e) {
            console.error('Error saving badges:', e);
        }
    }

    setUserName(name) {
        this.currentUser = {
            name: name.trim().substring(0, 15), // Máximo 15 caracteres
            joinDate: this.currentUser?.joinDate || new Date().toISOString(),
            totalGames: this.currentUser?.totalGames || 0,
            bestScore: this.currentUser?.bestScore || 0,
            dailyGames: this.currentUser?.dailyGames || 0,
            streak: this.currentUser?.streak || 0,
            lastPlayDate: this.currentUser?.lastPlayDate || null
        };
        this.saveCurrentUser();
    }

    // 🏅 SISTEMA DE BADGES Y LOGROS
    checkBadges(score, level, combo) {
        const newBadges = [];
        const today = this.today;
        
        // Badges de puntuación
        if (score >= 10000 && !this.hasBadge('high_score_10k')) {
            newBadges.push({
                id: 'high_score_10k',
                name: 'Puntuación Épica',
                emoji: '🔥',
                description: 'Conseguir 10,000+ puntos',
                date: today,
                rarity: 'common'
            });
        }
        
        if (score >= 50000 && !this.hasBadge('high_score_50k')) {
            newBadges.push({
                id: 'high_score_50k',
                name: 'Maestro del Juego',
                emoji: '👑',
                description: 'Conseguir 50,000+ puntos',
                date: today,
                rarity: 'rare'
            });
        }
        
        if (score >= 100000 && !this.hasBadge('high_score_100k')) {
            newBadges.push({
                id: 'high_score_100k',
                name: 'Leyenda Viviente',
                emoji: '🌟',
                description: 'Conseguir 100,000+ puntos',
                date: today,
                rarity: 'legendary'
            });
        }
        
        // Badges de combo
        if (combo >= 20 && !this.hasBadge('combo_master_20')) {
            newBadges.push({
                id: 'combo_master_20',
                name: 'Combo Master',
                emoji: '⚡',
                description: 'Combo de 20x o más',
                date: today,
                rarity: 'common'
            });
        }
        
        if (combo >= 50 && !this.hasBadge('combo_legend_50')) {
            newBadges.push({
                id: 'combo_legend_50',
                name: 'Combo Legendario',
                emoji: '💥',
                description: 'Combo de 50x o más',
                date: today,
                rarity: 'rare'
            });
        }
        
        // Badges de nivel
        if (level >= 10 && !this.hasBadge('level_master_10')) {
            newBadges.push({
                id: 'level_master_10',
                name: 'Nivel Master',
                emoji: '🎯',
                description: 'Llegar al nivel 10+',
                date: today,
                rarity: 'common'
            });
        }
        
        if (level >= 25 && !this.hasBadge('level_legend_25')) {
            newBadges.push({
                id: 'level_legend_25',
                name: 'Nivel Legendario',
                emoji: '🏆',
                description: 'Llegar al nivel 25+',
                date: today,
                rarity: 'rare'
            });
        }
        
        // Badges de racha diaria
        if (this.currentUser) {
            const lastPlayDate = this.currentUser.lastPlayDate;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            
            if (lastPlayDate === yesterdayStr) {
                this.currentUser.streak = (this.currentUser.streak || 0) + 1;
            } else if (lastPlayDate !== today) {
                this.currentUser.streak = 1;
            }
            
            this.currentUser.lastPlayDate = today;
            this.currentUser.dailyGames = (this.currentUser.dailyGames || 0) + 1;
            
            // Badge de racha
            if (this.currentUser.streak >= 3 && !this.hasBadge('streak_3')) {
                newBadges.push({
                    id: 'streak_3',
                    name: 'Racha Diaria',
                    emoji: '🔥',
                    description: 'Jugar 3 días seguidos',
                    date: today,
                    rarity: 'common'
                });
            }
            
            if (this.currentUser.streak >= 7 && !this.hasBadge('streak_7')) {
                newBadges.push({
                    id: 'streak_7',
                    name: 'Semana Completa',
                    emoji: '💪',
                    description: 'Jugar 7 días seguidos',
                    date: today,
                    rarity: 'rare'
                });
            }
            
            if (this.currentUser.streak >= 30 && !this.hasBadge('streak_30')) {
                newBadges.push({
                    id: 'streak_30',
                    name: 'Mes Completo',
                    emoji: '🏅',
                    description: 'Jugar 30 días seguidos',
                    date: today,
                    rarity: 'legendary'
                });
            }
            
            // Badge de juegos diarios
            if (this.currentUser.dailyGames >= 5 && !this.hasBadge('daily_games_5')) {
                newBadges.push({
                    id: 'daily_games_5',
                    name: 'Jugador Activo',
                    emoji: '🎮',
                    description: 'Jugar 5+ partidas en un día',
                    date: today,
                    rarity: 'common'
                });
            }
            
            if (this.currentUser.dailyGames >= 10 && !this.hasBadge('daily_games_10')) {
                newBadges.push({
                    id: 'daily_games_10',
                    name: 'Adicto al Juego',
                    emoji: '🎯',
                    description: 'Jugar 10+ partidas en un día',
                    date: today,
                    rarity: 'rare'
                });
            }
        }
        
        // Badges de ranking
        const userRank = this.getUserRank();
        if (userRank === 1 && !this.hasBadge('first_place')) {
            newBadges.push({
                id: 'first_place',
                name: 'Campeón del Día',
                emoji: '🥇',
                description: 'Ser #1 en el ranking diario',
                date: today,
                rarity: 'legendary'
            });
        }
        
        if (userRank <= 3 && userRank > 0 && !this.hasBadge('top_3')) {
            newBadges.push({
                id: 'top_3',
                name: 'Podio',
                emoji: '🏆',
                description: 'Estar en el top 3 del ranking',
                date: today,
                rarity: 'rare'
            });
        }
        
        if (userRank <= 10 && userRank > 0 && !this.hasBadge('top_10')) {
            newBadges.push({
                id: 'top_10',
                name: 'Top 10',
                emoji: '⭐',
                description: 'Estar en el top 10 del ranking',
                date: today,
                rarity: 'common'
            });
        }
        
        // Añadir nuevos badges
        newBadges.forEach(badge => {
            this.badges.push(badge);
            this.showNotification(`¡Nuevo Badge Desbloqueado! ${badge.emoji} ${badge.name}`, 'badge');
        });
        
        if (newBadges.length > 0) {
            this.saveBadges();
        }
        
        return newBadges;
    }

    hasBadge(badgeId) {
        return this.badges.some(badge => badge.id === badgeId);
    }

    getBadgesByRarity(rarity) {
        return this.badges.filter(badge => badge.rarity === rarity);
    }

    getRecentBadges(limit = 5) {
        return this.badges
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    }

    // 🔔 SISTEMA DE NOTIFICACIONES
    showNotification(message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date().toISOString()
        };
        
        this.notifications.push(notification);
        
        // Crear elemento visual
        const notificationEl = document.createElement('div');
        notificationEl.style.cssText = `
            position: fixed; top: 20px; right: 20px; z-index: 100001;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid ${type === 'badge' ? '#FFD700' : type === 'achievement' ? '#00FF00' : '#00ffff'};
            border-radius: 10px; padding: 15px 20px; max-width: 300px;
            color: #fff; font-family: system-ui; font-weight: bold;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            transform: translateX(100%); transition: transform 0.3s ease;
        `;
        
        notificationEl.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 20px;">${type === 'badge' ? '🏅' : type === 'achievement' ? '🎉' : '📢'}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notificationEl);
        
        // Animar entrada
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover
        setTimeout(() => {
            notificationEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (document.body.contains(notificationEl)) {
                    document.body.removeChild(notificationEl);
                }
            }, 300);
        }, duration);
    }

    submitScore(score, level = 1, combo = 0) {
        if (!this.currentUser) {
            // Guardar envío pendiente y pedir nombre
            this._pendingSubmission = { score, level, combo };
            this.showNamePrompt(true);
            return false;
        }

        const scoreData = {
            name: this.currentUser.name,
            score: score,
            level: level,
            combo: combo,
            timestamp: Date.now(),
            game: this.gameName
        };

        // Añadir score al leaderboard
        this.leaderboard.scores.push(scoreData);
        
        // Ordenar por score descendente
        this.leaderboard.scores.sort((a, b) => b.score - a.score);
        
        // Mantener solo top 50
        this.leaderboard.scores = this.leaderboard.scores.slice(0, 50);
        
        this.saveLeaderboard();

        // Actualizar stats del usuario
        this.currentUser.totalGames++;
        if (score > this.currentUser.bestScore) {
            this.currentUser.bestScore = score;
            this.showNotification(`¡Nuevo récord personal! ${score.toLocaleString()} puntos`, 'achievement');
        }
        this.saveCurrentUser();

        // Verificar badges
        const newBadges = this.checkBadges(score, level, combo);
        
        // Notificación de ranking
        const userRank = this.getUserRank();
        if (userRank <= 3) {
            this.showNotification(`¡Estás en el #${userRank} del ranking!`, 'achievement');
        }

        // Mostrar ranking
        this.showRanking(scoreData);
        
        return true;
    }

    getRanking() {
        return this.leaderboard.scores.slice(0, 10); // Top 10
    }

    getUserRank() {
        if (!this.currentUser) return null;
        
        const userIndex = this.leaderboard.scores.findIndex(
            entry => entry.name === this.currentUser.name
        );
        
        return userIndex >= 0 ? userIndex + 1 : null;
    }

    showNamePrompt(autoSubmitAfter = false) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 100000; display: flex;
            align-items: center; justify-content: center; font-family: system-ui;
        `;
        
        overlay.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); 
                        border: 2px solid #00ffff; border-radius: 15px; padding: 30px; 
                        text-align: center; max-width: 400px; width: 90%;">
                <h2 style="color: #00ffff; margin-bottom: 20px;">🏆 ¡Únete al Ranking Diario!</h2>
                <p style="color: #fff; margin-bottom: 20px;">Elige tu nombre para competir en la clasificación diaria</p>
                <input type="text" id="username-input" placeholder="Tu nombre (máx 15 caracteres)" 
                       style="width: 100%; padding: 12px; margin-bottom: 20px; border: 2px solid #00ffff; 
                              background: rgba(0,0,0,0.5); color: #fff; border-radius: 8px; font-size: 16px;"
                       maxlength="15">
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <button id="save-name" style="background: #00ffff; color: #000; padding: 12px 24px; 
                            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">GUARDAR</button>
                    <button id="skip-name" style="background: #666; color: #fff; padding: 12px 24px; 
                            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">SALTAR</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const input = overlay.querySelector('#username-input');
        const saveBtn = overlay.querySelector('#save-name');
        const skipBtn = overlay.querySelector('#skip-name');
        
        input.focus();
        
        saveBtn.onclick = () => {
            const name = input.value.trim();
            if (name.length >= 2) {
                this.setUserName(name);
                document.body.removeChild(overlay);
                // Si hay envío pendiente, publicarlo ahora
                if (autoSubmitAfter && this._pendingSubmission) {
                    const { score, level, combo } = this._pendingSubmission;
                    this._pendingSubmission = null;
                    this.submitScore(score, level, combo);
                }
            } else {
                alert('El nombre debe tener al menos 2 caracteres');
            }
        };
        
        skipBtn.onclick = () => {
            // Asignar un nombre temporal si el usuario decide saltar
            if (!this.currentUser) {
                this.setUserName('Anónimo');
            }
            document.body.removeChild(overlay);
            if (autoSubmitAfter && this._pendingSubmission) {
                const { score, level, combo } = this._pendingSubmission;
                this._pendingSubmission = null;
                this.submitScore(score, level, combo);
            }
        };
        
        input.onkeypress = (e) => {
            if (e.key === 'Enter') saveBtn.click();
        };
    }

    showRanking(scoreData) {
        const ranking = this.getRanking();
        const userRank = this.getUserRank();
        const recentBadges = this.getRecentBadges(3);
        
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 100000; display: flex;
            align-items: center; justify-content: center; font-family: system-ui;
        `;
        
        let rankingHTML = '';
        ranking.forEach((entry, index) => {
            const isCurrentUser = entry.name === this.currentUser.name;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
            const rankClass = isCurrentUser ? 'current-user' : '';
            
            rankingHTML += `
                <div class="rank-item ${rankClass}" style="
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 8px 12px; margin: 4px 0; border-radius: 8px;
                    background: ${isCurrentUser ? 'rgba(0,255,255,0.2)' : 'rgba(255,255,255,0.1)'};
                    border: ${isCurrentUser ? '2px solid #00ffff' : '1px solid #333'};
                ">
                    <span style="color: #fff; font-weight: bold;">${medal} #${index + 1}</span>
                    <span style="color: ${isCurrentUser ? '#00ffff' : '#fff'}; font-weight: bold;">${entry.name}</span>
                    <span style="color: #ffff00; font-weight: bold;">${entry.score.toLocaleString()}</span>
                </div>
            `;
        });
        
        // HTML de badges recientes
        let badgesHTML = '';
        if (recentBadges.length > 0) {
            badgesHTML = `
                <div style="margin-bottom: 20px; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                    <h3 style="color: #FFD700; margin-bottom: 10px;">🏅 Badges Recientes</h3>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        ${recentBadges.map(badge => `
                            <span style="background: ${badge.rarity === 'legendary' ? '#FFD700' : badge.rarity === 'rare' ? '#FF6B6B' : '#4ECDC4'}; 
                                        color: #000; padding: 4px 8px; border-radius: 15px; font-size: 12px; font-weight: bold;">
                                ${badge.emoji} ${badge.name}
                            </span>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        overlay.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); 
                        border: 2px solid #00ffff; border-radius: 15px; padding: 30px; 
                        text-align: center; max-width: 600px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h2 style="color: #00ffff; margin-bottom: 20px;">🏆 Ranking Diario - ${this.gameName}</h2>
                <p style="color: #fff; margin-bottom: 20px;">Tu posición: #${userRank || 'No clasificado'}</p>
                
                ${badgesHTML}
                
                <div style="margin-bottom: 20px;">
                    ${rankingHTML}
                </div>
                
                <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                    <button id="share-ranking" style="background: #1da1f2; color: #fff; padding: 10px 20px; 
                            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">📱 Compartir</button>
                    <button id="show-badges" style="background: #FFD700; color: #000; padding: 10px 20px; 
                            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">🏅 Mis Badges</button>
                    <button id="close-ranking" style="background: #00ffff; color: #000; padding: 10px 20px; 
                            border: none; border-radius: 8px; font-weight: bold; cursor: pointer;">Cerrar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const shareBtn = overlay.querySelector('#share-ranking');
        const badgesBtn = overlay.querySelector('#show-badges');
        const closeBtn = overlay.querySelector('#close-ranking');
        
        shareBtn.onclick = () => {
            this.shareRanking(scoreData, userRank);
        };
        
        badgesBtn.onclick = () => {
            this.showBadges();
        };
        
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
        };
    }

    showBadges() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9); z-index: 100001; display: flex;
            align-items: center; justify-content: center; font-family: system-ui;
        `;
        
        const badgesByRarity = {
            legendary: this.getBadgesByRarity('legendary'),
            rare: this.getBadgesByRarity('rare'),
            common: this.getBadgesByRarity('common')
        };
        
        const rarityNames = {
            legendary: 'Legendarios',
            rare: 'Raros',
            common: 'Comunes'
        };
        
        const rarityColors = {
            legendary: '#FFD700',
            rare: '#FF6B6B',
            common: '#4ECDC4'
        };
        
        let badgesHTML = '';
        Object.keys(badgesByRarity).forEach(rarity => {
            const badges = badgesByRarity[rarity];
            if (badges.length > 0) {
                badgesHTML += `
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: ${rarityColors[rarity]}; margin-bottom: 10px;">
                            ${rarityNames[rarity]} (${badges.length})
                        </h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                            ${badges.map(badge => `
                                <div style="background: ${rarityColors[rarity]}20; border: 2px solid ${rarityColors[rarity]}; 
                                            border-radius: 10px; padding: 15px; text-align: center;">
                                    <div style="font-size: 24px; margin-bottom: 8px;">${badge.emoji}</div>
                                    <div style="color: #fff; font-weight: bold; margin-bottom: 5px;">${badge.name}</div>
                                    <div style="color: #ccc; font-size: 12px;">${badge.description}</div>
                                    <div style="color: #999; font-size: 10px; margin-top: 5px;">${badge.date}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });
        
        overlay.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); 
                        border: 2px solid #FFD700; border-radius: 15px; padding: 30px; 
                        text-align: center; max-width: 800px; width: 90%; max-height: 80vh; overflow-y: auto;">
                <h2 style="color: #FFD700; margin-bottom: 20px;">🏅 Mis Badges y Logros</h2>
                <p style="color: #fff; margin-bottom: 20px;">Total: ${this.badges.length} badges desbloqueados</p>
                
                ${badgesHTML || '<p style="color: #ccc;">Aún no tienes badges. ¡Sigue jugando para desbloquearlos!</p>'}
                
                <button id="close-badges" style="background: #FFD700; color: #000; padding: 12px 24px; 
                        border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-top: 20px;">Cerrar</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const closeBtn = overlay.querySelector('#close-badges');
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
        };
    }

    shareRanking(scoreData, userRank) {
        const gameNames = {
            'stack-tower-neon': 'Stack Tower Neon',
            'neon-runner-wow': 'Neon Runner WOW',
            'neon-beat-wow': 'Neon Beat WOW',
            'neon-lab-physics-wow': 'Neon Lab Physics WOW',
            'neon-runner-lipastudios': 'Neon Runner',
            'neon-beat-stage': 'Neon Beat Stage',
            'neon-lab-physics': 'Neon Lab Physics'
        };
        
        const gameName = gameNames[this.gameName] || this.gameName;
        const rankText = userRank ? `#${userRank}` : 'No clasificado';
        const badgesCount = this.badges.length;
        
        const shareText = `🏆 ¡He conseguido ${scoreData.score.toLocaleString()} puntos en ${gameName}! 
Posición en el ranking diario: ${rankText}
🏅 Badges desbloqueados: ${badgesCount}

¿Puedes superarme? Juega gratis en: https://lipastudios.com

#LIPAStudios #JuegosNeon #Gaming`;

        // Intentar compartir nativo
        if (navigator.share) {
            navigator.share({
                title: `Ranking ${gameName}`,
                text: shareText,
                url: 'https://lipastudios.com'
            });
        } else {
            // Fallback - copiar al clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('¡Texto copiado! Pégalo en tus redes sociales');
            }).catch(() => {
                // Fallback manual
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('¡Texto copiado! Pégalo en tus redes sociales');
            });
        }
    }

    getStats() {
        if (!this.currentUser) return null;
        
        return {
            name: this.currentUser.name,
            totalGames: this.currentUser.totalGames,
            bestScore: this.currentUser.bestScore,
            currentRank: this.getUserRank(),
            joinDate: this.currentUser.joinDate,
            dailyGames: this.currentUser.dailyGames || 0,
            streak: this.currentUser.streak || 0,
            badgesCount: this.badges.length,
            recentBadges: this.getRecentBadges(5)
        };
    }
}

// 🎮 INTEGRACIÓN CON JUEGOS
window.LipaLeaderboard = DailyLeaderboard;
window.DailyLeaderboard = DailyLeaderboard;

// Función helper para integrar fácilmente
window.initLeaderboard = function(gameName) {
    return new DailyLeaderboard(gameName);
};

// Función para mostrar ranking desde cualquier parte
window.showLeaderboard = function(gameName) {
    const lb = new DailyLeaderboard(gameName);
    const ranking = lb.getRanking();
    const userRank = lb.getUserRank();
    // Si no hay usuario aún, pedir nombre (opcional)
    if (!lb.currentUser) {
        lb.showNamePrompt(false);
    }
    // Mostrar ranking aunque esté vacío (invita a ser el primero)
    lb.showRanking({ name: lb.currentUser?.name || 'Anónimo', score: 0 });
};

console.log('🏆 LIPA Leaderboard System with Badges & Notifications loaded!');