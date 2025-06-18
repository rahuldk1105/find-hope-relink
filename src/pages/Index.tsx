
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Heart, Shield, Phone, Mail, MapPin, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Government Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Top Government Bar */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              <span>இந்திய அரசு | Government of India</span>
              <span>|</span>
              <span>தமிழ்நாடு அரசு | Government of Tamil Nadu</span>
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
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center border-2 border-orange-700">
                <div className="text-white font-bold text-lg">TN</div>
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  ReLink - காணாமல்போனோர் தேடல் போர்ட்டல்
                </h1>
                <p className="text-sm text-gray-600">
                  Government of Tamil Nadu | Police Department
                </p>
                <p className="text-xs text-gray-500">
                  தமிழ்நாடு அரசு | காவல்துறை
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-orange-300 hover:bg-orange-50"
              >
                குடிமக்கள் உள்நுழைவு
              </Button>
              <Button 
                onClick={() => navigate('/role-select')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                பதிவு / புகார்
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-100 to-red-100">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/100px-Emblem_of_India.svg.png" 
              alt="Government of India Emblem" 
              className="w-16 h-16 mr-4"
            />
            <Badge className="bg-orange-600 text-white hover:bg-orange-600 text-lg px-4 py-2">
              அரசு முயற்சி • Government Initiative
            </Badge>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            தமிழ்நாடு<br />காணாமல்போனோர் போர்ட்டல்
          </h2>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            தமிழ்நாடு காவல்துறையின் அதிகாரபூர்வ போர்ட்டல் - காணாமல்போனோரை அறிவிக்கவும் கண்காணிக்கவும். 
            பாதுகாப்பான, அரசு சரிபார்க்கப்பட்ட சேனல்கள் மூலம் சட்ட அமலாக்கத்துடன் இணைந்து செயல்படுங்கள்.
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Official portal of Tamil Nadu Police Department for reporting and tracking missing persons
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/role-select')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-6"
            >
              <Users className="mr-2 h-5 w-5" />
              காணாமல்போனவரை அறிவிக்கவும்
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-orange-300 hover:bg-orange-50 text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              ஏற்கனவே உள்ள வழக்கைக் கண்காணிக்கவும்
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            இந்தியாவில் காணாமல்போனோர் புள்ளிவிவரங்கள்
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-orange-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600">2.3 லட்சம்</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">2023ல் இந்தியாவில் காணாமல்போனோர்</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">85%</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">வெற்றிகரமாக மீட்கப்பட்ட விகிதம்</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">72 மணி</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">முதல் 72 மணிநேரம் மிக முக்கியம்</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600">24/7</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">காவல்துறை உதவி கிடைக்கும்</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            எங்கள் சேவைகள் | Our Services
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-orange-700">காணாமல்போனவரை அறிவிக்கவும்</CardTitle>
                <CardDescription>Report Missing Person</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  எங்கள் பாதுகாப்பான அரசு போர்ட்டல் மூலம் விரிவான காணாமல்போனோர் அறிக்கையை தாக்கல் செய்யுங்கள். 
                  அனைத்து அறிக்கைகளும் தமிழ்நாடு காவல்துறை அமைப்புகளுடன் நேரடியாக ஒருங்கிணைக்கப்பட்டுள்ளன.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-700">விசாரணையைக் கண்காணிக்கவும்</CardTitle>
                <CardDescription>Track Investigation</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  தமிழ்நாடு காவல்துறை முழுவதும் உள்ள விசாரணை அதிகாரிகளின் நிகழ்நேர புதுப்பிப்புகள் மூலம் 
                  உங்கள் வழக்கின் முன்னேற்றத்தைக் கண்காணிக்கவும்.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-700">காவல்துறை ஒருங்கிணைப்பு</CardTitle>
                <CardDescription>Police Coordination</CardDescription>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  தமிழ்நாடு காவல்துறை பிரிவுகளுடன் நேரடி ஒருங்கிணைப்பு, வேகமான மற்றும் திறமையான 
                  தேடல் நடவடிக்கைகளுக்கு தொழில்நுட்பத்தைப் பயன்படுத்துதல்.
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
            <h3 className="text-3xl font-bold mb-4 text-red-700">அவசர தொடர்பு | Emergency Contact</h3>
            <p className="text-xl mb-8 text-gray-700">
              உடனடி உதவிக்கு, தமிழ்நாடு காவல்துறை அவசர சேவைகளைத் தொடர்பு கொள்ளவும்
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-red-600 mb-2" />
                <h4 className="font-semibold text-gray-800">அவசரநிலை</h4>
                <p className="text-2xl font-bold text-red-600">100</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-semibold text-gray-800">கட்டுப்பாட்டு அறை</h4>
                <p className="text-lg font-semibold text-orange-600">044-28447100</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">மின்னஞ்சல் ஆதரவு</h4>
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
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">ReLink TN</span>
              </div>
              <p className="text-gray-300 text-sm">
                அதிகாரபூர்வ காணாமல்போனோர் போர்ட்டல்<br />
                தமிழ்நாடு அரசு<br />
                காவல்துறை
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">விரைவு இணைப்புகள்</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>தமிழ்நாடு காவல்துறை</li>
                <li>அரசு போர்ட்டல்</li>
                <li>அவசர சேவைகள்</li>
                <li>குடிமக்கள் சேவைகள்</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">தொடர்பு</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" />சென்னை, தமிழ்நாடு</li>
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" />044-28447100</li>
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" />info@tnpolice.gov.in</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">சட்டப்பூர்வ</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>தனியுரிமை கொள்கை</li>
                <li>சேவை விதிமுறைகள்</li>
                <li>RTI சட்டம்</li>
                <li>அணுகல்தன்மை</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>© 2024 தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. | கடைசியாக புதுப்பிக்கப்பட்டது: டிசம்பர் 2024</p>
            <p className="mt-2">இது தமிழ்நாடு காவல்துறையின் அதிகாரபூர்வ வலைத்தளம்</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
