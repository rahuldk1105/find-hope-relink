
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, User, Calendar, Navigation } from "lucide-react";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  last_seen_location: string;
  photo_url: string | null;
  last_seen_lat: number | null;
  last_seen_lng: number | null;
  status: string;
  created_at: string;
}

interface AnalyticsMapProps {
  missingPersons: MissingPerson[];
  isLoading: boolean;
}

const AnalyticsMap = ({ missingPersons, isLoading }: AnalyticsMapProps) => {
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null);

  // Calculate heatmap intensity based on location clustering
  const getLocationClusters = () => {
    const clusters: { [key: string]: number } = {};
    missingPersons.forEach(person => {
      if (person.last_seen_lat && person.last_seen_lng) {
        const key = `${person.last_seen_lat.toFixed(3)},${person.last_seen_lng.toFixed(3)}`;
        clusters[key] = (clusters[key] || 0) + 1;
      }
    });
    return clusters;
  };

  const locationClusters = getLocationClusters();

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="relative h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-dashed border-blue-300 overflow-hidden">
        {/* Map Placeholder with Markers */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-blue-700 font-medium">Interactive Heatmap View</p>
            <p className="text-blue-600 text-sm">Integrate with Mapbox for full functionality</p>
            <p className="text-blue-600 text-sm mt-2">
              {missingPersons.length} cases • {Object.keys(locationClusters).length} unique locations
            </p>
          </div>
        </div>

        {/* Simulated Markers */}
        <div className="absolute inset-0 p-4">
          {missingPersons.slice(0, 8).map((person, index) => (
            <div
              key={person.id}
              className={`absolute w-4 h-4 rounded-full cursor-pointer transition-all hover:scale-150 ${
                person.status === 'missing' ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{
                left: `${20 + (index % 4) * 20}%`,
                top: `${20 + Math.floor(index / 4) * 30}%`,
              }}
              onClick={() => setSelectedPerson(person)}
              title={`${person.name} - ${person.last_seen_location}`}
            />
          ))}
        </div>

        {/* Heatmap Legend */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs">
          <p className="font-medium mb-2">Heatmap Intensity</p>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span>Low</span>
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>Medium</span>
            <div className="w-4 h-4 bg-red-600 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Quick View Panel */}
      {selectedPerson && (
        <Card className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {selectedPerson.photo_url ? (
                <img
                  src={selectedPerson.photo_url}
                  alt={selectedPerson.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{selectedPerson.name}</h3>
                <Badge variant={selectedPerson.status === 'missing' ? 'destructive' : 'default'}>
                  {selectedPerson.status}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{selectedPerson.gender}, {selectedPerson.age} years old</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedPerson.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 col-span-2">
                  <Navigation className="w-4 h-4" />
                  <span>{selectedPerson.last_seen_location}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Location Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Total Markers</h4>
          <p className="text-2xl font-bold text-blue-600">{missingPersons.length}</p>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Unique Locations</h4>
          <p className="text-2xl font-bold text-green-600">{Object.keys(locationClusters).length}</p>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium text-sm text-gray-700 mb-2">Highest Cluster</h4>
          <p className="text-2xl font-bold text-orange-600">
            {Math.max(...Object.values(locationClusters), 0)} cases
          </p>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsMap;
