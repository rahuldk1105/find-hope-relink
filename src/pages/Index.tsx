
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Heart, Shield, Phone, Mail, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      {/* Government Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Top Government Bar */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              <span>भारत सरकार | Government of India</span>
              <span>|</span>
              <span>तमिलनाडु सरकार | Government of Tamil Nadu</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Skip to main content</span>
              <span>|</span>
              <span>Screen Reader Access</span>
            </div>
          </div>
          
          {/* Main Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Government Emblem */}
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center border-2 border-orange-700">
                <div className="text-white font-bold text-lg">TN</div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  ReLink - Missing Persons Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Government of Tamil Nadu | Police Department
                </p>
                <p className="text-xs text-gray-500">
                  तमिलनाडु पुलिस विभाग
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-orange-300 hover:bg-orange-50"
              >
                Citizen Login
              </Button>
              <Button 
                onClick={() => navigate('/role-select')}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Register / Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-100 to-green-100">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/100px-Emblem_of_India.svg.png" 
              alt="Government of India Emblem" 
              className="w-16 h-16 mr-4"
            />
            <Badge className="bg-orange-600 text-white hover:bg-orange-600 text-lg px-4 py-2">
              Government Initiative • सरकारी पहल
            </Badge>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            Tamil Nadu Missing<br />Persons Portal
          </h2>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            Official portal of Tamil Nadu Police Department for reporting and tracking missing persons. 
            Connect with law enforcement through secure, government-verified channels.
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            तमिलनाडु पुलिस विभाग का आधिकारिक पोर्टल - लापता व्यक्तियों की रिपोर्ट और ट्रैकिंग के लिए
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/role-select')}
              className="bg-orange-600 hover:bg-orange-700 text-white text-lg px-8 py-6"
            >
              <Users className="mr-2 h-5 w-5" />
              Report Missing Person
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-orange-300 hover:bg-orange-50 text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              Track Existing Case
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Services | हमारी सेवाएं
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-orange-700">Report Missing Person</CardTitle>
                <CardDescription>लापता व्यक्ति की रिपोर्ट करें</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  File detailed missing person reports through our secure government portal. 
                  All reports are directly integrated with Tamil Nadu Police systems.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-700">Track Investigation</CardTitle>
                <CardDescription>जांच की स्थिति देखें</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Monitor the progress of your case through real-time updates from investigating officers 
                  across Tamil Nadu Police Department.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-700">Police Coordination</CardTitle>
                <CardDescription>पुलिस समन्वय</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  Direct coordination with Tamil Nadu Police units, leveraging technology 
                  for faster and more efficient search operations.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Section */}
      <section className="py-16 px-4 bg-red-50 border-t-4 border-red-400">
        <div className="container mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <h3 className="text-3xl font-bold mb-4 text-red-700">Emergency Contact | आपातकालीन संपर्क</h3>
            <p className="text-xl mb-8 text-gray-700">
              For immediate assistance, contact Tamil Nadu Police Emergency Services
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-red-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Emergency</h4>
                <p className="text-2xl font-bold text-red-600">100</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Control Room</h4>
                <p className="text-lg font-semibold text-orange-600">044-28447100</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">Email Support</h4>
                <p className="text-sm text-blue-600">support@tnpolice.gov.in</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">ReLink TN</span>
              </div>
              <p className="text-gray-300 text-sm">
                Official Missing Persons Portal<br />
                Government of Tamil Nadu<br />
                Police Department
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Tamil Nadu Police</li>
                <li>Government Portal</li>
                <li>Emergency Services</li>
                <li>Citizen Services</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" />Chennai, Tamil Nadu</li>
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" />044-28447100</li>
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" />info@tnpolice.gov.in</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>RTI Act</li>
                <li>Accessibility</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 Government of Tamil Nadu. All rights reserved. | Last updated: December 2024</p>
            <p className="mt-2">This is an official website of Tamil Nadu Police Department (तमिलनाडु पुलिस विभाग)</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
