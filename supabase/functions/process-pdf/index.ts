import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { decode } from 'https://deno.land/std@0.177.0/encoding/base64.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      throw new Error('No file uploaded')
    }

    console.log('📄 Processing PDF file:', file.name)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Upload PDF to storage
    const timestamp = new Date().getTime()
    const filePath = `${timestamp}_${file.name}`
    
    console.log('📤 Uploading PDF to storage:', filePath)
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdf_documents')
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert: false
      })

    if (uploadError) {
      console.error('❌ Error uploading PDF:', uploadError)
      throw uploadError
    }

    console.log('✅ PDF uploaded successfully:', uploadData)

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('pdf_documents')
      .getPublicUrl(filePath)

    // Insert into pediatric_knowledge
    const { data: insertData, error: insertError } = await supabase
      .from('pediatric_knowledge')
      .insert({
        title: file.name.replace('.pdf', ''),
        content: `PDF Document: ${publicUrl}`,
        category: 'PDF Documents',
        chapter: 'Uploaded Documents'
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Error inserting into pediatric_knowledge:', insertError)
      throw insertError
    }

    console.log('✅ PDF data inserted into knowledge base:', insertData)

    return new Response(
      JSON.stringify({ 
        message: 'PDF processed successfully',
        data: insertData
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('❌ Error processing PDF:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message 
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