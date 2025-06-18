
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "உள்நுழைவு தோல்வி | Login Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "உள்நுழைவு வெற்றி | Login Successful",
        description: "ReLink உக்கு வருக"
      });
      
      navigate('/relative-dashboard');
    } catch (error: any) {
      toast({
        title: "உள்நுழைவு தோல்வி | Login Failed",
        description: "எதிர்பாராத பிழை ஏற்பட்டது",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            முகப்புக்கு திரும்பு
          </Button>
          
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              ReLink
            </h1>
          </div>
          <p className="text-gray-600">
            உங்கள் குடிமக்கள் கணக்கில் உள்நுழையுங்கள்
          </p>
        </div>

        <Card className="border-orange-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-800">மீண்டும் வருக</CardTitle>
            <CardDescription>
              உங்கள் டாஷ்போர்டை அணுக உங்கள் விவரங்களை உள்ளிடுங்கள்
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">மின்னஞ்சல் முகவரி</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="உங்கள் மின்னஞ்சலை உள்ளிடுங்கள்"
                  required
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">கடவுச்சொல்</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="உங்கள் கடவுச்சொல்லை உள்ளிடுங்கள்"
                  required
                  className="border-orange-200 focus:border-orange-400"
                />
              </div>

              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
                disabled={loading}
              >
                {loading ? "உள்நுழைகிறது..." : "உள்நுழைவு"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                கணக்கு இல்லையா?
              </p>
              <Button 
                variant="outline" 
                onClick={() => navigate('/role-select')}
                className="w-full border-orange-200 hover:bg-orange-50"
              >
                புதிய கணக்கை உருவாக்கு
              </Button>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm font-medium text-orange-800 mb-2">டெமோ நற்சான்றிதழ்கள்:</p>
              <div className="space-y-1 text-xs text-orange-700">
                <div><Badge variant="outline" className="text-xs mr-2 border-orange-300">குடிமகன்</Badge>family@demo.com</div>
                <p className="text-orange-600">கடவுச்சொல்: demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
