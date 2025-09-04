import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const API_TOKEN = 'KEY=Qr6Ty8Pw3Nv1Az5Gh7Lc9BmK SECRET=S1dF2gH3jK4lM5nP6qR7tV8wX9yZ0aB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wX2';
const LEAD_API_URL = 'http://gw.pineapple.co.za/users/motor_lead';

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

    const leadData = await req.json();

    // Store the lead in the database first
    const { data: savedLead, error: insertError } = await supabase
      .from('leads')
      .insert({
        quote_id: leadData.quote_id,
        first_name: leadData.first_name,
        last_name: leadData.last_name,
        email: leadData.email,
        id_number: leadData.id_number || '',
        contact_number: leadData.contact_number,
        application_user: leadData.application_user || '',
        application_user_email: leadData.application_user_email || '',
        status: 'pending'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Failed to store lead data');
    }

    const response = await fetch(LEAD_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer KEY=${API_KEY} SECRET=${API_SECRET}`,
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      // Update lead status to failed
      await supabase
        .from('leads')
        .update({ status: 'failed' })
        .eq('id', savedLead.id);
        
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Update lead status to submitted
    await supabase
      .from('leads')
      .update({ status: 'submitted' })
      .eq('id', savedLead.id);

    return new Response(
      JSON.stringify({ ...data, leadId: savedLead.id }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Lead transfer error:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while processing the lead transfer',
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