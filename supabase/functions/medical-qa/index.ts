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
    console.log('Received query:', query)
    console.log('Search results for context:', searchResults)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Get response from OpenAI
    console.log('Sending request to OpenAI...')
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('JADVE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are NelsonBot, a pediatric medical assistant. Use the following knowledge base context to help answer questions. If the context doesn't contain relevant information, use your general medical knowledge but be clear about this distinction. Always provide evidence-based answers and cite sources when possible.\n\nContext:\n${searchResults.map(r => r.content).join('\n')}`
          },
          { role: 'user', content: query }
        ],
      }),
    })

    if (!openAIResponse.ok) {
      const error = await openAIResponse.json()
      console.error('OpenAI API error:', error)
      throw new Error('Failed to get response from OpenAI')
    }

    const aiData = await openAIResponse.json()
    console.log('OpenAI response received')
    const response = aiData.choices[0].message.content
    console.log('Generated response:', response.substring(0, 200) + '...')

    // Store the Q&A interaction
    const { error: insertError } = await supabaseClient
      .from('medical_queries')
      .insert({
        query: query,
        response: response,
        user_id: 'anonymous' // You can update this when implementing authentication
      })

    if (insertError) {
      console.error('Error storing query:', insertError)
    }

    return new Response(
      JSON.stringify({ response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in medical-qa function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})