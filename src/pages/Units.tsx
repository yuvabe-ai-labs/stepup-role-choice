import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
type Json =
  | string
  | number
  | boolean
  | null
  | {
      [key: string]: Json;
    }
  | Json[];
interface Unit {
  id: string;
  unit_name: string;
  unit_type: string;
  focus_areas: Json;
  opportunities_offered: Json;
  skills_offered: Json;
  profile_id: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  is_aurovillian: boolean;
  created_at: string;
  updated_at: string;
}

// --- Helpers ---
function safeParse<T>(data: any, fallback: T): T {
  if (!data) return fallback;
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
}
function getUnitGradient(unitName: string, unitType: string): string {
  const gradients = [
    "bg-gradient-to-br from-gray-900 to-purple-900",
    "bg-gradient-to-br from-teal-600 to-blue-700",
    "bg-gradient-to-br from-gray-800 to-orange-900",
    "bg-gradient-to-br from-blue-600 to-teal-700",
    "bg-gradient-to-br from-gray-700 to-gray-900",
    "bg-gradient-to-br from-teal-700 to-blue-800",
    "bg-gradient-to-br from-purple-600 to-indigo-700",
    "bg-gradient-to-br from-green-600 to-teal-700",
    "bg-gradient-to-br from-red-600 to-pink-700",
  ];
  const hash = unitName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffInDays === 0) return "Today";
  if (diffInDays === 1) return "1d ago";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return `${Math.floor(diffInDays / 30)}m ago`;
}
const Units = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    units: true,
    industry: false,
    interest: false,
  });

  // filter states
  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedFocusAreas, setSelectedFocusAreas] = useState<string[]>([]);

  // Fetch units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("units")
          .select("*")
          .order("created_at", {
            ascending: false,
          });
        if (error) {
          console.error("Error fetching units:", error);
          setError(error.message);
        } else {
          setUnits(data || []);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch units");
      } finally {
        setLoading(false);
      }
    };
    fetchUnits();
  }, []);

  // Helpers for filters
  const getUniqueUnitNames = () => [
    ...new Set(units.map((unit) => unit.unit_name)),
  ];
  const getUniqueUnitTypes = () => [
    ...new Set(units.map((unit) => unit.unit_type)),
  ];
  const getUniqueFocusAreas = () => {
    const allFocusAreas = units.flatMap((unit) => {
      const focusAreas = safeParse(unit.focus_areas, {});
      return Object.keys(focusAreas);
    });
    return [...new Set(allFocusAreas)];
  };
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const toggleFilter = (
    value: string,
    setState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setState((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };
  const clearFilters = () => {
    setSelectedUnits([]);
    setSelectedTypes([]);
    setSelectedFocusAreas([]);
  };

  // Apply filters
  const filteredUnits = units.filter((unit) => {
    const focusAreas = safeParse(unit.focus_areas, {});
    const focusAreaKeys = Object.keys(focusAreas);
    if (selectedUnits.length > 0 && !selectedUnits.includes(unit.unit_name)) {
      return false;
    }
    if (selectedTypes.length > 0 && !selectedTypes.includes(unit.unit_type)) {
      return false;
    }
    if (
      selectedFocusAreas.length > 0 &&
      !selectedFocusAreas.some((f) => focusAreaKeys.includes(f))
    ) {
      return false;
    }
    return true;
  });
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-background border border-border rounded-2xl shadow-md p-6 m-6 h-auto">
          <h2 className="text-base font-semibold text-gray-800 mb-6">
            All Filters
          </h2>

          {/* Units Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("units")}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
            >
              <span>Units</span>
              {expandedSections.units ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.units && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getUniqueUnitNames().map((unitName) => (
                    <span
                      key={unitName}
                      onClick={() => toggleFilter(unitName, setSelectedUnits)}
                      className={`px-3 py-1 text-sm border rounded-full cursor-pointer ${
                        selectedUnits.includes(unitName)
                          ? "bg-sky-500 text-white border-sky-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {unitName}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unit Type Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("industry")}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
            >
              <span>Unit Type</span>
              {expandedSections.industry ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.industry && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getUniqueUnitTypes().map((unitType) => (
                    <span
                      key={unitType}
                      onClick={() => toggleFilter(unitType, setSelectedTypes)}
                      className={`px-3 py-1 text-sm border rounded-full cursor-pointer ${
                        selectedTypes.includes(unitType)
                          ? "bg-sky-500 text-white border-sky-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {unitType}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Focus Areas Filter */}
          <div className="mb-6">
            <button
              onClick={() => toggleSection("interest")}
              className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 mb-3"
            >
              <span>Focus Areas</span>
              {expandedSections.interest ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
            {expandedSections.interest && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {getUniqueFocusAreas().map((focusArea) => (
                    <span
                      key={focusArea}
                      onClick={() =>
                        toggleFilter(focusArea, setSelectedFocusAreas)
                      }
                      className={`px-3 py-1 text-sm border rounded-full cursor-pointer ${
                        selectedFocusAreas.includes(focusArea)
                          ? "bg-sky-500 text-white border-sky-500"
                          : "border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {focusArea}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply + Clear */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full text-sm font-medium py-2 border-2 border-teal-500 rounded-3xl bg-transparent hover:bg-teal-50 text-teal-500"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">
              Explore {filteredUnits.length} Units just for you
            </h1>
          </div>

          {loading ? (
            // Loading Skeleton
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({
                length: 6,
              }).map((_, index) => (
                <Card key={index} className="overflow-hidden shadow-sm">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-500">Error loading units: {error}</p>
            </div>
          ) : filteredUnits.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500">No units available.</p>
            </div>
          ) : (
            // Units Grid
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredUnits.map((unit) => {
                const focusAreas = safeParse(unit.focus_areas, {});
                const gradient = getUnitGradient(
                  unit.unit_name,
                  unit.unit_type
                );
                const timeAgo = getTimeAgo(unit.created_at);
                return (
                  <Card
                    key={unit.id}
                    className="overflow-hidden shadow border border-gray-200 rounded-xl hover:shadow-md transition-shadow cursor-pointer"
                  >
                    {/* Top section with gradient */}
                    <div
                      className={`h-48 ${gradient} relative flex items-center justify-center`}
                    >
                      <Badge className="absolute top-3 left-3 bg-white text-gray-800 text-xs font-semibold px-2 py-0.5 rounded-md">
                        {timeAgo}
                      </Badge>

                      <div className="text-white text-center px-4">
                        <h3 className="text-lg font-semibold mb-1">
                          {unit.unit_name}
                        </h3>
                        <p className="text-white/80 text-sm">
                          {unit.unit_type}
                        </p>

                        {Object.keys(focusAreas).length > 0 && (
                          <div className="mt-2 flex flex-wrap justify-center gap-1">
                            {Object.entries(
                              focusAreas as Record<string, string>
                            )
                              .slice(0, 2)
                              .map(([key, value]) => (
                                <Badge
                                  key={key}
                                  className="bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-md"
                                >
                                  {key}: {value}
                                </Badge>
                              ))}
                          </div>
                        )}
                      </div>

                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
                    </div>

                    {/* Bottom content */}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {unit.unit_name.charAt(0)}
                          </div>
                          <span className="text-sm font-medium">
                            {unit.unit_name}
                          </span>
                        </div>

                        <Button
                          size="sm"
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium rounded-md px-3 py-1.5"
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
