import { useState, useEffect } from "react";
import { Bell, X, Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";

export function StudyReminder() {
  const { enrolledCourses, getEnrollment } = useCourses();
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<string | null>(null);

  useEffect(() => {
    if (!user || enrolledCourses.length === 0) return;

    // Show reminder every 30 minutes (for demo, show after 10 seconds)
    const timer = setTimeout(() => {
      // Find a course that's in progress but not completed
      const inProgressCourse = enrolledCourses.find(course => {
        const enrollment = getEnrollment(course.id);
        return enrollment && enrollment.progress > 0 && enrollment.progress < 100;
      });

      if (inProgressCourse) {
        setCurrentCourse(inProgressCourse.id);
        setIsVisible(true);
      }
    }, 10000); // 10 seconds for demo

    return () => clearTimeout(timer);
  }, [user, enrolledCourses, getEnrollment]);

  const handleStartStudy = () => {
    if (currentCourse) {
      // In a real app, this would navigate to the course
      console.log(`Starting study session for course: ${currentCourse}`);
    }
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleSnooze = () => {
    setIsVisible(false);
    // Snooze for 15 minutes (for demo, show again after 30 seconds)
    setTimeout(() => {
      setIsVisible(true);
    }, 30000);
  };

  if (!isVisible || !currentCourse) return null;

  const course = enrolledCourses.find(c => c.id === currentCourse);
  const enrollment = getEnrollment(currentCourse);

  if (!course || !enrollment) return null;

  return (
    <div className="fixed top-4 right-4 bg-white dark:bg-card border border-border rounded-lg shadow-lg p-4 max-w-sm z-50 animate-slide-in">
      <div className="flex items-start space-x-3">
        <div className="bg-primary/10 rounded-full p-2">
          <Bell className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h6 className="font-medium text-foreground">Study Reminder</h6>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-2">
            Time to continue your <strong>{course.title}</strong> course! 
            You're {enrollment.progress}% complete.
          </p>
          
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {enrollment.progress}%
            </span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleStartStudy}
              className="flex items-center space-x-1"
            >
              <Play className="h-3 w-3" />
              <span>Continue</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSnooze}
              className="flex items-center space-x-1 text-muted-foreground"
            >
              <Clock className="h-3 w-3" />
              <span>Later</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
