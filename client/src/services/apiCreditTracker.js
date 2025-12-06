/**
 * API Credit Tracker
 * Tracks API credit usage and alerts when thresholds are reached
 */

const STORAGE_KEY = 'api_credit_usage';
const ALERT_THRESHOLD = 0.5; // 50%
const WARNING_THRESHOLD = 0.8; // 80%
const CRITICAL_THRESHOLD = 0.9; // 90%
// Get total credits from environment variable or use default
const DEFAULT_TOTAL_CREDITS = import.meta.env.VITE_API_TOTAL_CREDITS 
    ? parseInt(import.meta.env.VITE_API_TOTAL_CREDITS, 10) 
    : 1000; // Default total credits

/**
 * Get current credit usage from localStorage
 */
export const getCreditUsage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading credit usage:', error);
  }
  
  // Return default if nothing stored
  return {
    totalCredits: DEFAULT_TOTAL_CREDITS,
    usedCredits: 0,
    lastAlertThreshold: 0, // Track last threshold we alerted for
    lastResetDate: new Date().toISOString().split('T')[0] // Daily reset tracking
  };
};

/**
 * Save credit usage to localStorage
 */
const saveCreditUsage = (usage) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch (error) {
    console.error('Error saving credit usage:', error);
  }
};

/**
 * Check if we should reset credits (daily reset)
 */
const shouldResetCredits = (usage) => {
  const today = new Date().toISOString().split('T')[0];
  return usage.lastResetDate !== today;
};

/**
 * Reset credits for a new day
 */
const resetDailyCredits = (usage) => {
  const today = new Date().toISOString().split('T')[0];
  return {
    ...usage,
    usedCredits: 0,
    lastAlertThreshold: 0,
    lastResetDate: today
  };
};

/**
 * Record API credit usage
 * @param {number} credits - Number of credits to add to usage
 * @param {number} totalCredits - Optional total credits (if different from default)
 * @returns {Object} - Updated usage info
 */
export const recordApiUsage = (credits = 1, totalCredits = null) => {
  let usage = getCreditUsage();
  
  // Reset if new day
  if (shouldResetCredits(usage)) {
    usage = resetDailyCredits(usage);
  }
  
  // Update total credits if provided
  if (totalCredits !== null) {
    usage.totalCredits = totalCredits;
  }
  
  // Add to used credits
  usage.usedCredits += credits;
  
  // Save updated usage
  saveCreditUsage(usage);
  
  return usage;
};

/**
 * Check thresholds and log to console
 * @param {Object} usage - Current usage object
 * @returns {boolean} - True if a threshold was crossed
 */
export const checkAndAlertThreshold = (usage) => {
  const percentage = usage.usedCredits / usage.totalCredits;
  const percentageUsed = percentage * 100;
  const remainingCredits = usage.totalCredits - usage.usedCredits;
  
  // Debug: log current state
  console.log(`[Credit Check] Usage: ${percentageUsed.toFixed(1)}%, Last threshold: ${usage.lastAlertThreshold}, Used: ${usage.usedCredits}/${usage.totalCredits}`);
  
  // Track which thresholds have been crossed (50, 80, 90)
  // Check 90% threshold (compare percentage to percentage: 90.1 >= 90)
  if (percentageUsed >= 90 && usage.lastAlertThreshold < 90) {
    usage.lastAlertThreshold = 90;
    saveCreditUsage(usage);
    console.log(`⚠️ API Credit Usage: 90% - Used ${usage.usedCredits}/${usage.totalCredits} credits. Remaining: ${remainingCredits}`);
    return true;
  }
  // Check 80% threshold (compare percentage to percentage: 80 >= 80)
  else if (percentageUsed >= 80 && usage.lastAlertThreshold < 80) {
    usage.lastAlertThreshold = 80;
    saveCreditUsage(usage);
    console.log(`⚠️ API Credit Usage: 80% - Used ${usage.usedCredits}/${usage.totalCredits} credits. Remaining: ${remainingCredits}`);
    return true;
  }
  // Check 50% threshold (compare percentage to percentage: 50 >= 50)
  else if (percentageUsed >= 50 && usage.lastAlertThreshold < 50) {
    usage.lastAlertThreshold = 50;
    saveCreditUsage(usage);
    console.log(`⚠️ API Credit Usage: 50% - Used ${usage.usedCredits}/${usage.totalCredits} credits. Remaining: ${remainingCredits}`);
    return true;
  }
  
  return false;
};

/**
 * Get current credit status
 * @returns {Object} - Credit status info
 */
export const getCreditStatus = () => {
  let usage = getCreditUsage();
  
  // Reset if new day
  if (shouldResetCredits(usage)) {
    usage = resetDailyCredits(usage);
    saveCreditUsage(usage);
  }
  
  const percentage = (usage.usedCredits / usage.totalCredits) * 100;
  const remaining = usage.totalCredits - usage.usedCredits;
  
  return {
    used: usage.usedCredits,
    total: usage.totalCredits,
    remaining,
    percentage: percentage.toFixed(2),
    isWarning: percentage >= 50,
    isCritical: percentage >= 90
  };
};

/**
 * Set total credits (for configuration)
 * @param {number} total} - Total credits available
 */
export const setTotalCredits = (total) => {
  const usage = getCreditUsage();
  usage.totalCredits = total;
  saveCreditUsage(usage);
};

/**
 * Reset credit usage (for testing or manual reset)
 */
export const resetCredits = () => {
  const usage = getCreditUsage();
  usage.usedCredits = 0;
  usage.lastAlertThreshold = 0;
  saveCreditUsage(usage);
};

