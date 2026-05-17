/**
 * @deprecated Carga lipa-brain-catalog.js y lipa-brain-core.js (LipaBrainPlan vive en core).
 */
(function (global) {
  'use strict';
  if (!global.LipaBrainPlan && global.LipaBrain) {
    global.LipaBrainPlan = {
      PROFILE_KEY: global.LipaBrain.PROFILE_KEY,
      GAMES: global.LipaBrain.GAMES,
      buildRoutine: global.LipaBrain.buildRoutine,
      getProfile: global.LipaBrain.getProfile,
      saveProfile: global.LipaBrain.saveProfile,
      clearProfile: global.LipaBrain.clearProfile,
      hasProfile: global.LipaBrain.hasProfile,
      shouldShowOnboarding: global.LipaBrain.shouldShowOnboarding
    };
  }
})(typeof window !== 'undefined' ? window : global);
