/**
 * 🎯 STACK TOWER NEON - INTELLIGENT ADS MANAGER
 * AI-Powered Ad Optimization for Maximum Revenue
 */

class IntelligentAdsManager {
    constructor() {
        this.adCounters = {
            interstitial: 0,
            rewarded: 0,
            banner: 0,
            floating: 0,
            lastAdTime: 0,
            sessionStart: Date.now(),
            cooldownPeriods: {
                interstitial: 45000, // 45 seconds
                rewarded: 30000,     // 30 seconds
                floating: 60000      // 60 seconds
            }
        };
        
        this.userBehavior = {
            adDismissalRate: 0,
            adCompletionRate: 1,
            averageSessionTime: 0,
            gamesPerSession: 0,
            engagementLevel: 'medium'
        };
        
        this.abTestConfig = {
            currentTest: null,
            testGroups: ['control', 'aggressive', 'gentle'],
            currentGroup: this.getABTestGroup(),
            testResults: {}
        };
        
        this.revenueOptimization = {
            bestPerformingPlacements: {},
            optimalFrequencies: {},
            userSegmentStrategies: {}
        };
        
        this.init();
    }
    
    init() {
        this.loadUserHistory();
        this.calculateUserSegment();
        this.initializeABTesting();
        this.setupEventTracking();
        this.startRevenueOptimization();
        
        console.log('🎯 Intelligent Ads Manager initialized');
        console.log(`📊 A/B Test Group: ${this.abTestConfig.currentGroup}`);
        console.log(`💡 User Segment: ${this.userBehavior.engagementLevel}`);
    }
    
    loadUserHistory() {
        const history = localStorage.getItem('adManagerHistory');
        if (history) {
            const data = JSON.parse(history);
            this.userBehavior = { ...this.userBehavior, ...data };
        }
    }
    
    saveUserHistory() {
        localStorage.setItem('adManagerHistory', JSON.stringify(this.userBehavior));
    }
    
    calculateUserSegment() {
        const sessionCount = parseInt(localStorage.getItem('stackTowerSessions') || '0');
        const highScore = parseInt(localStorage.getItem('stackTowerHighScore') || '0');
        const avgSessionTime = this.userBehavior.averageSessionTime;
        
        if (sessionCount >= 10 && highScore > 50 && avgSessionTime > 300) {
            this.userBehavior.engagementLevel = 'high';
        } else if (sessionCount >= 5 && highScore > 20) {
            this.userBehavior.engagementLevel = 'medium';
        } else {
            this.userBehavior.engagementLevel = 'low';
        }
    }
    
    getABTestGroup() {
        // Consistent A/B testing based on user ID
        const userId = localStorage.getItem('userId') || this.generateUserId();
        const hash = this.simpleHash(userId);
        return this.abTestConfig.testGroups[hash % this.abTestConfig.testGroups.length];
    }
    
    generateUserId() {
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('userId', userId);
        return userId;
    }
    
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    initializeABTesting() {
        const strategies = {
            control: {
                interstitialProbability: 0.7,
                rewardedProbability: 0.5,
                floatingDelay: 60000,
                cooldownMultiplier: 1.0
            },
            aggressive: {
                interstitialProbability: 0.85,
                rewardedProbability: 0.7,
                floatingDelay: 30000,
                cooldownMultiplier: 0.8
            },
            gentle: {
                interstitialProbability: 0.5,
                rewardedProbability: 0.4,
                floatingDelay: 90000,
                cooldownMultiplier: 1.3
            }
        };
        
        this.currentStrategy = strategies[this.abTestConfig.currentGroup];
    }
    
    setupEventTracking() {
        // Track ad performance automatically
        window.addEventListener('adEvent', (event) => {
            this.handleAdEvent(event.detail);
        });
    }
    
    startRevenueOptimization() {
        // Optimize ad frequency every 2 minutes
        setInterval(() => {
            this.optimizeAdFrequency();
        }, 120000);
        
        // Save performance data every 30 seconds
        setInterval(() => {
            this.savePerformanceData();
        }, 30000);
    }
    
    // CORE AD DECISION ENGINE
    shouldShowAd(adType, context = {}) {
        const now = Date.now();
        const timeSinceLastAd = now - this.adCounters.lastAdTime;
        const cooldown = this.adCounters.cooldownPeriods[adType] * this.currentStrategy.cooldownMultiplier;
        
        // Check cooldown
        if (timeSinceLastAd < cooldown) {
            this.logAdDecision(adType, 'rejected', 'cooldown_active', context);
            return false;
        }
        
        // Calculate probability based on context and user behavior
        const probability = this.calculateAdProbability(adType, context);
        const shouldShow = Math.random() < probability;
        
        this.logAdDecision(adType, shouldShow ? 'approved' : 'rejected', 'probability_check', {
            ...context,
            probability,
            timeSinceLastAd,
            userEngagement: this.userBehavior.engagementLevel
        });
        
        return shouldShow;
    }
    
    calculateAdProbability(adType, context) {
        let baseProbability = this.getBaseProbability(adType);
        
        // Adjust based on user engagement
        const engagementMultiplier = {
            high: 1.2,
            medium: 1.0,
            low: 0.8
        };
        
        baseProbability *= engagementMultiplier[this.userBehavior.engagementLevel];
        
        // Adjust based on game context
        if (context.gameScore) {
            if (context.gameScore > 50) baseProbability *= 1.3; // High score = more engaged
            if (context.gameScore < 5) baseProbability *= 0.7;  // Low score = less engaged
        }
        
        // Adjust based on session duration
        const sessionDuration = Date.now() - this.adCounters.sessionStart;
        if (sessionDuration > 300000) baseProbability *= 1.2; // 5+ minutes = high engagement
        if (sessionDuration < 60000) baseProbability *= 0.8;  // <1 minute = new user
        
        // Adjust based on historical ad completion rate
        if (this.userBehavior.adCompletionRate > 0.8) {
            baseProbability *= 1.2; // User completes ads = show more
        } else if (this.userBehavior.adCompletionRate < 0.5) {
            baseProbability *= 0.7; // User dismisses ads = show fewer
        }
        
        // Adjust based on streak performance
        if (context.perfectStreak > 5) {
            baseProbability *= 1.4; // Perfect streak = highly engaged
        }
        
        return Math.min(1.0, Math.max(0.1, baseProbability));
    }
    
    getBaseProbability(adType) {
        const probabilities = {
            interstitial: this.currentStrategy.interstitialProbability,
            rewarded: this.currentStrategy.rewardedProbability,
            banner: 0.9,    // Banners almost always show
            floating: 0.6   // Floating ads are less aggressive
        };
        
        return probabilities[adType] || 0.5;
    }
    
    // AD EXECUTION METHODS
    showInterstitialAd(context = {}) {
        if (!this.shouldShowAd('interstitial', context)) {
            return Promise.resolve(false);
        }
        
        this.adCounters.interstitial++;
        this.adCounters.lastAdTime = Date.now();
        
        return new Promise((resolve) => {
            if (window.adBreak) {
                window.adBreak({
                    type: 'start',
                    name: 'game_over_interstitial',
                    beforeAd: () => {
                        this.trackAdEvent('interstitial', 'started', context);
                    },
                    afterAd: () => {
                        this.trackAdEvent('interstitial', 'completed', context);
                        this.updateAdPerformance('interstitial', true);
                        resolve(true);
                    },
                    adDismissed: () => {
                        this.trackAdEvent('interstitial', 'dismissed', context);
                        this.updateAdPerformance('interstitial', false);
                        resolve(false);
                    }
                });
            } else {
                // Fallback for testing
                this.simulateAd('interstitial', context).then(resolve);
            }
        });
    }
    
    showRewardedAd(rewardType = 'continue', context = {}) {
        if (!this.shouldShowAd('rewarded', { ...context, rewardType })) {
            return Promise.resolve({ success: false, reason: 'frequency_cap' });
        }
        
        this.adCounters.rewarded++;
        this.adCounters.lastAdTime = Date.now();
        
        return new Promise((resolve) => {
            if (window.adBreak) {
                window.adBreak({
                    type: 'reward',
                    name: `rewarded_${rewardType}`,
                    beforeAd: () => {
                        this.trackAdEvent('rewarded', 'started', { ...context, rewardType });
                    },
                    afterAd: () => {
                        this.trackAdEvent('rewarded', 'completed', { ...context, rewardType });
                        this.updateAdPerformance('rewarded', true);
                        resolve({ success: true, reward: rewardType });
                    },
                    adViewed: () => {
                        this.grantReward(rewardType);
                    },
                    adDismissed: () => {
                        this.trackAdEvent('rewarded', 'dismissed', { ...context, rewardType });
                        this.updateAdPerformance('rewarded', false);
                        resolve({ success: false, reason: 'user_dismissed' });
                    }
                });
            } else {
                // Fallback for testing
                this.simulateRewardedAd(rewardType, context).then(resolve);
            }
        });
    }
    
    showBannerAd(placement) {
        if (!this.shouldShowAd('banner', { placement })) {
            return false;
        }
        
        this.adCounters.banner++;
        this.trackAdEvent('banner', 'shown', { placement });
        
        // Banner ads are typically managed by AdSense directly
        return true;
    }
    
    showFloatingAd() {
        if (!this.shouldShowAd('floating')) {
            return false;
        }
        
        this.adCounters.floating++;
        this.adCounters.lastAdTime = Date.now();
        
        const floatingElement = document.getElementById('floating-ad');
        if (floatingElement && floatingElement.classList.contains('hidden')) {
            floatingElement.classList.remove('hidden');
            this.trackAdEvent('floating', 'shown');
            
            // Auto-hide after 30 seconds if not interacted with
            setTimeout(() => {
                if (!floatingElement.classList.contains('hidden')) {
                    floatingElement.classList.add('hidden');
                    this.trackAdEvent('floating', 'auto_hidden');
                }
            }, 30000);
            
            return true;
        }
        
        return false;
    }
    
    // REWARD SYSTEM
    grantReward(rewardType) {
        const rewards = {
            continue: () => {
                // Grant extra lives or continue game
                if (window.gameState) {
                    window.gameState.score += 5;
                    if (window.showIndicator) window.showIndicator('¡BONUS +5 PUNTOS!');
                }
            },
            wide_blocks: () => {
                if (window.gameState) {
                    window.gameState.powerUps = window.gameState.powerUps || {};
                    window.gameState.powerUps.wider = (window.gameState.powerUps.wider || 0) + 5;
                }
            },
            slow_motion: () => {
                if (window.gameState) {
                    window.gameState.powerUps = window.gameState.powerUps || {};
                    window.gameState.powerUps.slowMo = (window.gameState.powerUps.slowMo || 0) + 10;
                }
            },
            perfect_block: () => {
                if (window.gameState) {
                    window.gameState.powerUps = window.gameState.powerUps || {};
                    window.gameState.powerUps.perfect = (window.gameState.powerUps.perfect || 0) + 1;
                }
            },
            double_points: () => {
                if (window.gameState) {
                    window.gameState.powerUps = window.gameState.powerUps || {};
                    window.gameState.powerUps.double = (window.gameState.powerUps.double || 0) + 10;
                }
            }
        };
        
        if (rewards[rewardType]) {
            rewards[rewardType]();
            this.trackAdEvent('reward', 'granted', { rewardType });
        }
    }
    
    // PERFORMANCE TRACKING
    trackAdEvent(adType, event, context = {}) {
        const eventData = {
            adType,
            event,
            timestamp: Date.now(),
            sessionDuration: Date.now() - this.adCounters.sessionStart,
            userEngagement: this.userBehavior.engagementLevel,
            abTestGroup: this.abTestConfig.currentGroup,
            ...context
        };
        
        // Send to analytics
        if (window.gameAnalytics) {
            window.gameAnalytics.trackEvent(`ad_${event}`, eventData);
        }
        
        // Track revenue if applicable
        if (event === 'completed' || event === 'shown') {
            const revenue = this.calculateAdRevenue(adType);
            if (window.gameAnalytics) {
                window.gameAnalytics.trackAdImpression(adType, context.placement || 'default', revenue);
            }
        }
        
        console.log(`🎯 Ad Event: ${adType} ${event}`, eventData);
    }
    
    updateAdPerformance(adType, completed) {
        const key = `${adType}_performance`;
        const current = this.userBehavior[key] || { shown: 0, completed: 0 };
        
        current.shown++;
        if (completed) current.completed++;
        
        this.userBehavior[key] = current;
        this.userBehavior.adCompletionRate = this.calculateOverallCompletionRate();
        
        this.saveUserHistory();
    }
    
    calculateOverallCompletionRate() {
        let totalShown = 0;
        let totalCompleted = 0;
        
        Object.keys(this.userBehavior).forEach(key => {
            if (key.endsWith('_performance')) {
                const perf = this.userBehavior[key];
                totalShown += perf.shown;
                totalCompleted += perf.completed;
            }
        });
        
        return totalShown > 0 ? totalCompleted / totalShown : 1;
    }
    
    calculateAdRevenue(adType) {
        const baseRevenue = {
            interstitial: 0.08,
            rewarded: 0.12,
            banner: 0.025,
            floating: 0.035
        };
        
        // Adjust by A/B test group
        const multiplier = {
            control: 1.0,
            aggressive: 0.95, // More ads = slightly lower CPM
            gentle: 1.1       // Fewer ads = higher CPM
        };
        
        return (baseRevenue[adType] || 0.05) * (multiplier[this.abTestConfig.currentGroup] || 1.0);
    }
    
    // OPTIMIZATION METHODS
    optimizeAdFrequency() {
        const sessionDuration = Date.now() - this.adCounters.sessionStart;
        const adDensity = this.adCounters.interstitial / Math.max(1, sessionDuration / 60000);
        
        // Adjust strategy based on performance
        if (this.userBehavior.adCompletionRate > 0.8 && adDensity < 2) {
            // User completes ads and we're not showing too many - increase frequency
            this.currentStrategy.interstitialProbability = Math.min(0.9, this.currentStrategy.interstitialProbability * 1.1);
        } else if (this.userBehavior.adCompletionRate < 0.5) {
            // User dismisses ads - decrease frequency
            this.currentStrategy.interstitialProbability = Math.max(0.3, this.currentStrategy.interstitialProbability * 0.9);
        }
        
        console.log('🎯 Ad frequency optimized:', {
            completionRate: this.userBehavior.adCompletionRate,
            adDensity,
            newProbability: this.currentStrategy.interstitialProbability
        });
    }
    
    savePerformanceData() {
        const performanceData = {
            adCounters: this.adCounters,
            userBehavior: this.userBehavior,
            abTestGroup: this.abTestConfig.currentGroup,
            timestamp: Date.now()
        };
        
        localStorage.setItem('adManagerPerformance', JSON.stringify(performanceData));
    }
    
    // SIMULATION METHODS (for testing without real ads)
    simulateAd(adType, context = {}) {
        return new Promise((resolve) => {
            console.log(`🎮 Simulating ${adType} ad...`);
            
            this.trackAdEvent(adType, 'started', context);
            
            // Simulate ad duration
            const duration = adType === 'rewarded' ? 3000 : 2000;
            
            setTimeout(() => {
                // 85% completion rate for simulation
                const completed = Math.random() > 0.15;
                
                if (completed) {
                    this.trackAdEvent(adType, 'completed', context);
                    this.updateAdPerformance(adType, true);
                } else {
                    this.trackAdEvent(adType, 'dismissed', context);
                    this.updateAdPerformance(adType, false);
                }
                
                resolve(completed);
            }, duration);
        });
    }
    
    simulateRewardedAd(rewardType, context = {}) {
        return new Promise((resolve) => {
            console.log(`🎮 Simulating rewarded ad for ${rewardType}...`);
            
            this.trackAdEvent('rewarded', 'started', { ...context, rewardType });
            
            setTimeout(() => {
                const completed = Math.random() > 0.1; // 90% completion rate for rewarded
                
                if (completed) {
                    this.trackAdEvent('rewarded', 'completed', { ...context, rewardType });
                    this.updateAdPerformance('rewarded', true);
                    this.grantReward(rewardType);
                    resolve({ success: true, reward: rewardType });
                } else {
                    this.trackAdEvent('rewarded', 'dismissed', { ...context, rewardType });
                    this.updateAdPerformance('rewarded', false);
                    resolve({ success: false, reason: 'user_dismissed' });
                }
            }, 3000);
        });
    }
    
    logAdDecision(adType, decision, reason, context = {}) {
        console.log(`🎯 Ad Decision: ${adType} - ${decision} (${reason})`, {
            userEngagement: this.userBehavior.engagementLevel,
            abTestGroup: this.abTestConfig.currentGroup,
            ...context
        });
    }
    
    // PUBLIC API METHODS
    requestInterstitial(context = {}) {
        return this.showInterstitialAd(context);
    }
    
    requestRewarded(rewardType = 'continue', context = {}) {
        return this.showRewardedAd(rewardType, context);
    }
    
    requestFloating() {
        return this.showFloatingAd();
    }
    
    // Get performance metrics for dashboard
    getPerformanceMetrics() {
        return {
            sessionStats: this.adCounters,
            userBehavior: this.userBehavior,
            abTestGroup: this.abTestConfig.currentGroup,
            estimatedRevenue: this.calculateSessionRevenue()
        };
    }
    
    calculateSessionRevenue() {
        let totalRevenue = 0;
        
        Object.keys(this.adCounters).forEach(adType => {
            if (typeof this.adCounters[adType] === 'number' && adType !== 'lastAdTime' && adType !== 'sessionStart') {
                totalRevenue += this.adCounters[adType] * this.calculateAdRevenue(adType);
            }
        });
        
        return Math.round(totalRevenue * 1000) / 1000; // Round to 3 decimal places
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.adsManager = new IntelligentAdsManager();
    
    // Schedule floating ad show after initial engagement
    setTimeout(() => {
        if (window.adsManager) {
            window.adsManager.requestFloating();
        }
    }, 45000);
});

// Expose to global scope for game integration
window.IntelligentAdsManager = IntelligentAdsManager;

console.log('🎯 Intelligent Ads Manager Loaded - Revenue Optimization Active');
