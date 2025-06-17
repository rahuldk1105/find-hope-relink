
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, AlertCircle, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const PoliceLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // Specialized police credentials
  const POLICE_CREDENTIALS = {
    email: "tnpolice.admin@gov.tn.in",
    password: "TamilNadu@Police2024"
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if credentials match the specialized police access
      if (formData.email === POLICE_CREDENTIALS.email && formData.password === POLICE_CREDENTIALS.password) {
        // Store police session in localStorage for demo purposes
        localStorage.setItem('police_authenticated', 'true');
        localStorage.setItem('police_session', JSON.stringify({
          email: formData.email,
          role: 'police',
          loginTime: new Date().toISOString()
        }));

        toast({
          title: "Police Access Authorized",
          description: "Welcome to Tamil Nadu Police Control Room"
        });
        
        navigate('/police-dashboard');
      } else {
        toast({
          title: "Access Denied",
          description: "Invalid police credentials. Contact IT Department for access.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "System Error",
        description: "Please contact Technical Support: 044-28447100",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-red-200 shadow-2xl">
        <CardHeader className="space-y-1 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-gray-800">Tamil Nadu Police</CardTitle>
          <CardTitle className="text-xl text-center text-orange-700">Authorized Personnel Only</CardTitle>
          <CardDescription className="text-center text-gray-600">
            तमिलनाडु पुलिस नियंत्रण कक्ष | Control Room Access
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Officer ID / Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="officer.id@gov.tn.in"
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center">
                <Lock className="w-4 h-4 mr-2" />
                Secure Password
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder="Enter authorized password"
                required
                className="border-orange-200 focus:border-orange-400"
              />
            </div>

            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Access Control Room"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">⚠️ RESTRICTED ACCESS SYSTEM</p>
                <p className="mt-1">This portal is exclusively for Tamil Nadu Police Department officers. Unauthorized access attempts are logged and may result in legal action under IT Act 2000.</p>
                <p className="mt-2 font-medium">For technical support: Call 044-28447100</p>
              </div>
            </div>
          </div>

          {/* Demo credentials for development */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-800 mb-1">DEMO ACCESS (Development Only):</p>
            <div className="text-xs text-blue-700">
              <p>Email: tnpolice.admin@gov.tn.in</p>
              <p>Password: TamilNadu@Police2024</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoliceLogin;
