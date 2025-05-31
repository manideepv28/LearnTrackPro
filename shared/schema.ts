import { z } from "zod";

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
  joinDate: z.string(),
  stats: z.object({
    coursesCompleted: z.number().default(0),
    totalHours: z.number().default(0),
    streak: z.number().default(0),
    certificates: z.number().default(0),
  }).default({
    coursesCompleted: 0,
    totalHours: 0,
    streak: 0,
    certificates: 0,
  }),
});

export const insertUserSchema = userSchema.omit({ id: true });

// Course schema
export const courseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  instructor: z.string(),
  category: z.enum(['web-development', 'mobile-development', 'data-science', 'machine-learning', 'devops']),
  level: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.string(),
  price: z.number(),
  rating: z.number(),
  students: z.string(),
  thumbnail: z.string(),
  videoUrl: z.string(),
  curriculum: z.array(z.object({
    title: z.string(),
    lessons: z.array(z.string()),
    duration: z.string().optional(),
  })),
});

export const insertCourseSchema = courseSchema.omit({ id: true });

// Enrollment schema
export const enrollmentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  enrolledDate: z.string(),
  progress: z.number().default(0),
  completed: z.boolean().default(false),
  lastAccessed: z.string(),
  timeSpent: z.number().default(0),
});

export const insertEnrollmentSchema = enrollmentSchema.omit({ id: true });

// Progress schema
export const progressSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  lessonId: z.string(),
  completed: z.boolean().default(false),
  completedAt: z.string().optional(),
  timeSpent: z.number().default(0),
});

export const insertProgressSchema = progressSchema.omit({ id: true });

// Study reminder schema
export const studyReminderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  reminderTime: z.string(),
  enabled: z.boolean().default(true),
  lastShown: z.string().optional(),
});

export const insertStudyReminderSchema = studyReminderSchema.omit({ id: true });

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Course = z.infer<typeof courseSchema>;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Enrollment = z.infer<typeof enrollmentSchema>;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Progress = z.infer<typeof progressSchema>;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type StudyReminder = z.infer<typeof studyReminderSchema>;
export type InsertStudyReminder = z.infer<typeof insertStudyReminderSchema>;
