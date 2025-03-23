import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the API key
const GEMINI_API_KEY = 'AIzaSyBYSw0fuXaZQc06gSUJKHegAwNCl7zI9CY';

// Validate API key
if (!GEMINI_API_KEY) {
  console.error('Gemini API key is missing');
  throw new Error('Gemini API key is required');
}

// Initialize the API with error handling
let genAI;
try {
  genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
} catch (error) {
  console.error('Failed to initialize Gemini API:', error);
  throw new Error('Failed to initialize AI service');
}

/**
 * Analyzes a smart contract related query using the Gemini API
 * @param {string} query - The user's question about smart contracts
 * @returns {Promise<{answer: string}>} The AI-generated response
 */
export async function analyzeSmartContract(query) {
  if (!query?.trim()) {
    throw new Error('Query cannot be empty');
  }

  try {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro"
    });

    const prompt = `As a smart contract and blockchain expert, please provide a clear and accurate response to this question about smart contracts: ${query}

Please format your response in a clear, structured way. If providing code examples, include explanations.

Question: ${query}`;

    // Generate content with proper error handling
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    });
    
    if (!result?.response) {
      throw new Error('No response received from the model');
    }

    const text = result.response.text();
    
    if (!text) {
      throw new Error('Empty response received from the model');
    }

    console.log('Successfully generated response:', { query, responseLength: text.length });

    return {
      answer: text
    };
  } catch (error) {
    console.error('Error in analyzeSmartContract:', error);
    
    // Check for specific error types
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your Gemini API key configuration.');
    }
    
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    
    if (error.message?.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    }

    // Generic error message for other cases
    throw new Error('Failed to get response from AI assistant. Please try again.');
  }
} 