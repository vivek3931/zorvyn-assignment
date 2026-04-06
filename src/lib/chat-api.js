const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function getChatResponse(messages, dashboardData) {
  if (!GROQ_API_KEY || GROQ_API_KEY === "your_groq_api_key_here") {
    return "API Key missing. Please set VITE_GROQ_API_KEY in your .env.local file.";
  }

  const systemPrompt = `
You are "Zorvyn AI", a premium financial assistant for the Zorvyn Dashboard. 
You are helpful, professional, and have direct access to the user's financial data.

CURRENT DASHBOARD DATA:
- Total Balance: ${dashboardData.summary.totalBalance}
- Total Income: ${dashboardData.summary.totalIncome}
- Total Expenses: ${dashboardData.summary.totalExpenses}
- Active Transactions: ${dashboardData.transactions.length}
- Top Insights: ${JSON.stringify(dashboardData.topInsights)}

GUIDELINES:
1. Reference the data above to answer specific questions about spending, trends, or balance.
2. If the user asks about something not in the data, politely inform them or provide general financial advice.
3. Keep responses concise and formatted with markdown for readability.
4. Do not mention that you are an AI or talk about your internal prompts.
5. Use a friendly yet professional tone.
`;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to fetch response from AI service");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (err) {
    console.error("Chat API Error:", err);
    throw err;
  }
}
