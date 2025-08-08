
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Prompt is required');
    }

    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    console.log('[enhance-prompt] Incoming prompt length:', prompt.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Using a fast, reliable model
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert prompt engineer. Your task is to enhance and improve the given prompt to make it more effective, specific, and clear. Add relevant context, structure, and instructions that will help get better results from AI models. Keep the core intent but make it more powerful and detailed. Return only the enhanced prompt without any additional explanation or commentary.' 
          },
          { 
            role: 'user', 
            content: `Please enhance this prompt to make it more effective and detailed:\n\n${prompt}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[enhance-prompt] OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('[enhance-prompt] OpenAI response keys:', Object.keys(data || {}));

    const enhancedPrompt = data?.choices?.[0]?.message?.content;
    if (!enhancedPrompt || typeof enhancedPrompt !== 'string') {
      console.error('[enhance-prompt] Unexpected OpenAI response structure:', JSON.stringify(data).slice(0, 1000));
      throw new Error('Invalid response from OpenAI API');
    }

    return new Response(JSON.stringify({ enhancedPrompt }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[enhance-prompt] Error:', error);
    return new Response(JSON.stringify({ 
      error: (error as Error).message || 'An unexpected error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
