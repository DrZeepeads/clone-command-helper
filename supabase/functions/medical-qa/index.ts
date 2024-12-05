import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

async function retryHuggingFaceRequest(url: string, options: RequestInit, retries = MAX_RETRIES): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Hugging Face API error:', error);
      
      // Check if error is due to model loading
      if (error.error?.includes('loading') && retries > 0) {
        console.log(`Model still loading, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return retryHuggingFaceRequest(url, options, retries - 1);
      }
      
      throw new Error(error.error || 'Unknown error from Hugging Face API');
    }
    
    return response;
  } catch (error) {
    if (retries > 0 && error.message?.includes('loading')) {
      console.log(`Request failed, retrying in ${RETRY_DELAY}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
      return retryHuggingFaceRequest(url, options, retries - 1);
    }
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, context } = await req.json()
    console.log('📝 Received query:', query)
    console.log('🔍 Using context:', context)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Get Hugging Face API key
    const huggingfaceKey = Deno.env.get('HUGGINGFACE_API_KEY')
    if (!huggingfaceKey) {
      throw new Error('Hugging Face API key not found in environment variables')
    }

    // Get answer from Hugging Face with retries
    console.log('🤖 Sending request to Hugging Face...')
    const hfResponse = await retryHuggingFaceRequest(
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
    )

    const aiData = await hfResponse.json()
    console.log('✅ Hugging Face response received:', aiData)

    if (!aiData.answer) {
      throw new Error('Invalid response format from Hugging Face API')
    }

    // Format the response
    const response = `Based on the available medical knowledge: ${aiData.answer}`

    // Store the Q&A interaction
    const { error: insertError } = await supabaseClient
      .from('medical_queries')
      .insert({
        query: query,
        response: response,
        user_id: 'anonymous' // You can update this when implementing authentication
      })

    if (insertError) {
      console.error('❌ Error storing query:', insertError)
    }

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('❌ Error in medical-qa function:', error)
    
    // Determine appropriate status code and message
    let status = 500
    let message = 'An unexpected error occurred'
    
    if (error.message?.includes('loading')) {
      status = 503
      message = 'The AI model is still loading. Please try again in a few seconds.'
    } else if (error.message?.includes('API key')) {
      status = 500
      message = 'Server configuration error'
    } else if (error.message?.includes('Invalid response format')) {
      status = 502
      message = 'Received invalid response from AI model'
    }

    return new Response(
      JSON.stringify({ 
        error: message,
        details: error.message
      }),
      { 
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})