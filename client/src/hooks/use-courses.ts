import { useState, useEffect } from 'react';
import { Course, Enrollment } from '@shared/schema';
import { LocalStorage, STORAGE_KEYS } from '@/lib/storage';
import { COURSE_DATA } from '@/lib/course-data';
import { useAuth } from './use-auth';

export interface CourseFilters {
  category: string;
  level: string;
  search: string;
}

export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filters, setFilters] = useState<CourseFilters>({
    category: '',
    level: '',
    search: '',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load courses and enrollments from localStorage
    const savedCourses = LocalStorage.load<Course[]>(STORAGE_KEYS.COURSES);
    const savedEnrollments = LocalStorage.load<Enrollment[]>(STORAGE_KEYS.ENROLLMENTS);

    setCourses(savedCourses || COURSE_DATA);
    setEnrollments(savedEnrollments || []);
    setIsLoading(false);

    // Save courses to localStorage if not already saved
    if (!savedCourses) {
      LocalStorage.save(STORAGE_KEYS.COURSES, COURSE_DATA);
    }
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = !filters.category || course.category === filters.category;
    const matchesLevel = !filters.level || course.level === filters.level;
    const matchesSearch = !filters.search || 
      course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      course.instructor.toLowerCase().includes(filters.search.toLowerCase());

    return matchesCategory && matchesLevel && matchesSearch;
  });

  const enrolledCourses = courses.filter(course => 
    enrollments.some(enrollment => enrollment.courseId === course.id && enrollment.userId === user?.id)
  );

  const isEnrolled = (courseId: string): boolean => {
    return enrollments.some(enrollment => 
      enrollment.courseId === courseId && enrollment.userId === user?.id
    );
  };

  const getEnrollment = (courseId: string): Enrollment | undefined => {
    return enrollments.find(enrollment => 
      enrollment.courseId === courseId && enrollment.userId === user?.id
    );
  };

  const enrollInCourse = (courseId: string): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: 'Please login to enroll in courses' };
    }

    if (isEnrolled(courseId)) {
      return { success: false, error: 'Already enrolled in this course' };
    }

    const enrollment: Enrollment = {
      id: Date.now().toString(),
      userId: user.id,
      courseId,
      enrolledDate: new Date().toISOString(),
      progress: 0,
      completed: false,
      lastAccessed: new Date().toISOString(),
      timeSpent: 0,
    };

    const updatedEnrollments = [...enrollments, enrollment];
    setEnrollments(updatedEnrollments);
    LocalStorage.save(STORAGE_KEYS.ENROLLMENTS, updatedEnrollments);

    return { success: true };
  };

  const updateProgress = (courseId: string, progress: number, timeSpent?: number): void => {
    if (!user) return;

    const updatedEnrollments = enrollments.map(enrollment => {
      if (enrollment.courseId === courseId && enrollment.userId === user.id) {
        return {
          ...enrollment,
          progress: Math.min(100, Math.max(0, progress)),
          completed: progress >= 100,
          lastAccessed: new Date().toISOString(),
          timeSpent: timeSpent !== undefined ? enrollment.timeSpent + timeSpent : enrollment.timeSpent,
        };
      }
      return enrollment;
    });

    setEnrollments(updatedEnrollments);
    LocalStorage.save(STORAGE_KEYS.ENROLLMENTS, updatedEnrollments);
  };

  const getCourseById = (courseId: string): Course | undefined => {
    return courses.find(course => course.id === courseId);
  };

  const updateFilters = (newFilters: Partial<CourseFilters>): void => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = (): void => {
    setFilters({
      category: '',
      level: '',
      search: '',
    });
  };

  return {
    courses: filteredCourses,
    allCourses: courses,
    enrolledCourses,
    enrollments,
    filters,
    isLoading,
    isEnrolled,
    getEnrollment,
    getCourseById,
    enrollInCourse,
    updateProgress,
    updateFilters,
    clearFilters,
  };
}
