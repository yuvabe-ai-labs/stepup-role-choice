import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronRight, CalendarIcon, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUnits } from "@/hooks/useUnits";
import { formatDistanceToNow, subDays, startOfDay } from "date-fns";

const Units = () => {
  const navigate = useNavigate();
  const { units, loading, error } = useUnits();

  const [filters, setFilters] = useState({
    units: [] as string[],
    industries: [] as string[],
    departments: [] as string[],
    interestAreas: [] as string[],
    postingDate: { from: "", to: "" },
  });

  const [activeDateRange, setActiveDateRange] = useState("");
  const [searchUnits, setSearchUnits] = useState("");
  const [searchIndustries, setSearchIndustries] = useState("");
  const [searchDepartments, setSearchDepartments] = useState("");

  const [showAllUnits, setShowAllUnits] = useState(false);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);

  const resetFilters = () => {
    setFilters({
      units: [],
      industries: [],
      departments: [],
      interestAreas: [],
      postingDate: { from: "", to: "" },
    });
    setActiveDateRange("");
  };

  // Unique data lists
  const uniqueUnits = Array.from(new Set(units.map((u) => u.unit_name).filter(Boolean)));
  const uniqueIndustries = Array.from(new Set(units.map((u) => u.industry || u.unit_type).filter(Boolean)));
  const uniqueDepartments = Array.from(new Set(units.map((u) => u.unit_type).filter(Boolean)));

  const interestAreas = Array.from(
    new Set(
      units.flatMap((u) =>
        typeof u.focus_areas === "object" && u.focus_areas
          ? Object.values(u.focus_areas)
          : typeof u.focus_areas_backup === "object" && u.focus_areas_backup
            ? Object.keys(u.focus_areas_backup)
            : [],
      ),
    ),
  );

  // Filtered by search term
  const filteredUnitsList = uniqueUnits.filter((u) => u.toLowerCase().includes(searchUnits.toLowerCase()));
  const filteredIndustriesList = uniqueIndustries.filter((i) =>
    i.toLowerCase().includes(searchIndustries.toLowerCase()),
  );
  const filteredDepartmentsList = uniqueDepartments.filter((d) =>
    d.toLowerCase().includes(searchDepartments.toLowerCase()),
  );

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === "postingDate") return;
    const list = filters[category] as string[];
    setFilters({
      ...filters,
      [category]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  const DateRange = (range) => {
    // If same button clicked again → deselect
    if (activeDateRange === range) {
      setActiveDateRange("");
      setFilters({
        ...filters,
        postingDate: { from: "", to: "" },
      });
      return;
    }

    const now = new Date();
    let from;
    const to = now;

    if (range === "today") {
      from = new Date(now.setHours(0, 0, 0, 0));
    } else if (range === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      from = startOfWeek;
    } else if (range === "month") {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      from = startOfMonth;
    }

    setActiveDateRange(range);
    setFilters({
      ...filters,
      postingDate: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
    });
  };
  const filteredUnits = units.filter((unit) => {
    if (filters.units.length && !filters.units.includes(unit.unit_name)) return false;

    if (filters.industries.length) {
      const ind = unit.industry || unit.unit_type;
      if (!ind || !filters.industries.includes(ind)) return false;
    }

    if (filters.departments.length && !filters.departments.includes(unit.unit_type)) return false;

    if (filters.interestAreas.length) {
      // Combine all focus areas into a flat array
      const unitAreas: string[] = [];

      if (typeof unit.focus_areas === "object" && unit.focus_areas !== null) {
        unitAreas.push(...Object.values(unit.focus_areas).map(String));
      } else if (typeof unit.focus_areas_backup === "object" && unit.focus_areas_backup !== null) {
        unitAreas.push(...Object.keys(unit.focus_areas_backup).map(String));
      }

      // Check if any selected interest area exists in the unit's areas
      if (!filters.interestAreas.some((area) => unitAreas.includes(area))) return false;
    }

    // ✅ Posting Date filter
    if (filters.postingDate.from || filters.postingDate.to) {
      const unitDate = new Date(unit.created_at);
      if (filters.postingDate.from) {
        const from = new Date(filters.postingDate.from);
        if (unitDate < from) return false;
      }
      if (filters.postingDate.to) {
        const to = new Date(filters.postingDate.to);
        if (unitDate > to) return false;
      }
    }

    return true;
  });

  const getUnitGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-purple-600 to-blue-600",
      "bg-gradient-to-br from-teal-600 to-green-600",
      "bg-gradient-to-br from-orange-600 to-red-600",
      "bg-gradient-to-br from-blue-600 to-cyan-500",
      "bg-gradient-to-br from-pink-600 to-purple-600",
      "bg-gradient-to-br from-gray-700 to-gray-900",
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex gap-6 p-6">
        {/* Filters Sidebar */}
        <div className="w-80 bg-card pt-[20px] border rounded-3xl flex flex-col h-[90vh] sticky top-6">
          {/* Sticky Header */}
          <div className="flex items-center justify-between mb-4 px-6 py-3 border-b sticky top-0 bg-card z-10">
            <h2 className="text-lg font-bold">Filters</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-white  text-sm font-medium"
              onClick={resetFilters}
            >
              Reset all
            </Button>
          </div>

          {/* Scrollable Filter Body */}
          <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-6">
            {/* Units */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Units</Label>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Units"
                  value={searchUnits}
                  onChange={(e) => setSearchUnits(e.target.value)}
                  className="pl-8 rounded-3xl"
                />
              </div>
              <div className="space-y-3">
                {(showAllUnits ? filteredUnitsList : filteredUnitsList.slice(0, 4)).map((name) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.units.includes(name)}
                      onCheckedChange={() => toggleFilter("units", name)}
                    />
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
                {filteredUnitsList.length > 4 && (
                  <Button
                    variant="link"
                    className="p-0 text-primary text-sm"
                    onClick={() => setShowAllUnits(!showAllUnits)}
                  >
                    {showAllUnits ? "Show Less" : `+${filteredUnitsList.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Industry */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Industry</Label>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Industry..."
                  value={searchIndustries}
                  onChange={(e) => setSearchIndustries(e.target.value)}
                  className="pl-8 rounded-3xl"
                />
              </div>
              <div className="space-y-3">
                {(showAllIndustries ? filteredIndustriesList : filteredIndustriesList.slice(0, 4)).map((name) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.industries.includes(name)}
                      onCheckedChange={() => toggleFilter("industries", name)}
                    />
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
                {filteredIndustriesList.length > 4 && (
                  <Button
                    variant="link"
                    className="p-0 text-primary text-sm"
                    onClick={() => setShowAllIndustries(!showAllIndustries)}
                  >
                    {showAllIndustries ? "Show Less" : `+${filteredIndustriesList.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Department</Label>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search Department..."
                  value={searchDepartments}
                  onChange={(e) => setSearchDepartments(e.target.value)}
                  className="pl-8 rounded-3xl"
                />
              </div>
              <div className="space-y-3">
                {(showAllDepartments ? filteredDepartmentsList : filteredDepartmentsList.slice(0, 4)).map((name) => (
                  <div key={name} className="flex items-center space-x-2">
                    <Checkbox
                      checked={filters.departments.includes(name)}
                      onCheckedChange={() => toggleFilter("departments", name)}
                    />
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
                {filteredDepartmentsList.length > 4 && (
                  <Button
                    variant="link"
                    className="p-0 text-primary text-sm"
                    onClick={() => setShowAllDepartments(!showAllDepartments)}
                  >
                    {showAllDepartments ? "Show Less" : `+${filteredDepartmentsList.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Posting Date */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Posting Date</Label>

              {/* Date Range Picker */}
              <div className="flex flex-col space-y-3">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start rounded-full px-4 text-left font-normal truncate"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {filters.postingDate.from ? new Date(filters.postingDate.from).toLocaleDateString() : "From"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.postingDate.from ? new Date(filters.postingDate.from) : undefined}
                          onSelect={(date) => {
                            setFilters({
                              ...filters,
                              postingDate: {
                                ...filters.postingDate,
                                from: date ? date.toISOString() : "",
                              },
                            });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start rounded-full px-4 text-left font-normal truncate"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                          {filters.postingDate.to ? new Date(filters.postingDate.to).toLocaleDateString() : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.postingDate.to ? new Date(filters.postingDate.to) : undefined}
                          onSelect={(date) => {
                            setFilters({
                              ...filters,
                              postingDate: {
                                ...filters.postingDate,
                                to: date ? date.toISOString() : "",
                              },
                            });
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Quick range buttons */}
                <div className="flex justify-between mt-2 gap-2 flex-wrap">
                  <Button
                    variant={activeDateRange === "today" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full px-4 flex-1"
                    onClick={() => DateRange("today")}
                  >
                    Today
                  </Button>

                  <Button
                    variant={activeDateRange === "week" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full px-4 flex-1"
                    onClick={() => DateRange("week")}
                  >
                    This Week
                  </Button>

                  <Button
                    variant={activeDateRange === "month" ? "default" : "outline"}
                    size="sm"
                    className="rounded-full px-4 flex-1"
                    onClick={() => DateRange("month")}
                  >
                    This Month
                  </Button>
                </div>
              </div>
            </div>

            {/* Interest Areas */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Interest Areas</Label>
              <div className="flex flex-wrap gap-2">
                {interestAreas.slice(0, 10).map((area) => (
                  <Button
                    key={String(area)}
                    variant={filters.interestAreas.includes(String(area)) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleFilter("interestAreas", String(area))}
                  >
                    {String(area)}
                  </Button>
                ))}
                {interestAreas.length > 10 && (
                  <Button variant="link" className="text-primary text-sm p-0">
                    + Show More
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content (Units Grid) */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Explore {filteredUnits.length} Units</h1>
          </div>
          {error ? (
            <p className="text-destructive">{error}</p>
          ) : loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden rounded-3xl">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No units found matching your filters.</p>
              <Button variant="outline" onClick={resetFilters} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUnits.map((unit, index) => {
                const gradient = getUnitGradient(index);
                const focusAreas =
                  typeof unit.focus_areas === "object" && unit.focus_areas !== null
                    ? Object.entries(unit.focus_areas as Record<string, any>).slice(0, 2)
                    : [];

                return (
                  <Card
                    key={unit.id}
                    className="overflow-hidden rounded-3xl hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/units/${unit.id}`)}
                  >
                    <div
                      className={`${gradient} h-48 relative flex flex-col items-center justify-center p-6 text-white`}
                    >
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                        {formatDistanceToNow(new Date(unit.created_at), {
                          addSuffix: true,
                        })}
                      </Badge>
                      {unit.is_aurovillian && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">Auroville</Badge>
                      )}
                      <h3 className="text-xl font-bold text-center mb-2">{unit.unit_name.toLocaleUpperCase()}</h3>
                      <ChevronRight className="absolute right-4 bottom-4 w-6 h-6" />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground">
                            <img src={unit.image} alt={`${unit.unit_name} logo`} />
                          </div>
                          <span className="text-sm font-medium line-clamp-1">{unit.unit_name}</span>
                        </div>
                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-3xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/units/${unit.id}`);
                          }}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Units;
