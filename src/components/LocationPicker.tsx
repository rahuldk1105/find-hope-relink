
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationChange: (location: { address: string; lat?: number; lng?: number }) => void;
  value: { address: string; lat?: number; lng?: number };
}

const LocationPicker: React.FC<LocationPickerProps> = ({ onLocationChange, value }) => {
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setUseCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationChange({
            address: value.address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            lat: latitude,
            lng: longitude
          });
          setUseCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUseCurrentLocation(false);
        }
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="lastSeenLocation">Last Seen Location *</Label>
        <Input
          id="lastSeenLocation"
          value={value.address}
          onChange={(e) => onLocationChange({ ...value, address: e.target.value })}
          placeholder="e.g., Downtown Portland, near Powell's Books"
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={useCurrentLocation}
          className="flex items-center space-x-2"
        >
          <MapPin className="h-4 w-4" />
          <span>{useCurrentLocation ? "Getting location..." : "Use Current Location"}</span>
        </Button>
        {value.lat && value.lng && (
          <span className="text-sm text-green-600">
            Location captured: {value.lat.toFixed(4)}, {value.lng.toFixed(4)}
          </span>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
