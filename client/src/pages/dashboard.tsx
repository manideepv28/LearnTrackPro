import { Book, CheckCircle, Clock, Trophy, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProgressChart } from "@/components/progress-chart";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";

interface DashboardProps {
  onCourseClick: (courseId: string) => void;
  onBrowseCourses: () => void;
}

export default function Dashboard({ onCourseClick, onBrowseCourses }: DashboardProps) {
  const { enrolledCourses, enrollments, getCourseById, getEnrollment } = useCourses();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view your dashboard</h2>
          <Button onClick={onBrowseCourses}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  const userEnrollments = enrollments.filter(e => e.userId === user.id);
  const completedCount = userEnrollments.filter(e => e.completed).length;
  const totalHours = userEnrollments.reduce((sum, e) => sum + e.timeSpent, 0);
  const avgProgress = userEnrollments.length > 0 
    ? userEnrollments.reduce((sum, e) => sum + e.progress, 0) / userEnrollments.length 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
              <p className="text-blue-100 mb-4">Continue your coding journey and master new skills</p>
            </div>
            <div className="mt-6 md:mt-0">
              <img 
                src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                alt="Coding workspace" 
                className="rounded-lg shadow-lg w-48 h-32 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{userEnrollments.length}</p>
                  <p className="text-muted-foreground text-sm">Enrolled Courses</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                  <p className="text-muted-foreground text-sm">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{Math.round(totalHours / 60)}</p>
                  <p className="text-muted-foreground text-sm">Hours Learned</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-foreground">{completedCount}</p>
                  <p className="text-muted-foreground text-sm">Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
            </CardHeader>
            <CardContent>
              {userEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No enrolled courses yet</p>
                  <Button onClick={onBrowseCourses} className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Browse Courses</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userEnrollments.slice(0, 3).map((enrollment) => {
                    const course = getCourseById(enrollment.courseId);
                    if (!course) return null;

                    return (
                      <div key={enrollment.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-foreground">{course.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            enrollment.completed 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          }`}>
                            {enrollment.completed ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{course.instructor}</p>
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-muted-foreground mb-1">
                            <span>Progress</span>
                            <span>{Math.round(enrollment.progress)}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => onCourseClick(course.id)}
                          disabled={enrollment.completed}
                        >
                          {enrollment.completed ? 'View Certificate' : 'Continue Learning'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <ProgressChart />
        </div>
      </div>
    </div>
  );
}
