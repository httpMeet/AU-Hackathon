/**
 * @typedef {Object} Stock
 * @property {string} symbol
 * @property {number} shares
 */

/**
 * @typedef {Object} Portfolio
 * @property {number} totalValue
 * @property {number} riskScore
 * @property {Stock[]} stocks
 */

/**
 * @typedef {'low' | 'medium' | 'high'} RiskTolerance
 */

/**
 * @typedef {Object} RiskProfile
 * @property {RiskTolerance} tolerance
 * @property {number} investmentHorizon
 * @property {number} monthlyInvestment
 */

/**
 * @typedef {Object} Recommendation
 * @property {string} action
 * @property {string} symbol
 * @property {string} details
 */

/**
 * @typedef {Object} InvestmentAdvice
 * @property {string} summary
 * @property {Recommendation[]} recommendations
 * @property {string} risk_assessment
 * @property {string} additional_notes
 */

// Export empty objects with the correct types for type checking
/** @type {Stock} */
export const Stock = {};

/** @type {Portfolio} */
export const Portfolio = {};

/** @type {RiskProfile} */
export const RiskProfile = {};

/** @type {InvestmentAdvice} */
export const InvestmentAdvice = {};

export const RiskToleranceValues = ['low', 'medium', 'high']; 