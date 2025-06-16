
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface MatchResult {
  id: string;
  name: string;
  age: number;
  photo_url: string | null;
  confidence: number;
}

const FaceScanModule = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsUsingCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsUsingCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setScanImage(url);
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScanImage(url);
    }
  };

  const uploadScanImage = async (imageBlob: Blob): Promise<string> => {
    const fileName = `scan-${user?.id}-${Date.now()}.jpg`;
    
    const { data, error } = await supabase.storage
      .from('scan-images')
      .upload(fileName, imageBlob);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('scan-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Mock face matching function - replace with actual face recognition API
  const performFaceMatching = async (scanImageUrl: string): Promise<MatchResult[]> => {
    // Fetch all missing persons with photos
    const { data: missingPersons, error } = await supabase
      .from('missing_persons')
      .select('id, name, age, photo_url')
      .eq('status', 'missing')
      .not('photo_url', 'is', null);

    if (error) throw error;

    // Mock confidence scores - in real implementation, use AWS Rekognition or FaceAPI.js
    const mockResults: MatchResult[] = missingPersons
      .slice(0, 3)
      .map((person, index) => ({
        ...person,
        confidence: Math.random() * 30 + 70 - (index * 10) // Mock confidence 70-95%
      }))
      .sort((a, b) => b.confidence - a.confidence);

    return mockResults;
  };

  const logScanAttempt = async (scanImageUrl: string, matches: MatchResult[]) => {
    if (!user) return;

    const topMatch = matches[0];
    
    const { error } = await supabase
      .from('scan_attempts')
      .insert({
        police_id: user.id,
        scan_image_url: scanImageUrl,
        matched_person_id: topMatch?.id || null,
        confidence: topMatch?.confidence || 0
      });

    if (error) {
      console.error('Error logging scan attempt:', error);
    }
  };

  const performScan = async () => {
    if (!scanImage || !user) return;

    setIsScanning(true);
    try {
      // Convert image URL to blob
      const response = await fetch(scanImage);
      const blob = await response.blob();
      
      // Upload scan image
      const scanImageUrl = await uploadScanImage(blob);
      
      // Perform face matching
      const matches = await performFaceMatching(scanImageUrl);
      setMatchResults(matches);
      
      // Log the scan attempt
      await logScanAttempt(scanImageUrl, matches);
      
      toast({
        title: "Scan Complete",
        description: `Found ${matches.length} potential matches`,
      });
    } catch (error: any) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error.message || "Failed to process scan",
        variant: "destructive"
      });
    } finally {
      setIsScanning(false);
    }
  };

  const markAsFound = async (personId: string) => {
    try {
      const { error } = await supabase
        .from('missing_persons')
        .update({ status: 'found' })
        .eq('id', personId);

      if (error) throw error;

      toast({
        title: "Status Updated",
        description: "Person marked as found. Notifications sent to family.",
      });

      // Remove from match results
      setMatchResults(prev => prev.filter(result => result.id !== personId));
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update status",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5" />
            <span>Face Scan Module</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Capture Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={startCamera}
              disabled={isUsingCamera}
              className="h-24 flex flex-col items-center justify-center space-y-2"
            >
              <Camera className="w-6 h-6" />
              <span>Use Camera</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="h-24 flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="w-6 h-6" />
              <span>Upload Photo</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Camera View */}
          {isUsingCamera && (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <div className="flex justify-center space-x-4">
                <Button onClick={capturePhoto}>
                  <Camera className="w-4 h-4 mr-2" />
                  Capture
                </Button>
                <Button variant="outline" onClick={stopCamera}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />

          {/* Scan Image Preview */}
          {scanImage && (
            <div className="space-y-4">
              <div className="text-center">
                <img
                  src={scanImage}
                  alt="Scan preview"
                  className="max-w-md mx-auto rounded-lg"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={performScan}
                  disabled={isScanning}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isScanning ? (
                    "Scanning..."
                  ) : (
                    <>
                      <Scan className="w-4 h-4 mr-2" />
                      Scan for Matches
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setScanImage(null)}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* Match Results */}
          {matchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Match Results</h3>
              <div className="space-y-3">
                {matchResults.map((match, index) => (
                  <Card key={match.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {match.photo_url ? (
                            <img
                              src={match.photo_url}
                              alt={match.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <User className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold">{match.name}</h4>
                              <p className="text-sm text-gray-600">{match.age} years old</p>
                            </div>
                            <div className="text-right space-y-2">
                              <Badge 
                                variant={match.confidence > 85 ? "default" : match.confidence > 70 ? "secondary" : "outline"}
                                className="mb-2"
                              >
                                {match.confidence.toFixed(1)}% Match
                              </Badge>
                              <div>
                                <Button
                                  size="sm"
                                  onClick={() => markAsFound(match.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark as Found
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FaceScanModule;
