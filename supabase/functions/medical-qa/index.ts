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
    const { query, searchResults } = await req.json()
    console.log('📝 Received query:', query)
    console.log('🔍 Search results for context:', searchResults)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Get Hugging Face API key
    const huggingfaceKey = Deno.env.get('HUGGINGFACE_API_KEY')
    if (!huggingfaceKey) {
      throw new Error('Hugging Face API key not found in environment variables')
    }

    // Prepare context from search results
    const context = searchResults?.map(r => `${r.title}: ${r.content}`).join('\n') || 'No specific context available.'

    // Get answer from Hugging Face
    console.log('🤖 Sending request to Hugging Face...')
    const hfResponse = await fetch('https://api-inference.huggingface.co/models/deepset/roberta-base-squad2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingfaceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          question: query,
          context: context
        }
      }),
    })

    if (!hfResponse.ok) {
      const error = await hfResponse.json()
      console.error('❌ Hugging Face API error:', error)
      throw new Error(`Hugging Face API error: ${error.error || 'Unknown error'}`)
    }

    const aiData = await hfResponse.json()
    console.log('✅ Hugging Face response received:', aiData)

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
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})