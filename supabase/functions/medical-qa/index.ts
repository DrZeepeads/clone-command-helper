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
    const { query, context } = await req.json()
    console.log('📝 Received query:', query)
    console.log('🔍 Using context:', context)

    // Get Hugging Face API key
    const huggingfaceKey = Deno.env.get('HUGGINGFACE_API_KEY')
    if (!huggingfaceKey) {
      throw new Error('Hugging Face API key not found')
    }

    // Get answer from Hugging Face
    console.log('🤖 Sending request to Hugging Face...')
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
    )

    if (!hfResponse.ok) {
      const error = await hfResponse.json()
      console.error('❌ Hugging Face API error:', error)
      throw new Error(error.error || 'Error from Hugging Face API')
    }

    const aiData = await hfResponse.json()
    console.log('✅ Hugging Face response:', aiData)

    if (!aiData.answer) {
      throw new Error('Invalid response format from Hugging Face API')
    }

    // Format and return the response
    const response = `Based on the available medical knowledge: ${aiData.answer}`
    
    return new Response(
      JSON.stringify({ response }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('❌ Error in medical-qa function:', error)
    
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
    )
  }
})