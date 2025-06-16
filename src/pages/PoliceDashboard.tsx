
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Search, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliceDashboard = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  // Mock data - in real app this would come from Supabase
  const missingPersons = [
    {
      id: "1",
      name: "Sarah Johnson",
      age: 24,
      gender: "female",
      status: "missing",
      lastSeen: "Downtown Portland, OR",
      reportedDate: "2024-01-15",
      reporter: "Emily Johnson (Sister)",
      photo: "/placeholder.svg",
      healthConditions: "Diabetes, requires medication"
    },
    {
      id: "2", 
      name: "Michael Chen",
      age: 16,
      gender: "male",
      status: "found",
      lastSeen: "Central Park, NYC",
      reportedDate: "2024-01-10",
      reporter: "Lisa Chen (Mother)",
      photo: "/placeholder.svg",
      healthConditions: "None reported"
    },
    {
      id: "3",
      name: "Anna Williams",
      age: 34,
      gender: "female", 
      status: "missing",
      lastSeen: "Seattle, WA",
      reportedDate: "2024-01-12",
      reporter: "David Williams (Husband)",
      photo: "/placeholder.svg",
      healthConditions: "Bipolar disorder"
    }
  ];

  const filteredPersons = missingPersons.filter(person => {
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         person.lastSeen.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || person.status === statusFilter;
    const matchesGender = genderFilter === "all" || person.gender === genderFilter;
    
    return matchesSearch && matchesStatus && matchesGender;
  });

  const missingCount = missingPersons.filter(p => p.status === "missing").length;
  const foundCount = missingPersons.filter(p => p.status === "found").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-teal-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Police Dashboard</h1>
                <p className="text-sm text-gray-600">Law Enforcement Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => navigate('/scan-person')}>
                Scan Person
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
          <Card className="border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Cases</CardTitle>
              <Search className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{missingCount}</div>
              <p className="text-xs text-gray-500">Currently missing</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Resolved</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{foundCount}</div>
              <p className="text-xs text-gray-500">Successfully found</p>
            </CardContent>
          </Card>

          <Card className="border-teal-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
              <Users className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{missingPersons.length}</div>
              <p className="text-xs text-gray-500">All time reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Missing Persons List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Missing Persons Database</CardTitle>
                <CardDescription>Search and manage missing person cases</CardDescription>
              </div>
              <Button 
                onClick={() => navigate('/scan-person')}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
              >
                Scan Person
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                  <SelectItem value="found">Found</SelectItem>
                </SelectContent>
              </Select>
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPersons.map((person) => (
                <div key={person.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={person.photo} 
                      alt={person.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{person.name}</h3>
                        <Badge 
                          variant={person.status === "found" ? "default" : "destructive"}
                          className={person.status === "found" ? "bg-green-100 text-green-700 hover:bg-green-100" : ""}
                        >
                          {person.status === "found" ? "Found" : "Missing"}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Age: {person.age} • Gender: {person.gender} • Last seen: {person.lastSeen}
                      </p>
                      <p className="text-xs text-gray-500">
                        Reported by: {person.reporter} • Date: {person.reportedDate}
                      </p>
                      {person.healthConditions !== "None reported" && (
                        <p className="text-xs text-red-600 mt-1">
                          Health: {person.healthConditions}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/case/${person.id}`)}>
                      View Case
                    </Button>
                    {person.status === "missing" && (
                      <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                        Mark Found
                      </Button>
                    )}
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

export default PoliceDashboard;
