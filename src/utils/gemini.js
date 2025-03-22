import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getStockAnalysis(stock, action) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze ${stock.name} (${stock.symbol}) stock for a ${action.toUpperCase()} recommendation. Current price: $${stock.currentPrice} with ${stock.change} change.

Please provide a detailed analysis with 5 key points supporting this ${action} recommendation. Consider:
1. Current market conditions
2. Company fundamentals
3. Technical indicators
4. Industry trends
5. Risk factors

Format the response as:
"${action.toUpperCase()} recommendation for ${stock.symbol} based on:
1. [First point]
2. [Second point]
3. [Third point]
4. [Fourth point]
5. [Fifth point]"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get stock analysis');
  }
}

export async function getMarketAnalysis() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Provide a current market analysis with the following information:

1. Major indices performance (S&P 500, NASDAQ, DOW) with percentage changes
2. Top performing sectors with percentage changes
3. Three key market highlights
4. Three major risk factors affecting the market

Format the response in JSON:
{
  "indices": [
    {"name": "S&P 500", "change": "+X.X%"},
    {"name": "NASDAQ", "change": "+X.X%"},
    {"name": "DOW", "change": "+X.X%"}
  ],
  "sectors": [
    {"name": "Sector1", "change": "+X.X%"},
    {"name": "Sector2", "change": "+X.X%"},
    {"name": "Sector3", "change": "+X.X%"}
  ],
  "highlights": [
    "Highlight 1",
    "Highlight 2",
    "Highlight 3"
  ],
  "risks": [
    "Risk 1",
    "Risk 2",
    "Risk 3"
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to get market analysis');
  }
} 