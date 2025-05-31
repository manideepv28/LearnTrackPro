import { useState, useEffect } from "react";
import { ArrowLeft, Play, Clock, Users, Star, CheckCircle, Book } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface CourseDetailProps {
  courseId: string;
  onBack: () => void;
}

export default function CourseDetail({ courseId, onBack }: CourseDetailProps) {
  const { getCourseById, isEnrolled, getEnrollment, enrollInCourse, updateProgress } = useCourses();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedLesson, setSelectedLesson] = useState(0);

  const course = getCourseById(courseId);
  const enrollment = getEnrollment(courseId);
  const enrolled = isEnrolled(courseId);

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Course not found</h2>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  const handleEnroll = () => {
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

  const handleStartLesson = () => {
    if (enrolled && enrollment) {
      // Simulate progress update
      const newProgress = Math.min(100, enrollment.progress + 10);
      updateProgress(course.id, newProgress, 15); // 15 minutes of study time
      
      toast({
        title: "Lesson Started",
        description: "Your progress has been updated",
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-card border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="flex items-center space-x-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Courses</span>
          </Button>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={getCategoryBadgeClass(course.category)}>
                  {course.category.replace('-', ' ')}
                </Badge>
                <span className="text-sm text-muted-foreground capitalize">
                  {course.level}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{course.title}</h1>
              <p className="text-muted-foreground">by {course.instructor}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-foreground">${course.price}</div>
                {enrolled && enrollment && (
                  <div className="text-sm text-muted-foreground">
                    {Math.round(enrollment.progress)}% Complete
                  </div>
                )}
              </div>
              <Button 
                size="lg"
                onClick={enrolled ? handleStartLesson : handleEnroll}
                className={enrolled ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {enrolled ? "Continue Learning" : "Enroll Now"}
              </Button>
            </div>
          </div>

          {enrolled && enrollment && (
            <div className="mt-4">
              <Progress value={enrollment.progress} className="h-2" />
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Video Player */}
            <div className="bg-black rounded-lg aspect-video mb-6">
              <iframe 
                width="100%" 
                height="100%" 
                src={course.videoUrl}
                title={course.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
                className="rounded-lg"
              />
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Course Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3">What You'll Learn</h3>
                  <ul className="space-y-2">
                    {course.curriculum.flatMap(section => 
                      section.lessons.map((lesson, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{lesson}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                {course.curriculum.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="border border-border rounded-lg">
                    <div className="p-4 bg-muted/50 border-b border-border">
                      <h4 className="font-semibold text-foreground">{section.title}</h4>
                      {section.duration && (
                        <p className="text-sm text-muted-foreground">Duration: {section.duration}</p>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lessonIndex}
                          className="flex items-center justify-between p-3 rounded hover:bg-muted/50 cursor-pointer"
                          onClick={() => setSelectedLesson(sectionIndex * 10 + lessonIndex)}
                        >
                          <div className="flex items-center space-x-3">
                            <Play className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{lesson}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {Math.floor(Math.random() * 20) + 5} min
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <p>Reviews feature coming soon!</p>
                  <p className="text-sm mt-1">Rate and review courses after enrollment</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-white dark:bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Course Information</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Duration
                  </span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Students
                  </span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Star className="h-4 w-4 mr-2" />
                    Rating
                  </span>
                  <span className="font-medium">{course.rating}/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center">
                    <Book className="h-4 w-4 mr-2" />
                    Lessons
                  </span>
                  <span className="font-medium">
                    {course.curriculum.reduce((total, section) => total + section.lessons.length, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructor Info */}
            <div className="bg-white dark:bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">Instructor</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-muted-foreground">Expert Instructor</p>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white dark:bg-card rounded-lg border border-border p-6">
              <h3 className="font-semibold mb-4">This course includes:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Lifetime access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mobile and desktop access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Progress tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
