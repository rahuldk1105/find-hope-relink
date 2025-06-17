
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RoleSelect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-orange-200">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-xl text-gray-800">Authentication Required</CardTitle>
            <CardDescription>प्रमाणीकरण आवश्यक</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              You must be logged in as a verified citizen to access Tamil Nadu Missing Persons Portal services.
            </p>
            <p className="text-sm text-gray-500">
              सेवाओं तक पहुंचने के लिए कृपया पहले लॉग इन करें
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Sign In / Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full border-orange-200 hover:bg-orange-50"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/relative-dashboard')}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
            Report Missing Person
          </h1>
          <p className="text-gray-600 text-lg">
            लापता व्यक्ति की रिपोर्ट दर्ज करें - Tamil Nadu Police Portal
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8 max-w-2xl mx-auto">
          {/* Only show relative option since users are already authenticated */}
          <Card className="border-orange-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => navigate('/report-missing')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <Badge className="mb-3 bg-orange-100 text-orange-700 hover:bg-orange-100">
                Citizen Report | नागरिक रिपोर्ट
              </Badge>
              <CardTitle className="text-2xl text-orange-700 mb-2">File Missing Person Report</CardTitle>
              <CardDescription className="text-gray-600">
                लापता व्यक्ति की विस्तृत रिपोर्ट दर्ज करें
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Submit detailed missing person reports with photos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Automatic integration with Tamil Nadu Police systems</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Real-time case tracking and updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <span>Direct communication with investigating officers</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 mt-6">
                Proceed to File Report
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            For police personnel access, contact IT Department | 
            पुलिस कर्मियों के लिए आईटी विभाग से संपर्क करें
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
