
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    'govt.india': 'Government of India',
    'govt.tn': 'Government of Tamil Nadu',
    'skip.content': 'Skip to main content',
    'screen.reader': 'Screen Reader Access',
    'citizen.login': 'Citizen Login',
    'register.report': 'Register / Report',
    
    // Hero Section
    'govt.initiative': 'Government Initiative',
    'missing.portal': 'Tamil Nadu Missing Persons Portal',
    'portal.description': 'Official portal of Tamil Nadu Police Department for reporting and tracking missing persons through secure, government-verified channels.',
    'report.missing': 'Report Missing Person',
    'track.case': 'Track Existing Case',
    
    // Statistics
    'statistics.title': 'Missing Persons Statistics in India',
    'stat.total': '2.3 Lakh',
    'stat.total.desc': 'Missing persons reported in India in 2023',
    'stat.success': '85%',
    'stat.success.desc': 'Successfully recovered rate',
    'stat.time': '72 Hours',
    'stat.time.desc': 'First 72 hours are critical',
    'stat.support': '24/7',
    'stat.support.desc': 'Police assistance available',
    
    // Services
    'services.title': 'Our Services',
    'service.report.title': 'Report Missing Person',
    'service.report.desc': 'File comprehensive missing person reports through our secure government portal. All reports are directly integrated with Tamil Nadu Police systems.',
    'service.track.title': 'Track Investigation',
    'service.track.desc': 'Monitor your case progress with real-time updates from investigating officers across Tamil Nadu Police.',
    'service.police.title': 'Police Coordination',
    'service.police.desc': 'Direct coordination with Tamil Nadu Police units, leveraging technology for faster and efficient search operations.',
    
    // Emergency
    'emergency.title': 'Emergency Contact',
    'emergency.desc': 'For immediate assistance, contact Tamil Nadu Police emergency services',
    'emergency.label': 'Emergency',
    'control.room': 'Control Room',
    'email.support': 'Email Support',
    
    // Footer
    'official.portal': 'Official Missing Persons Portal',
    'quick.links': 'Quick Links',
    'tn.police': 'Tamil Nadu Police',
    'govt.portal': 'Government Portal',
    'emergency.services': 'Emergency Services',
    'citizen.services': 'Citizen Services',
    'contact': 'Contact',
    'legal': 'Legal',
    'privacy.policy': 'Privacy Policy',
    'terms.service': 'Terms of Service',
    'rti.act': 'RTI Act',
    'accessibility': 'Accessibility',
    'copyright': '© 2024 Government of Tamil Nadu. All rights reserved. | Last updated: December 2024',
    'official.website': 'This is the official website of Tamil Nadu Police',
    
    // Report Missing Page
    'back.to.dashboard': 'Back to Dashboard',
    'report.missing.person': 'Report Missing Person',
    'provide.detailed.info': 'Provide detailed information to help find your loved one',
    'important.notice': 'Important Notice',
    'first.72.hours': 'The first 72 hours are critical. Providing quick and accurate information will help find your loved one.',
    'missing.person.report': 'Missing Person Report',
    'provide.comprehensive.info': 'Provide as much detailed information as possible to assist in search operations. This information will be shared with law enforcement.',
    'personal.information': 'Personal Information',
    'full.name': 'Full Name',
    'enter.full.name': 'Enter full name',
    'age': 'Age',
    'enter.age': 'Enter age',
    'gender': 'Gender',
    'select.gender': 'Select gender',
    'male': 'Male',
    'female': 'Female',
    'other': 'Other',
    'photos': 'Photos',
    'last.known.location': 'Last Known Location',
    'additional.information': 'Additional Information',
    'health.conditions': 'Health Conditions',
    'health.conditions.placeholder': 'Any medical conditions, medications, or relevant health issues...',
    'additional.description': 'Additional Description',
    'description.placeholder': 'Physical description, last worn clothing, circumstances of disappearance, and other relevant details...',
    'cancel': 'Cancel',
    'submit.report': 'Submit Report',
    'submitting': 'Submitting...',
    'auth.required': 'Authentication Required',
    'login.to.submit': 'Please log in to submit a report.',
    'required.fields': 'Required Fields',
    'fill.all.required': 'Please fill in all required fields.',
    'report.submitted.success': 'Report Submitted Successfully',
    'report.registered': 'Your missing person report has been registered and law enforcement has been notified.',
    'submission.failed': 'Submission Failed',
    'could.not.submit': 'Could not submit report. Please try again.',
    
    // Login Page
    'welcome.back': 'Welcome Back',
    'enter.details': 'Enter your details to access your dashboard',
    'email.address': 'Email Address',
    'enter.email': 'Enter your email',
    'password': 'Password',
    'enter.password': 'Enter your password',
    'login': 'Login',
    'logging.in': 'Logging in...',
    'no.account': 'Don\'t have an account?',
    'create.new.account': 'Create New Account',
    'demo.credentials': 'Demo Credentials:',
    'citizen': 'Citizen',
    'login.failed': 'Login Failed',
    'login.successful': 'Login Successful',
    'welcome.to.relink': 'Welcome to ReLink'
  },
  ta: {
    // Header
    'govt.india': 'இந்திய அரசு',
    'govt.tn': 'தமிழ்நாடு அரசு',
    'skip.content': 'முக்கிய உள்ளடக்கத்திற்கு செல்லவும்',
    'screen.reader': 'திரை வாசிப்பு அணுகல்',
    'citizen.login': 'குடிமக்கள் உள்நுழைவு',
    'register.report': 'பதிவு / புகார்',
    'govt.initiative': 'அரசு முயற்சி',
    'missing.portal': 'தமிழ்நாடு காணாமல்போனோர் போர்ட்டல்',
    'portal.description': 'தமிழ்நாடு காவல்துறையின் அதிகாரபூர்வ போர்ட்டல் - காணாமல்போனோரை அறிவிக்கவும் கண்காணிக்கவும். பாதுகாப்பான, அரசு சரிபார்க்கப்பட்ட சேனல்கள் மூலம்.',
    'report.missing': 'காணாமல்போனவரை அறிவிக்கவும்',
    'track.case': 'ஏற்கனவே உள்ள வழக்கைக் கண்காணிக்கவும்',
    'statistics.title': 'இந்தியாவில் காணாமல்போனோர் புள்ளிவிவரங்கள்',
    'stat.total': '2.3 லட்சம்',
    'stat.total.desc': '2023ல் இந்தியாவில் காணாமல்போனோர்',
    'stat.success': '85%',
    'stat.success.desc': 'வெற்றிகரமாக மீட்கப்பட்ட விகிதம்',
    'stat.time': '72 மணி',
    'stat.time.desc': 'முதல் 72 மணிநேரம் மிக முக்கியம்',
    'stat.support': '24/7',
    'stat.support.desc': 'காவல்துறை உதவி கிடைக்கும்',
    'services.title': 'எங்கள் சேவைகள்',
    'service.report.title': 'காணாமல்போனவரை அறிவிக்கவும்',
    'service.report.desc': 'எங்கள் பாதுகாப்பான அரசு போர்ட்டல் மூலம் விரிவான காணாமல்போனோர் அறிக்கையை தாக்கல் செய்யுங்கள். அனைத்து அறிக்கைகளும் தமிழ்நாடு காவல்துறையுடன் நேரடியாக ஒருங்கிணைக்கப்பட்டுள்ளன.',
    'service.track.title': 'விசாரணையைக் கண்காணிக்கவும்',
    'service.track.desc': 'தமிழ்நாடு காவல்துறை முழுவதும் உள்ள விசாரணை அதிகாரிகளின் நிகழ்நேர புதுப்பிப்புகள் மூலம் உங்கள் வழக்கின் முன்னேற்றத்தைக் கண்காணிக்கவும்.',
    'service.police.title': 'காவல்துறை ஒருங்கிணைப்பு',
    'service.police.desc': 'தமிழ்நாடு காவல்துறை பிரிவுகளுடன் நேரடி ஒருங்கிணைப்பு, வேகமான மற்றும் திறமையான தேடல் நடவடிக்கைகளுக்கு தொழில்நுட்பத்தைப் பயன்படுத்துதல்.',
    'emergency.title': 'அவசர தொடர்பு',
    'emergency.desc': 'உடனடி உதவிக்கு, தமிழ்நாடு காவல்துறை அவசர சேவைகளைத் தொடர்பு கொள்ளவும்',
    'emergency.label': 'அவசரநிலை',
    'control.room': 'கட்டுப்பாட்டு அறை',
    'email.support': 'மின்னஞ்சல் ஆதரவு',
    'official.portal': 'அதிகாரபூர்வ காணாமல்போனோர் போர்ட்டல்',
    'quick.links': 'விரைவு இணைப்புகள்',
    'tn.police': 'தமிழ்நாடு காவல்துறை',
    'govt.portal': 'அரசு போர்ட்டல்',
    'emergency.services': 'அவசர சேவைகள்',
    'citizen.services': 'குடிமக்கள் சேவைகள்',
    'contact': 'தொடர்பு',
    'legal': 'சட்டப்பூர்வ',
    'privacy.policy': 'தனியுரிமை கொள்கை',
    'terms.service': 'சேவை விதிமுறைகள்',
    'rti.act': 'RTI சட்டம்',
    'accessibility': 'அணுகல்தன்மை',
    'copyright': '© 2024 தமிழ்நாடு அரசு. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. | கடைசியாக புதுப்பிக்கப்பட்டது: டிசம்பர் 2024',
    'official.website': 'இது தமிழ்நாடு காவல்துறையின் அதிகாரபூர்வ வலைத்தளம்'
  },
  hi: {
    // Header
    'govt.india': 'भारत सरकार',
    'govt.tn': 'तमिलनाडु सरकार',
    'skip.content': 'मुख्य सामग्री पर जाएं',
    'screen.reader': 'स्क्रीन रीडर एक्सेस',
    'citizen.login': 'नागरिक लॉगिन',
    'register.report': 'पंजीकरण / रिपोर्ट',
    'govt.initiative': 'सरकारी पहल',
    'missing.portal': 'तमिलनाडु लापता व्यक्ति पोर्टल',
    'portal.description': 'तमिलनाडु पुलिस विभाग का आधिकारिक पोर्टल - लापता व्यक्तियों की रिपोर्ट करने और ट्रैकिंग के लिए। सुरक्षित, सरकार द्वारा सत्यापित चैनलों के माध्यम से।',
    'report.missing': 'लापता व्यक्ति की रिपोर्ट करें',
    'track.case': 'मौजूदा केस को ट्रैक करें',
    'statistics.title': 'भारत में लापता व्यक्तियों के आंकड़े',
    'stat.total': '2.3 लाख',
    'stat.total.desc': '2023 में भारत में लापता व्यक्ति रिपोर्ट किए गए',
    'stat.success': '85%',
    'stat.success.desc': 'सफलतापूर्वक बरामद दर',
    'stat.time': '72 घंटे',
    'stat.time.desc': 'पहले 72 घंटे बहुत महत्वपूर्ण हैं',
    'stat.support': '24/7',
    'stat.support.desc': 'पुलिस सहायता उपलब्ध',
    'services.title': 'हमारी सेवाएं',
    'service.report.title': 'लापता व्यक्ति की रिपोर्ट करें',
    'service.report.desc': 'हमारे सुरक्षित सरकारी पोर्टल के माध्यम से व्यापक लापता व्यक्ति रिपोर्ट दाखिल करें। सभी रिपोर्ट सीधे तमिलनाडु पुलिस सिस्टम के साथ एकीकृत हैं।',
    'service.track.title': 'जांच को ट्रैक करें',
    'service.track.desc': 'तमिलनाडु पुलिस भर के जांच अधिकारियों से रियल-टाइम अपडेट के साथ अपने केस की प्रगति की निगरानी करें।',
    'service.police.title': 'पुलिस समन्वय',
    'service.police.desc': 'तमिलनाडु पुलिस इकाइयों के साथ प्रत्यक्ष समन्वय, तेज़ और कुशल खोज संचालन के लिए प्रौद्योगिकी का लाभ उठाना।',
    'emergency.title': 'आपातकालीन संपर्क',
    'emergency.desc': 'तत्काल सहायता के लिए, तमिलनाडु पुलिस आपातकालीन सेवाओं से संपर्क करें',
    'emergency.label': 'आपातकाल',
    'control.room': 'नियंत्रण कक्ष',
    'email.support': 'ईमेल समर्थन',
    'official.portal': 'आधिकारिक लापता व्यक्ति पोर्टल',
    'quick.links': 'त्वरित लिंक',
    'tn.police': 'तमिलनाडु पुलिस',
    'govt.portal': 'सरकारी पोर्टल',
    'emergency.services': 'आपातकालीन सेवाएं',
    'citizen.services': 'नागरिक सेवाएं',
    'contact': 'संपर्क',
    'legal': 'कानूनी',
    'privacy.policy': 'गोपनीयता नीति',
    'terms.service': 'सेवा की शर्तें',
    'rti.act': 'आरटीआई अधिनियम',
    'accessibility': 'पहुंच',
    'copyright': '© 2024 तमिलनाडु सरकार। सभी अधिकार सुरक्षित। | अंतिम अपडेट: दिसंबर 2024',
    'official.website': 'यह तमिलनाडु पुलिस की आधिकारिक वेबसाइट है'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
