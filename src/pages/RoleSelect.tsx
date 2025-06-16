
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
            Choose Your Role
          </h1>
          <p className="text-gray-600 text-lg">
            Select how you'd like to use ReLink to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Relative Card */}
          <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => navigate('/relative-register')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <Badge className="mb-3 bg-blue-100 text-blue-700 hover:bg-blue-100">
                Family Member
              </Badge>
              <CardTitle className="text-2xl text-blue-700 mb-2">I'm a Relative</CardTitle>
              <CardDescription className="text-gray-600">
                Report a missing family member or loved one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Submit detailed missing person reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Upload photos and provide descriptions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Track case status and updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Coordinate with law enforcement</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 mt-6">
                Get Started as Relative
              </Button>
            </CardContent>
          </Card>

          {/* Police Card */}
          <Card className="border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                onClick={() => navigate('/police-register')}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <Badge className="mb-3 bg-teal-100 text-teal-700 hover:bg-teal-100">
                Law Enforcement
              </Badge>
              <CardTitle className="text-2xl text-teal-700 mb-2">I'm Police</CardTitle>
              <CardDescription className="text-gray-600">
                Search and coordinate missing person cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Access all missing person reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Advanced search and filtering tools</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Image scanning and matching capabilities</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <span>Case management and updates</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 mt-6">
                Get Started as Police
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Button variant="link" onClick={() => navigate('/login')} className="p-0 h-auto text-blue-600">
              Sign in here
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
