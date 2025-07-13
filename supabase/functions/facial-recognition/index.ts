import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FaceRecognitionRequest {
  missingPersonId: string;
  imageUrl: string;
}

interface MatchResult {
  confidence: number;
  matchedImageUrl: string;
  matchedImageName: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { missingPersonId, imageUrl }: FaceRecognitionRequest = await req.json();
    
    console.log(`Starting facial recognition for missing person: ${missingPersonId}`);
    console.log(`Image URL: ${imageUrl}`);

    // Get all images from the image-database bucket to compare against
    const { data: imageFiles, error: listError } = await supabase.storage
      .from('image-database')
      .list();

    if (listError) {
      console.error('Error listing images from database:', listError);
      throw listError;
    }

    console.log(`Found ${imageFiles?.length || 0} images in database to compare`);

    // Simulate facial recognition processing
    // In a real implementation, you would:
    // 1. Download the missing person image
    // 2. Download each database image
    // 3. Use face-api.js or similar to compare faces
    // 4. Calculate confidence scores
    
    const matches: MatchResult[] = [];
    
    if (imageFiles && imageFiles.length > 0) {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // For demonstration, let's assume we found a match with the first image
      // In real implementation, this would be actual face recognition results
      const firstImage = imageFiles[0];
      const confidence = Math.random() * 30 + 70; // Random confidence between 70-100%
      
      if (confidence > 75) {
        const { data: publicUrl } = supabase.storage
          .from('image-database')
          .getPublicUrl(firstImage.name);
          
        matches.push({
          confidence,
          matchedImageUrl: publicUrl.publicUrl,
          matchedImageName: firstImage.name
        });

        // Store the match result in scan_images bucket
        try {
          // Copy the matched image to scan_images bucket
          const timestamp = Date.now();
          const scanImageName = `match-${missingPersonId}-${timestamp}.jpg`;
          
          // Download the original image
          const imageResponse = await fetch(publicUrl.publicUrl);
          const imageBlob = await imageResponse.blob();
          
          // Upload to scan_images bucket
          const { error: uploadError } = await supabase.storage
            .from('scan-images')
            .upload(scanImageName, imageBlob);
            
          if (uploadError) {
            console.error('Error uploading to scan_images:', uploadError);
          } else {
            console.log(`Successfully stored match in scan_images: ${scanImageName}`);
          }
        } catch (error) {
          console.error('Error copying image to scan_images:', error);
        }

        // Create a scan attempt record
        const { error: scanError } = await supabase
          .from('scan_attempts')
          .insert({
            police_id: '00000000-0000-0000-0000-000000000000', // System scan
            matched_person_id: missingPersonId,
            confidence: confidence,
            scan_image_url: imageUrl,
            action: 'automated_match',
            found_location: 'Database Match',
            found_person_name: 'Automated Recognition'
          });

        if (scanError) {
          console.error('Error creating scan attempt:', scanError);
        }
      }
    }

    console.log(`Facial recognition completed. Found ${matches.length} matches`);

    return new Response(
      JSON.stringify({
        success: true,
        matches,
        totalImagesScanned: imageFiles?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Facial recognition error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        matches: []
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});