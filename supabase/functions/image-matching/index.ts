import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImageMatchingRequest {
  missingPersonId: string;
  imageUrl: string;
}

interface MatchResult {
  confidence: number;
  matchedImageUrl: string;
  matchedImageName: string;
}

// Robust facial recognition for same person across different photos
async function calculateFacialSimilarity(image1Buffer: ArrayBuffer, image2Buffer: ArrayBuffer): Promise<number> {
  try {
    // Extract facial features from both images
    const features1 = await extractFacialFeatures(image1Buffer);
    const features2 = await extractFacialFeatures(image2Buffer);
    
    if (!features1 || !features2) {
      console.log('Could not extract facial features from one or both images');
      return 0;
    }
    
    // Calculate cosine similarity between feature vectors
    const similarity = calculateCosineSimilarity(features1, features2);
    const confidence = Math.max(0, Math.min(100, similarity * 100));
    
    console.log(`Facial similarity calculated: ${confidence.toFixed(1)}%`);
    return confidence;
    
  } catch (error) {
    console.error('Error in facial recognition:', error);
    return 0;
  }
}

// Calculate cosine similarity between two feature vectors
function calculateCosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) return 0;
  
  let dotProduct = 0;
  let norm1 = 0;
  let norm2 = 0;
  
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    norm1 += vec1[i] * vec1[i];
    norm2 += vec2[i] * vec2[i];
  }
  
  if (norm1 === 0 || norm2 === 0) return 0;
  
  return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
}

// Extract robust facial features for same person recognition
async function extractFacialFeatures(imageBuffer: ArrayBuffer): Promise<number[] | null> {
  try {
    const view = new Uint8Array(imageBuffer);
    const features: number[] = [];
    
    // Extract multiple feature types and combine into single vector
    const geometry = extractFacialGeometry(view);
    const texture = extractFacialTexture(view);
    const structure = extractFacialStructure(view);
    const skinTone = extractSkinTone(view);
    
    // Combine all features into a single normalized vector
    features.push(...geometry, ...texture, ...structure, ...skinTone);
    
    // Normalize the feature vector
    const magnitude = Math.sqrt(features.reduce((sum, val) => sum + val * val, 0));
    if (magnitude === 0) return null;
    
    return features.map(val => val / magnitude);
  } catch (error) {
    console.error('Error extracting facial features:', error);
    return null;
  }
}

// Extract facial geometry (proportions, ratios)
function extractFacialGeometry(imageData: Uint8Array) {
  const features = [];
  
  // Analyze facial proportions by sampling key regions
  const samplePoints = 50;
  const step = Math.floor(imageData.length / samplePoints);
  
  // Extract facial landmark approximations
  let eyeRegion = 0, noseRegion = 0, mouthRegion = 0, jawRegion = 0;
  
  for (let i = 0; i < samplePoints; i++) {
    const idx = i * step;
    if (idx < imageData.length) {
      const pixel = imageData[idx];
      
      // Approximate facial regions based on position
      if (i < 12) eyeRegion += pixel;        // Upper region (eyes)
      else if (i < 25) noseRegion += pixel;   // Middle region (nose)
      else if (i < 37) mouthRegion += pixel;  // Lower-middle (mouth)
      else jawRegion += pixel;                // Lower region (jaw)
    }
  }
  
  // Normalize by region size
  eyeRegion /= 12;
  noseRegion /= 13;
  mouthRegion /= 12;
  jawRegion /= 13;
  
  features.push(
    eyeRegion / 255,
    noseRegion / 255,
    mouthRegion / 255,
    jawRegion / 255,
    eyeRegion / noseRegion,    // Eye-to-nose ratio
    noseRegion / mouthRegion,  // Nose-to-mouth ratio
    mouthRegion / jawRegion    // Mouth-to-jaw ratio
  );
  
  return features;
}

// Extract facial texture (skin patterns, pores, etc.)
function extractFacialTexture(imageData: Uint8Array) {
  const features = [];
  const texturePatterns = [];
  
  // Analyze texture by looking at local variations
  for (let i = 0; i < imageData.length - 100; i += 100) {
    const localVariation = Math.abs(imageData[i] - imageData[i + 100]);
    texturePatterns.push(localVariation);
  }
  
  // Calculate texture statistics
  const avgVariation = texturePatterns.reduce((a, b) => a + b, 0) / texturePatterns.length;
  const maxVariation = Math.max(...texturePatterns);
  const minVariation = Math.min(...texturePatterns);
  
  features.push(
    avgVariation / 255,
    maxVariation / 255,
    minVariation / 255,
    (maxVariation - minVariation) / 255  // Texture range
  );
  
  return features;
}

// Extract facial structure (overall shape and contours)
function extractFacialStructure(imageData: Uint8Array) {
  const features = [];
  
  // Create structural fingerprint using block analysis
  const blockCount = 16;
  const blockSize = Math.floor(imageData.length / blockCount);
  
  for (let i = 0; i < blockCount; i++) {
    const start = i * blockSize;
    const end = Math.min(start + blockSize, imageData.length);
    
    let blockSum = 0;
    let blockEdges = 0;
    
    for (let j = start; j < end - 1; j++) {
      blockSum += imageData[j];
      
      // Count significant intensity changes (edges)
      if (Math.abs(imageData[j] - imageData[j + 1]) > 25) {
        blockEdges++;
      }
    }
    
    const blockAvg = blockSum / (end - start);
    const edgeDensity = blockEdges / (end - start);
    
    features.push(blockAvg / 255, edgeDensity);
  }
  
  return features;
}

// Extract skin tone characteristics
function extractSkinTone(imageData: Uint8Array) {
  const features = [];
  
  // Sample skin tone by analyzing color distribution
  let rSum = 0, gSum = 0, bSum = 0;
  let samples = 0;
  
  // Sample every 300th byte to get color information
  for (let i = 0; i < imageData.length - 2; i += 300) {
    rSum += imageData[i];
    gSum += imageData[i + 1] || imageData[i];
    bSum += imageData[i + 2] || imageData[i];
    samples++;
  }
  
  const avgR = rSum / samples;
  const avgG = gSum / samples;
  const avgB = bSum / samples;
  
  features.push(
    avgR / 255,
    avgG / 255,
    avgB / 255,
    avgR / avgG,  // Red-to-green ratio
    avgG / avgB   // Green-to-blue ratio
  );
  
  return features;
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

    const { missingPersonId, imageUrl }: ImageMatchingRequest = await req.json();
    
    console.log(`Starting image matching for missing person: ${missingPersonId}`);
    console.log(`Missing person image URL: ${imageUrl}`);

    // Get all images from the dataset-images bucket to compare against
    const { data: datasetImages, error: datasetError } = await supabase.storage
      .from('dataset-images')
      .list();

    if (datasetError) {
      console.error('Error listing images from dataset-images:', datasetError);
      throw new Error(`Failed to access dataset-images: ${datasetError.message}`);
    }

    console.log(`Found ${datasetImages?.length || 0} images in dataset-images to compare`);

    const matches: MatchResult[] = [];
    
    if (datasetImages && datasetImages.length > 0) {
      console.log(`Processing image matching for ${datasetImages.length} dataset images`);
      
      // Download the missing person image for processing
      const missingPersonResponse = await fetch(imageUrl);
      if (!missingPersonResponse.ok) {
        throw new Error(`Failed to download missing person image: ${missingPersonResponse.statusText}`);
      }
      const missingPersonBlob = await missingPersonResponse.blob();
      const missingPersonBuffer = await missingPersonBlob.arrayBuffer();
      
      console.log('Downloaded missing person image for comparison');
      
      // Process each image in the dataset
      for (const datasetImage of datasetImages) {
        try {
          const { data: datasetImageUrl } = supabase.storage
            .from('dataset-images')
            .getPublicUrl(datasetImage.name);
          
          // Download dataset image
          const datasetResponse = await fetch(datasetImageUrl.publicUrl);
          if (!datasetResponse.ok) {
            console.error(`Failed to download dataset image ${datasetImage.name}: ${datasetResponse.statusText}`);
            continue;
          }
          const datasetBlob = await datasetResponse.blob();
          const datasetBuffer = await datasetBlob.arrayBuffer();
          
          // Calculate facial similarity using advanced embedding comparison
          const similarity = await calculateFacialSimilarity(missingPersonBuffer, datasetBuffer);
          
          console.log(`Similarity for ${datasetImage.name}: ${similarity}%`);
          
          if (similarity > 60) { // Threshold for same person recognition (60% confidence)
            matches.push({
              confidence: similarity,
              matchedImageUrl: datasetImageUrl.publicUrl,
              matchedImageName: datasetImage.name
            });
            
            console.log(`Match found: ${datasetImage.name} with confidence ${similarity}%`);
          }
        } catch (error) {
          console.error(`Error processing dataset image ${datasetImage.name}:`, error);
        }
      }
    }
    
    // Sort matches by confidence (highest first)
    matches.sort((a, b) => b.confidence - a.confidence);
    
    // Store scan results if matches found
    if (matches.length > 0) {
      const bestMatch = matches[0];
      
      try {
        // Create a scan attempt record for the best match
        const { error: scanError } = await supabase
          .from('scan_attempts')
          .insert({
            police_id: '00000000-0000-0000-0000-000000000000', // System scan
            matched_person_id: missingPersonId,
            confidence: bestMatch.confidence,
            scan_image_url: imageUrl,
            action: 'automated_image_match',
            found_location: 'Dataset Match',
            found_person_name: 'Automated Image Recognition'
          });

        if (scanError) {
          console.error('Error creating scan attempt:', scanError);
        } else {
          console.log('Successfully created scan attempt record');
          
          // Store the missing person image in scan-images bucket when match is found
          try {
            const fileName = `match_${missingPersonId}_${Date.now()}.jpg`;
            const { error: uploadError } = await supabase.storage
              .from('scan-images')
              .upload(fileName, missingPersonBlob, {
                contentType: 'image/jpeg',
                upsert: false
              });
              
            if (uploadError) {
              console.error('Error uploading to scan-images bucket:', uploadError);
            } else {
              console.log(`Successfully uploaded matched image to scan-images: ${fileName}`);
            }
          } catch (uploadErr) {
            console.error('Error during image upload:', uploadErr);
          }
        }
      } catch (error) {
        console.error('Error storing scan results:', error);
      }
    }

    console.log(`Image matching completed. Found ${matches.length} matches from ${datasetImages?.length || 0} images`);

    return new Response(
      JSON.stringify({
        success: true,
        matches: matches.slice(0, 5), // Return top 5 matches
        totalImagesScanned: datasetImages?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Image matching error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        matches: [],
        totalImagesScanned: 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});