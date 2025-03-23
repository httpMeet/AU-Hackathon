import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || '');
console.log(genAI)

interface SmartContractResponse {
  answer: string;
}

export async function analyzeSmartContract(query: string): Promise<SmartContractResponse> {
  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert in blockchain and smart contracts. Please analyze and respond to the following query about smart contracts: ${query}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      answer: text
    };
  } catch (error) {
    console.error('Error in analyzeSmartContract:', error);
    throw new Error('Failed to analyze smart contract query. Please try again.');
  }
} 