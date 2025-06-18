
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Scan, Map, LogOut, Activity, TrendingUp, MapPin, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import MissingPersonsList from "@/components/MissingPersonsList";
import FaceScanModule from "@/components/FaceScanModule";
import PoliceMapView from "@/components/PoliceMapView";

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Get police session info
  const policeSession = JSON.parse(localStorage.getItem('police_session') || '{}');

  // Fetch dashboard statistics
  const { data: stats } = useQuery({
    queryKey: ['police-dashboard-stats'],
    queryFn: async () => {
      const [missingCount, scanCount, foundCount, recentScans] = await Promise.all([
        supabase
          .from('missing_persons')
          .select('id', { count: 'exact' })
          .eq('status', 'missing'),
        supabase
          .from('scan_attempts')
          .select('id', { count: 'exact' }),
        supabase
          .from('missing_persons')
          .select('id', { count: 'exact' })
          .eq('status', 'found'),
        supabase
          .from('scan_attempts')
          .select('id', { count: 'exact' })
          .gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        activeMissingPersons: missingCount.count || 0,
        totalScans: scanCount.count || 0,
        foundPersons: foundCount.count || 0,
        recentScans: recentScans.count || 0
      };
    }
  });

  const handleSignOut = () => {
    localStorage.removeItem('police_authenticated');
    localStorage.removeItem('police_session');
    navigate('/tnpolice/secure/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b-4 border-orange-500 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">காவல்துறை டாஷ்போர்ட் | Police Dashboard</h1>
                <p className="text-sm text-gray-600">ReLink காணாமல்போனோர் அமைப்பு</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex border-orange-300 text-orange-700">
                அதிகாரி: {policeSession.email || 'Tamil Nadu Police'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2 border-orange-300 hover:bg-orange-50"
              >
                <LogOut className="w-4 h-4" />
                <span>வெளியேறு</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Activity className="w-4 h-4" />
              <span>மேலோட்டம்</span>
            </TabsTrigger>
            <TabsTrigger value="missing-persons" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span>காணாமல்போனோர்</span>
            </TabsTrigger>
            <TabsTrigger value="scan" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Scan className="w-4 h-4" />
              <span>முக ஸ்கேன்</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Map className="w-4 h-4" />
              <span>வரைபடம்</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span>பகுப்பாய்வு</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-l-4 border-l-orange-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">செயலில் உள்ள காணாமல்போனோர்</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{stats?.activeMissingPersons || 0}</div>
                  <p className="text-xs text-muted-foreground">தற்போது அறிவிக்கப்பட்ட காணாமல்போனோர்</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-blue-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">மொத்த ஸ்கேன்கள்</CardTitle>
                  <Scan className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.totalScans || 0}</div>
                  <p className="text-xs text-muted-foreground">முக அடையாள ஸ்கேன்கள் செய்யப்பட்டவை</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">கண்டுபிடிக்கப்பட்டவர்கள்</CardTitle>
                  <MapPin className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.foundPersons || 0}</div>
                  <p className="text-xs text-muted-foreground">வெற்றிகரமாக மீட்கப்பட்டவர்கள்</p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-purple-500 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">இன்றைய ஸ்கேன்கள்</CardTitle>
                  <Zap className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">{stats?.recentScans || 0}</div>
                  <p className="text-xs text-muted-foreground">கடைசி 24 மணிநேரத்தில்</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">விரைவு நடவடிக்கைகள் | Quick Actions</CardTitle>
                <CardDescription>பொதுவான காவல்துறை டாஷ்போர்ட் நடவடிக்கைகள்</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setActiveTab("scan")}
                    className="h-24 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Scan className="w-6 h-6" />
                    <span>முக ஸ்கேன் தொடங்கு</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("missing-persons")}
                    className="h-24 flex flex-col items-center justify-center space-y-2 border-orange-300 hover:bg-orange-50"
                  >
                    <Users className="w-6 h-6 text-orange-600" />
                    <span>காணாமல்போனோர்</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("map")}
                    className="h-24 flex flex-col items-center justify-center space-y-2 border-orange-300 hover:bg-orange-50"
                  >
                    <Map className="w-6 h-6 text-orange-600" />
                    <span>வரைபடம் பார்க்க</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/analytics-dashboard')}
                    className="h-24 flex flex-col items-center justify-center space-y-2 border-orange-300 hover:bg-orange-50"
                  >
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                    <span>பகுப்பாய்வு</span>
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
            <PoliceMapView />
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  <span>மேம்பட்ட பகுப்பாய்வு | Advanced Analytics</span>
                </CardTitle>
                <CardDescription>
                  விரிவான பகுப்பாய்வு மற்றும் வெப்ப வரைபட காட்சிப்படுத்தல்
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">மேம்பட்ட பகுப்பாய்வு டாஷ்போர்ட்</h3>
                  <p className="text-gray-600 mb-6">
                    வெப்ப வரைபட காட்சிப்படுத்தல், வடிப்பான்கள் மற்றும் ஏற்றுமதி திறன்களுடன் விரிவான பகுப்பாய்வை அணுகவும்.
                  </p>
                  <Button
                    onClick={() => navigate('/analytics-dashboard')}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    பகுப்பாய்வு டாஷ்போர்ட் திற
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PoliceDashboard;
