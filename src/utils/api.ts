export const generateAIResponse = async (aiName: string, context: string) => {
  try {
    console.log(`Generating response for ${aiName}...`);
    console.log('Context:', context);
    
    let response;
    
    switch(aiName.toLowerCase()) {
      case 'openai':
        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) throw new Error('OpenAI API key missing');
        
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are participating in a debate. Be concise and persuasive.'
              },
              {
                role: 'user',
                content: context
              }
            ],
            max_tokens: 150,
          }),
        });
        const openaiData = await response.json();
        return openaiData.choices[0].message.content;

      case 'anthropic':
        const claudeKey = process.env.CLAUDE_API_KEY;
        if (!claudeKey) throw new Error('Claude API key missing');
        
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': claudeKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'claude-3-sonnet-20240229',
            max_tokens: 150,
            messages: [{
              role: 'user',
              content: context
            }]
          }),
        });
        const claudeData = await response.json();
        return claudeData.content[0].text;

      case 'google':
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error('Gemini API key missing');
        
        response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': geminiKey,
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: context
              }]
            }],
            generationConfig: {
              maxOutputTokens: 150,
            },
          }),
        });
        const geminiData = await response.json();
        return geminiData.candidates[0].content.parts[0].text;

      case 'deepseek':
        const deepseekKey = process.env.DEEPSEEK_API_KEY;
        if (!deepseekKey) throw new Error('DeepSeek API key missing');
        
        response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a debate moderator. Be impartial and guide the discussion.'
              },
              {
                role: 'user',
                content: context
              }
            ],
            max_tokens: 150,
          }),
        });
        const deepseekData = await response.json();
        return deepseekData.choices[0].message.content;

      default:
        throw new Error(`Unknown AI model: ${aiName}`);
    }
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};