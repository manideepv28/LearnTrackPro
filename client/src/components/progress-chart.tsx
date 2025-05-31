import { useMemo } from "react";
import { useCourses } from "@/hooks/use-courses";
import { useAuth } from "@/hooks/use-auth";

export function ProgressChart() {
  const { enrollments } = useCourses();
  const { user } = useAuth();

  const chartData = useMemo(() => {
    if (!user) return [];
    
    const userEnrollments = enrollments.filter(e => e.userId === user.id);
    
    // Generate weekly progress data for the last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Simulate progress data - in a real app, this would come from actual progress tracking
      const progress = userEnrollments.reduce((sum, enrollment) => {
        // Simulate daily progress based on enrollment progress
        return sum + (enrollment.progress / 7) * Math.random();
      }, 0);
      
      days.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        progress: Math.min(100, progress),
      });
    }
    
    return days;
  }, [enrollments, user]);

  const maxProgress = Math.max(...chartData.map(d => d.progress), 1);

  return (
    <div className="bg-white dark:bg-card rounded-xl shadow-sm border border-border p-6">
      <h3 className="font-semibold text-foreground mb-4">Weekly Progress</h3>
      
      {chartData.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No progress data available</p>
          <p className="text-sm mt-1">Enroll in a course to start tracking your progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chart */}
          <div className="flex items-end space-x-2 h-32">
            {chartData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-md relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-t from-primary to-blue-400 rounded-t-md transition-all duration-500 ease-out"
                    style={{ 
                      height: `${Math.max((day.progress / maxProgress) * 100, 2)}px`,
                      minHeight: '2px'
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground mt-2">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
          
          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {Math.round(chartData.reduce((sum, d) => sum + d.progress, 0) / chartData.length)}%
              </div>
              <div className="text-xs text-muted-foreground">Avg Progress</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {Math.round(Math.max(...chartData.map(d => d.progress)))}%
              </div>
              <div className="text-xs text-muted-foreground">Best Day</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-foreground">
                {enrollments.filter(e => e.userId === user?.id && e.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
