
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, User, Search, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  last_seen_location: string;
  photo_url: string | null;
  created_at: string;
  status: string;
  health_conditions: string | null;
  last_seen_lat: number | null;
  last_seen_lng: number | null;
}

interface FiltersState {
  search: string;
  gender: string;
  ageMin: string;
  ageMax: string;
  location: string;
  showFilters: boolean;
}

const MissingPersonsList = () => {
  const [filters, setFilters] = useState<FiltersState>({
    search: "",
    gender: "",
    ageMin: "",
    ageMax: "",
    location: "",
    showFilters: false
  });

  const { data: missingPersons, isLoading, error } = useQuery({
    queryKey: ['missing-persons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .eq('status', 'missing')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as MissingPerson[];
    }
  });

  const filteredPersons = useMemo(() => {
    if (!missingPersons) return [];

    return missingPersons.filter(person => {
      // Search filter
      if (filters.search && !person.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Gender filter
      if (filters.gender && person.gender !== filters.gender) {
        return false;
      }

      // Age range filter
      if (filters.ageMin && person.age < parseInt(filters.ageMin)) {
        return false;
      }
      if (filters.ageMax && person.age > parseInt(filters.ageMax)) {
        return false;
      }

      // Location filter
      if (filters.location && !person.last_seen_location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [missingPersons, filters]);

  const updateFilter = (key: keyof FiltersState, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      gender: "",
      ageMin: "",
      ageMax: "",
      location: "",
      showFilters: filters.showFilters
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex space-x-4">
                <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading missing persons data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Search className="w-5 h-5" />
              <span>Search & Filter</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateFilter('showFilters', !filters.showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {filters.showFilters ? 'Hide' : 'Show'} Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="search">Search by Name</Label>
              <Input
                id="search"
                placeholder="Enter name..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Filter by Location</Label>
              <Input
                id="location"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => updateFilter('location', e.target.value)}
              />
            </div>
          </div>

          {filters.showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={filters.gender} onValueChange={(value) => updateFilter('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ageMin">Min Age</Label>
                <Input
                  id="ageMin"
                  type="number"
                  placeholder="Min age"
                  value={filters.ageMin}
                  onChange={(e) => updateFilter('ageMin', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="ageMax">Max Age</Label>
                <Input
                  id="ageMax"
                  type="number"
                  placeholder="Max age"
                  value={filters.ageMax}
                  onChange={(e) => updateFilter('ageMax', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredPersons.length} of {missingPersons?.length || 0} missing persons
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Missing Persons List */}
      <div className="space-y-4">
        {filteredPersons.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No missing persons match your current filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredPersons.map((person) => (
            <Card key={person.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex space-x-4">
                  <div className="flex-shrink-0">
                    {person.photo_url ? (
                      <img
                        src={person.photo_url}
                        alt={person.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{person.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{person.age} years old</span>
                          <Badge variant="outline">{person.gender}</Badge>
                          <span className="flex items-center">
                            <CalendarDays className="w-4 h-4 mr-1" />
                            Filed {format(new Date(person.created_at), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Last seen: {person.last_seen_location}</span>
                    </div>
                    {person.health_conditions && (
                      <div className="text-sm">
                        <span className="font-medium text-amber-600">Health conditions:</span>
                        <span className="ml-1 text-gray-600">{person.health_conditions}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default MissingPersonsList;
