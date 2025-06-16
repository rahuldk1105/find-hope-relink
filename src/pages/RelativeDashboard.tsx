
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Search, ArrowUp, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RelativeDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app this would come from Supabase
  const myReports = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 24,
      status: "missing",
      lastSeen: "Downtown Portland",
      reportedDate: "2024-01-15",
      photo: "/placeholder.svg"
    },
    {
      id: "2", 
      name: "Michael Chen",
      age: 16,
      status: "found",
      lastSeen: "Central Park",
      reportedDate: "2024-01-10",
      photo: "/placeholder.svg"
    }
  ];

  const filteredReports = myReports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ReLink Dashboard</h1>
                <p className="text-sm text-gray-600">Family Member Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => navigate('/report-missing')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Report Missing Person
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">2</div>
              <p className="text-xs text-gray-500">Missing person reports filed</p>
            </CardContent>
          </Card>

          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
              <Search className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">1</div>
              <p className="text-xs text-gray-500">Currently being investigated</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">1</div>
              <p className="text-xs text-gray-500">Successfully reunited</p>
            </CardContent>
          </Card>
        </div>

        {/* My Reports Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">My Reports</CardTitle>
                <CardDescription>Manage your missing person reports</CardDescription>
              </div>
              <Button 
                onClick={() => navigate('/report-missing')}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                New Report
              </Button>
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={report.photo} 
                      alt={report.name} 
                      className="w-12 h-12 rounded-full object-cover bg-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{report.name}</h3>
                      <p className="text-sm text-gray-600">Age: {report.age} • Last seen: {report.lastSeen}</p>
                      <p className="text-xs text-gray-500">Reported: {report.reportedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={report.status === "found" ? "default" : "destructive"}
                      className={report.status === "found" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                    >
                      {report.status === "found" ? "Found" : "Missing"}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/report/${report.id}`)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelativeDashboard;
