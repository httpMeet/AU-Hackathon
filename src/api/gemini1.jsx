import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY is not defined in environment variables');
}

export const genAI = new GoogleGenerativeAI(API_KEY);

// Helper function to add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function analyzeStock(stockSymbol, sharesOwned) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a financial analysis expert. Analyze the stock ${stockSymbol} with ${sharesOwned} stocks owned and return ONLY a JSON response in the exact format shown below. Do not include any additional text, explanations, formatting, or markdown code blocks - only pure JSON.

{
  "recommendation": "BUY" | "HOLD" | "SELL",
  "confidence": <number between 0-1>,
  "analysis": {
    "technical": {
      "trend": "UPWARD" | "DOWNWARD" | "SIDEWAYS",
      "strength": <number between 0-1>
    },
    "sentiment": {
      "overall": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "score": <number between -1 to 1>
    },
    "risk": {
      "level": "LOW" | "MEDIUM" | "HIGH",
      "factors": ["factor1", "factor2"]
    }
  },
  "portfolio_impact": {
    "stock_symbol": "${stockSymbol}",
    "owned_shares": ${sharesOwned},
    "current_value": <number>,
    "potential_change": <number>
  },
  "news": [
    {
      "title": "<string>",
      "summary": "<string>",
      "sentiment": "POSITIVE" | "NEUTRAL" | "NEGATIVE",
      "impact": "HIGH" | "MEDIUM" | "LOW"
    }
  ],
  "reasoning": "<string>"
}`;

  try {
    // Add a small delay before making the request
    await delay(1000);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown code blocks and any extra whitespace
    text = text.replace(/```json\n|\n```|```/g, '');
    text = text.trim();
    
    try {
      // Remove any potential BOM or hidden characters
      const cleanText = text.replace(/^\uFEFF/, '');
      
      // Parse the cleaned JSON
      const parsedResponse = JSON.parse(cleanText);
      
      // Validate the response structure
      if (!parsedResponse.recommendation || 
          !parsedResponse.analysis || 
          !parsedResponse.portfolio_impact ||
          !parsedResponse.news) {
        throw new Error('Invalid response structure');
      }
      
      return parsedResponse;
    } catch (parseError) {
      console.error('Original response:', text);
      throw new Error('Failed to analyze stock. Please try again.');
    }
  } catch (error) {
    if (error.message?.includes('429') || error.message?.includes('quota')) {
      throw new Error('API rate limit reached. Please try again in a few moments.');
    }
    console.error('Error analyzing stock:', error);
    throw error;
  }
} 