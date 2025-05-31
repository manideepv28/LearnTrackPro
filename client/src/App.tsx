import { useState } from "react";
import { Route, Switch, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Code, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AuthModal } from "@/components/auth-modal";
import { StudyReminder } from "@/components/study-reminder";
import Home from "@/pages/home";
import Dashboard from "@/pages/dashboard";
import CourseDetail from "@/pages/course-detail";
import { useAuth } from "@/hooks/use-auth";

function Navigation() {
  const [, setLocation] = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleNavigation = (path: string) => {
    if (path === "/dashboard" && !isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setLocation(path);
  };

  return (
    <>
      <nav className="bg-white dark:bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setLocation("/")}>
                <Code className="text-primary text-2xl mr-2" />
                <span className="text-xl font-bold text-foreground">CodeLearn</span>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button 
                    onClick={() => setLocation("/")}
                    className="text-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Courses
                  </button>
                  <button 
                    onClick={() => handleNavigation("/dashboard")}
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    My Learning
                  </button>
                  <button 
                    onClick={() => handleNavigation("/dashboard")}
                    className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Progress
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="relative">
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-5 w-5" />
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        3
                      </Badge>
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block font-medium text-foreground">
                      {user?.name}
                    </span>
                    <Button variant="ghost" size="sm" onClick={logout}>
                      <User className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" onClick={() => setShowAuthModal(true)}>
                    Login
                  </Button>
                  <Button onClick={() => setShowAuthModal(true)}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}

function Router() {
  const [, setLocation] = useLocation();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setLocation(`/course/${courseId}`);
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setLocation("/");
  };

  const handleBrowseCourses = () => {
    setLocation("/");
  };

  return (
    <Switch>
      <Route path="/" component={() => <Home onCourseClick={handleCourseClick} />} />
      <Route path="/dashboard" component={() => <Dashboard onCourseClick={handleCourseClick} onBrowseCourses={handleBrowseCourses} />} />
      <Route path="/course/:id">
        {(params) => (
          <CourseDetail 
            courseId={params.id} 
            onBack={handleBackToCourses}
          />
        )}
      </Route>
      <Route>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">404 - Page Not Found</h1>
            <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation("/")}>Go Home</Button>
          </div>
        </div>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navigation />
          <Router />
          <StudyReminder />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
