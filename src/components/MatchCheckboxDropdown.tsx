"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function MatchCheckboxDropdown() {
  const [filters, setFilters] = useState({
    exact: false,
    above90: false,
    between80and90: false,
    between60and80: false,
  });

  const toggleFilter = (key: keyof typeof filters, checked: boolean) => {
    setFilters({ ...filters, [key]: checked });
  };

  const selectedCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="relative">
      <Label className="text-sm font-medium mb-2 block">Select Matches</Label>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[250px] justify-between">
            {selectedCount > 0
              ? `${selectedCount} option${
                  selectedCount > 1 ? "s" : ""
                } selected`
              : "Choose match filters"}
            <span className="ml-2 text-muted-foreground">▾</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[250px] p-2">
          <DropdownMenuCheckboxItem
            checked={filters.exact}
            onCheckedChange={(checked) =>
              toggleFilter("exact", checked as boolean)
            }
          >
            Exact Matches (100%)
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={filters.above90}
            onCheckedChange={(checked) =>
              toggleFilter("above90", checked as boolean)
            }
          >
            Above 90% Match
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={filters.between80and90}
            onCheckedChange={(checked) =>
              toggleFilter("between80and90", checked as boolean)
            }
          >
            80% – 90% Matches
          </DropdownMenuCheckboxItem>

          <DropdownMenuCheckboxItem
            checked={filters.between60and80}
            onCheckedChange={(checked) =>
              toggleFilter("between60and80", checked as boolean)
            }
          >
            60% – 80% Matches
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
