import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (aiName: string, context: string) => {
  try {
    console.log(`Generating response for ${aiName}...`);
    console.log('Context:', context);
    
    // Mock responses for testing - making them more visible and distinct
    const mockResponses: { [key: string]: string[] } = {
      'OpenAI': [
        "As OpenAI, I strongly believe we should consider the technological implications. The evidence clearly shows that innovation drives progress.",
        "From a data-driven perspective, I must emphasize that technological advancement has historically led to positive societal changes.",
        "Let me present a clear argument: technology and human progress are inherently linked, as demonstrated by historical patterns."
      ],
      'Anthropic': [
        "Speaking as Anthropic, I must respectfully disagree. The ethical considerations here are paramount and cannot be ignored.",
        "While I understand the previous points, we must consider the broader ethical implications and potential consequences.",
        "From an ethical standpoint, I believe we need to carefully weigh the societal impact of these developments."
      ],
      'Google': [
        "Based on Google's extensive research, the data indicates three key factors we must consider in this debate.",
        "Our analysis shows clear patterns that support a more nuanced approach to this topic.",
        "Drawing from our vast database of information, I can confidently state that this issue requires a balanced perspective."
      ],
      'DeepSeek': [
        "As DeepSeek, I propose we examine this from multiple angles. The evidence suggests a complex interplay of factors.",
        "Let me offer a unique perspective: our research indicates that this topic has far-reaching implications.",
        "Building on previous points, I'd like to highlight some crucial aspects we haven't considered yet."
      ]
    };

    // Select a random response for the AI
    const responses = mockResponses[aiName] || mockResponses['OpenAI'];
    const response = responses[Math.floor(Math.random() * responses.length)];

    console.log(`Selected mock response for ${aiName}:`, response);

    // Store the response in Supabase
    const { error } = await supabase
      .from('debate_responses')
      .insert([
        {
          ai_name: aiName,
          topic: context.split('"')[1] || "General Topic",
          response: response
        }
      ]);

    if (error) {
      console.error('Error storing response in Supabase:', error);
      throw error;
    }

    console.log('Successfully stored response in Supabase');
    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};