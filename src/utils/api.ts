export const generateAIResponse = async (aiName: string, context: string) => {
  try {
    console.log(`Generating response for ${aiName}...`);
    console.log('Context:', context);
    
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error('No API key found');
      throw new Error('API key is missing');
    }

    console.log('Making API request...');
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are ${aiName} participating in a debate. Be concise and persuasive.`
          },
          {
            role: 'user',
            content: context
          }
        ],
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText);
      throw new Error('Failed to generate response');
    }

    const data = await response.json();
    console.log('API response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};