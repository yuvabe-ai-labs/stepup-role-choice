import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Search, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useInfiniteCourses } from "@/hooks/useInfiniteCourses";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useCourses } from "@/hooks/useCourses";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays, differenceInHours, differenceInMinutes, formatDistanceToNow } from "date-fns";

const Courses = () => {
  const navigate = useNavigate();
  const { courses: allCourses, loading: coursesLoading } = useCourses();
  const [providers, setProviders] = useState<Array<{ id: string; name: string }>>([]);

  const [filters, setFilters] = useState({
    providers: [] as string[],
    titles: [] as string[],
    difficulty: [] as string[],
    postingDate: { from: "", to: "" },
  });

  const [activeDateRange, setActiveDateRange] = useState("");
  const [searchProviders, setSearchProviders] = useState("");
  const [searchTitles, setSearchTitles] = useState("");
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [showAllTitles, setShowAllTitles] = useState(false);

  // Fetch course providers
  useEffect(() => {
    const fetchProviders = async () => {
      const uniqueCreatorIds = [...new Set(allCourses.map((c) => c.created_by))];

      const { data } = await supabase.from("units").select("id, unit_name").in("id", uniqueCreatorIds);

      if (data) {
        setProviders(data.map((p) => ({ id: p.id, name: p.unit_name })));
      }
    };

    if (allCourses.length > 0) {
      fetchProviders();
    }
  }, [allCourses]);

  const resetFilters = () => {
    setFilters({
      providers: [],
      titles: [],
      difficulty: [],
      postingDate: { from: "", to: "" },
    });
    setActiveDateRange("");
  };

  const parsePgTimestamp = (ts: any): Date => {
    if (ts instanceof Date) return ts;
    if (!ts) return new Date(NaN);
    let s = String(ts).trim();
    s = s
      .replace(" ", "T")
      .replace(/\.(\d{3})\d+/, ".$1")
      .replace(/\+00:00?$|Z$/i, "Z");
    if (!/[zZ]|[+\-]\d{2}:?\d{2}$/.test(s)) s = s + "Z";
    return new Date(s);
  };

  const uniqueProviderNames = providers.map((p) => p.name);
  const uniqueTitles = [...new Set(allCourses.map((c) => c.title).filter(Boolean))];

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === "postingDate") return;
    const list = filters[category] as string[];
    setFilters({
      ...filters,
      [category]: list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    });
  };

  const DateRange = (range: "today" | "week" | "month") => {
    if (activeDateRange === range) {
      setActiveDateRange("");
      setFilters({ ...filters, postingDate: { from: "", to: "" } });
      return;
    }

    const now = new Date();
    let from = new Date();
    if (range === "today") from.setHours(0, 0, 0, 0);
    else if (range === "week") {
      const firstDay = new Date(now);
      firstDay.setDate(now.getDate() - now.getDay());
      firstDay.setHours(0, 0, 0, 0);
      from = firstDay;
    } else if (range === "month") {
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    }

    const to = new Date();
    to.setHours(23, 59, 59, 999);
    setActiveDateRange(range);
    setFilters({
      ...filters,
      postingDate: { from: from.toISOString(), to: to.toISOString() },
    });
  };

  const filteredCourses = allCourses.filter((course) => {
    // Filter by provider
    if (filters.providers.length) {
      const providerName = providers.find((p) => p.id === course.created_by)?.name;
      if (!providerName || !filters.providers.includes(providerName)) return false;
    }

    // Filter by title
    if (filters.titles.length && !filters.titles.includes(course.title)) return false;

    // Filter by difficulty
    if (filters.difficulty.length && !filters.difficulty.includes(course.difficulty_level || "")) return false;

    // Filter by posting date
    if (filters.postingDate.from || filters.postingDate.to) {
      const courseDate = parsePgTimestamp(course.created_at).getTime();
      const from = filters.postingDate.from ? new Date(filters.postingDate.from).getTime() : -Infinity;
      const to = filters.postingDate.to ? new Date(filters.postingDate.to).getTime() : Infinity;
      if (Number.isNaN(courseDate)) return false;
      if (courseDate < from || courseDate > to) return false;
    }

    return true;
  });

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "intermediate":
        return "bg-orange-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container px-4 sm:px-6 lg:px-[7.5rem] py-4 lg:py-10">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-80 bg-card pt-5 border border-gray-200 rounded-3xl flex flex-col lg:h-[90vh] lg:sticky lg:top-6 mb-4 lg:mb-0">
            <div className="flex items-center justify-between mb-4 px-6 py-3 border-b bg-card sticky top-0 z-10">
              <h2 className="text-lg font-bold">Filters</h2>
              <Button variant="ghost" className="text-primary text-sm font-medium" onClick={resetFilters}>
                Reset all
              </Button>
            </div>

            <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-6">
              <FilterSection
                label="Course Providers"
                searchValue={searchProviders}
                onSearch={setSearchProviders}
                list={uniqueProviderNames}
                selected={filters.providers}
                onToggle={(v) => toggleFilter("providers", v)}
                showAll={showAllProviders}
                setShowAll={setShowAllProviders}
              />

              <FilterSection
                label="Course Title"
                searchValue={searchTitles}
                onSearch={setSearchTitles}
                list={uniqueTitles}
                selected={filters.titles}
                onToggle={(v) => toggleFilter("titles", v)}
                showAll={showAllTitles}
                setShowAll={setShowAllTitles}
              />

              <div>
                <Label className="text-sm font-medium text-gray-500 mb-3 block">Course Level</Label>
                <div className="space-y-3">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.difficulty.includes(level)}
                        onCheckedChange={() => toggleFilter("difficulty", level)}
                      />
                      <span className="text-sm">{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <PostingDateFilter
                filters={filters}
                activeDateRange={activeDateRange}
                onSelectDate={(range) => DateRange(range)}
                onDateChange={setFilters}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl text-gray-600 font-medium">
                Explore {filteredCourses.length} Course
                {filteredCourses.length !== 1 ? "s" : ""}
              </h1>
            </div>

            {/* Courses Grid */}
            <div className="grid gap-2.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const gradients = [
                  "bg-gradient-to-br from-lime-400 to-green-600",
                  "bg-gradient-to-br from-purple-500 to-pink-600",
                  "bg-gradient-to-br from-blue-500 to-cyan-400",
                  "bg-gradient-to-br from-orange-500 to-red-600",
                  "bg-gradient-to-br from-teal-500 to-blue-600",
                  "bg-gradient-to-br from-yellow-500 to-orange-600",
                ];
                const gradient = gradients[Math.floor(Math.random() * gradients.length)];

                return (
                  <Card key={course.id} className="overflow-hidden rounded-3xl hover:shadow-lg transition-all">
                    {/* Course Image/Gradient Header */}
                    <div className={`h-40 ${gradient} relative flex items-center justify-center`}>
                      {course.image_url ? (
                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-white text-center">
                          <h3 className="text-2xl font-bold">{course.category || "Course"}</h3>
                        </div>
                      )}
                      {/* Time ago badge */}
                      <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                        {formatDistanceToNow(new Date(course.created_at), {
                          addSuffix: true,
                        })}
                      </Badge>
                    </div>

                    <CardContent className="p-4 space-y-3">
                      {/* Duration and Level */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration || "8 weeks"}</span>
                        </div>
                        {course.difficulty_level && (
                          <Badge className={`${getDifficultyColor(course.difficulty_level)} text-white`}>
                            {course.difficulty_level}
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg line-clamp-1">{course.title}</h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description || "Build your skills with this comprehensive course..."}
                      </p>

                      {/* Know More Button */}
                      <Button
                        className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
                        variant="outline"
                      >
                        <a href={course.website_url} target="_blank">
                          Know more
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Loading Skeletons */}
              {coursesLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <Card key={`skeleton-${i}`} className="overflow-hidden rounded-xl">
                    <Skeleton className="h-40 w-full" />
                    <CardContent className="p-4 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-10 w-full rounded-full" />
                    </CardContent>
                  </Card>
                ))}
            </div>

            {!coursesLoading && filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No courses found matching your filters.</p>
                <Button variant="outline" onClick={resetFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------ FilterSection Component ------------------ */
const FilterSection = ({ label, searchValue, onSearch, list, selected, onToggle, showAll, setShowAll }: any) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearch(value);
    setShowDropdown(value.trim().length > 0);
  };

  const filteredSearchResults = list.filter((item: string) => item.toLowerCase().includes(searchValue.toLowerCase()));

  return (
    <div className="relative">
      <Label className="text-sm font-medium text-gray-500 mb-3 block">{label}</Label>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={`Search ${label}...`}
          value={searchValue}
          onChange={handleSearchChange}
          className="pl-8 border-gray-400 rounded-3xl"
          onFocus={() => searchValue.trim().length > 0 && setShowDropdown(true)}
        />
      </div>

      {/* Search Dropdown */}
      {showDropdown && filteredSearchResults.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full bg-card border rounded-xl shadow-md max-h-56 overflow-auto"
        >
          {filteredSearchResults.map((item: string) => (
            <div
              key={item}
              onClick={() => {
                onToggle(item);
                setShowDropdown(false);
              }}
              className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer hover:bg-muted transition ${
                selected.includes(item) ? "bg-muted/50" : ""
              }`}
            >
              <span>{item}</span>
              <Checkbox checked={selected.includes(item)} />
            </div>
          ))}
        </div>
      )}

      {/* Checkbox list */}
      <div className="space-y-3 mt-3">
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
};

/* ------------------ PostingDateFilter Component ------------------ */
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
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {[
          { value: "today", label: "Today" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ].map((range) => (
          <Button
            key={range.value}
            variant={activeDateRange === range.value ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectDate(range.value)}
            className="rounded-full"
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  </div>
);
