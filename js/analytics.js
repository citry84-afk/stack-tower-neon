/**
 * 🚀 STACK TOWER NEON - ADVANCED ANALYTICS SYSTEM
 * Revenue-Optimized Analytics for 10,000€/month Target
 */

class GameAnalytics {
    constructor() {
        this.sessionStart = Date.now();
        this.sessionId = this.generateSessionId();
        this.gameEvents = [];
        this.userSegment = null;
        
        this.revenueTracking = {
            sessionRevenue: 0,
            totalAdsViewed: 0,
            estimatedValue: 0,
            adTypes: {
                interstitial: { views: 0, revenue: 0 },
                rewarded: { views: 0, revenue: 0 },
                banner: { views: 0, revenue: 0 },
                floating: { views: 0, revenue: 0 }
            }
        };
        
        this.engagementMetrics = {
            perfectStacks: 0,
            totalStacks: 0,
            maxStreak: 0,
            gamesPlayed: 0,
            totalPlayTime: 0
        };
        
        this.conversionFunnel = {
            gameStarts: 0,
            firstPerfectStack: 0,
            reached10Points: 0,
            reached50Points: 0,
            adInteractions: 0,
            socialShares: 0
        };
        
        this.init();
    }
    
    generateSessionId() {
        return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    init() {
        this.setupGA4();
        this.setupCustomTracking();
        this.setupRevenueOptimization();
        this.calculateUserSegment();
        this.startSessionTracking();
        
        console.log('📊 Advanced Analytics initialized');
        console.log(`💰 Revenue tracking active - Session: ${this.sessionId}`);
    }
    
    setupGA4() {
        // Enhanced GA4 configuration for games
        if (typeof gtag !== 'undefined') {
            gtag('config', 'G-XXXXXXXXXX', {
                custom_map: {
                    'custom_parameter_1': 'user_segment',
                    'custom_parameter_2': 'revenue_potential',
                    'custom_parameter_3': 'engagement_score'
                },
                send_page_view: true,
                allow_google_signals: true,
                allow_ad_personalization_signals: true
            });
        }
    }
    
    setupCustomTracking() {
        // Track page visibility changes for engagement
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('session_pause', {
                    session_duration: this.getSessionDuration(),
                    engagement_score: this.calculateEngagementScore()
                });
            } else {
                this.trackEvent('session_resume');
            }
        });
        
        // Track user interactions
        document.addEventListener('click', (e) => {
            this.trackInteraction('click', {
                element: e.target.tagName,
                className: e.target.className
            });
        });
        
        // Track touch events for mobile
        document.addEventListener('touchstart', (e) => {
            this.trackInteraction('touch', {
                touches: e.touches.length
            });
        });
    }
    
    setupRevenueOptimization() {
        // Track revenue optimization metrics every 30 seconds
        setInterval(() => {
            this.trackRevenueMetrics();
        }, 30000);
        
        // Track conversion funnel progression
        this.setupConversionTracking();
    }
    
    calculateUserSegment() {
        const hasPlayed = localStorage.getItem('stackTowerHighScore');
        const sessionCount = parseInt(localStorage.getItem('stackTowerSessions') || '0') + 1;
        const highScore = parseInt(localStorage.getItem('stackTowerHighScore') || '0');
        
        localStorage.setItem('stackTowerSessions', sessionCount.toString());
        
        if (sessionCount === 1) {
            this.userSegment = 'new_user';
        } else if (sessionCount <= 5) {
            this.userSegment = 'casual_user';
        } else if (highScore < 20) {
            this.userSegment = 'beginner';
        } else if (highScore < 50) {
            this.userSegment = 'intermediate';
        } else {
            this.userSegment = 'expert';
        }
        
        this.trackEvent('user_segment_identified', {
            segment: this.userSegment,
            session_count: sessionCount,
            high_score: highScore
        });
    }
    
    startSessionTracking() {
        this.trackEvent('session_start', {
            user_segment: this.userSegment,
            device_type: this.getDeviceType(),
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
        
        // Track session heartbeat every minute
        setInterval(() => {
            this.trackSessionHeartbeat();
        }, 60000);
    }
    
    // GAME-SPECIFIC TRACKING
    trackGameStart() {
        this.conversionFunnel.gameStarts++;
        this.engagementMetrics.gamesPlayed++;
        
        this.trackEvent('game_start', {
            user_segment: this.userSegment,
            games_played_session: this.engagementMetrics.gamesPlayed,
            session_duration: this.getSessionDuration(),
            predicted_value: this.predictUserValue()
        });
    }
    
    trackPerfectStack(streak, points) {
        this.engagementMetrics.perfectStacks++;
        this.engagementMetrics.totalStacks++;
        this.engagementMetrics.maxStreak = Math.max(this.engagementMetrics.maxStreak, streak);
        
        if (this.engagementMetrics.perfectStacks === 1) {
            this.conversionFunnel.firstPerfectStack++;
            this.trackEvent('first_perfect_stack', {
                session_duration: this.getSessionDuration()
            });
        }
        
        this.trackEvent('perfect_stack', {
            streak: streak,
            points: points,
            total_perfects: this.engagementMetrics.perfectStacks,
            engagement_score: this.calculateEngagementScore(),
            user_segment: this.userSegment
        });
        
        // Track high-value streaks
        if (streak >= 10) {
            this.trackConversion('expert_streak', streak * 0.1);
        }
    }
    
    trackScoreMilestone(score) {
        if (score >= 10 && this.conversionFunnel.reached10Points === 0) {
            this.conversionFunnel.reached10Points++;
            this.trackConversion('score_milestone_10', 0.05);
        }
        
        if (score >= 50 && this.conversionFunnel.reached50Points === 0) {
            this.conversionFunnel.reached50Points++;
            this.trackConversion('score_milestone_50', 0.15);
        }
    }
    
    trackGameOver(finalScore, level, blocksStacked) {
        const playTime = Date.now() - this.gameStartTime;
        this.engagementMetrics.totalPlayTime += playTime;
        
        this.trackEvent('game_over', {
            final_score: finalScore,
            level: level,
            blocks_stacked: blocksStacked,
            play_time: playTime,
            perfect_rate: this.engagementMetrics.perfectStacks / Math.max(1, this.engagementMetrics.totalStacks),
            engagement_score: this.calculateEngagementScore(),
            user_segment: this.userSegment,
            session_value: this.revenueTracking.sessionRevenue
        });
    }
    
    // AD REVENUE TRACKING
    trackAdImpression(adType, placement, estimatedRevenue = 0) {
        this.revenueTracking.totalAdsViewed++;
        this.revenueTracking.sessionRevenue += estimatedRevenue;
        this.revenueTracking.adTypes[adType].views++;
        this.revenueTracking.adTypes[adType].revenue += estimatedRevenue;
        
        this.trackEvent('ad_impression', {
            ad_type: adType,
            placement: placement,
            estimated_revenue: estimatedRevenue,
            session_ads: this.revenueTracking.totalAdsViewed,
            session_revenue: this.revenueTracking.sessionRevenue,
            user_segment: this.userSegment
        });
        
        // Track to Google Analytics as a conversion
        this.trackConversion('ad_revenue', estimatedRevenue);
    }
    
    trackAdClick(adType, placement) {
        this.conversionFunnel.adInteractions++;
        
        this.trackEvent('ad_click', {
            ad_type: adType,
            placement: placement,
            session_duration: this.getSessionDuration(),
            engagement_score: this.calculateEngagementScore()
        });
    }
    
    trackAdCompletion(adType, placement, reward = null) {
        const estimatedRevenue = this.getAdRevenue(adType);
        this.trackAdImpression(adType, placement, estimatedRevenue);
        
        this.trackEvent('ad_completed', {
            ad_type: adType,
            placement: placement,
            reward: reward,
            completion_rate: this.calculateAdCompletionRate(),
            user_value: this.predictUserValue()
        });
    }
    
    // CONVERSION TRACKING
    trackConversion(conversionType, value = 0) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                conversion_type: conversionType,
                conversion_value: value,
                currency: 'EUR',
                user_segment: this.userSegment,
                session_id: this.sessionId
            });
        }
    }
    
    trackSocialShare(platform, score) {
        this.conversionFunnel.socialShares++;
        
        this.trackEvent('social_share', {
            platform: platform,
            score: score,
            user_segment: this.userSegment,
            viral_potential: this.calculateViralPotential()
        });
        
        this.trackConversion('social_engagement', 0.1);
    }
    
    // ENGAGEMENT METRICS
    calculateEngagementScore() {
        const sessionDuration = this.getSessionDuration();
        const perfectRate = this.engagementMetrics.perfectStacks / Math.max(1, this.engagementMetrics.totalStacks);
        const gamesPerMinute = this.engagementMetrics.gamesPlayed / Math.max(1, sessionDuration / 60000);
        
        return Math.min(100, Math.round(
            (sessionDuration / 1000) * 0.1 +
            perfectRate * 20 +
            gamesPerMinute * 10 +
            this.engagementMetrics.maxStreak * 2
        ));
    }
    
    predictUserValue() {
        const engagementScore = this.calculateEngagementScore();
        const sessionDuration = this.getSessionDuration() / 1000;
        const adInteractionRate = this.conversionFunnel.adInteractions / Math.max(1, this.revenueTracking.totalAdsViewed);
        
        // Predict user lifetime value
        let predictedValue = 0;
        
        if (this.userSegment === 'expert') predictedValue += 0.5;
        if (this.userSegment === 'intermediate') predictedValue += 0.3;
        if (engagementScore > 50) predictedValue += 0.2;
        if (sessionDuration > 300) predictedValue += 0.15;
        if (adInteractionRate > 0.1) predictedValue += 0.25;
        
        return Math.round(predictedValue * 100) / 100;
    }
    
    calculateViralPotential() {
        const score = this.calculateEngagementScore();
        const socialShares = this.conversionFunnel.socialShares;
        const sessionDuration = this.getSessionDuration() / 1000;
        
        return Math.min(10, Math.round(
            score * 0.05 +
            socialShares * 2 +
            (sessionDuration > 180 ? 2 : 0)
        ));
    }
    
    // REVENUE OPTIMIZATION
    getAdRevenue(adType) {
        const revenueMap = {
            interstitial: 0.08,
            rewarded: 0.12,
            banner: 0.025,
            floating: 0.035
        };
        
        // Adjust by user segment
        const multiplier = {
            expert: 1.3,
            intermediate: 1.1,
            casual_user: 1.0,
            beginner: 0.9,
            new_user: 0.8
        };
        
        return (revenueMap[adType] || 0.05) * (multiplier[this.userSegment] || 1.0);
    }
    
    calculateAdCompletionRate() {
        const totalShown = this.revenueTracking.totalAdsViewed;
        const totalCompleted = Object.values(this.revenueTracking.adTypes)
            .reduce((sum, type) => sum + type.views, 0);
        
        return totalShown > 0 ? totalCompleted / totalShown : 1;
    }
    
    // UTILITY METHODS
    trackEvent(eventName, parameters = {}) {
        const eventData = {
            event_name: eventName,
            session_id: this.sessionId,
            timestamp: Date.now(),
            user_segment: this.userSegment,
            ...parameters
        };
        
        this.gameEvents.push(eventData);
        
        // Send to Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                event_category: 'game_interaction',
                event_label: eventName,
                session_id: this.sessionId,
                ...parameters
            });
        }
        
        // Console log for debugging
        if (parameters.estimated_revenue || eventName.includes('revenue')) {
            console.log(`💰 Revenue Event: ${eventName}`, eventData);
        }
    }
    
    trackInteraction(type, data = {}) {
        this.trackEvent('user_interaction', {
            interaction_type: type,
            ...data
        });
    }
    
    trackSessionHeartbeat() {
        this.trackEvent('session_heartbeat', {
            session_duration: this.getSessionDuration(),
            engagement_score: this.calculateEngagementScore(),
            revenue_generated: this.revenueTracking.sessionRevenue,
            games_played: this.engagementMetrics.gamesPlayed
        });
    }
    
    trackRevenueMetrics() {
        this.trackEvent('revenue_metrics', {
            session_revenue: this.revenueTracking.sessionRevenue,
            ads_viewed: this.revenueTracking.totalAdsViewed,
            estimated_rpm: this.calculateRPM(),
            user_value: this.predictUserValue(),
            ad_types: this.revenueTracking.adTypes
        });
    }
    
    calculateRPM() {
        const impressions = this.revenueTracking.totalAdsViewed;
        const revenue = this.revenueTracking.sessionRevenue;
        return impressions > 0 ? (revenue / impressions) * 1000 : 0;
    }
    
    getSessionDuration() {
        return Date.now() - this.sessionStart;
    }
    
    getDeviceType() {
        return /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
    }
    
    // SESSION END TRACKING
    trackSessionEnd() {
        const sessionData = {
            session_duration: this.getSessionDuration(),
            games_played: this.engagementMetrics.gamesPlayed,
            total_revenue: this.revenueTracking.sessionRevenue,
            engagement_score: this.calculateEngagementScore(),
            conversion_funnel: this.conversionFunnel,
            user_segment: this.userSegment,
            final_prediction: this.predictUserValue()
        };
        
        this.trackEvent('session_end', sessionData);
        
        // Store session summary for next visit
        localStorage.setItem('lastSessionSummary', JSON.stringify(sessionData));
        
        console.log('📊 Session Analytics Summary:', sessionData);
        console.log(`💰 Total Revenue Generated: €${this.revenueTracking.sessionRevenue.toFixed(4)}`);
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameAnalytics = new GameAnalytics();
});

// Track session end on page unload
window.addEventListener('beforeunload', () => {
    if (window.gameAnalytics) {
        window.gameAnalytics.trackSessionEnd();
    }
});

console.log('🚀 Advanced Analytics System Loaded - Revenue Optimization Active');
