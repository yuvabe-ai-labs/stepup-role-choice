// <-- same imports as before -->
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
import { formatDistanceToNow } from "date-fns";

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

  // ------------------ NEW: parse helper ------------------
  const parsePgTimestamp = (ts: any): Date => {
    // If it's already a Date, return early
    if (ts instanceof Date) return ts;

    if (!ts) return new Date(NaN);

    let s = String(ts).trim();

    // Replace space between date & time with 'T' for ISO compatibility
    s = s.replace(" ", "T");

    // Trim microseconds to milliseconds (convert .123456 -> .123)
    s = s.replace(/\.(\d{3})\d+/, ".$1");

    // If timezone is '+00' or '+00:00', convert to 'Z'
    s = s.replace(/\+00:00?$|Z$/i, "Z");

    // If there's no timezone offset (e.g., ends with seconds), append Z
    if (!/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s)) {
      s = s + "Z";
    }

    const d = new Date(s);
    return d;
  };
  // -------------------------------------------------------

  // Extract unique filter data
  const uniqueUnits = [...new Set(units.map((u) => u.unit_name).filter(Boolean))];
  const uniqueIndustries = [...new Set(units.map((u) => u.industry || u.unit_type).filter(Boolean))];
  const uniqueDepartments = [...new Set(units.map((u) => u.unit_type).filter(Boolean))];

  const interestAreas = [
    ...new Set(
      units.flatMap((u) =>
        typeof u.focus_areas === "object" && u.focus_areas
          ? Object.values(u.focus_areas)
          : typeof u.focus_areas_backup === "object" && u.focus_areas_backup
            ? Object.keys(u.focus_areas_backup)
            : [],
      ),
    ),
  ];

  // Search filtering
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

  // ✅ Fixed & simplified date range logic
  const DateRange = (range: "today" | "week" | "month") => {
    if (activeDateRange === range) {
      setActiveDateRange("");
      setFilters({ ...filters, postingDate: { from: "", to: "" } });
      return;
    }

    const now = new Date();
    let from = new Date();

    if (range === "today") {
      from.setHours(0, 0, 0, 0);
    } else if (range === "week") {
      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() - now.getDay()); // week starts Sunday; adjust if you want Monday
      firstDay.setHours(0, 0, 0, 0);
      from = firstDay;
    } else if (range === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    // End of current day in local time
    const to = new Date();
    to.setHours(23, 59, 59, 999);

    setActiveDateRange(range);
    setFilters({
      ...filters,
      postingDate: { from: from.toISOString(), to: to.toISOString() },
    });
  };

  // ✅ Core filtering (uses parsePgTimestamp for created_at)
  const filteredUnits = units.filter((unit) => {
    if (filters.units.length && !filters.units.includes(unit.unit_name)) return false;
    if (filters.industries.length) {
      const ind = unit.industry || unit.unit_type;
      if (!ind || !filters.industries.includes(ind)) return false;
    }
    if (filters.departments.length && !filters.departments.includes(unit.unit_type)) return false;

    if (filters.interestAreas.length) {
      const areas: string[] = [];
      if (typeof unit.focus_areas === "object" && unit.focus_areas)
        areas.push(...Object.values(unit.focus_areas).map(String));
      if (typeof unit.focus_areas_backup === "object" && unit.focus_areas_backup)
        areas.push(...Object.keys(unit.focus_areas_backup).map(String));

      if (!filters.interestAreas.some((a) => areas.includes(a))) return false;
    }

    if (filters.postingDate.from || filters.postingDate.to) {
      const unitDate = parsePgTimestamp(unit.created_at).getTime();
      const from = filters.postingDate.from ? new Date(filters.postingDate.from).getTime() : -Infinity;
      const to = filters.postingDate.to ? new Date(filters.postingDate.to).getTime() : Infinity;

      // If unitDate is invalid, exclude it (could also decide to include)
      if (Number.isNaN(unitDate)) return false;

      if (unitDate < from || unitDate > to) return false;
    }

    return true;
  });

  const getUnitGradient = (i: number) => {
    const g = [
      "bg-gradient-to-br from-purple-600 to-blue-600",
      "bg-gradient-to-br from-teal-600 to-green-600",
      "bg-gradient-to-br from-orange-600 to-red-600",
      "bg-gradient-to-br from-blue-600 to-cyan-500",
      "bg-gradient-to-br from-pink-600 to-purple-600",
      "bg-gradient-to-br from-gray-700 to-gray-900",
    ];
    return g[i % g.length];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex gap-6 p-6">
        {/* Sidebar Filters */}
        <div className="w-80 bg-card pt-5 border rounded-3xl flex flex-col h-[90vh] sticky top-6">
          <div className="flex items-center justify-between mb-4 px-6 py-3 border-b bg-card sticky top-0 z-10">
            <h2 className="text-lg font-bold">Filters</h2>
            <Button variant="ghost" className="text-primary text-sm font-medium" onClick={resetFilters}>
              Reset all
            </Button>
          </div>

          <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-6">
            {/* Units Filter */}
            <FilterSection
              label="Units"
              searchValue={searchUnits}
              onSearch={setSearchUnits}
              list={filteredUnitsList}
              selected={filters.units}
              onToggle={(v) => toggleFilter("units", v)}
              showAll={showAllUnits}
              setShowAll={setShowAllUnits}
            />

            {/* Industry Filter */}
            <FilterSection
              label="Industry"
              searchValue={searchIndustries}
              onSearch={setSearchIndustries}
              list={filteredIndustriesList}
              selected={filters.industries}
              onToggle={(v) => toggleFilter("industries", v)}
              showAll={showAllIndustries}
              setShowAll={setShowAllIndustries}
            />

            {/* Department Filter */}
            <FilterSection
              label="Department"
              searchValue={searchDepartments}
              onSearch={setSearchDepartments}
              list={filteredDepartmentsList}
              selected={filters.departments}
              onToggle={(v) => toggleFilter("departments", v)}
              showAll={showAllDepartments}
              setShowAll={setShowAllDepartments}
            />

            {/* Posting Date */}
            <PostingDateFilter
              filters={filters}
              activeDateRange={activeDateRange}
              onSelectDate={(range) => DateRange(range)}
              onDateChange={setFilters}
            />

            {/* Interest Areas */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Interest Areas</Label>
              <div className="flex flex-wrap gap-2">
                {interestAreas.slice(0, 10).map((a) => (
                  <Button
                    key={String(a)}
                    variant={filters.interestAreas.includes(String(a)) ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleFilter("interestAreas", String(a))}
                  >
                    {String(a)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
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
              {filteredUnits.map((unit, i) => {
                const gradient = getUnitGradient(i);
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
                        {formatDistanceToNow(parsePgTimestamp(unit.created_at), {
                          addSuffix: true,
                        })}
                      </Badge>
                      {unit.is_aurovillian && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">Auroville</Badge>
                      )}
                      <h3 className="text-xl font-bold text-center mb-2">{unit.unit_name.toLocaleUpperCase()}</h3>
                      <ChevronRight className="absolute right-4 bottom-4 w-6 h-6" />
                    </div>
                    <CardContent className="p-4 flex items-center justify-between">
                      <span className="text-sm font-medium line-clamp-1">{unit.unit_name}</span>
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

/* ------------------ Helper Subcomponents ------------------ */
const FilterSection = ({ label, searchValue, onSearch, list, selected, onToggle, showAll, setShowAll }: any) => (
  <div>
    <Label className="text-sm font-semibold text-muted-foreground mb-3 block">{label}</Label>
    <div className="relative mb-3">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={`Search ${label}...`}
        value={searchValue}
        onChange={(e) => onSearch(e.target.value)}
        className="pl-8 rounded-3xl"
      />
    </div>
    <div className="space-y-3">
      {(showAll ? list : list.slice(0, 4)).map((item: string) => (
        <div key={item} className="flex items-center space-x-2">
          <Checkbox checked={selected.includes(item)} onCheckedChange={() => onToggle(item)} />
          <span className="text-sm">{item}</span>
        </div>
      ))}
      {list.length > 4 && (
        <Button variant="link" className="p-0 text-primary text-sm" onClick={() => setShowAll(!showAll)}>
          {showAll ? "Show Less" : `+${list.length - 4} More`}
        </Button>
      )}
    </div>
  </div>
);

const PostingDateFilter = ({ filters, activeDateRange, onSelectDate, onDateChange }: any) => (
  <div>
    <Label className="text-sm font-semibold text-muted-foreground mb-3 block">Posting Date</Label>
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap gap-2 justify-between">
        {["from", "to"].map((key) => (
          <Popover key={key}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 justify-start rounded-full px-4 text-left font-normal truncate"
              >
                <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                {filters.postingDate[key]
                  ? new Date(filters.postingDate[key]).toLocaleDateString()
                  : key === "from"
                    ? "From"
                    : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.postingDate[key] ? new Date(filters.postingDate[key]) : undefined}
                onSelect={(date) =>
                  onDateChange({
                    ...filters,
                    postingDate: {
                      ...filters.postingDate,
                      [key]: date ? date.toISOString() : "",
                    },
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        ))}
      </div>

      <div className="flex justify-between gap-2 flex-wrap mt-2">
        {["today", "week", "month"].map((range) => (
          <Button
            key={range}
            variant={activeDateRange === range ? "default" : "outline"}
            size="sm"
            className="rounded-full flex-1"
            onClick={() => onSelectDate(range)}
          >
            {range === "today" ? "Today" : range === "week" ? "This Week" : "This Month"}
          </Button>
        ))}
      </div>
    </div>
  </div>
);

export default Units;
