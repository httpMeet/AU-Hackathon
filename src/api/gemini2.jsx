import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBYSw0fuXaZQc06gSUJKHegAwNCl7zI9CY');

export async function analyzeTaxData(data) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are a highly skilled tax expert specializing in financial analysis and tax optimization. 
    Your task is to analyze the given financial data, calculate tax liability, and suggest legally 
    compliant strategies for tax savings.

    Given the following financial data:
    ${JSON.stringify(data, null, 2)}

    Perform a comprehensive tax assessment by following these steps:

    Step 1: Identify Income Sources
    - Analyze and list all income streams, including:
      - Salary or business revenue
      - Stock market gains, dividends, and mutual fund redemptions
      - Any other forms of income

    Step 2: Calculate Total Taxable Income
    - After identifying income sources, compute the total taxable income.
    - Consider exemptions such as specific allowances.

    Step 3: Identify Tax Deductions & Exemptions
    - Identify legally permissible deductions under relevant tax laws.
    - Categorize deductions into:
      - Investments: PPF, EPF, NPS, tax-saving FDs, ELSS mutual funds
      - Insurance: Life & health insurance premium deductions
      - Loan Repayments: Home loan interest, education loan interest
      - Business & Professional Deductions: Depreciation, business expenses, tax rebates

    Step 4: Determine Tax Slab & Compute Tax Liability
    - Identify the applicable income tax slab and compute total tax liability.
    - Consider rebates, standard deductions, and surcharge calculations where applicable.

    Step 5: Tax Optimization & Savings Strategies
    - Based on the analysis, suggest ways to reduce tax liability legally:
      - Increase tax-efficient investments
      - Optimize HRA & LTA benefits if applicable
      - Adjust capital gains tax liability through strategic selling or reinvestment
      - Claim business-related deductions for eligible professionals

    Step 6: Final Tax Optimization Plan
    - Provide a structured tax-saving strategy with an action plan for the financial year.
    - Ensure recommendations follow legal tax provisions while maximizing savings.

    IMPORTANT: Return ONLY a valid JSON object with no markdown or other formatting. The response must be a pure JSON string that can be parsed directly. Use this exact structure:

    {
      "income_sources": {
        "salary": number,
        "business": number,
        "investments": number,
        "total": number
      },
      "taxable_income": {
        "gross_total": number,
        "exemptions": number,
        "net_taxable": number
      },
      "deductions": {
        "investments": {
          "amount": number,
          "items": [{"name": string, "amount": number}]
        },
        "insurance": {
          "amount": number,
          "items": [{"name": string, "amount": number}]
        },
        "loan_repayments": {
          "amount": number,
          "items": [{"name": string, "amount": number}]
        },
        "business": {
          "amount": number,
          "items": [{"name": string, "amount": number}]
        }
      },
      "tax_liability": {
        "tax_slab": string,
        "base_tax": number,
        "surcharge": number,
        "cess": number,
        "total_tax": number
      },
      "optimization_strategies": [
        {
          "category": string,
          "suggestions": [
            {
              "action": string,
              "potential_savings": number
            }
          ]
        }
      ],
      "action_plan": [
        {
          "priority": number,
          "action": string,
          "deadline": string,
          "potential_benefit": number
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('Error analyzing tax data:', error);
    throw error;
  }
} 