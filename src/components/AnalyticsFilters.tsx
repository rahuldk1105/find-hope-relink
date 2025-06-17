
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterState {
  ageRange: [number, number];
  gender: string;
  status: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

interface AnalyticsFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const AnalyticsFilters = ({ filters, onFiltersChange }: AnalyticsFiltersProps) => {
  const updateFilters = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({
      ageRange: [0, 100],
      gender: "all",
      status: "all",
      dateRange: { from: null, to: null }
    });
  };

  const hasActiveFilters = 
    filters.ageRange[0] !== 0 || 
    filters.ageRange[1] !== 100 || 
    filters.gender !== "all" || 
    filters.status !== "all" || 
    filters.dateRange.from !== null || 
    filters.dateRange.to !== null;

  return (
    <Card className="w-full lg:w-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters}>
              <X className="w-4 h-4 mr-1" />
              Reset
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Age Range Slider */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Age Range</label>
            <div className="px-2">
              <Slider
                value={filters.ageRange}
                onValueChange={(value) => updateFilters('ageRange', value as [number, number])}
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{filters.ageRange[0]}</span>
                <span>{filters.ageRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select value={filters.gender} onValueChange={(value) => updateFilters('gender', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value) => updateFilters('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="missing">Missing</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateRange.from ? (
                    filters.dateRange.to ? (
                      <>
                        {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                        {format(filters.dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(filters.dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={filters.dateRange.from || undefined}
                  selected={{
                    from: filters.dateRange.from || undefined,
                    to: filters.dateRange.to || undefined,
                  }}
                  onSelect={(range) => 
                    updateFilters('dateRange', {
                      from: range?.from || null,
                      to: range?.to || null
                    })
                  }
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {(filters.ageRange[0] !== 0 || filters.ageRange[1] !== 100) && (
              <Badge variant="secondary">
                Age: {filters.ageRange[0]}-{filters.ageRange[1]}
              </Badge>
            )}
            {filters.gender !== "all" && (
              <Badge variant="secondary">
                Gender: {filters.gender}
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge variant="secondary">
                Status: {filters.status}
              </Badge>
            )}
            {filters.dateRange.from && (
              <Badge variant="secondary">
                From: {format(filters.dateRange.from, "MMM dd, yyyy")}
              </Badge>
            )}
            {filters.dateRange.to && (
              <Badge variant="secondary">
                To: {format(filters.dateRange.to, "MMM dd, yyyy")}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilters;
