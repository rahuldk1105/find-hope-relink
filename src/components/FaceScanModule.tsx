
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Scan, CheckCircle, AlertTriangle, User, Eye, MapPin, Clock, Users2 } from "lucide-react";
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

interface ScanDetails {
  foundLocation: string;
  foundTime: string;
  foundPersonName: string;
  estimatedAge: number;
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
  const [showScanDetails, setShowScanDetails] = useState(false);
  const [scanDetails, setScanDetails] = useState<ScanDetails>({
    foundLocation: "",
    foundTime: "",
    foundPersonName: "",
    estimatedAge: 0
  });

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      setStream(mediaStream);
      setIsUsingCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      toast({
        title: "கேமரா பிழை | Camera Error",
        description: "கேமரா அணுக முடியவில்லை. அனுமதிகளை சரிபார்க்கவும்.",
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
          setShowScanDetails(true);
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
      setShowScanDetails(true);
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

  const performFaceMatching = async (scanImageUrl: string): Promise<{ high: MatchResult[], low: MatchResult[] }> => {
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
      .slice(0, 5);

    const highConfidence = allResults.filter(result => result.confidence > 80);
    const lowConfidence = allResults.filter(result => result.confidence > 50 && result.confidence <= 80);

    return { high: highConfidence, low: lowConfidence };
  };

  const logScanAttempt = async (scanImageUrl: string, allMatches: MatchResult[]) => {
    if (!user) return;

    try {
      const scanAttempts = allMatches.map(match => ({
        police_id: user.id,
        scan_image_url: scanImageUrl,
        matched_person_id: match.id,
        confidence: match.confidence,
        action: 'scanned',
        found_location: scanDetails.foundLocation,
        found_time: scanDetails.foundTime ? new Date(scanDetails.foundTime).toISOString() : null,
        found_person_name: scanDetails.foundPersonName,
        estimated_age: scanDetails.estimatedAge
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

    // Validate scan details
    if (!scanDetails.foundLocation || !scanDetails.foundTime || !scanDetails.foundPersonName || !scanDetails.estimatedAge) {
      toast({
        title: "விவரங்கள் தேவை | Details Required",
        description: "அனைத்து ஸ்கேன் விவரங்களையும் நிரப்பவும்",
        variant: "destructive"
      });
      return;
    }

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
      
      // Log all scan attempts with details
      const allMatches = [...high, ...low];
      await logScanAttempt(uploadedScanImageUrl, allMatches);
      
      toast({
        title: "ஸ்கேன் முடிந்தது | Scan Complete",
        description: `${high.length} உயர் நம்பகத்தன்மை மற்றும் ${low.length} குறைந்த நம்பகத்தன்மை பொருத்தங்கள் கண்டறியப்பட்டன`,
      });

      setShowScanDetails(false);
    } catch (error: any) {
      console.error('Scan error:', error);
      toast({
        title: "ஸ்கேன் தோல்வி | Scan Failed",
        description: error.message || "ஸ்கேன் செயலாக்க முடியவில்லை",
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
    setShowScanDetails(false);
    setScanDetails({
      foundLocation: "",
      foundTime: "",
      foundPersonName: "",
      estimatedAge: 0
    });
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scan className="w-5 h-5 text-orange-600" />
            <span>முக ஸ்கேன் தொகுதி | Face Scan Module</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Capture Options */}
          {!scanImage && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={startCamera}
                disabled={isUsingCamera}
                className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
              >
                <Camera className="w-6 h-6" />
                <span>கேமரா பயன்படுத்து</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="h-24 flex flex-col items-center justify-center space-y-2 border-orange-300 hover:bg-orange-50"
              >
                <Upload className="w-6 h-6 text-orange-600" />
                <span>புகைப்படம் பதிவேற்று</span>
              </Button>
            </div>
          )}

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
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                  style={{ maxHeight: '400px' }}
                />
                <div className="absolute inset-0 border-2 border-orange-500 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-orange-500"></div>
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-orange-500"></div>
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-orange-500"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-orange-500"></div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button onClick={capturePhoto} className="bg-orange-500 hover:bg-orange-600">
                  <Camera className="w-4 h-4 mr-2" />
                  புகைப்படம் எடு
                </Button>
                <Button variant="outline" onClick={stopCamera} className="border-orange-300 hover:bg-orange-50">
                  ரத்து செய்
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
                  className="max-w-md mx-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Scan Details Form */}
              {showScanDetails && (
                <Card className="border-orange-200">
                  <CardHeader>
                    <CardTitle className="text-orange-700">ஸ்கேன் விவரங்கள் | Scan Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="foundLocation">கண்டுபிடிக்கப்பட்ட இடம் *</Label>
                        <Input
                          id="foundLocation"
                          value={scanDetails.foundLocation}
                          onChange={(e) => setScanDetails(prev => ({ ...prev, foundLocation: e.target.value }))}
                          placeholder="எ.கா: T. Nagar, Chennai"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="foundTime">கண்டுபிடிக்கப்பட்ட நேரம் *</Label>
                        <Input
                          id="foundTime"
                          type="datetime-local"
                          value={scanDetails.foundTime}
                          onChange={(e) => setScanDetails(prev => ({ ...prev, foundTime: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="foundPersonName">நபரின் பெயர் (தெரிந்தால்)</Label>
                        <Input
                          id="foundPersonName"
                          value={scanDetails.foundPersonName}
                          onChange={(e) => setScanDetails(prev => ({ ...prev, foundPersonName: e.target.value }))}
                          placeholder="நபரின் பெயர் தெரிந்தால் உள்ளிடவும்"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estimatedAge">தோராயமான வயது *</Label>
                        <Input
                          id="estimatedAge"
                          type="number"
                          min="1"
                          max="120"
                          value={scanDetails.estimatedAge || ''}
                          onChange={(e) => setScanDetails(prev => ({ ...prev, estimatedAge: parseInt(e.target.value) || 0 }))}
                          placeholder="தோராயமான வயது"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 pt-4">
                      <Button
                        onClick={performScan}
                        disabled={isScanning}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                      >
                        {isScanning ? (
                          "ஸ்கேன் செய்யப்படுகிறது..."
                        ) : (
                          <>
                            <Scan className="w-4 h-4 mr-2" />
                            பொருத்தங்களுக்கு ஸ்கேன் செய்யுங்கள்
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={clearResults}
                        className="border-orange-300 hover:bg-orange-50"
                      >
                        அழிக்கவும்
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {!showScanDetails && !isScanning && (
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => setShowScanDetails(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    ஸ்கேன் விவரங்கள் சேர்க்கவும்
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearResults}
                    className="border-orange-300 hover:bg-orange-50"
                  >
                    அழிக்கவும்
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* High Confidence Match Results */}
          {highConfidenceMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span>உயர் நம்பகத்தன்மை பொருத்தங்கள் (80%+)</span>
              </h3>
              <div className="space-y-3">
                {highConfidenceMatches.map((match) => (
                  <Card key={match.id} className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow cursor-pointer bg-white/90" onClick={() => handleMatchClick(match)}>
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
                              <p className="text-sm text-gray-600">{match.age} வயது • {match.gender}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {match.last_seen_location}
                              </p>
                            </div>
                            <div className="text-right space-y-2">
                              <Badge 
                                variant="default"
                                className="mb-2 bg-green-600"
                              >
                                {match.confidence.toFixed(1)}% பொருத்தம்
                              </Badge>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-2 border-green-300 hover:bg-green-50"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>விவரங்கள்</span>
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

          {/* Low Confidence Match Results */}
          {lowConfidenceMatches.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <span>குறைந்த நம்பகத்தன்மை பொருத்தங்கள் (50-80%)</span>
              </h3>
              <div className="space-y-3 opacity-75">
                {lowConfidenceMatches.map((match) => (
                  <Card key={match.id} className="border-l-4 border-l-orange-400 hover:shadow-md transition-shadow cursor-pointer hover:opacity-100 bg-white/90" onClick={() => handleMatchClick(match)}>
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
                              <p className="text-sm text-gray-600">{match.age} வயது • {match.gender}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {match.last_seen_location}
                              </p>
                            </div>
                            <div className="text-right space-y-2">
                              <Badge 
                                variant="secondary"
                                className="mb-2"
                              >
                                {match.confidence.toFixed(1)}% பொருத்தம்
                              </Badge>
                              <div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center space-x-2 border-orange-300 hover:bg-orange-50"
                                >
                                  <Eye className="w-4 h-4" />
                                  <span>விவரங்கள்</span>
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
              <h3 className="font-semibold text-gray-600 mb-2">பொருத்தங்கள் எதுவும் கிடைக்கவில்லை</h3>
              <p className="text-sm text-gray-500">
                காணாமல்போனோர் தரவுத்தளத்தில் முக பொருத்தங்கள் எதுவும் இல்லை.
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
