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
    const { query } = await req.json()
    console.log('Received search query:', query)

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    console.log('Executing search_pediatric_knowledge with query:', query)
    
    // Call the search function
    const { data: results, error } = await supabaseClient.rpc(
      'search_pediatric_knowledge',
      { search_query: query }
    )

    if (error) {
      console.error('Error searching knowledge base:', error)
      throw error
    }

    console.log('Search results:', results)
    console.log(`Found ${results?.length || 0} matching entries`)

    // If no results, try a broader search
    if (!results?.length) {
      console.log('No results found, trying broader search...')
      const { data: broadResults, error: broadError } = await supabaseClient
        .from('pediatric_knowledge')
        .select('*')
        .textSearch('content', query, {
          type: 'websearch',
          config: 'english'
        })
        .limit(5)

      if (broadError) {
        console.error('Error in broader search:', broadError)
      } else {
        console.log('Broader search results:', broadResults)
        return new Response(
          JSON.stringify({ results: broadResults }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in search-knowledge function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})