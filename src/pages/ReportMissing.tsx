
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, User, Shield, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import LocationPicker from "@/components/LocationPicker";
import PhotoUpload from "@/components/PhotoUpload";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { FacialRecognitionStatus } from "@/components/FacialRecognitionStatus";

type GenderType = "male" | "female" | "other";
type StatusType = "missing" | "found";

const ReportMissing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "" as GenderType,
    healthConditions: "",
    lastSeenLocation: { 
      address: "", 
      lat: undefined as number | undefined, 
      lng: undefined as number | undefined 
    },
    description: "",
    photos: [] as File[]
  });
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [missingPersonId, setMissingPersonId] = useState<string | null>(null);
  const [showFacialRecognition, setShowFacialRecognition] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadPhotos = async (photos: File[]): Promise<string[]> => {
    const uploadPromises = photos.map(async (photo, index) => {
      const fileExt = photo.name.split('.').pop();
      const fileName = `${user?.id}-${Date.now()}-${index}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('missing-person-photos')
        .upload(fileName, photo);

      if (error) {
        console.error('Photo upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('missing-person-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submission started', { user, formData });
    
    if (!user) {
      toast({
        title: t('auth.required'),
        description: t('login.to.submit'),
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.age || !formData.gender || !formData.lastSeenLocation.address) {
      toast({
        title: t('required.fields'),
        description: t('fill.all.required'),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Starting photo upload...');
      // Upload photos first
      const photoUrls = formData.photos.length > 0 ? await uploadPhotos(formData.photos) : [];
      const primaryPhotoUrl = photoUrls[0] || null;
      console.log('Photos uploaded:', photoUrls);

      // Insert missing person record
      console.log('Inserting missing person record...');
      const insertData = {
        reporter_id: user.id,
        name: formData.name.trim(),
        age: parseInt(formData.age),
        gender: formData.gender as GenderType,
        health_conditions: formData.healthConditions.trim() || null,
        last_seen_location: formData.lastSeenLocation.address.trim(),
        last_seen_lat: formData.lastSeenLocation.lat,
        last_seen_lng: formData.lastSeenLocation.lng,
        photo_url: primaryPhotoUrl,
        status: 'missing' as StatusType
      };
      
      console.log('Data to insert:', insertData);

      const { data, error } = await supabase
        .from('missing_persons')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully inserted:', data);

      // Set the missing person ID and photo URL for facial recognition
      setMissingPersonId(data.id);
      if (primaryPhotoUrl) {
        setUploadedPhotoUrl(primaryPhotoUrl);
        setShowFacialRecognition(true);
      }

      toast({
        title: t('report.submitted.success'),
        description: t('report.registered'),
      });
      
      // Don't navigate immediately if facial recognition is starting
      if (!primaryPhotoUrl) {
        navigate('/relative-dashboard');
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: t('submission.failed'),
        description: error.message || t('could.not.submit'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b-4 border-orange-500 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/relative-dashboard')} className="hover:bg-orange-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('back.to.dashboard')}
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{t('report.missing.person')}</h1>
                <p className="text-sm text-gray-600">{t('provide.detailed.info')}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Important Notice */}
        <Card className="mb-6 border-orange-300 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-1">{t('important.notice')}</h3>
                <p className="text-sm text-orange-700">
                  {t('first.72.hours')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
            <CardTitle className="text-2xl text-orange-700">{t('missing.person.report')}</CardTitle>
            <CardDescription>
              {t('provide.comprehensive.info')}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-600" />
                  {t('personal.information')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">{t('full.name')} *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder={t('enter.full.name')}
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                    
                    {/* Facial Recognition Status - shown after form submission */}
                    {showFacialRecognition && missingPersonId && uploadedPhotoUrl && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-blue-800 mb-2">Facial Recognition Analysis</p>
                        <FacialRecognitionStatus
                          missingPersonId={missingPersonId}
                          imageUrl={uploadedPhotoUrl}
                          onComplete={() => {
                            setShowFacialRecognition(false);
                            navigate('/relative-dashboard');
                          }}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-700">{t('age')} *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder={t('enter.age')}
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700">{t('gender')} *</Label>
                  <Select value={formData.gender} onValueChange={(value: GenderType) => handleInputChange("gender", value)}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <SelectValue placeholder={t('select.gender')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t('male')}</SelectItem>
                      <SelectItem value="female">{t('female')}</SelectItem>
                      <SelectItem value="other">{t('other')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">{t('photos')}</h3>
                <PhotoUpload 
                  photos={formData.photos}
                  onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
                />
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">{t('last.known.location')}</h3>
                <LocationPicker
                  value={formData.lastSeenLocation}
                  onLocationChange={(location) => setFormData(prev => ({ ...prev, lastSeenLocation: location }))}
                />
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">{t('additional.information')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="health" className="text-gray-700">{t('health.conditions')}</Label>
                  <Textarea
                    id="health"
                    value={formData.healthConditions}
                    onChange={(e) => handleInputChange("healthConditions", e.target.value)}
                    placeholder={t('health.conditions.placeholder')}
                    className="min-h-20 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">{t('additional.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder={t('description.placeholder')}
                    className="min-h-32 border-orange-200 focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-4 pt-6 border-t-2 border-orange-200">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/relative-dashboard')}
                  className="border-orange-300 hover:bg-orange-50"
                >
                  {t('cancel')}
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8"
                >
                  {loading ? t('submitting') : t('submit.report')}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportMissing;
