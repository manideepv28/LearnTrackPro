import { useState } from "react";
import { Code, Users, Star, Trophy, Search, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CourseCard } from "@/components/course-card";
import { CourseFilters } from "@/components/course-filters";
import { AuthModal } from "@/components/auth-modal";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";

interface HomeProps {
  onCourseClick: (courseId: string) => void;
}

export default function Home({ onCourseClick }: HomeProps) {
  const { courses, updateFilters, filters } = useCourses();
  const { user, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Scroll to courses section
      document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      setShowAuthModal(true);
    }
  };

  const handleBrowseCourses = () => {
    document.getElementById('courses-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Master Programming with Interactive Courses
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of developers learning cutting-edge technologies through hands-on projects and expert-led video tutorials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-white text-primary hover:bg-gray-100"
                  onClick={handleGetStarted}
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={handleBrowseCourses}
                >
                  Browse Courses
                </Button>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-blue-100">
                <div className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  <span>50k+ Students</span>
                </div>
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5" />
                  <span>4.8/5 Rating</span>
                </div>
                <div className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  <span>Certificates</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Developer workspace with multiple monitors showing code" 
                  className="rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Code className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Watch & Learn</p>
                      <p className="text-sm text-gray-600">1000+ Videos</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className="lg:w-1/4">
              <CourseFilters />
            </div>

            {/* Course Grid */}
            <div className="lg:w-3/4">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Popular Courses</h2>
                  <p className="text-muted-foreground mt-1">Discover our most-loved programming courses</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="alphabetical">A-Z</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex border border-border rounded-lg">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Course Cards */}
              {courses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No courses found matching your criteria.</p>
                  <Button 
                    variant="ghost" 
                    onClick={() => updateFilters({ category: '', level: '', search: '' })}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {courses.map((course) => (
                    <CourseCard 
                      key={course.id} 
                      course={course} 
                      onCourseClick={onCourseClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}
