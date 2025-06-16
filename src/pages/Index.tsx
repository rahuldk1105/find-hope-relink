
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Heart, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  ReLink
                </h1>
                <p className="text-sm text-gray-600">Reuniting Families</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-blue-200 hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/role-select')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
            Connecting Communities • Saving Lives
          </Badge>
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">
            Help Bring Missing<br />Persons Home
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            ReLink connects families reporting missing persons with law enforcement through 
            advanced technology, making search efforts more efficient and effective.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/role-select')}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-lg px-8 py-6"
            >
              <Users className="mr-2 h-5 w-5" />
              Report Missing Person
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/police-login')}
              className="border-blue-200 hover:bg-blue-50 text-lg px-8 py-6"
            >
              <Shield className="mr-2 h-5 w-5" />
              Police Access
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/60 backdrop-blur-sm">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            How ReLink Works
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-700">Report Missing Person</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Family members can quickly report missing persons with detailed information, 
                  photos, and last known locations to create comprehensive profiles.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-teal-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-teal-700">Advanced Search</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Police officers can search and filter missing persons by location, age, 
                  gender, and other criteria to efficiently coordinate search efforts.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-purple-700">Reunite Families</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Through coordinated efforts and technology, we help bring missing persons 
                  home safely and reunite them with their families.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Every Second Counts</h3>
            <p className="text-xl mb-8 opacity-90">
              Join our mission to reconnect families and save lives through technology and community cooperation.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/role-select')}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6"
            >
              Start Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 border-t border-gray-200">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-800">ReLink</span>
          </div>
          <p className="text-gray-600">
            © 2024 ReLink. Dedicated to reuniting families and supporting communities.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
