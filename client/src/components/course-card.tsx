import { Clock, Users, Star } from "lucide-react";
import { Course } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface CourseCardProps {
  course: Course;
  onCourseClick?: (courseId: string) => void;
}

export function CourseCard({ course, onCourseClick }: CourseCardProps) {
  const { enrollInCourse, isEnrolled, getEnrollment } = useCourses();
  const { user } = useAuth();
  const { toast } = useToast();

  const enrolled = isEnrolled(course.id);
  const enrollment = getEnrollment(course.id);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'web-development':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'mobile-development':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'data-science':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'machine-learning':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'devops':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleEnroll = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in courses",
        variant: "destructive",
      });
      return;
    }

    const result = enrollInCourse(course.id);
    if (result.success) {
      toast({
        title: "Enrollment Successful",
        description: `You have been enrolled in ${course.title}`,
      });
    } else {
      toast({
        title: "Enrollment Failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleCardClick = () => {
    onCourseClick?.(course.id);
  };

  return (
    <div 
      className="course-card group"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img 
          src={course.thumbnail} 
          alt={`${course.title} course thumbnail`}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        {enrolled && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500 text-white">
              {enrollment?.progress || 0}% Complete
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryBadgeClass(course.category)}>
            {course.category.replace('-', ' ')}
          </Badge>
          <span className="text-sm text-muted-foreground capitalize">
            {course.level}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{course.students}</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
            <span>{course.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            ${course.price}
          </span>
          <Button 
            onClick={handleEnroll}
            className={enrolled ? "bg-green-600 hover:bg-green-700" : ""}
            disabled={enrolled}
          >
            {enrolled ? "Enrolled" : "Enroll Now"}
          </Button>
        </div>
      </div>
    </div>
  );
}
