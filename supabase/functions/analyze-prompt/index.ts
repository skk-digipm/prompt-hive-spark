
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function tryParseJsonLoose(input: string) {
  if (!input) return null;
  // Remove code fences if present
  let cleaned = input.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

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

Focus on the main concepts, technologies, and purpose of the text. Make the title actionable and descriptive. Ensure the output is ONLY JSON with no extra commentary.`;

    const userPrompt = `Analyze this text and generate appropriate metadata:
Source: ${sourceUrl || 'Unknown'}
Domain: ${sourceDomain || 'Unknown'}

Content:
${content.substring(0, 3000)}`;

    console.log('[analyze-prompt] Content length:', content.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[analyze-prompt] OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const aiResponse = data?.choices?.[0]?.message?.content;
    if (!aiResponse || typeof aiResponse !== 'string') {
      console.error('[analyze-prompt] Unexpected OpenAI response structure:', JSON.stringify(data).slice(0, 1000));
      throw new Error('Invalid AI response format');
    }

    let analysisResult = tryParseJsonLoose(aiResponse);
    if (!analysisResult) {
      console.error('[analyze-prompt] Failed to parse AI response as JSON:', aiResponse);
      throw new Error('Invalid AI response format');
    }

    // Validate the response structure
    if (!analysisResult.title || !analysisResult.tags || !analysisResult.category) {
      console.error('[analyze-prompt] Incomplete AI response object:', analysisResult);
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
    console.error('[analyze-prompt] Error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to analyze prompt',
        details: (error as Error).message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
