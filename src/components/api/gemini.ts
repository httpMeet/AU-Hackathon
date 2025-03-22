import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Portfolio, RiskProfile, InvestmentAdvice } from '../types';

const genAI = new GoogleGenerativeAI('AIzaSyBYSw0fuXaZQc06gSUJKHegAwNCl7zI9CY');

export async function getInvestmentAdvice(portfolio: Portfolio, riskProfile: RiskProfile): Promise<InvestmentAdvice> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }); // Changed to gemini-pro for better JSON handling

  const prompt = `
    You are an expert AI investment advisor. Analyze the following portfolio and risk profile, then provide concise, actionable advice for portfolio optimization. Your response must be a valid JSON object (no markdown formatting, no backticks) with the following structure:
    {
      "summary": "A brief summary of the portfolio and risk profile analysis",
      "recommendations": [
        {
          "action": "buy/sell/hold",
          "symbol": "stock symbol (if applicable)",
          "details": "specific advice or reasoning"
        }
      ],
      "risk_assessment": "Assessment of how the portfolio aligns with the risk profile",
      "additional_notes": "Any further suggestions or considerations"
    }

    Portfolio:
    - Total Value: $${portfolio.totalValue}
    - Risk Score: ${portfolio.riskScore}/10
    - Holdings: ${portfolio.stocks.map(s => `${s.shares} shares of ${s.symbol}`).join(', ')}

    Risk Profile:
    - Risk Tolerance: ${riskProfile.tolerance}
    - Investment Horizon: ${riskProfile.investmentHorizon} years
    - Monthly Investment: $${riskProfile.monthlyInvestment}

    Remember: Return ONLY the JSON object, with no markdown formatting or backticks.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response text to ensure it's valid JSON
    const cleanJson = text
      .replace(/```json\s*/g, '') // Remove ```json
      .replace(/```\s*$/g, '')    // Remove closing ```
      .trim();                    // Remove any extra whitespace

    try {
      return JSON.parse(cleanJson);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('Invalid response format from AI model');
    }
  } catch (error) {
    console.error('Error generating investment advice:', error);
    throw new Error('Failed to generate investment advice');
  }
}