import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, User } from "lucide-react";

interface MatchResult {
  confidence: number;
  matchedImageUrl: string;
  matchedImageName: string;
}

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalImageUrl: string;
  matches: MatchResult[];
  missingPersonName: string;
}

export const MatchDetailsModal = ({ 
  isOpen, 
  onClose, 
  originalImageUrl, 
  matches, 
  missingPersonName 
}: MatchDetailsModalProps) => {
  if (!matches || matches.length === 0) return null;

  const topMatch = matches[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Match Found for {missingPersonName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Confidence Badge */}
          <div className="flex justify-center">
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-lg px-4 py-2">
              {topMatch.confidence.toFixed(1)}% Confidence Match
            </Badge>
          </div>

          {/* Images Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center">Missing Person Photo</h3>
              <div className="border-2 border-blue-200 rounded-lg p-4 bg-blue-50">
                {originalImageUrl ? (
                  <img 
                    src={originalImageUrl} 
                    alt="Missing person" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <p className="text-sm text-blue-700 text-center mt-2 font-medium">
                  Original Report Photo
                </p>
              </div>
            </div>

            {/* Matched Image */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-center">Matched Dataset Image</h3>
              <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                <img 
                  src={topMatch.matchedImageUrl} 
                  alt="Matched person" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <p className="text-sm text-green-700 text-center mt-2 font-medium">
                  {topMatch.matchedImageName}
                </p>
              </div>
            </div>
          </div>


          {/* Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Images compared between missing-person-photos and dataset-images storage buckets
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};