
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Layers, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  last_seen_lat: number | null;
  last_seen_lng: number | null;
  last_seen_location: string;
  created_at: string;
  status: string;
  photo_url: string | null;
}

const PoliceMapView = () => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<MissingPerson | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch missing persons with location data
  const { data: missingPersons = [] } = useQuery({
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

  // Initialize Google Map
  useEffect(() => {
    if (typeof window !== 'undefined' && window.google && window.google.maps) {
      initializeMap();
      setMapLoaded(true);
    } else {
      // Load Google Maps if not already loaded
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOMD0C1dMj5v3I&libraries=visualization&callback=initMap`;
      script.async = true;
      window.initMap = () => {
        initializeMap();
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    }
  }, [missingPersons]);

  const initializeMap = () => {
    if (!window.google || !window.google.maps) return;

    // Center on Tamil Nadu
    const map = new window.google.maps.Map(document.getElementById('police-map')!, {
      zoom: 7,
      center: { lat: 11.1271, lng: 78.6569 }, // Tamil Nadu center
      styles: [
        {
          featureType: "administrative",
          elementType: "geometry",
          stylers: [{ color: "#ff8c00" }]
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#ffffff" }]
        }
      ]
    });

    // Add markers for missing persons
    missingPersons.forEach((person) => {
      if (person.last_seen_lat && person.last_seen_lng) {
        const marker = new window.google.maps.Marker({
          position: { lat: person.last_seen_lat, lng: person.last_seen_lng },
          map: map,
          title: person.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
                <path d="M15 0C6.7 0 0 6.7 0 15c0 15 15 25 15 25s15-10 15-25C30 6.7 23.3 0 15 0z" fill="#ff4444"/>
                <circle cx="15" cy="15" r="8" fill="white"/>
                <text x="15" y="19" text-anchor="middle" font-size="10" fill="#333">👤</text>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(30, 40)
          }
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div class="p-3 max-w-xs">
              <h3 class="font-semibold text-lg mb-2">${person.name}</h3>
              <p class="text-sm text-gray-600 mb-1">வயது: ${person.age} | பாலினம்: ${person.gender}</p>
              <p class="text-sm text-gray-600 mb-2">கடைசியாக பார்க்கப்பட்ட இடம்: ${person.last_seen_location}</p>
              <p class="text-xs text-gray-500">அறிவிக்கப்பட்ட தேதி: ${new Date(person.created_at).toLocaleDateString('ta-IN')}</p>
              <button class="mt-2 px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600" 
                      onclick="selectPerson('${person.id}')">
                விவரங்கள் பார்க்க
              </button>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }
    });

    // Add heatmap if enabled
    if (showHeatmap && window.google.maps.visualization) {
      const heatmapData = missingPersons
        .filter(person => person.last_seen_lat && person.last_seen_lng)
        .map(person => new window.google.maps.LatLng(person.last_seen_lat!, person.last_seen_lng!));

      const heatmap = new window.google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        map: map
      });

      heatmap.set('gradient', [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]);
    }

    // Make selectPerson function globally available
    window.selectPerson = (personId: string) => {
      const person = missingPersons.find(p => p.id === personId);
      if (person) {
        setSelectedPerson(person);
      }
    };
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <span>வரைபட பார்வை | Map View</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-orange-300">
                <Users className="w-4 h-4 mr-1" />
                {missingPersons.length} காணாமல்போனோர்
              </Badge>
              <Button
                variant={showHeatmap ? "default" : "outline"}
                size="sm"
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={showHeatmap ? "bg-orange-500 hover:bg-orange-600" : "border-orange-300 hover:bg-orange-50"}
              >
                <Layers className="w-4 h-4 mr-2" />
                வெப்ப வரைபடம்
              </Button>
            </div>
            <Button variant="outline" size="sm" className="border-orange-300 hover:bg-orange-50">
              <Filter className="w-4 h-4 mr-2" />
              வடிப்பான்
            </Button>
          </div>
          
          {/* Google Map Container */}
          <div 
            id="police-map" 
            className="w-full h-96 rounded-lg border border-orange-200"
            style={{ minHeight: '400px' }}
          >
            {/* Fallback content while map loads */}
            {!mapLoaded && (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">வரைபடம் ஏற்றப்படுகிறது...</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Selected Person Details */}
      {selectedPerson && (
        <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700">தேர்ந்தெடுக்கப்பட்ட நபர் விவரங்கள்</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-4">
              {selectedPerson.photo_url ? (
                <img
                  src={selectedPerson.photo_url}
                  alt={selectedPerson.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedPerson.name}</h3>
                <p className="text-gray-600">வயது: {selectedPerson.age} | பாலினம்: {selectedPerson.gender}</p>
                <p className="text-gray-600">கடைசியாக பார்க்கப்பட்ட இடம்: {selectedPerson.last_seen_location}</p>
                <p className="text-sm text-gray-500">அறிவிக்கப்பட்ட தேதி: {new Date(selectedPerson.created_at).toLocaleDateString('ta-IN')}</p>
                <div className="mt-3 space-x-2">
                  <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                    விவரங்கள் பார்க்க
                  </Button>
                  <Button size="sm" variant="outline" className="border-orange-300 hover:bg-orange-50">
                    கண்டுபிடிக்கப்பட்டதாக குறிக்க
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Legend */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">வரைபட குறியீடுகள் | Map Legend</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span className="text-sm">காணாமல்போனோர்</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="text-sm">கண்டுபிடிக்கப்பட்டவர்கள்</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span className="text-sm">சமீபத்திய ஸ்கேன்கள்</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-red-600 rounded-full"></div>
              <span className="text-sm">வெப்ப வரைபடம்</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliceMapView;
