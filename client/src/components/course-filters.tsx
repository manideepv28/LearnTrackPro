import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORIES, LEVELS } from "@/lib/course-data";
import { useCourses } from "@/hooks/use-courses";

export function CourseFilters() {
  const { filters, updateFilters, clearFilters } = useCourses();

  const handleSearchChange = (value: string) => {
    updateFilters({ search: value });
  };

  const handleCategoryChange = (value: string) => {
    updateFilters({ category: value === "all" ? "" : value });
  };

  const handleLevelChange = (value: string) => {
    updateFilters({ level: value === "all" ? "" : value });
  };

  const hasActiveFilters = filters.category || filters.level || filters.search;

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Filter Courses</h3>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Category
          </label>
          <Select 
            value={filters.category || "all"} 
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Level */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Skill Level
          </label>
          <Select 
            value={filters.level || "all"} 
            onValueChange={handleLevelChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Minimum Rating
          </label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Any Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Rating</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
              <SelectItem value="4.8">4.8+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
