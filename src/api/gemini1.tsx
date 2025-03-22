import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBYSw0fuXaZQc06gSUJKHegAwNCl7zI9CY';

export const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeStock(stockSymbol: string, sharesOwned: number) {
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
}

Base your analysis on:
- Technical Analysis (price trends, overbought/oversold status, momentum)
- Sentiment Analysis (news headlines, market sentiment)
- Risk Assessment (market volatility, sector risks, news impact)
- Recent News (provide 3-5 relevant news items with their impact on the stock)

CRITICAL: Return ONLY pure JSON. Do not wrap the response in markdown code blocks or add any other formatting.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Remove markdown code blocks if present
    text = text.replace(/^json\n|\n$/g, '');
    text = text.trim();
    
    try {
      // Remove any potential BOM or hidden characters
      const cleanText = text.replace(/^\uFEFF/, '');
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
      console.error('Failed to parse Gemini response:', text);
      throw new Error('Failed to analyze stock. Please try again.');
    }
  } catch (error) {
    console.error('Error analyzing stock:', error);
    throw error;
  }
}