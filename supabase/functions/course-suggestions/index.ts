const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { skills } = body;
    
    // Input validation
    if (!Array.isArray(skills)) {
      return new Response(
        JSON.stringify({ error: 'Skills must be an array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (skills.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one skill is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (skills.length > 20) {
      return new Response(
        JSON.stringify({ error: 'Maximum 20 skills allowed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate each skill
    for (const skill of skills) {
      if (typeof skill !== 'string' || skill.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'All skills must be non-empty strings' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (skill.length > 50) {
        return new Response(
          JSON.stringify({ error: 'Each skill must be less than 50 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = 'You are an education advisor with knowledge of top certification programs and courses from reputable organizations like AWS, Google, Microsoft, Coursera, edX, and industry-recognized certification bodies.';
    const userPrompt = `Based on these skills: ${skills.join(', ')}, suggest 6 relevant certification courses or programs. Focus on well-known certifications from AWS, Google Cloud, Microsoft, Oracle, CompTIA, and similar reputable organizations. For each, provide: course title, provider, level (Beginner/Intermediate/Advanced), duration, price (use "Free", "$XX", or "$XXX" ranges), and relevant skills covered. Format as JSON array: [{ title, provider, level, duration, price, skills: [] }]`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    let aiResponse = data.choices[0].message.content;

    // Try to extract JSON from the response
    const jsonMatch = aiResponse.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      aiResponse = jsonMatch[0];
    }

    try {
      const parsedData = JSON.parse(aiResponse);
      return new Response(
        JSON.stringify({ courses: parsedData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch {
      // If parsing fails, return empty array
      return new Response(
        JSON.stringify({ courses: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in course-suggestions function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
