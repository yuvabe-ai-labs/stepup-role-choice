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

  const [searchUnits, setSearchUnits] = useState("");
  const [searchIndustries, setSearchIndustries] = useState("");
  const [searchDepartments, setSearchDepartments] = useState("");

  const [showAllUnits, setShowAllUnits] = useState(false);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);

  // const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const resetFilters = () => {
    setFilters({
      units: [],
      industries: [],
      departments: [],
      interestAreas: [],
      postingDate: { from: "", to: "" },
    });
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

  const DateRange = (type: "today" | "week" | "month") => {
    const today = new Date();
    let fromDate = today;
    if (type === "week") fromDate = subDays(today, 7);
    else if (type === "month") fromDate = subDays(today, 30);

    setFilters({
      ...filters,
      postingDate: {
        from: startOfDay(fromDate).toISOString(),
        to: startOfDay(today).toISOString(),
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
      const areas = typeof unit.focus_areas === "object" ? Object.keys(unit.focus_areas) : [];
      if (!filters.interestAreas.some((area) => areas.includes(area))) return false;
    }
    // if (dateRange?.from && dateRange?.to) {
    //   const createdAt = new Date(unit.created_at);
    //   const from = new Date(dateRange.from);
    //   const to = new Date(dateRange.to);
    //   to.setHours(23, 59, 59, 999); // ✅ include the entire end day
    //   if (createdAt < from || createdAt > to) return false;
    // }

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
              className="text-primary hover:text-primary/80 text-sm font-medium"
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
            {/* Posting Date */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Posting Date</Label>

              {/* From / To date inputs */}
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">From</Label>
                  <div className="flex items-center border rounded-full px-3 py-2 bg-background">
                    .
                    <CalendarIcon className="w-3 h-4 text-muted-foreground mr-2" />
                    <Input
                      type="date"
                      className="border-0 p-0 h-auto focus-visible:ring-0 text-sm"
                      value={filters.postingDate.from}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          postingDate: {
                            ...filters.postingDate,
                            from: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <Label className="text-xs text-muted-foreground mb-1 block">To</Label>
                  <div className="flex items-center border rounded-full px-3 py-2 bg-background">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground mr-2" />
                    <Input
                      type="date"
                      className="border-0 p-0 h-auto focus-visible:ring-0 text-sm"
                      value={filters.postingDate.to}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          postingDate: {
                            ...filters.postingDate,
                            to: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Quick range buttons */}
              <div className="flex justify-between mt-2">
                <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => DateRange("today")}>
                  Today
                </Button>
                <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => DateRange("week")}>
                  This Week
                </Button>
                <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => DateRange("month")}>
                  This Month
                </Button>
              </div>
            </div>

            {/* Posting Date Filter
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                Posting Date
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal w-full"
                  >
                    {dateRange?.from ? (
                      dateRange.to ? (
                        <>
                          {format(dateRange.from, "LLL dd, y")} -{" "}
                          {format(dateRange.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(dateRange.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range || {});
                    }}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div> */}

            {/* Interest Areas */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Interest Areas</Label>
              <div className="flex flex-wrap gap-2">
                {interestAreas.slice(0, 10).map((area) => (
                  <Button
                    key={area}
                    variant={filters.interestAreas.includes(area) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleFilter("interestAreas", area)}
                  >
                    {area}
                  </Button>
                ))}
                {interestAreas.length > 10 && (
                  <Button variant="link" className="text-primary text-sm p-0">
                    + Show More
                  </Button>
                )}
              </div>
            </div>

            {/* <Button
              className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
              variant="outline"
            >
              Apply
            </Button> */}
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
                      {/* <p className="text-sm text-white/80">{unit.unit_type}</p> */}
                      {/* {focusAreas.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                          {focusAreas.map(([key]) => (
                            <Badge
                              key={key}
                              variant="secondary"
                              className="bg-white/20 text-white text-xs"
                            >
                              {key}
                            </Badge>
                          ))}
                        </div>
                      )} */}
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

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { ChevronRight } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useUnits } from "@/hooks/useUnits";
// import { formatDistanceToNow } from "date-fns";

// const Units = () => {
//   const navigate = useNavigate();
//   const { units, loading, error } = useUnits();

//   const [filters, setFilters] = useState({
//     unitNames: [] as string[],
//     industries: [] as string[],
//     isAurovillian: null as boolean | null,
//   });

//   console.log("[Units] Current filters:", filters);
//   console.log("[Units] Total units loaded:", units.length);

//   // Extract unique values for filters
//   const uniqueUnitNames = Array.from(new Set(units.map((u) => u.unit_name).filter(Boolean))).slice(0, 10);
//   const uniqueIndustries = Array.from(new Set(units.map((u) => u.industry || u.unit_type).filter(Boolean))).slice(
//     0,
//     10,
//   );

//   const toggleFilter = (category: "unitNames" | "industries", value: string) => {
//     console.log("[Units] Toggle filter:", category, value);
//     setFilters((prev) => ({
//       ...prev,
//       [category]: prev[category].includes(value)
//         ? prev[category].filter((v) => v !== value)
//         : [...prev[category], value],
//     }));
//   };

//   const toggleAuroville = (checked: boolean) => {
//     console.log("[Units] Toggle Auroville:", checked);
//     setFilters((prev) => ({
//       ...prev,
//       isAurovillian: checked ? true : null,
//     }));
//   };

//   const resetFilters = () => {
//     console.log("[Units] Reset all filters");
//     setFilters({ unitNames: [], industries: [], isAurovillian: null });
//   };

//   // Apply filters
//   const filteredUnits = units.filter((unit) => {
//     if (filters.unitNames.length > 0 && !filters.unitNames.includes(unit.unit_name)) {
//       return false;
//     }
//     if (filters.industries.length > 0) {
//       const unitIndustry = unit.industry || unit.unit_type;
//       if (!unitIndustry || !filters.industries.includes(unitIndustry)) {
//         return false;
//       }
//     }
//     if (filters.isAurovillian !== null && unit.is_aurovillian !== filters.isAurovillian) {
//       return false;
//     }
//     return true;
//   });

//   console.log("[Units] Filtered units:", filteredUnits.length);

//   const getUnitGradient = (index: number) => {
//     const gradients = [
//       "bg-gradient-to-br from-purple-600 to-blue-600",
//       "bg-gradient-to-br from-teal-600 to-green-600",
//       "bg-gradient-to-br from-orange-600 to-red-600",
//       "bg-gradient-to-br from-blue-600 to-cyan-500",
//       "bg-gradient-to-br from-pink-600 to-purple-600",
//       "bg-gradient-to-br from-gray-700 to-gray-900",
//     ];
//     return gradients[index % gradients.length];
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="flex gap-6 p-6">
//         {/* Left Sidebar - Filters */}
//         <div className="w-80 bg-card border rounded-3xl p-6 h-fit sticky top-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold">Filters</h2>
//             <Button
//               variant="ghost"
//               className="text-primary hover:text-primary/80 text-sm font-medium"
//               onClick={resetFilters}
//             >
//               Reset all
//             </Button>
//           </div>

//           {/* Auroville Toggle */}
//           <div className="mb-6 p-4 bg-muted rounded-lg">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="auroville-toggle" className="text-sm font-medium">
//                 Auroville Units Only
//               </Label>
//               <Switch
//                 id="auroville-toggle"
//                 checked={filters.isAurovillian === true}
//                 onCheckedChange={toggleAuroville}
//               />
//             </div>
//           </div>

//           {/* Units Filter */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-muted-foreground mb-3">Units</h3>
//             <div className="space-y-3 max-h-60 overflow-y-auto">
//               {uniqueUnitNames.map((unitName) => (
//                 <div key={unitName} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`unit-${unitName}`}
//                     checked={filters.unitNames.includes(unitName)}
//                     onCheckedChange={() => toggleFilter("unitNames", unitName)}
//                   />
//                   <label htmlFor={`unit-${unitName}`} className="text-sm font-medium cursor-pointer line-clamp-1">
//                     {unitName}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {uniqueUnitNames.length > 10 && (
//               <Button variant="link" className="text-primary text-sm p-0 mt-2">
//                 +{units.length - 10} More
//               </Button>
//             )}
//           </div>

//           {/* Industry Filter */}
//           <div className="mb-6">
//             <h3 className="text-sm font-semibold text-muted-foreground mb-3">Industry</h3>
//             <div className="space-y-3 max-h-60 overflow-y-auto">
//               {uniqueIndustries.map((industry) => (
//                 <div key={industry} className="flex items-center space-x-2">
//                   <Checkbox
//                     id={`industry-${industry}`}
//                     checked={filters.industries.includes(industry)}
//                     onCheckedChange={() => toggleFilter("industries", industry)}
//                   />
//                   <label htmlFor={`industry-${industry}`} className="text-sm font-medium cursor-pointer line-clamp-1">
//                     {industry}
//                   </label>
//                 </div>
//               ))}
//             </div>
//             {uniqueIndustries.length > 10 && (
//               <Button variant="link" className="text-primary text-sm p-0 mt-2">
//                 +{uniqueIndustries.length - 10} More
//               </Button>
//             )}
//           </div>

//           <Button
//             className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
//             variant="outline"
//             onClick={resetFilters}
//           >
//             Apply
//           </Button>
//         </div>

//         {/* Main Content */}
//         <div className="flex-1">
//           <div className="mb-6">
//             <h1 className="text-3xl font-bold">Explore {filteredUnits.length} Units</h1>
//           </div>

//           {error && (
//             <div className="text-center py-8">
//               <p className="text-destructive">{error}</p>
//             </div>
//           )}

//           {loading ? (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <Card key={i} className="overflow-hidden rounded-3xl">
//                   <Skeleton className="h-48 w-full" />
//                   <CardContent className="p-4">
//                     <Skeleton className="h-6 w-full mb-2" />
//                     <Skeleton className="h-4 w-3/4" />
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : filteredUnits.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-muted-foreground">No units found matching your filters.</p>
//               <Button variant="outline" onClick={resetFilters} className="mt-4">
//                 Clear Filters
//               </Button>
//             </div>
//           ) : (
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//               {filteredUnits.map((unit, index) => {
//                 const gradient = getUnitGradient(index);
//                 const focusAreas =
//                   typeof unit.focus_areas === "object" && unit.focus_areas !== null
//                     ? Object.entries(unit.focus_areas as Record<string, any>).slice(0, 2)
//                     : [];

//                 return (
//                   <Card
//                     key={unit.id}
//                     className="overflow-hidden rounded-3xl hover:shadow-lg transition-all cursor-pointer"
//                     onClick={() => navigate(`/units/${unit.id}`)}
//                   >
//                     {/* Unit Header */}
//                     <div
//                       className={`${gradient} h-48 relative flex flex-col items-center justify-center p-6 text-white`}
//                     >
//                       <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
//                         {formatDistanceToNow(new Date(unit.created_at), { addSuffix: true })}
//                       </Badge>

//                       {unit.is_aurovillian && (
//                         <Badge className="absolute top-3 right-3 bg-green-500 text-white">Auroville</Badge>
//                       )}

//                       <h3 className="text-xl font-bold text-center mb-2">{unit.unit_name}</h3>
//                       <p className="text-sm text-white/80">{unit.unit_type}</p>

//                       {focusAreas.length > 0 && (
//                         <div className="mt-3 flex flex-wrap gap-2 justify-center">
//                           {focusAreas.map(([key]) => (
//                             <Badge key={key} variant="secondary" className="bg-white/20 text-white text-xs">
//                               {key}
//                             </Badge>
//                           ))}
//                         </div>
//                       )}

//                       <ChevronRight className="absolute right-4 bottom-4 w-6 h-6" />
//                     </div>

//                     {/* Unit Footer */}
//                     <CardContent className="p-4">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-2">
//                           <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
//                             <img src={unit.image} alt={`${unit.unit_name} logo`} />
//                           </div>
//                           <span className="text-sm font-medium line-clamp-1">{unit.unit_name}</span>
//                         </div>

//                         <Button
//                           size="sm"
//                           className="bg-orange-500 hover:bg-orange-600 text-white rounded-3xl"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/units/${unit.id}`);
//                           }}
//                         >
//                           View
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Units;
