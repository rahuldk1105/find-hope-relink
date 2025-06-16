
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  last_seen_location: string;
  photo_url: string | null;
  last_seen_lat: number | null;
  last_seen_lng: number | null;
  created_at: string;
}

const MissingPersonsMap = () => {
  const { data: missingPersons, isLoading } = useQuery({
    queryKey: ['missing-persons-map'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .eq('status', 'missing')
        .not('last_seen_lat', 'is', null)
        .not('last_seen_lng', 'is', null);
      
      if (error) throw error;
      return data as MissingPerson[];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Last Seen Locations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span>Last Seen Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Map placeholder - integrate with Mapbox or similar service */}
          <div className="h-96 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-300">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <p className="text-blue-700 font-medium">Interactive Map View</p>
              <p className="text-blue-600 text-sm">Integrate with Mapbox or Google Maps</p>
              <p className="text-blue-600 text-sm mt-2">{missingPersons?.length || 0} locations to display</p>
            </div>
          </div>

          {/* Location List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h4 className="font-medium text-gray-700 mb-2">Locations ({missingPersons?.length || 0})</h4>
            {missingPersons?.map((person) => (
              <div key={person.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0">
                  {person.photo_url ? (
                    <img
                      src={person.photo_url}
                      alt={person.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-gray-600">{person.last_seen_location}</p>
                  <p className="text-xs text-gray-500">
                    {person.last_seen_lat?.toFixed(4)}, {person.last_seen_lng?.toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissingPersonsMap;
