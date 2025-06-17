
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, TrendingUp, MapPin, Download, Calendar, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AnalyticsMap from "@/components/AnalyticsMap";
import AnalyticsFilters from "@/components/AnalyticsFilters";
import AnalyticsCards from "@/components/AnalyticsCards";
import ExportControls from "@/components/ExportControls";
import type { Database } from "@/integrations/supabase/types";

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

interface FilterState {
  ageRange: [number, number];
  gender: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

type PersonGender = Database['public']['Enums']['person_gender'];
type PersonStatus = Database['public']['Enums']['person_status'];

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [filters, setFilters] = useState<FilterState>({
    ageRange: [0, 100],
    gender: "all",
    status: "all",
    dateRange: {
      from: null,
      to: null
    }
  });

  // Fetch all missing persons data
  const { data: missingPersons, isLoading } = useQuery({
    queryKey: ['analytics-missing-persons', filters],
    queryFn: async () => {
      let query = supabase
        .from('missing_persons')
        .select('*');

      // Apply filters with proper type casting
      if (filters.gender !== "all") {
        query = query.eq('gender', filters.gender as PersonGender);
      }
      
      if (filters.status !== "all") {
        query = query.eq('status', filters.status as PersonStatus);
      }

      if (filters.dateRange.from) {
        query = query.gte('created_at', filters.dateRange.from.toISOString());
      }
      
      if (filters.dateRange.to) {
        query = query.lte('created_at', filters.dateRange.to.toISOString());
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter by age range
      const filteredData = (data as MissingPerson[]).filter(person => 
        person.age >= filters.ageRange[0] && person.age <= filters.ageRange[1]
      );
      
      return filteredData;
    }
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">ReLink Missing Persons Analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/police-dashboard')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Analytics Cards */}
          <AnalyticsCards missingPersons={missingPersons || []} />

          {/* Filters and Export */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <AnalyticsFilters filters={filters} onFiltersChange={setFilters} />
            <ExportControls missingPersons={missingPersons || []} />
          </div>

          {/* Map Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Missing Persons Heatmap</span>
              </CardTitle>
              <CardDescription>
                Interactive map showing missing person locations with heatmap overlay
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsMap missingPersons={missingPersons || []} isLoading={isLoading} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
