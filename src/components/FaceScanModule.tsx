import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, User, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import MatchReviewModal from "./MatchReviewModal";

interface MatchResult {
  id: string;
  name: string;
  age: number;
  gender: string;
  photo_url: string | null;
  confidence: number;
  health_conditions?: string;
  last_seen_location: string;
  created_at: string;
}

const FaceScanModule = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [scanImageUrl, setScanImageUrl] = useState<string>("");
  const [highConfidenceMatches, setHighConfidenceMatches] = useState<MatchResult[]>([]);
  const [lowConfidenceMatches, setLowConfidenceMatches] = useState<MatchResult[]>([]);
  const [isUsingCamera, setIsUsingCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Enhanced face matching function with top 5 results and confidence thresholds
  const performFaceMatching = async (scanImageUrl: string): Promise<{ high: MatchResult[], low: MatchResult[] }> => {
    // Fetch all missing persons with photos
    const { data: missingPersons, error } = await supabase
      .from('missing_persons')
      .select('id, name, age, gender, photo_url, health_conditions, last_seen_location, created_at')
      .eq('status', 'missing')
      .not('photo_url', 'is', null);

    if (error) throw error;

    // Enhanced mock confidence scores - in real implementation, use AWS Rekognition or FaceAPI.js
    const allResults: MatchResult[] = missingPersons
      .map((person) => ({
        ...person,
        confidence: Math.random() * 40 + 60 // Mock confidence 60-100%
      }))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Top 5 matches

    // Split results by confidence threshold
    const highConfidence = allResults.filter(result => result.confidence > 80);
    const lowConfidence = allResults.filter(result => result.confidence > 50 && result.confidence <= 80);

    return { high: highConfidence, low: lowConfidence };
  };

  const logScanAttempt = async (scanImageUrl: string, allMatches: MatchResult[]) => {
    if (!user) return;

    try {
      // Log all matches for this scan attempt
      const scanAttempts = allMatches.map(match => ({
        police_id: user.id,
        scan_image_url: scanImageUrl,
        matched_person_id: match.id,
        confidence: match.confidence,
        action: 'scanned'
      }));

      const { error } = await supabase
        .from('scan_attempts')
        .insert(scanAttempts);

      if (error) {
        console.error('Error logging scan attempts:', error);
      }
    } catch (error) {
      console.error('Error in logScanAttempt:', error);
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
      const uploadedScanImageUrl = await uploadScanImage(blob);
      setScanImageUrl(uploadedScanImageUrl);
      
      // Perform face matching
      const { high, low } = await performFaceMatching(uploadedScanImageUrl);
      setHighConfidenceMatches(high);
      setLowConfidenceMatches(low);
      
      // Log all scan attempts
      const allMatches = [...high, ...low];
      await logScanAttempt(uploadedScanImageUrl, allMatches);
      
      toast({
        title: "Scan Complete",
        description: `Found ${high.length} high-confidence and ${low.length} low-confidence matches`,
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

  const handleMatchClick = (match: MatchResult) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleMatchConfirmed = (personId: string) => {
    setHighConfidenceMatches(prev => prev.filter(match => match.id !== personId));
    setLowConfidenceMatches(prev => prev.filter(match => match.id !== personId));
  };

  const handleMatchRejected = (personId: string) => {
    // Keep matches in list but could add visual indication that they were rejected
  };

  const clearResults = () => {
    setScanImage(null);
    setScanImageUrl("");
    setHighConfidenceMatches([]);
    setLowConfidenceMatches([]);
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
                  onClick={clearResults}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {/* High Confidence Match Results */}
          {highConfidenceMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>High Confidence Matches (80%+)</span>
              </h3>
              <div className="space-y-3">
                {highConfidenceMatches.map((match) => (
                  <Card key={match.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleMatchClick(match)}>
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
                              <p className="text-sm text-gray-600">{match.age} years old • {match.gender}</p>
                            </div>
                            <div className="text-right space-y-2">
                              <Badge 
                                variant="default"
                                className="mb-2 bg-green-600"
                              >
                                {match.confidence.toFixed(1)}% Match
                              </Badge>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Review</span>
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

          {/* No High Confidence Matches Message */}
          {highConfidenceMatches.length === 0 && lowConfidenceMatches.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-orange-800">No high-confidence match found</h3>
              </div>
              <p className="text-sm text-orange-700 mt-1">
                Review possible low-confidence matches below.
              </p>
            </div>
          )}

          {/* Low Confidence Match Results */}
          {lowConfidenceMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>Low Confidence Matches (50-80%)</span>
              </h3>
              <div className="space-y-3 opacity-75">
                {lowConfidenceMatches.map((match) => (
                  <Card key={match.id} className="border-l-4 border-l-orange-400 hover:shadow-md transition-shadow cursor-pointer hover:opacity-100" onClick={() => handleMatchClick(match)}>
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
                              <p className="text-sm text-gray-600">{match.age} years old • {match.gender}</p>
                            </div>
                            <div className="text-right space-y-2">
                              <Badge 
                                variant="secondary"
                                className="mb-2"
                              >
                                {match.confidence.toFixed(1)}% Match
                              </Badge>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-2"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>Review</span>
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

          {/* No matches found */}
          {highConfidenceMatches.length === 0 && lowConfidenceMatches.length === 0 && scanImageUrl && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-600 mb-2">No matches found</h3>
              <p className="text-sm text-gray-500">
                No facial matches found in the missing persons database.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Match Review Modal */}
      <MatchReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={selectedMatch}
        scanImageUrl={scanImageUrl}
        onMatchConfirmed={handleMatchConfirmed}
        onMatchRejected={handleMatchRejected}
      />
    </div>
  );
};

export default FaceScanModule;
