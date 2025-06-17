
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, X, User, MapPin, Heart, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

interface MatchReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: MatchResult | null;
  scanImageUrl: string;
  onMatchConfirmed: (personId: string) => void;
  onMatchRejected: (personId: string) => void;
}

const MatchReviewModal = ({
  isOpen,
  onClose,
  match,
  scanImageUrl,
  onMatchConfirmed,
  onMatchRejected
}: MatchReviewModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!match) return null;

  const handleConfirmMatch = async () => {
    setIsProcessing(true);
    try {
      // Update missing person status to found
      const { error: updateError } = await supabase
        .from('missing_persons')
        .update({ status: 'found' })
        .eq('id', match.id);

      if (updateError) throw updateError;

      // Log the scan attempt with confirmation
      const { error: logError } = await supabase
        .from('scan_attempts')
        .insert({
          police_id: user?.id,
          scan_image_url: scanImageUrl,
          matched_person_id: match.id,
          confidence: match.confidence,
          action: 'confirmed'
        });

      if (logError) console.error('Error logging scan attempt:', logError);

      toast({
        title: "Match Confirmed",
        description: `${match.name} has been marked as found. Notifications sent to family.`,
      });

      onMatchConfirmed(match.id);
      onClose();
    } catch (error: any) {
      toast({
        title: "Confirmation Failed",
        description: error.message || "Failed to confirm match",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectMatch = async () => {
    setIsProcessing(true);
    try {
      // Log the scan attempt with rejection
      const { error } = await supabase
        .from('scan_attempts')
        .insert({
          police_id: user?.id,
          scan_image_url: scanImageUrl,
          matched_person_id: match.id,
          confidence: match.confidence,
          action: 'rejected'
        });

      if (error) console.error('Error logging scan attempt:', error);

      toast({
        title: "Match Rejected",
        description: "Match has been rejected and logged for review.",
      });

      onMatchRejected(match.id);
      onClose();
    } catch (error: any) {
      toast({
        title: "Rejection Failed",
        description: error.message || "Failed to reject match",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Review Match - {match.confidence.toFixed(1)}% Confidence</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Side-by-side image comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Scan Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={scanImageUrl}
                  alt="Scan"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Missing Person Photo</CardTitle>
              </CardHeader>
              <CardContent>
                {match.photo_url ? (
                  <img
                    src={match.photo_url}
                    alt={match.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Person details */}
          <Card>
            <CardHeader>
              <CardTitle>Person Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">{match.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {match.age} years old • {match.gender}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Reported: {new Date(match.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">Last Seen Location:</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">{match.last_seen_location}</p>
              </div>

              {match.health_conditions && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Health Conditions:</span>
                  </div>
                  <p className="text-sm text-gray-600 ml-6">{match.health_conditions}</p>
                </div>
              )}

              <div className="pt-2">
                <Badge 
                  variant={match.confidence > 80 ? "default" : "secondary"}
                  className="text-sm"
                >
                  {match.confidence.toFixed(1)}% Confidence Match
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={handleRejectMatch}
              disabled={isProcessing}
              className="flex items-center space-x-2"
            >
              <X className="w-4 h-4" />
              <span>Reject Match</span>
            </Button>
            <Button
              onClick={handleConfirmMatch}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isProcessing ? "Processing..." : "Confirm Match"}</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchReviewModal;
