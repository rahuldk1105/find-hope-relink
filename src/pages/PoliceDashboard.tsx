
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Scan, Map, LogOut, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MissingPersonsList from "@/components/MissingPersonsList";
import FaceScanModule from "@/components/FaceScanModule";
import MissingPersonsMap from "@/components/MissingPersonsMap";

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['police-dashboard-stats'],
    queryFn: async () => {
      const [missingCount, scanCount] = await Promise.all([
        supabase
          .from('missing_persons')
          .select('id', { count: 'exact' })
          .eq('status', 'missing'),
        supabase
          .from('scan_attempts')
          .select('id', { count: 'exact' })
      ]);

      return {
        activeMissingPersons: missingCount.count || 0,
        totalScans: scanCount.count || 0
      };
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Police Dashboard</h1>
                <p className="text-sm text-gray-600">ReLink Missing Persons System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex">
                Officer: {user?.email}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="missing-persons" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Missing Persons</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center space-x-2">
              <Scan className="w-4 h-4" />
              <span>Face Scan</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2">
              <Map className="w-4 h-4" />
              <span>Map View</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Missing Persons</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeMissingPersons || 0}</div>
                  <p className="text-xs text-muted-foreground">Currently reported missing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                  <Scan className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalScans || 0}</div>
                  <p className="text-xs text-muted-foreground">Face recognition scans performed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Status</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common police dashboard actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => setActiveTab("scan")}
                    className="h-24 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Scan className="w-6 h-6" />
                    <span>Start Face Scan</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("missing-persons")}
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                  >
                    <Users className="w-6 h-6" />
                    <span>View Missing Persons</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("map")}
                    className="h-24 flex flex-col items-center justify-center space-y-2"
                  >
                    <Map className="w-6 h-6" />
                    <span>View Map</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="missing-persons">
            <MissingPersonsList />
          </TabsContent>

          <TabsContent value="scan">
            <FaceScanModule />
          </TabsContent>

          <TabsContent value="map">
            <MissingPersonsMap />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PoliceDashboard;
