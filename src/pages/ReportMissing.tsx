
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
import { supabase } from "@/integrations/supabase/client";
import LocationPicker from "@/components/LocationPicker";
import PhotoUpload from "@/components/PhotoUpload";

type GenderType = "male" | "female" | "other";
type StatusType = "missing" | "found";

const ReportMissing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
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

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('missing-person-photos')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "அங்கீகாரம் தேவை | Authentication Required",
        description: "அறிக்கை சமர்பிக்க உள்நுழையுங்கள்.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.name || !formData.age || !formData.gender || !formData.lastSeenLocation.address) {
      toast({
        title: "தேவையான புலங்கள் | Required Fields",
        description: "அனைத்து அவசியமான புலங்களையும் நிரப்பவும்.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Upload photos first
      const photoUrls = formData.photos.length > 0 ? await uploadPhotos(formData.photos) : [];
      const primaryPhotoUrl = photoUrls[0] || null;

      // Insert missing person record
      const { data, error } = await supabase
        .from('missing_persons')
        .insert({
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
        })
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "அறிக்கை வெற்றிகரமாக சமர்பிக்கப்பட்டது | Report Submitted Successfully",
        description: "உங்கள் காணாமல்போனோர் அறிக்கை பதிவு செய்யப்பட்டு சட்ட அமலாக்கத்திற்கு அறிவிக்கப்பட்டது.",
      });
      
      navigate('/relative-dashboard');
    } catch (error: any) {
      console.error('Error submitting report:', error);
      toast({
        title: "சமர்பிப்பு தோல்வி | Submission Failed",
        description: error.message || "அறிக்கை சமர்பிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
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
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => navigate('/relative-dashboard')} className="hover:bg-orange-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              டாஷ்போர்டுக்கு திரும்பு
            </Button>
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">காணாமல்போனவரை அறிவிக்கவும்</h1>
              <p className="text-sm text-gray-600">உங்கள் அன்புக்குரியவரைக் கண்டுபிடிக்க விரிவான தகவல்களை வழங்கவும்</p>
            </div>
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
                <h3 className="font-semibold text-orange-800 mb-1">முக்கியமான அறிவிப்பு</h3>
                <p className="text-sm text-orange-700">
                  முதல் 72 மணிநேரம் மிக முக்கியம். விரைவாக மற்றும் துல்லியமான தகவல்களை வழங்குவது 
                  உங்கள் அன்புக்குரியவரைக் கண்டுபிடிக்க உதவும்.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-orange-200">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-red-100">
            <CardTitle className="text-2xl text-orange-700">காணாமல்போனோர் அறிக்கை</CardTitle>
            <CardDescription>
              தேடல் நடவடிக்கைகளில் உதவ முடிந்தவரை விரிவான தகவல்களை வழங்கவும். 
              இந்த தகவல் சட்ட அமலாக்கத்துடன் பகிரப்படும்.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-orange-600" />
                  தனிப்பட்ட தகவல்கள்
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700">முழுப் பெயர் *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="முழுப் பெயரை உள்ளிடுங்கள்"
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-gray-700">வயது *</Label>
                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="வயதை உள்ளிடுங்கள்"
                      required
                      className="border-orange-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-gray-700">பாலினம் *</Label>
                  <Select value={formData.gender} onValueChange={(value: GenderType) => handleInputChange("gender", value)}>
                    <SelectTrigger className="border-orange-200 focus:border-orange-400">
                      <SelectValue placeholder="பாலினத்தை தேர்ந்தெடுக்கவும்" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">ஆண்</SelectItem>
                      <SelectItem value="female">பெண்</SelectItem>
                      <SelectItem value="other">மற்றவை</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">புகைப்படங்கள்</h3>
                <PhotoUpload 
                  photos={formData.photos}
                  onPhotosChange={(photos) => setFormData(prev => ({ ...prev, photos }))}
                />
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">கடைசியாக தெரிந்த இடம்</h3>
                <LocationPicker
                  value={formData.lastSeenLocation}
                  onLocationChange={(location) => setFormData(prev => ({ ...prev, lastSeenLocation: location }))}
                />
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b-2 border-orange-200 pb-2">கூடுதல் தகவல்கள்</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="health" className="text-gray-700">உடல்நிலை விவரங்கள்</Label>
                  <Textarea
                    id="health"
                    value={formData.healthConditions}
                    onChange={(e) => handleInputChange("healthConditions", e.target.value)}
                    placeholder="ஏதேனும் மருத்துவ நிலைமைகள், மருந்துகள், அல்லது தொடர்புடைய உடல்நிலை பிரச்சினைகள்..."
                    className="min-h-20 border-orange-200 focus:border-orange-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700">கூடுதல் விவரம்</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="உடல் அமைப்பு, கடைசியாக அணிந்திருந்த உடை, காணாமல்போன சூழ்நிலைகள், மற்றும் பிற தொடர்புடைய விவரங்கள்..."
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
                  ரத்து செய்
                </Button>
                <Button 
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 px-8"
                >
                  {loading ? "சமர்பிக்கிறது..." : "அறிக்கை சமர்பிக்கவும்"}
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
