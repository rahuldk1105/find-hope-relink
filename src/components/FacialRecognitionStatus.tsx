import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FacialRecognitionStatusProps {
  missingPersonId: string;
  imageUrl: string;
  onComplete?: () => void;
}

interface MatchResult {
  confidence: number;
  matchedImageUrl: string;
  matchedImageName: string;
}

interface RecognitionResult {
  success: boolean;
  matches: MatchResult[];
  totalImagesScanned: number;
  error?: string;
}

export const FacialRecognitionStatus = ({ 
  missingPersonId, 
  imageUrl, 
  onComplete 
}: FacialRecognitionStatusProps) => {
  const [status, setStatus] = useState<'running' | 'completed' | 'error'>('running');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [totalScanned, setTotalScanned] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    startFacialRecognition();
  }, [missingPersonId, imageUrl]);

  const startFacialRecognition = async () => {
    try {
      setStatus('running');
      
      console.log('Starting facial recognition for:', missingPersonId);
      
      const { data, error } = await supabase.functions.invoke('facial-recognition', {
        body: {
          missingPersonId,
          imageUrl
        }
      });

      if (error) throw error;

      const result: RecognitionResult = data;
      
      console.log('Facial recognition result:', result);
      
      if (result.success) {
        setMatches(result.matches);
        setTotalScanned(result.totalImagesScanned);
        setStatus('completed');
        
        if (result.matches.length > 0) {
          toast({
            title: "Match Found!",
            description: `Found ${result.matches.length} potential match(es) in the database.`,
          });
        } else {
          toast({
            title: "Scan Complete",
            description: `Scanned ${result.totalImagesScanned} images. No matches found.`,
          });
        }
      } else {
        throw new Error(result.error || 'Recognition failed');
      }
    } catch (error: any) {
      console.error('Facial recognition error:', error);
      setStatus('error');
      toast({
        title: "Recognition Error",
        description: error.message || "Failed to complete facial recognition",
        variant: "destructive"
      });
    } finally {
      onComplete?.();
    }
  };

  const openMatchModal = () => {
    if (matches.length > 0) {
      setShowModal(true);
    }
  };

  const renderStatus = () => {
    switch (status) {
      case 'running':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">Running facial match...</span>
          </div>
        );
      
      case 'completed':
        if (matches.length > 0) {
          return (
            <Button 
              onClick={openMatchModal}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Match Found ({matches.length})
            </Button>
          );
        } else {
          return (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Scan Complete - No matches
            </Badge>
          );
        }
      
      case 'error':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Recognition failed</span>
            <Button 
              onClick={startFacialRecognition}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              Retry
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        {renderStatus()}
        {status === 'completed' && (
          <p className="text-xs text-gray-600 mt-1">
            Scanned {totalScanned} images in database
          </p>
        )}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Facial Recognition Match Found</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Found {matches.length} potential match(es) in the database:
            </p>
            
            {matches.map((match, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Match #{index + 1}</h4>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    {Math.round(match.confidence)}% confidence
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Original Image</p>
                    <img 
                      src={imageUrl} 
                      alt="Missing person" 
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Matched Image</p>
                    <img 
                      src={match.matchedImageUrl} 
                      alt="Matched person" 
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  <p>Database file: {match.matchedImageName}</p>
                  <p>This match has been automatically saved to scan records.</p>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};