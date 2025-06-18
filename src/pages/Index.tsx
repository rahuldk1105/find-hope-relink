
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Heart, Shield, Phone, Mail, MapPin, TrendingUp, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Government Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          {/* Top Government Bar */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-4">
              <span>{t('govt.india')} | Government of India</span>
              <span>|</span>
              <span>{t('govt.tn')} | Government of Tamil Nadu</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{t('skip.content')}</span>
              <span>|</span>
              <span>{t('screen.reader')}</span>
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
                  {language === 'en' ? (
                    <>
                      ReLink - Missing Persons Portal
                      <div className="text-lg text-gray-600">காணாமல்போனோர் தேடல் போர்ட்டல்</div>
                    </>
                  ) : (
                    t('missing.portal')
                  )}
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
              <LanguageSwitcher />
              <Button 
                variant="outline" 
                onClick={() => navigate('/login')}
                className="border-orange-300 hover:bg-orange-50"
              >
                {t('citizen.login')}
              </Button>
              <Button 
                onClick={() => navigate('/role-select')}
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
              >
                {t('register.report')}
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
              {t('govt.initiative')} • Government Initiative
            </Badge>
          </div>
          
          <h2 className="text-5xl font-bold mb-6 text-gray-800">
            {language === 'en' ? (
              <>
                Tamil Nadu<br />Missing Persons Portal
                <div className="text-3xl mt-2 text-orange-700">தமிழ்நாடு காணாமல்போனோர் போர்ட்டல்</div>
              </>
            ) : (
              t('missing.portal')
            )}
          </h2>
          <p className="text-xl text-gray-700 mb-4 max-w-3xl mx-auto leading-relaxed">
            {t('portal.description')}
          </p>
          {language === 'en' && (
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              Official portal of Tamil Nadu Police Department for reporting and tracking missing persons
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/role-select')}
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-6"
            >
              <Users className="mr-2 h-5 w-5" />
              {t('report.missing')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/login')}
              className="border-orange-300 hover:bg-orange-50 text-lg px-8 py-6"
            >
              <Search className="mr-2 h-5 w-5" />
              {t('track.case')}
            </Button>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-2 text-gray-800">
            {t('statistics.title')}
          </h3>
          {language === 'en' && (
            <p className="text-center text-gray-600 mb-12">भारत में लापता व्यक्तियों के आंकड़े</p>
          )}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="border-orange-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-orange-600">{t('stat.total')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">{t('stat.total.desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-600">{t('stat.success')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">{t('stat.success.desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-600">{t('stat.time')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">{t('stat.time.desc')}</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-purple-600">{t('stat.support')}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">{t('stat.support.desc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-2 text-gray-800">
            {t('services.title')}
          </h3>
          {language === 'en' && (
            <p className="text-center text-gray-600 mb-12">हमारी सेवाएं | Our Services</p>
          )}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-orange-700">{t('service.report.title')}</CardTitle>
                {language === 'en' && <CardDescription>Report Missing Person</CardDescription>}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {t('service.report.desc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-green-700">{t('service.track.title')}</CardTitle>
                {language === 'en' && <CardDescription>Track Investigation</CardDescription>}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {t('service.track.desc')}
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-blue-700">{t('service.police.title')}</CardTitle>
                {language === 'en' && <CardDescription>Police Coordination</CardDescription>}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {t('service.police.desc')}
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
            <h3 className="text-3xl font-bold mb-4 text-red-700">{t('emergency.title')}</h3>
            <p className="text-xl mb-8 text-gray-700">
              {t('emergency.desc')}
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-red-600 mb-2" />
                <h4 className="font-semibold text-gray-800">{t('emergency.label')}</h4>
                <p className="text-2xl font-bold text-red-600">100</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 text-orange-600 mb-2" />
                <h4 className="font-semibold text-gray-800">{t('control.room')}</h4>
                <p className="text-lg font-semibold text-orange-600">044-28447100</p>
              </div>
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 text-blue-600 mb-2" />
                <h4 className="font-semibold text-gray-800">{t('email.support')}</h4>
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
                {t('official.portal')}<br />
                {t('govt.tn')}<br />
                {language === 'en' ? 'Police Department' : 'காவல்துறை'}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('quick.links')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>{t('tn.police')}</li>
                <li>{t('govt.portal')}</li>
                <li>{t('emergency.services')}</li>
                <li>{t('citizen.services')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('contact')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center"><MapPin className="w-4 h-4 mr-2" />Chennai, Tamil Nadu</li>
                <li className="flex items-center"><Phone className="w-4 h-4 mr-2" />044-28447100</li>
                <li className="flex items-center"><Mail className="w-4 h-4 mr-2" />info@tnpolice.gov.in</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">{t('legal')}</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>{t('privacy.policy')}</li>
                <li>{t('terms.service')}</li>
                <li>{t('rti.act')}</li>
                <li>{t('accessibility')}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>{t('copyright')}</p>
            <p className="mt-2">{t('official.website')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
