
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, ArrowUp, User, LogOut, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  status: string;
  last_seen_location: string;
  created_at: string;
  photo_url: string;
}

const RelativeDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [myReports, setMyReports] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyReports();
    }
  }, [user]);

  const fetchMyReports = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .eq('reporter_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setMyReports(data || []);
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      toast({
        title: "Error",
        description: "Failed to load your reports.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const filteredReports = myReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalReports = myReports.length;
  const activeCases = myReports.filter(report => report.status === 'missing').length;
  const resolvedCases = myReports.filter(report => report.status === 'found').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ReLink Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome back, {user?.user_metadata?.name || 'Family Member'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => navigate('/report-missing')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Report Missing Person
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{totalReports}</div>
              <p className="text-xs text-gray-500">Missing person reports filed</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
              <Search className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{activeCases}</div>
              <p className="text-xs text-gray-500">Currently being investigated</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{resolvedCases}</div>
              <p className="text-xs text-gray-500">Successfully reunited</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-blue-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/report-missing')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <ArrowUp className="h-5 w-5" />
                <span>Report Missing Person</span>
              </CardTitle>
              <CardDescription>Submit a new missing person report with photos and details</CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-teal-200 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/my-reports')}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-teal-700">
                <FileText className="h-5 w-5" />
                <span>View All My Reports</span>
              </CardTitle>
              <CardDescription>Manage and track all your submitted reports</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Reports Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Recent Reports</CardTitle>
                <CardDescription>Your latest missing person reports</CardDescription>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/my-reports')}
              >
                View All
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No reports yet</h3>
                <p className="text-gray-500 mb-4">Get started by submitting your first missing person report.</p>
                <Button 
                  onClick={() => navigate('/report-missing')}
                  className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
                >
                  Submit First Report
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {report.photo_url ? (
                        <img 
                          src={report.photo_url} 
                          alt={report.name} 
                          className="w-12 h-12 rounded-full object-cover bg-gray-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-800">{report.name}</h3>
                        <p className="text-sm text-gray-600">Age: {report.age} • Last seen: {report.last_seen_location}</p>
                        <p className="text-xs text-gray-500">Reported: {new Date(report.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={report.status === "found" ? "default" : "destructive"}
                        className={report.status === "found" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                      >
                        {report.status === "found" ? "Found" : "Missing"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/report/${report.id}`)}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelativeDashboard;
