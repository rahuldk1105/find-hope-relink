
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Plus, 
  Clock, 
  MapPin, 
  Search, 
  Heart,
  TrendingUp,
  Shield,
  Eye,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ImageMatchingStatus } from "@/components/ImageMatchingStatus";

const RelativeDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Fetch user's reports
  const { data: myReports = [] } = useQuery({
    queryKey: ['my-reports', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .eq('reporter_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  // Fetch general statistics for engagement
  const { data: stats } = useQuery({
    queryKey: ['general-stats'],
    queryFn: async () => {
      const [totalMissing, totalFound, recentFound] = await Promise.all([
        supabase
          .from('missing_persons')
          .select('id', { count: 'exact' })
          .eq('status', 'missing'),
        supabase
          .from('missing_persons')
          .select('id', { count: 'exact' })
          .eq('status', 'found'),
        supabase
          .from('missing_persons')
          .select('id', { count: 'exact' })
          .eq('status', 'found')
          .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      return {
        totalMissing: totalMissing.count || 0,
        totalFound: totalFound.count || 0,
        recentFound: recentFound.count || 0,
        successRate: totalFound.count && totalMissing.count ? 
          Math.round((totalFound.count / (totalFound.count + totalMissing.count)) * 100) : 0
      };
    }
  });

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'missing': return 'bg-orange-500';
      case 'found': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'missing': return 'காணாமல்போயுள்ளார்';
      case 'found': return 'கண்டுபிடிக்கப்பட்டார்';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b-4 border-orange-500 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">குடிமக்கள் டாஷ்போர்ட் | Citizen Dashboard</h1>
                <p className="text-sm text-gray-600">ReLink காணாமல்போனோர் போர்ட்டல்</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden sm:flex border-orange-300 text-orange-700">
                {user?.email}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-orange-300 hover:bg-orange-50"
              >
                வெளியேறு
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Heart className="w-4 h-4" />
              <span>முகப்பு</span>
            </TabsTrigger>
            <TabsTrigger value="my-reports" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span>என் அறிக்கைகள்</span>
            </TabsTrigger>
            <TabsTrigger value="statistics" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span>புள்ளிவிவரங்கள்</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="flex items-center space-x-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              <Shield className="w-4 h-4" />
              <span>ஆதரவு</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Welcome Section */}
            <Card className="bg-gradient-to-r from-orange-100 to-red-100 border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-700">வணக்கம், {user?.user_metadata?.name || 'குடிமகன்'}!</CardTitle>
                <CardDescription>
                  தமிழ்நாடு காவல்துறையின் ReLink போர்ட்டலுக்கு வருக. உங்கள் அன்புக்குரியவர்களைக் கண்டுபிடிக்க நாங்கள் உதவுகிறோம்.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={() => navigate('/report-missing')}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    காணாமல்போனவரை அறிவிக்கவும்
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setActiveTab("my-reports")}
                    className="border-orange-300 hover:bg-orange-50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    என் அறிக்கைகளைப் பார்க்க
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/90 backdrop-blur-sm border-orange-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">என் அறிக்கைகள்</CardTitle>
                  <Users className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{myReports.length}</div>
                  <p className="text-xs text-muted-foreground">மொத்தம் சமர்பிக்கப்பட்ட அறிக்கைகள்</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">வெற்றி விகிதம்</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{stats?.successRate || 0}%</div>
                  <p className="text-xs text-muted-foreground">கண்டுபிடிக்கப்பட்ட நபர்கள்</p>
                </CardContent>
              </Card>

              <Card className="bg-white/90 backdrop-blur-sm border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">இந்த வாரம்</CardTitle>
                  <Calendar className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{stats?.recentFound || 0}</div>
                  <p className="text-xs text-muted-foreground">சமீபத்தில் கண்டுபிடிக்கப்பட்டவர்கள்</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Reports */}
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-orange-700">சமீபத்திய அறிக்கைகள்</CardTitle>
                <CardDescription>உங்கள் சமீபத்திய காணாமல்போனோர் அறிக்கைகள்</CardDescription>
              </CardHeader>
              <CardContent>
                {myReports.length > 0 ? (
                  <div className="space-y-4">
                    {myReports.slice(0, 3).map((report) => (
                      <div key={report.id} className="flex items-center space-x-4 p-4 border border-orange-200 rounded-lg">
                        <div className="flex-shrink-0">
                          {report.photo_url ? (
                            <img
                              src={report.photo_url}
                              alt={report.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Users className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{report.name}</h4>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {report.last_seen_location}
                          </p>
                           <p className="text-xs text-gray-500 flex items-center">
                             <Clock className="w-3 h-3 mr-1" />
                             {new Date(report.created_at).toLocaleDateString('ta-IN')}
                           </p>
                           
                           {/* Image matching status - only for missing persons with photos */}
                           {report.status === 'missing' && report.photo_url && (
                             <div className="mt-2">
                               <ImageMatchingStatus 
                                 missingPersonId={report.id}
                                 onComplete={() => {
                                   console.log('Image matching completed for', report.name);
                                 }}
                               />
                             </div>
                           )}
                        </div>
                        <Badge className={`${getStatusColor(report.status)} text-white`}>
                          {getStatusText(report.status)}
                        </Badge>
                      </div>
                    ))}
                    {myReports.length > 3 && (
                      <Button 
                        variant="outline" 
                        onClick={() => setActiveTab("my-reports")}
                        className="w-full border-orange-300 hover:bg-orange-50"
                      >
                        அனைத்து அறிக்கைகளையும் பார்க்க ({myReports.length - 3} மேலும்)
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">அறிக்கைகள் எதுவும் இல்லை</h3>
                    <p className="text-gray-500 mb-4">
                      இன்னும் எந்த காணாமல்போனோர் அறிக்கையும் சமர்பிக்கவில்லை.
                    </p>
                    <Button 
                      onClick={() => navigate('/report-missing')}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      முதல் அறிக்கையை சமர்பிக்கவும்
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-reports">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-orange-700">என் அறிக்கைகள்</CardTitle>
                <CardDescription>உங்கள் அனைத்து காணாமல்போனோர் அறிக்கைகள்</CardDescription>
              </CardHeader>
              <CardContent>
                {myReports.length > 0 ? (
                  <div className="space-y-4">
                    {myReports.map((report) => (
                      <Card key={report.id} className="border-orange-200">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {report.photo_url ? (
                                <img
                                  src={report.photo_url}
                                  alt={report.name}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Users className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-lg font-semibold">{report.name}</h3>
                                  <p className="text-gray-600">வயது: {report.age} | பாலினம்: {report.gender}</p>
                                  <p className="text-gray-600 flex items-center mt-1">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    கடைசியாக பார்க்கப்பட்ட இடம்: {report.last_seen_location}
                                  </p>
                                  <p className="text-sm text-gray-500 flex items-center mt-1">
                                     <Clock className="w-4 h-4 mr-1" />
                                     அறிவிக்கப்பட்ட தேதி: {new Date(report.created_at).toLocaleDateString('ta-IN')}
                                   </p>
                                   
                                   {/* Image matching status in the my-reports tab */}
                                   {report.status === 'missing' && report.photo_url && (
                                     <div className="mt-2">
                                       <ImageMatchingStatus 
                                         missingPersonId={report.id}
                                         onComplete={() => {
                                           console.log('Image matching completed for', report.name);
                                         }}
                                       />
                                     </div>
                                   )}
                                  {report.health_conditions && (
                                    <p className="text-sm text-gray-600 mt-2">
                                      <strong>உடல்நிலை:</strong> {report.health_conditions}
                                    </p>
                                  )}
                                </div>
                                <Badge className={`${getStatusColor(report.status)} text-white`}>
                                  {getStatusText(report.status)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">அறிக்கைகள் எதுவும் இல்லை</h3>
                    <p className="text-gray-500 mb-4">இன்னும் எந்த அறிக்கையும் சமர்பிக்கவில்லை.</p>
                    <Button 
                      onClick={() => navigate('/report-missing')}
                      className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                    >
                      முதல் அறிக்கையை சமர்பிக்கவும்
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-700">தமிழ்நாட்டில் காணாமல்போனோர் புள்ளிவிவரங்கள்</CardTitle>
                  <CardDescription>பொதுவான தகவல்கள் மற்றும் சுவாரஸ்ய உண்மைகள்</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">மொத்தம் செயலில் உள்ள வழக்குகள்</span>
                        <span className="text-2xl font-bold text-orange-600">{stats?.totalMissing || 0}</span>
                      </div>
                      <Progress value={60} className="h-2" />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">வெற்றிகரமாக மீட்கப்பட்டவர்கள்</span>
                        <span className="text-2xl font-bold text-green-600">{stats?.totalFound || 0}</span>
                      </div>
                      <Progress value={stats?.successRate || 0} className="h-2" />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">சுவாரஸ்ய உண்மைகள்</h4>
                      <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>முதல் 72 மணிநேரம் மிக முக்கியம் - 85% நபர்கள் இந்த நேரத்தில் கண்டுபிடிக்கப்படுகிறார்கள்</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>தமிழ்நாட்டில் ஆண்டுக்கு சராசரி 15,000+ காணாமல்போனோர் வழக்குகள் பதிவாகின்றன</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>90% வழக்குகள் 30 நாட்களுக்குள் தீர்க்கப்படுகின்றன</span>
                        </div>
                        <div className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <span>தொழில்நுட்ப முன்னேற்றங்கள் தேடல் நேரத்தை 50% குறைத்துள்ளன</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-100 to-green-100 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-700">நம்பிக்கையூட்டும் செய்தி</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    தமிழ்நாடு காவல்துறை ஒவ்வொரு வழக்கையும் மிக கவனமாகக் கையாளுகிறது. நவீன தொழில்நுட்பம், 
                    அர்ப்பணிப்புள்ள அதிகாரிகள், மற்றும் சமூகத்தின் ஒத்துழைப்புடன், நாங்கள் வழக்குகளை 
                    விரைவாகவும் திறமையாகவும் தீர்த்து வருகிறோம். உங்கள் நம்பிக்கையை இழக்காதீர்கள் - 
                    நாங்கள் உங்களுடன் இருக்கிறோம்.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="support">
            <div className="space-y-6">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-orange-700">உதவி மற்றும் ஆதரவு</CardTitle>
                  <CardDescription>தேவைப்படும்போது எங்களைத் தொடர்பு கொள்ளுங்கள்</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">அவசர தொடர்பு</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border border-red-200 rounded-lg bg-red-50">
                          <Phone className="w-5 h-5 text-red-600" />
                          <div>
                            <p className="font-semibold text-red-700">அவசரநிலை</p>
                            <p className="text-2xl font-bold text-red-600">100</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border border-orange-200 rounded-lg bg-orange-50">
                          <Phone className="w-5 h-5 text-orange-600" />
                          <div>
                            <p className="font-semibold text-orange-700">கட்டுப்பாட்டு அறை</p>
                            <p className="text-lg font-bold text-orange-600">044-28447100</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 p-3 border border-blue-200 rounded-lg bg-blue-50">
                          <Mail className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-semibold text-blue-700">மின்னஞ்சல் ஆதரவு</p>
                            <p className="text-sm text-blue-600">support@tnpolice.gov.in</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">அடிக்கடி கேட்கப்படும் கேள்விகள்</h4>
                      <div className="space-y-3">
                        <Card className="border-gray-200">
                          <CardContent className="p-3">
                            <h5 className="font-semibold text-sm mb-1">அறிக்கை சமர்பித்த பிறகு என்ன நடக்கும்?</h5>
                            <p className="text-xs text-gray-600">உங்கள் அறிக்கை உடனடியாக காவல்துறையின் தரவுத்தளத்தில் சேர்க்கப்படும்.</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-gray-200">
                          <CardContent className="p-3">
                            <h5 className="font-semibold text-sm mb-1">புதுப்பிப்புகள் எப்போது வரும்?</h5>
                            <p className="text-xs text-gray-600">முக்கியமான முன்னேற்றங்கள் இருந்தால் உங்களுக்கு அறிவிக்கப்படும்.</p>
                          </CardContent>
                        </Card>
                        
                        <Card className="border-gray-200">
                          <CardContent className="p-3">
                            <h5 className="font-semibold text-sm mb-1">கூடுதல் தகவல்கள் தேவையா?</h5>
                            <p className="text-xs text-gray-600">ஆம், நினைவுக்கு வரும் எந்த தகவலும் காவல்துறையுடன் பகிர்ந்து கொள்ளுங்கள்.</p>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-100 to-blue-100 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-700">நம்பிக்கையுடன் இருங்கள்</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    தமிழ்நாடு காவல்துறை உங்கள் அன்புக்குரியவர்களைக் கண்டுபிடிக்க அயராது உழைக்கிறது. 
                    நவீன தொழில்நுட்பம், அனுபவமிக்க அதிகாரிகள், மற்றும் மக்களின் ஒத்துழைப்புடன் 
                    நாங்கள் ஒவ்வொரு வழக்கையும் தீர்ப்பதில் உறுதியாக உள்ளோம்.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RelativeDashboard;
