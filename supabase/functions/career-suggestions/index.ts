const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skills, type } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'jobs') {
      systemPrompt = 'You are a career advisor with deep knowledge of the Indian tech industry and current job market trends. Provide realistic, actionable job role suggestions with Indian salary ranges.';
      userPrompt = `Based on these skills: ${skills.join(', ')}, suggest 5 realistic job roles that match in the Indian job market. For each role, provide: job title (be specific and realistic), match percentage (realistic 60-95%), required skills array, and average annual salary range in Indian Rupees (use format like "₹8-12 LPA" or "₹15-25 LPA"). Format as JSON array with structure: [{ title, match, skills: [], salary }]`;
    } else if (type === 'trends') {
      systemPrompt = 'You are a technology trends analyst. Provide current, factual information about technology trends in 2025.';
      userPrompt = 'List 5 current technology trends in 2025 that are most relevant for career development. Include: trend name, description, and why it matters. Format as JSON array: [{ name, description, importance }]';
    } else if (type === 'roadmap') {
      systemPrompt = 'You are a career development coach. Create practical, step-by-step learning roadmaps.';
      userPrompt = `Create a 6-month learning roadmap for someone with these skills: ${skills.join(', ')} who wants to advance their career. Include: phase name, duration, topics to learn, and resources. Format as JSON array: [{ phase, duration, topics: [], resources: [] }]`;
    }

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
      
      // Add job search URLs for job suggestions
      if (type === 'jobs' && Array.isArray(parsedData)) {
        parsedData.forEach((job: any) => {
          const jobTitle = encodeURIComponent(job.title);
          job.links = {
            naukri: `https://www.naukri.com/jobs-in-india?k=${jobTitle}`,
            linkedin: `https://www.linkedin.com/jobs/search/?keywords=${jobTitle}&location=India`,
            indeed: `https://in.indeed.com/jobs?q=${jobTitle}&l=India`
          };
        });
      }
      
      return new Response(
        JSON.stringify({ data: parsedData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch {
      // If parsing fails, return raw response
      return new Response(
        JSON.stringify({ data: aiResponse }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in career-suggestions function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
