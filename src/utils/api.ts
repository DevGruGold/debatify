
import { supabase } from "@/integrations/supabase/client";

export const generateAIResponse = async (aiName: string, context: string) => {
  try {
    console.log(`Generating response for ${aiName}...`);
    console.log('Context:', context);
    
    // Call Supabase Edge Function to generate AI response
    const { data, error } = await supabase.functions.invoke('generate-ai-response', {
      body: {
        aiName,
        context
      }
    });

    if (error) {
      console.error('Error calling edge function:', error);
      
      // Check for specific error types and provide user-friendly messages
      if (error.message?.includes('exceeded your current quota')) {
        throw new Error(`${aiName}'s API quota has been exceeded. Please try another AI provider.`);
      }
      
      throw error;
    }

    if (!data?.generatedText) {
      console.error('No generated text in response:', data);
      throw new Error('Failed to generate AI response');
    }

    const response = data.generatedText;
    console.log(`Generated response for ${aiName}:`, response);

    // Store the response in Supabase
    const { error: dbError } = await supabase
      .from('debate_responses')
      .insert([
        {
          ai_name: aiName,
          topic: context.split('"')[1] || "General Topic",
          response: response
        }
      ]);

    if (dbError) {
      console.error('Error storing response in Supabase:', dbError);
      throw dbError;
    }

    console.log('Successfully stored response in Supabase');
    return response;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};
