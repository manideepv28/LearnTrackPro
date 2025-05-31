import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEnrollmentSchema, insertProgressSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser({
        ...userData,
        joinDate: new Date().toISOString(),
      });

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  // Course routes
  app.get("/api/courses", async (req, res) => {
    try {
      const { category, level } = req.query;
      let courses = await storage.getAllCourses();

      if (category) {
        courses = await storage.getCoursesByCategory(category as string);
      }
      if (level) {
        courses = courses.filter(course => course.level === level);
      }

      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", async (req, res) => {
    try {
      const enrollmentData = insertEnrollmentSchema.parse(req.body);
      
      // Check if already enrolled
      const existingEnrollment = await storage.getEnrollment(enrollmentData.userId, enrollmentData.courseId);
      if (existingEnrollment) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      const enrollment = await storage.createEnrollment({
        ...enrollmentData,
        enrolledDate: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
      });

      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/users/:userId/enrollments", async (req, res) => {
    try {
      const enrollments = await storage.getUserEnrollments(req.params.userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.patch("/api/enrollments/:id", async (req, res) => {
    try {
      const updates = req.body;
      const enrollment = await storage.updateEnrollment(req.params.id, {
        ...updates,
        lastAccessed: new Date().toISOString(),
      });

      if (!enrollment) {
        return res.status(404).json({ message: "Enrollment not found" });
      }

      res.json(enrollment);
    } catch (error) {
      res.status(400).json({ message: "Failed to update enrollment" });
    }
  });

  // Progress routes
  app.get("/api/users/:userId/courses/:courseId/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(req.params.userId, req.params.courseId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = insertProgressSchema.parse(req.body);
      const progress = await storage.createProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to create progress record" });
    }
  });

  app.patch("/api/progress/:id", async (req, res) => {
    try {
      const updates = req.body;
      const progress = await storage.updateProgress(req.params.id, updates);

      if (!progress) {
        return res.status(404).json({ message: "Progress record not found" });
      }

      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Failed to update progress" });
    }
  });

  // User stats
  app.get("/api/users/:userId/stats", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const enrollments = await storage.getUserEnrollments(req.params.userId);
      const completedCourses = enrollments.filter(e => e.completed).length;
      const totalHours = enrollments.reduce((sum, e) => sum + e.timeSpent, 0);

      const stats = {
        coursesCompleted: completedCourses,
        totalHours: Math.round(totalHours / 60), // Convert minutes to hours
        streak: user.stats.streak,
        certificates: completedCourses,
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
