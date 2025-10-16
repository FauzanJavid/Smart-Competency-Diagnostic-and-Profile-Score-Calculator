const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language IDs for Judge0
const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,  // Node.js
  python: 71,      // Python 3
  java: 62,        // Java
  cpp: 54,         // C++ (GCC 9.2.0)
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, testCases } = await req.json();
    const JUDGE0_API_KEY = Deno.env.get('JUDGE0_API_KEY');

    if (!JUDGE0_API_KEY) {
      throw new Error('JUDGE0_API_KEY not configured');
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    console.log('Executing code with Judge0:', { language, languageId, testCaseCount: testCases.length });

    // Execute each test case
    const results = await Promise.all(
      testCases.map(async (testCase: any) => {
        try {
          // Submit code for execution
          const submissionResponse = await fetch('https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-RapidAPI-Key': JUDGE0_API_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
            },
            body: JSON.stringify({
              language_id: languageId,
              source_code: code,
              stdin: testCase.input || '',
              expected_output: testCase.expected_output || '',
            }),
          });

          if (!submissionResponse.ok) {
            const errorText = await submissionResponse.text();
            console.error('Judge0 submission error:', submissionResponse.status, errorText);
            throw new Error(`Judge0 API error: ${submissionResponse.status}`);
          }

          const result = await submissionResponse.json();
          console.log('Test case result:', result);

          // Check if output matches expected
          const passed = result.status.id === 3 && 
                        result.stdout?.trim() === testCase.expected_output?.trim();

          return {
            passed,
            message: `Input: ${testCase.input}`,
            output: result.stdout?.trim() || '',
            expected: testCase.expected_output?.trim() || '',
            error: result.stderr || result.compile_output || null,
            status: result.status.description,
          };
        } catch (error) {
          console.error('Test case execution error:', error);
          return {
            passed: false,
            message: `Input: ${testCase.input}`,
            output: '',
            expected: testCase.expected_output?.trim() || '',
            error: error instanceof Error ? error.message : 'Execution failed',
            status: 'Error',
          };
        }
      })
    );

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in execute-code function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
