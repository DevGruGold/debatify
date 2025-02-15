import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Get API keys from environment
const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
const metaApiKey = Deno.env.get('META_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function generateOpenAIResponse(aiName: string, context: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAIApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { 
          role: 'system', 
          content: `You are ${aiName}, an AI participating in a debate. Your responses should be thoughtful, concise (2-3 sentences), and maintain a respectful tone.` 
        },
        { role: 'user', content: context }
      ],
      temperature: 0.7,
      max_tokens: 150
    }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'OpenAI API error');
  return data.choices[0].message.content;
}

async function generateAnthropicResponse(aiName: string, context: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-2',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `You are ${aiName} participating in a debate. Respond thoughtfully but concisely (2-3 sentences) to: ${context}`
      }]
    }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Anthropic API error');
  return data.content[0].text;
}

async function generateGeminiResponse(aiName: string, context: string) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `You are ${aiName} participating in a debate. Respond thoughtfully but concisely (2-3 sentences) to: ${context}`
        }]
      }],
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      }
    }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error('Gemini API error');
  return data.candidates[0].content.parts[0].text;
}

async function generateDeepseekResponse(aiName: string, context: string) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${deepseekApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `You are ${aiName}, participating in a debate. Keep responses thoughtful but concise (2-3 sentences).`
        },
        {
          role: 'user',
          content: context
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Deepseek API error');
  return data.choices[0].message.content;
}

async function generateMetaResponse(aiName: string, context: string) {
  const response = await fetch('https://api.llama.meta.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${metaApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-2-70b-chat',
      messages: [
        {
          role: 'system',
          content: `You are ${aiName}, participating in a debate. Keep responses thoughtful but concise (2-3 sentences).`
        },
        {
          role: 'user',
          content: context
        }
      ],
      max_tokens: 150,
      temperature: 0.7
    }),
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || 'Meta API error');
  return data.choices[0].message.content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting generate-ai-response function');
    
    const { aiName, context } = await req.json();
    console.log('Received request for AI:', aiName);
    console.log('Context:', context);

    let generatedText;
    
    switch (aiName.toLowerCase()) {
      case 'openai':
        if (!openAIApiKey) throw new Error('OpenAI API key not configured');
        generatedText = await generateOpenAIResponse(aiName, context);
        break;
      case 'anthropic':
        if (!anthropicApiKey) throw new Error('Anthropic API key not configured');
        generatedText = await generateAnthropicResponse(aiName, context);
        break;
      case 'google':
        if (!geminiApiKey) throw new Error('Gemini API key not configured');
        generatedText = await generateGeminiResponse(aiName, context);
        break;
      case 'deepseek':
        if (!deepseekApiKey) throw new Error('Deepseek API key not configured');
        generatedText = await generateDeepseekResponse(aiName, context);
        break;
      case 'meta':
        if (!metaApiKey) throw new Error('Meta API key not configured');
        generatedText = await generateMetaResponse(aiName, context);
        break;
      default:
        throw new Error(`Unsupported AI provider: ${aiName}`);
    }

    console.log('Generated response:', generatedText);

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-response function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Check the function logs for more information'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
