import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface ImageMatchingStatusProps {
  missingPersonId: string;
  onComplete?: () => void;
}

interface MatchResult {
  confidence: number;
  matchedImageUrl: string;
  matchedImageName: string;
}

interface ImageMatchingResponse {
  success: boolean;
  matches: MatchResult[];
  totalImagesScanned: number;
  error?: string;
}

export const ImageMatchingStatus = ({ missingPersonId, onComplete }: ImageMatchingStatusProps) => {
  const [status, setStatus] = useState<'running' | 'completed' | 'no-matches' | 'error'>('running');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [totalScanned, setTotalScanned] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    performImageMatching();
  }, [missingPersonId]);

  const performImageMatching = async () => {
    try {
      setStatus('running');
      
      // Get the missing person's photo URL
      const { data: missingPerson, error: fetchError } = await supabase
        .from('missing_persons')
        .select('photo_url')
        .eq('id', missingPersonId)
        .single();

      if (fetchError || !missingPerson?.photo_url) {
        setStatus('error');
        setErrorMessage('Could not find photo for comparison');
        return;
      }

      // Call the image matching edge function
      const { data, error } = await supabase.functions.invoke('image-matching', {
        body: {
          missingPersonId,
          imageUrl: missingPerson.photo_url
        }
      });

      if (error) {
        console.error('Image matching error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Image matching failed');
        return;
      }

      const response: ImageMatchingResponse = data;
      
      if (response.success) {
        setTotalScanned(response.totalImagesScanned);
        
        if (response.matches && response.matches.length > 0) {
          setMatches(response.matches);
          setStatus('completed');
        } else {
          setStatus('no-matches');
        }
      } else {
        setStatus('error');
        setErrorMessage(response.error || 'Image matching failed');
      }

    } catch (error: any) {
      console.error('Image matching error:', error);
      setStatus('error');
      setErrorMessage(error.message || 'An unexpected error occurred');
    }

    // Auto-complete after a delay
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const getStatusDisplay = () => {
    switch (status) {
      case 'running':
        return {
          icon: <Loader2 className="w-4 h-4 animate-spin" />,
          text: 'Running facial match...',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-4 h-4 text-green-600" />,
          text: `Match found! ${matches.length} potential match${matches.length > 1 ? 'es' : ''} (${matches[0]?.confidence.toFixed(1)}% confidence)`,
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'no-matches':
        return {
          icon: <Search className="w-4 h-4 text-gray-600" />,
          text: `Scan complete - No matches found (${totalScanned} images scanned)`,
          bgColor: 'bg-gray-50',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-200'
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
          text: `Error: ${errorMessage}`,
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className={`p-3 rounded-lg border ${statusDisplay.bgColor} ${statusDisplay.borderColor}`}>
      <div className="flex items-center space-x-2">
        {statusDisplay.icon}
        <span className={`text-sm font-medium ${statusDisplay.textColor}`}>
          {statusDisplay.text}
        </span>
      </div>
      {matches.length > 0 && (
        <div className="mt-2 text-xs text-green-700">
          Images compared between missing-person-photos and dataset-images buckets
        </div>
      )}
    </div>
  );
};