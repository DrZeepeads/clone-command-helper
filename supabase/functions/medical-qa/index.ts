import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Validate request body
    const requestData = await req.json().catch((e) => {
      console.error('Failed to parse request JSON:', e);
      throw new Error('Invalid JSON in request body');
    });

    const { query, context } = requestData;
    if (!query) {
      throw new Error('Query is required');
    }

    console.log('📝 Received query:', query);
    console.log('🔍 Using context:', context);

    // Get and validate Hugging Face API key
    const huggingfaceKey = Deno.env.get('HUGGINGFACE_API_KEY');
    if (!huggingfaceKey) {
      console.error('❌ Hugging Face API key not found');
      throw new Error('Hugging Face API key not configured');
    }

    // Send request to Hugging Face
    console.log('🤖 Sending request to Hugging Face...');
    const hfResponse = await fetch(
      'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingfaceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            question: query,
            context: context || 'No specific context available.'
          }
        }),
      }
    );

    // Handle non-200 responses from Hugging Face
    if (!hfResponse.ok) {
      const errorData = await hfResponse.json().catch(() => ({ error: 'Unknown error' }));
      console.error('❌ Hugging Face API error:', errorData);
      throw new Error(errorData.error || 'Error from Hugging Face API');
    }

    // Parse Hugging Face response
    const aiData = await hfResponse.json().catch((e) => {
      console.error('Failed to parse Hugging Face response:', e);
      throw new Error('Invalid response from Hugging Face API');
    });

    console.log('✅ Hugging Face response:', aiData);

    if (!aiData.answer) {
      throw new Error('Invalid response format from Hugging Face API');
    }

    // Format and return the response
    const response = `Based on the available medical knowledge: ${aiData.answer}`;
    
    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Error in medical-qa function:', error);
    
    // Ensure we always return a properly formatted error response
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An unexpected error occurred',
        details: error.toString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})