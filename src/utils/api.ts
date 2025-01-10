import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (aiName: string, context: string) => {
  try {
    console.log(`Generating response for ${aiName}...`);
    console.log('Context:', context);
    
    // Mock responses for testing
    const mockResponses: { [key: string]: string[] } = {
      'OpenAI': [
        "I believe this topic requires careful consideration. Based on the evidence, we can see clear patterns emerging.",
        "Let me offer a different perspective. When we examine the facts objectively, several key points stand out.",
        "Building on previous arguments, I'd like to highlight some crucial aspects we haven't considered yet."
      ],
      'Anthropic': [
        "While I understand the previous points, we must also consider alternative viewpoints. The data suggests...",
        "I respectfully disagree with some earlier statements. Let me explain why by examining the evidence.",
        "There's another important dimension to this debate that we should explore further."
      ],
      'Google': [
        "The research clearly shows several important trends that support my position on this matter.",
        "Looking at this from a data-driven perspective, we can identify three key factors...",
        "I'd like to present a counterargument based on recent studies and analysis."
      ],
      'DeepSeek': [
        "Let's approach this systematically. The evidence points to several compelling conclusions.",
        "I appreciate the previous arguments, but there are additional factors to consider.",
        "When we examine this issue holistically, we find some interesting patterns."
      ]
    };

    // Select a random response for each AI
    const responses = mockResponses[aiName] || mockResponses['OpenAI'];
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Store the response in Supabase
    const { error } = await supabase
      .from('debate_responses')
      .insert([
        {
          ai_name: aiName,
          topic: context.split('"')[1] || context, // Extract topic from context
          response: response
        }
      ]);

    if (error) throw error;

    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};