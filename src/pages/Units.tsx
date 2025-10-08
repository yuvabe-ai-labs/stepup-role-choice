import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useUnits } from "@/hooks/useUnits";
import { formatDistanceToNow } from "date-fns";

const Units = () => {
  const navigate = useNavigate();
  const { units, loading, error } = useUnits();
  
  const [filters, setFilters] = useState({
    unitNames: [] as string[],
    industries: [] as string[],
    isAurovillian: null as boolean | null,
  });

  console.log('[Units] Current filters:', filters);
  console.log('[Units] Total units loaded:', units.length);

  // Extract unique values for filters
  const uniqueUnitNames = Array.from(new Set(units.map((u) => u.unit_name).filter(Boolean))).slice(0, 10);
  const uniqueIndustries = Array.from(new Set(units.map((u) => u.industry || u.unit_type).filter(Boolean))).slice(0, 10);

  const toggleFilter = (category: "unitNames" | "industries", value: string) => {
    console.log('[Units] Toggle filter:', category, value);
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const toggleAuroville = (checked: boolean) => {
    console.log('[Units] Toggle Auroville:', checked);
    setFilters((prev) => ({
      ...prev,
      isAurovillian: checked ? true : null,
    }));
  };

  const resetFilters = () => {
    console.log('[Units] Reset all filters');
    setFilters({ unitNames: [], industries: [], isAurovillian: null });
  };

  // Apply filters
  const filteredUnits = units.filter((unit) => {
    if (filters.unitNames.length > 0 && !filters.unitNames.includes(unit.unit_name)) {
      return false;
    }
    if (filters.industries.length > 0) {
      const unitIndustry = unit.industry || unit.unit_type;
      if (!unitIndustry || !filters.industries.includes(unitIndustry)) {
        return false;
      }
    }
    if (filters.isAurovillian !== null && unit.is_aurovillian !== filters.isAurovillian) {
      return false;
    }
    return true;
  });

  console.log('[Units] Filtered units:', filteredUnits.length);

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
        {/* Left Sidebar - Filters */}
        <div className="w-80 bg-card border rounded-3xl p-6 h-fit sticky top-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Filters</h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80 text-sm font-medium"
              onClick={resetFilters}
            >
              Reset all
            </Button>
          </div>

          {/* Auroville Toggle */}
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <Label htmlFor="auroville-toggle" className="text-sm font-medium">
                Auroville Units Only
              </Label>
              <Switch
                id="auroville-toggle"
                checked={filters.isAurovillian === true}
                onCheckedChange={toggleAuroville}
              />
            </div>
          </div>

          {/* Units Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Units</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {uniqueUnitNames.map((unitName) => (
                <div key={unitName} className="flex items-center space-x-2">
                  <Checkbox
                    id={`unit-${unitName}`}
                    checked={filters.unitNames.includes(unitName)}
                    onCheckedChange={() => toggleFilter("unitNames", unitName)}
                  />
                  <label
                    htmlFor={`unit-${unitName}`}
                    className="text-sm font-medium cursor-pointer line-clamp-1"
                  >
                    {unitName}
                  </label>
                </div>
              ))}
            </div>
            {uniqueUnitNames.length > 10 && (
              <Button variant="link" className="text-primary text-sm p-0 mt-2">
                +{units.length - 10} More
              </Button>
            )}
          </div>

          {/* Industry Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Industry</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {uniqueIndustries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filters.industries.includes(industry)}
                    onCheckedChange={() => toggleFilter("industries", industry)}
                  />
                  <label
                    htmlFor={`industry-${industry}`}
                    className="text-sm font-medium cursor-pointer line-clamp-1"
                  >
                    {industry}
                  </label>
                </div>
              ))}
            </div>
            {uniqueIndustries.length > 10 && (
              <Button variant="link" className="text-primary text-sm p-0 mt-2">
                +{uniqueIndustries.length - 10} More
              </Button>
            )}
          </div>

          <Button
            className="w-full rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            variant="outline"
            onClick={resetFilters}
          >
            Apply
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">
              Explore {filteredUnits.length}+ Units just for you
            </h1>
          </div>

          {error && (
            <div className="text-center py-8">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {loading ? (
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
                const focusAreas = typeof unit.focus_areas === 'object' && unit.focus_areas !== null
                  ? Object.entries(unit.focus_areas as Record<string, any>).slice(0, 2)
                  : [];

                return (
                  <Card
                    key={unit.id}
                    className="overflow-hidden rounded-3xl hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/units/${unit.id}`)}
                  >
                    {/* Unit Header */}
                    <div className={`${gradient} h-48 relative flex flex-col items-center justify-center p-6 text-white`}>
                      <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                        {formatDistanceToNow(new Date(unit.created_at), { addSuffix: true })}
                      </Badge>

                      {unit.is_aurovillian && (
                        <Badge className="absolute top-3 right-3 bg-green-500 text-white">
                          Auroville
                        </Badge>
                      )}

                      <h3 className="text-xl font-bold text-center mb-2">{unit.unit_name}</h3>
                      <p className="text-sm text-white/80">{unit.unit_type}</p>

                      {focusAreas.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2 justify-center">
                          {focusAreas.map(([key]) => (
                            <Badge key={key} variant="secondary" className="bg-white/20 text-white text-xs">
                              {key}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <ChevronRight className="absolute right-4 bottom-4 w-6 h-6" />
                    </div>

                    {/* Unit Footer */}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {unit.unit_name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium line-clamp-1">{unit.unit_name}</span>
                        </div>

                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/unit-view/${unit.id}`);
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
