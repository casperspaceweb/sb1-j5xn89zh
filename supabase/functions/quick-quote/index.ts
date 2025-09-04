import { corsHeaders } from '../_shared/cors.ts';

const API_KEY = 'Qr6Ty8Pw3Nv1Az5Gh7Lc9BmK';
const API_SECRET = 'S1dF2gH3jK4lM5nP6qR7tV8wX9yZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2';
const QUOTE_API_URL = 'http://gw.pineapple.co.za/api/v1/quote/quick-quote';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      throw new Error('Method not allowed');
    }

    const requestData = await req.json();

    const response = await fetch(QUOTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `KEY=${API_KEY} SECRET=${API_SECRET}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Quick quote error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while processing the quote request',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});