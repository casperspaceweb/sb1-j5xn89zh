import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const API_KEY = Deno.env.get('PINEAPPLE_QUICK_QUOTE_API_KEY') ?? '';
const API_SECRET = Deno.env.get('PINEAPPLE_QUICK_QUOTE_API_SECRET') ?? '';
const QUOTE_API_URL = 'http://gw.pineapple.co.za/api/v1/quote/quick-quote';

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);
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

    // Store the request in quick_quotes table
    const { data: quickQuote, error: insertError } = await supabase
      .from('quick_quotes')
      .insert({
        source: requestData.source || 'KodomBranchOne',
        external_reference_id: requestData.externalReferenceId,
        vehicle_data: requestData.vehicles?.[0] || {},
        request_data: requestData,
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store quote request');
    }

    const response = await fetch(QUOTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer KEY=${API_KEY} SECRET=${API_SECRET}`,
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Update the quick_quotes record with the API response
    const { error: updateError } = await supabase
      .from('quick_quotes')
      .update({
        api_response: data,
        quote_id: data?.data?.[0]?.quoteId || null,
        premium: data?.data?.[0]?.premium || null,
        status: 'completed'
      })
      .eq('id', quickQuote.id);

    if (updateError) {
      console.error('Database update error:', updateError);
    }

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