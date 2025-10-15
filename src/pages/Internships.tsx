import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Search, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useInfiniteInternships } from "@/hooks/useInfiniteInternships";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { formatDistanceToNow } from "date-fns";
import Units from "./Units";

const Internships = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    units: [] as string[],
    industries: [] as string[],
    departments: [] as string[],
    coursePeriod: { min: 0, max: 12 },
    postingDate: { from: "", to: "" },
    interestAreas: [] as string[],
  });

  const [activeDateRange, setActiveDateRange] = useState("");
  const [searchUnits, setSearchUnits] = useState("");
  const [searchIndustries, setSearchIndustries] = useState("");
  const [searchDepartments, setSearchDepartments] = useState("");

  const [showAllUnits, setShowAllUnits] = useState(false);
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const [showAllDepartments, setShowAllDepartments] = useState(false);
  const [showAllInterestAreas, setShowAllInterestAreas] = useState(false);

  const { internships, loading, error, hasMore, loadMore } =
    useInfiniteInternships(filters);
  const { observerTarget } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMore,
  });

  console.log("[Internships] Total internships loaded:", internships.length);
  console.log("[Internships] Has more:", hasMore);

  const resetFilters = () => {
    setFilters({
      units: [],
      industries: [],
      departments: [],
      coursePeriod: { min: 0, max: 12 },
      postingDate: { from: "", to: "" },
      interestAreas: [],
    });
    setActiveDateRange("");
  };

  // Extract unique values from internships
  const uniqueUnits = Array.from(
    new Set(internships.map((i) => i.company_name).filter(Boolean))
  );
  const uniqueIndustries = Array.from(
    new Set(internships.map((i) => i.location).filter(Boolean))
  );
  const uniqueDepartments = Array.from(
    new Set(internships.map((i) => i.title?.split(" ")[0]).filter(Boolean))
  );

  // Sample interest areas - ideally these would come from database
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

  // Filtered lists
  const filteredUnitsList = uniqueUnits.filter((u) =>
    u.toLowerCase().includes(searchUnits.toLowerCase())
  );
  const filteredIndustriesList = uniqueIndustries.filter((i) =>
    i.toLowerCase().includes(searchIndustries.toLowerCase())
  );
  const filteredDepartmentsList = uniqueDepartments.filter((d) =>
    d.toLowerCase().includes(searchDepartments.toLowerCase())
  );

  const toggleFilter = (category: keyof typeof filters, value: string) => {
    if (category === "postingDate" || category === "coursePeriod") return;
    const list = filters[category] as string[];
    setFilters({
      ...filters,
      [category]: list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
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

    if (range === "today") {
      from.setHours(0, 0, 0, 0);
    } else if (range === "week") {
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

  const getInternshipGradient = (index: number) => {
    const gradients = [
      "bg-gradient-to-br from-blue-500 to-cyan-500",
      "bg-gradient-to-br from-purple-500 to-pink-500",
      "bg-gradient-to-br from-orange-500 to-red-500",
      "bg-gradient-to-br from-green-500 to-teal-500",
      "bg-gradient-to-br from-indigo-500 to-blue-500",
      "bg-gradient-to-br from-yellow-500 to-orange-500",
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
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Units
              </Label>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Select Units"
                  value={searchUnits}
                  onChange={(e) => setSearchUnits(e.target.value)}
                  className="pl-8 rounded-3xl"
                />
              </div>
              <div className="space-y-3">
                {(showAllUnits
                  ? filteredUnitsList
                  : filteredUnitsList.slice(0, 4)
                ).map((name) => (
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
                    {showAllUnits
                      ? "Show Less"
                      : `+${filteredUnitsList.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Industry */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Industry
              </Label>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Select Industry type"
                  value={searchIndustries}
                  onChange={(e) => setSearchIndustries(e.target.value)}
                  className="pl-8 rounded-3xl"
                />
              </div>
              <div className="space-y-3">
                {(showAllIndustries
                  ? filteredIndustriesList
                  : filteredIndustriesList.slice(0, 4)
                ).map((name) => (
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
                    {showAllIndustries
                      ? "Show Less"
                      : `+${filteredIndustriesList.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Department
              </Label>
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Select Industry type"
                  value={searchDepartments}
                  onChange={(e) => setSearchDepartments(e.target.value)}
                  className="pl-8 rounded-3xl"
                />
              </div>
              <div className="space-y-3">
                {(showAllDepartments
                  ? filteredDepartmentsList
                  : filteredDepartmentsList.slice(0, 4)
                ).map((name) => (
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
                    {showAllDepartments
                      ? "Show Less"
                      : `+${filteredDepartmentsList.length - 4} More`}
                  </Button>
                )}
              </div>
            </div>

            {/* Course Period */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Course Period
              </Label>
              <div className="flex gap-3 mb-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.coursePeriod.min}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        coursePeriod: {
                          ...filters.coursePeriod,
                          min: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="rounded-3xl"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.coursePeriod.max}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        coursePeriod: {
                          ...filters.coursePeriod,
                          max: parseInt(e.target.value) || 12,
                        },
                      })
                    }
                    className="rounded-3xl"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground">
                <span>{filters.coursePeriod.min}</span>
                <span>{filters.coursePeriod.max}</span>
              </div>
              <Slider
                value={[filters.coursePeriod.min, filters.coursePeriod.max]}
                onValueChange={([min, max]) =>
                  setFilters({ ...filters, coursePeriod: { min, max } })
                }
                min={0}
                max={12}
                step={1}
                className="mb-2"
              />
            </div>

            {/* Posting Date */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Posting Date
              </Label>
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
                          {filters.postingDate[
                            key as keyof typeof filters.postingDate
                          ]
                            ? new Date(
                                filters.postingDate[
                                  key as keyof typeof filters.postingDate
                                ]
                              ).toLocaleDateString()
                            : key === "from"
                            ? "From"
                            : "To"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            filters.postingDate[
                              key as keyof typeof filters.postingDate
                            ]
                              ? new Date(
                                  filters.postingDate[
                                    key as keyof typeof filters.postingDate
                                  ]
                                )
                              : undefined
                          }
                          onSelect={(date) =>
                            setFilters({
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

                <div className="flex justify-between gap-2 flex-wrap mt-2">
                  {["today", "week", "month"].map((range) => (
                    <Button
                      key={range}
                      variant={
                        activeDateRange === range ? "default" : "outline"
                      }
                      size="sm"
                      className="rounded-full flex-1"
                      onClick={() =>
                        DateRange(range as "today" | "week" | "month")
                      }
                    >
                      {range === "today"
                        ? "Today"
                        : range === "week"
                        ? "This Week"
                        : "This Month"}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Interest Areas */}
            <div>
              <Label className="text-sm font-semibold text-muted-foreground mb-3 block">
                Interest Areas
              </Label>
              <div className="flex flex-wrap gap-2">
                {(showAllInterestAreas
                  ? interestAreas
                  : interestAreas.slice(0, 8)
                ).map((area) => (
                  <Button
                    key={area}
                    variant={
                      filters.interestAreas.includes(area)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => toggleFilter("interestAreas", area)}
                  >
                    {area}
                  </Button>
                ))}
                {interestAreas.length > 8 && (
                  <Button
                    variant="link"
                    className="text-primary text-sm p-0"
                    onClick={() =>
                      setShowAllInterestAreas(!showAllInterestAreas)
                    }
                  >
                    {showAllInterestAreas ? "Show Less" : "+ Show More"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              Explore {internships.length} Internship
              {internships.length !== 1 ? "s" : ""} just for you
            </h1>
          </div>

          {error ? (
            <p className="text-destructive">{error}</p>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {internships.map((internship, index) => {
                  const gradient = getInternshipGradient(index);
                  return (
                    <Card
                      key={internship.id}
                      className="overflow-hidden rounded-3xl hover:shadow-lg transition-all cursor-pointer border-2 border-muted"
                      onClick={() => navigate(`/internships/${internship.id}`)}
                    >
                      <div
                        className={`${gradient} h-48 relative flex items-center justify-center p-6`}
                      >
                        {/* {Units.image ? (
                          <img
                            src={internship.image_url}
                            alt={internship.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-white text-center">
                            <h3 className="text-2xl font-bold">
                              {internship.company_name || "Internship"}
                            </h3>
                          </div>
                        )} */}
                        <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground">
                          Saved{" "}
                          {internship.posted_date
                            ? formatDistanceToNow(
                                new Date(internship.posted_date),
                                {
                                  addSuffix: true,
                                }
                              )
                            : "recently"}
                        </Badge>
                        <div className="w-16 h-16 bg-card rounded-2xl flex items-center justify-center shadow-lg">
                          <div className="text-2xl font-bold text-primary">
                            {internship.company_name?.charAt(0) || "I"}
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-5">
                        <h3 className="font-bold text-lg mb-2 line-clamp-1">
                          {internship.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {internship.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {internship.duration || "Duration not specified"}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* Loading skeletons */}
                {loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <Card
                      key={`skeleton-${i}`}
                      className="overflow-hidden rounded-3xl"
                    >
                      <Skeleton className="h-48 w-full" />
                      <CardContent className="p-5">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-2/3 mb-4" />
                        <Skeleton className="h-4 w-1/2" />
                      </CardContent>
                    </Card>
                  ))}
              </div>

              {/* Infinite scroll trigger */}
              {!loading && internships.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No internships found matching your filters.
                  </p>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Observer target for infinite scroll */}
              <div ref={observerTarget} className="h-10" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Internships;
