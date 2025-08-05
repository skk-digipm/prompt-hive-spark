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
    const { content, sourceUrl, sourceDomain } = await req.json();

    if (!content) {
      return new Response(
        JSON.stringify({ error: 'Content is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are an expert at analyzing prompts and generating metadata. Your task is to analyze the given text and generate:

1. A concise, descriptive title (max 60 characters)
2. Relevant tags (3-8 tags, focusing on key concepts, technologies, domains)
3. An appropriate category

Categories to choose from: General, ChatGPT, Claude, Development, Writing, Analysis, Creative, Business, Research, Education, Marketing, Design

Return your response as valid JSON with this exact structure:
{
  "title": "string",
  "tags": ["tag1", "tag2", "tag3"],
  "category": "string"
}

Focus on the main concepts, technologies, and purpose of the text. Make the title actionable and descriptive.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Analyze this text and generate appropriate metadata:\n\nSource: ${sourceUrl || 'Unknown'}\nDomain: ${sourceDomain || 'Unknown'}\n\nContent:\n${content.substring(0, 3000)}` 
          }
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    let analysisResult;
    try {
      analysisResult = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    // Validate the response structure
    if (!analysisResult.title || !analysisResult.tags || !analysisResult.category) {
      throw new Error('Incomplete AI response');
    }

    // Add source domain as additional tag if available
    if (sourceDomain && !analysisResult.tags.includes(sourceDomain)) {
      analysisResult.tags.push(sourceDomain.split('.')[0]);
    }

    // Ensure tags array is not too long
    analysisResult.tags = analysisResult.tags.slice(0, 8);

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-prompt function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze prompt',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});