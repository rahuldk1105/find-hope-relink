
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Download, FileText, Image, Table } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MissingPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  last_seen_location: string;
  status: string;
  created_at: string;
}

interface ExportControlsProps {
  missingPersons: MissingPerson[];
}

const ExportControls = ({ missingPersons }: ExportControlsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const headers = ['Name', 'Age', 'Gender', 'Status', 'Last Seen Location', 'Date Reported'];
      const csvContent = [
        headers.join(','),
        ...missingPersons.map(person => [
          `"${person.name}"`,
          person.age,
          person.gender,
          person.status,
          `"${person.last_seen_location}"`,
          new Date(person.created_at).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `missing-persons-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "CSV report has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the CSV file",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    setIsExporting(true);
    
    // Mock PDF generation
    setTimeout(() => {
      toast({
        title: "PDF Export",
        description: "PDF generation feature coming soon. Integrate with jsPDF library."
      });
      setIsExporting(false);
    }, 1000);
  };

  const captureMapSnapshot = () => {
    setIsExporting(true);
    
    // Mock map snapshot
    setTimeout(() => {
      toast({
        title: "Map Snapshot",
        description: "Map snapshot feature coming soon. Integrate with map library."
      });
      setIsExporting(false);
    }, 1000);
  };

  const generateAnalyticsReport = () => {
    setIsExporting(true);
    
    try {
      const reportData = {
        summary: {
          totalCases: missingPersons.length,
          activeCases: missingPersons.filter(p => p.status === 'missing').length,
          foundCases: missingPersons.filter(p => p.status === 'found').length,
          generatedAt: new Date().toISOString()
        },
        cases: missingPersons.map(person => ({
          name: person.name,
          age: person.age,
          gender: person.gender,
          status: person.status,
          location: person.last_seen_location,
          reportedDate: person.created_at
        }))
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: "Analytics report has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the report",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full lg:w-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <Download className="w-4 h-4" />
          <span>Export & Reports</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isExporting}>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={exportToCSV}>
                <Table className="w-4 h-4 mr-2" />
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={generateAnalyticsReport}>
                <FileText className="w-4 h-4 mr-2" />
                Analytics Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm" onClick={captureMapSnapshot} disabled={isExporting}>
            <Image className="w-4 h-4 mr-2" />
            Map Snapshot
          </Button>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <p>Available formats: CSV, PDF, JSON</p>
          <p>{missingPersons.length} records ready for export</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExportControls;
