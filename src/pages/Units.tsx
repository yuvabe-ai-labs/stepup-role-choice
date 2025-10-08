import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { useInfiniteUnits } from "@/hooks/useInfiniteUnits";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatDistanceToNow } from "date-fns";

const Units = () => {
  const [filters, setFilters] = useState({
    units: [] as string[],
    industries: [] as string[],
    departments: [] as string[],
    isAurovillian: null as boolean | null,
    postedDate: "",
    interestAreas: [] as string[],
  });

  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [showMoreUnits, setShowMoreUnits] = useState(false);
  const [showMoreIndustries, setShowMoreIndustries] = useState(false);
  const [showMoreDepartments, setShowMoreDepartments] = useState(false);
  const [showMoreInterests, setShowMoreInterests] = useState(false);

  const { units, loading, error, hasMore, loadMore } = useInfiniteUnits(filters);
  const { observerTarget } = useInfiniteScroll({ loading, hasMore, onLoadMore: loadMore });

  // Sample data for filters - in production, these should come from API
  const unitNames = [
    "Yuvabe",
    "Language Lab",
    "Yuvabe Education",
    "YouthLink",
    "Upasana",
    "Auromics Trust",
    "Tapasya",
    "Marc's Cafe",
  ];

  const industries = [
    "IT Services & Consulting",
    "Software Products",
    "Education & Training",
    "Engineering & Construction",
    "Healthcare",
    "Hospitality",
  ];

  const departments = [
    "Engineering - Software & QA",
    "Sales & Business Development",
    "UI/UX Design",
    "Digital Marketing",
    "Content Writing",
    "Product Management",
  ];

  const interestAreas = [
    "Air conditioning",
    "Assisted living",
    "Disability Access",
    "Cable Ready",
    "Controlled access",
    "Available now",
    "College",
    "Corporate",
    "Elevator",
    "High speed internet",
    "Garage",
  ];

  const postedDates = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const toggleFilter = (category: "units" | "industries" | "departments" | "interestAreas", value: string) => {
    console.log("[Units] Toggle filter:", category, value);
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const setPostedDateFilter = (value: string) => {
    console.log("[Units] Set posted date filter:", value);
    setFilters((prev) => ({ ...prev, postedDate: value }));
  };

  const toggleAuroville = (checked: boolean) => {
    console.log("[Units] Toggle Auroville filter:", checked);
    setFilters((prev) => ({ ...prev, isAurovillian: checked ? true : null }));
  };

  const resetFilters = () => {
    console.log("[Units] Reset all filters");
    setFilters({
      units: [],
      industries: [],
      departments: [],
      isAurovillian: null,
      postedDate: "",
      interestAreas: [],
    });
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  const applyFilters = () => {
    console.log("[Units] Apply filters clicked", filters);
    // Filters are already applied through the filters state
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex gap-6 p-6 max-w-[1400px] mx-auto">
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-card border rounded-3xl p-6 h-fit sticky top-6">
          <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Filters</h2>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 text-sm font-medium h-auto p-0"
                onClick={resetFilters}
              >
                Reset all
              </Button>
            </div>

            {/* Units Filter */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Units</h3>
              <div className="space-y-3">
                {unitNames.slice(0, showMoreUnits ? unitNames.length : 4).map((unit) => (
                  <div key={unit} className="flex items-center space-x-2">
                    <Checkbox
                      id={`unit-${unit}`}
                      checked={filters.units.includes(unit)}
                      onCheckedChange={() => toggleFilter("units", unit)}
                    />
                    <label htmlFor={`unit-${unit}`} className="text-sm cursor-pointer">
                      {unit}
                    </label>
                  </div>
                ))}
                {unitNames.length > 4 && (
                  <Button
                    variant="ghost"
                    className="text-primary text-xs p-0 h-auto font-medium"
                    onClick={() => setShowMoreUnits(!showMoreUnits)}
                  >
                    {showMoreUnits ? "Show Less" : `+${unitNames.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Industry Filter */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Industry</h3>
              <div className="space-y-3">
                {industries.slice(0, showMoreIndustries ? industries.length : 4).map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={filters.industries.includes(industry)}
                      onCheckedChange={() => toggleFilter("industries", industry)}
                    />
                    <label htmlFor={`industry-${industry}`} className="text-sm cursor-pointer">
                      {industry}
                    </label>
                  </div>
                ))}
                {industries.length > 4 && (
                  <Button
                    variant="ghost"
                    className="text-primary text-xs p-0 h-auto font-medium"
                    onClick={() => setShowMoreIndustries(!showMoreIndustries)}
                  >
                    {showMoreIndustries ? "Show Less" : `+${industries.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Department Filter */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Department</h3>
              <div className="space-y-3">
                {departments.slice(0, showMoreDepartments ? departments.length : 4).map((dept) => (
                  <div key={dept} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dept-${dept}`}
                      checked={filters.departments.includes(dept)}
                      onCheckedChange={() => toggleFilter("departments", dept)}
                    />
                    <label htmlFor={`dept-${dept}`} className="text-sm cursor-pointer">
                      {dept}
                    </label>
                  </div>
                ))}
                {departments.length > 4 && (
                  <Button
                    variant="ghost"
                    className="text-primary text-xs p-0 h-auto font-medium"
                    onClick={() => setShowMoreDepartments(!showMoreDepartments)}
                  >
                    {showMoreDepartments ? "Show Less" : `+${departments.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Posting Date Filter */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Posting Date</h3>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} />
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, "dd/MM/yyyy") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={dateTo} onSelect={setDateTo} />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2">
                  {postedDates.map((date) => (
                    <Button
                      key={date.value}
                      variant={filters.postedDate === date.value ? "default" : "outline"}
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={() => setPostedDateFilter(date.value)}
                    >
                      {date.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interest Areas */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">Interest Areas</h3>
              <div className="flex flex-wrap gap-2">
                {interestAreas.slice(0, showMoreInterests ? interestAreas.length : 8).map((interest) => (
                  <Badge
                    key={interest}
                    variant={filters.interestAreas.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleFilter("interestAreas", interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
              {interestAreas.length > 8 && (
                <Button
                  variant="ghost"
                  className="text-primary text-xs p-0 h-auto font-medium mt-2"
                  onClick={() => setShowMoreInterests(!showMoreInterests)}
                >
                  {showMoreInterests ? "Show Less" : "+ Show More"}
                </Button>
              )}
            </div>

            {/* Auroville Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="auroville-toggle" className="text-sm font-medium">
                Auroville Units
              </label>
              <Switch
                id="auroville-toggle"
                checked={filters.isAurovillian === true}
                onCheckedChange={toggleAuroville}
              />
            </div>

            {/* Apply Button */}
            <Button className="w-full" onClick={applyFilters}>
              Apply
            </Button>
          </div>
        </div>

        {/* Main Content - Units Grid */}
        <div className="flex-1">
          {error && (
            <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <Link key={unit.id} to={`/units/${unit.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5">
                    {unit.image ? (
                      <img
                        src={unit.image}
                        alt={unit.unit_name || "Unit"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-4xl font-bold text-primary/20">
                          {unit.unit_name?.charAt(0) || "U"}
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                        {formatDistanceToNow(new Date(unit.created_at), { addSuffix: true })}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{unit.unit_name}</h3>
                    {unit.industry && (
                      <Badge variant="outline" className="mb-2">
                        {unit.industry}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {unit.description || "No description available"}
                    </p>
                    {unit.address && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="line-clamp-1">{unit.address}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Loading Skeletons */}
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={`skeleton-${i}`} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasMore && !loading && (
            <div ref={observerTarget} className="h-20 flex items-center justify-center mt-6">
              <div className="text-sm text-muted-foreground">Loading more...</div>
            </div>
          )}

          {/* No More Results */}
          {!hasMore && units.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No more units to load
            </div>
          )}

          {/* No Results */}
          {!loading && units.length === 0 && (
            <div className="text-center py-20">
              <p className="text-lg text-muted-foreground">No units found</p>
              <Button variant="outline" className="mt-4" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted));
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
      `}</style>
    </div>
  );
};

export default Units;
