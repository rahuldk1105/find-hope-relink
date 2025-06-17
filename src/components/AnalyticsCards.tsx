
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle, Calendar, MapPin, TrendingUp, TrendingDown } from "lucide-react";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  last_seen_location: string;
  status: string;
  created_at: string;
}

interface AnalyticsCardsProps {
  missingPersons: MissingPerson[];
}

const AnalyticsCards = ({ missingPersons }: AnalyticsCardsProps) => {
  // Calculate analytics
  const totalActiveCases = missingPersons.filter(p => p.status === 'missing').length;
  
  const currentMonth = new Date();
  const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1);
  
  const casesFoundThisMonth = missingPersons.filter(p => {
    const foundDate = new Date(p.created_at);
    return p.status === 'found' && 
           foundDate.getMonth() === currentMonth.getMonth() && 
           foundDate.getFullYear() === currentMonth.getFullYear();
  }).length;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const casesLast7Days = missingPersons.filter(p => {
    const reportDate = new Date(p.created_at);
    return reportDate >= sevenDaysAgo;
  }).length;

  // Get most common locations
  const locationCounts: { [key: string]: number } = {};
  missingPersons.forEach(p => {
    if (p.last_seen_location) {
      locationCounts[p.last_seen_location] = (locationCounts[p.last_seen_location] || 0) + 1;
    }
  });
  
  const topLocations = Object.entries(locationCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  // Calculate trends (mock data for demo)
  const lastMonthTotal = Math.floor(totalActiveCases * 0.85);
  const activeCasesTrend = totalActiveCases > lastMonthTotal ? 'up' : 'down';
  const activeCasesChange = Math.abs(totalActiveCases - lastMonthTotal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {/* Total Active Cases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active Cases</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalActiveCases}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {activeCasesTrend === 'up' ? (
              <TrendingUp className="h-3 w-3 text-red-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-green-500" />
            )}
            <span className={activeCasesTrend === 'up' ? 'text-red-500' : 'text-green-500'}>
              {activeCasesChange} from last month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Cases Found This Month */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Found This Month</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{casesFoundThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            Cases resolved in {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
          </p>
        </CardContent>
      </Card>

      {/* Cases Reported Last 7 Days */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reports (7 Days)</CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{casesLast7Days}</div>
          <p className="text-xs text-muted-foreground">
            New reports in the last week
          </p>
        </CardContent>
      </Card>

      {/* Top Locations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Locations</CardTitle>
          <MapPin className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topLocations.length > 0 ? (
              topLocations.map(([location, count], index) => (
                <div key={location} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                    <span className="text-xs font-medium truncate max-w-24">
                      {location}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted-foreground">No location data</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsCards;
