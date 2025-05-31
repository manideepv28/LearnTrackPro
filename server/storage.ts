import { 
  User, 
  InsertUser, 
  Course, 
  InsertCourse, 
  Enrollment, 
  InsertEnrollment, 
  Progress, 
  InsertProgress,
  StudyReminder,
  InsertStudyReminder
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Course methods
  getCourse(id: string): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  getCoursesByLevel(level: string): Promise<Course[]>;

  // Enrollment methods
  getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: string, updates: Partial<Enrollment>): Promise<Enrollment | undefined>;

  // Progress methods
  getUserProgress(userId: string, courseId: string): Promise<Progress[]>;
  createProgress(progress: InsertProgress): Promise<Progress>;
  updateProgress(id: string, updates: Partial<Progress>): Promise<Progress | undefined>;

  // Study reminder methods
  getUserReminders(userId: string): Promise<StudyReminder[]>;
  createReminder(reminder: InsertStudyReminder): Promise<StudyReminder>;
  updateReminder(id: string, updates: Partial<StudyReminder>): Promise<StudyReminder | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private courses: Map<string, Course> = new Map();
  private enrollments: Map<string, Enrollment> = new Map();
  private progress: Map<string, Progress> = new Map();
  private reminders: Map<string, StudyReminder> = new Map();

  constructor() {
    this.initializeData();
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private initializeData() {
    // Initialize with sample courses
    const sampleCourses: Course[] = [
      {
        id: "js-course-2024",
        title: "Complete JavaScript Course 2024",
        description: "Master modern JavaScript from basics to advanced concepts including ES6+, async/await, and real-world projects.",
        instructor: "Jonas Schmedtmann",
        category: "web-development",
        level: "beginner",
        duration: "42 hours",
        price: 49.99,
        rating: 4.9,
        students: "15.2k",
        thumbnail: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        curriculum: [
          {
            title: "JavaScript Fundamentals",
            lessons: ["Variables and Data Types", "Functions and Scope", "Control Structures"],
            duration: "8 hours"
          },
          {
            title: "Modern JavaScript",
            lessons: ["ES6 Features", "Async Programming", "Modules"],
            duration: "12 hours"
          }
        ]
      },
      {
        id: "react-masterclass",
        title: "React.js Masterclass",
        description: "Build modern React applications with hooks, context, and advanced patterns. Includes Next.js and deployment.",
        instructor: "Maximilian Schwarzmüller",
        category: "web-development",
        level: "intermediate",
        duration: "38 hours",
        price: 79.99,
        rating: 4.7,
        students: "9.8k",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        videoUrl: "https://www.youtube.com/embed/Ke90Tje7VS0",
        curriculum: [
          {
            title: "React Basics",
            lessons: ["Components", "Props & State", "Event Handling"],
            duration: "10 hours"
          },
          {
            title: "Advanced React",
            lessons: ["Hooks", "Context API", "Performance"],
            duration: "15 hours"
          }
        ]
      },
      {
        id: "python-data-science",
        title: "Python for Data Science",
        description: "Complete Python data science course covering pandas, numpy, matplotlib, and machine learning basics.",
        instructor: "Jose Portilla",
        category: "data-science",
        level: "beginner",
        duration: "56 hours",
        price: 59.99,
        rating: 4.8,
        students: "22.1k",
        thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
        curriculum: [
          {
            title: "Python Basics",
            lessons: ["Syntax", "Data Structures", "Control Flow"],
            duration: "16 hours"
          },
          {
            title: "Data Analysis",
            lessons: ["Pandas", "NumPy", "Visualization"],
            duration: "20 hours"
          }
        ]
      },
      {
        id: "flutter-development",
        title: "Flutter App Development",
        description: "Create beautiful cross-platform mobile apps with Flutter. Build real apps for iOS and Android.",
        instructor: "Angela Yu",
        category: "mobile-development",
        level: "intermediate",
        duration: "45 hours",
        price: 69.99,
        rating: 4.6,
        students: "7.5k",
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        videoUrl: "https://www.youtube.com/embed/x0uinJvhNxI",
        curriculum: [
          {
            title: "Flutter Basics",
            lessons: ["Widgets", "Layouts", "Navigation"],
            duration: "18 hours"
          },
          {
            title: "Advanced Flutter",
            lessons: ["State Management", "APIs", "Publishing"],
            duration: "20 hours"
          }
        ]
      },
      {
        id: "tensorflow-deep-learning",
        title: "Deep Learning with TensorFlow",
        description: "Master neural networks and deep learning with TensorFlow. Build AI applications from scratch.",
        instructor: "Andrew Ng",
        category: "machine-learning",
        level: "advanced",
        duration: "62 hours",
        price: 99.99,
        rating: 4.9,
        students: "4.2k",
        thumbnail: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        curriculum: [
          {
            title: "Neural Networks",
            lessons: ["Perceptrons", "Backpropagation", "Optimization"],
            duration: "25 hours"
          },
          {
            title: "Deep Learning",
            lessons: ["CNNs", "RNNs", "Transfer Learning"],
            duration: "30 hours"
          }
        ]
      },
      {
        id: "fullstack-bootcamp",
        title: "Full Stack Web Development",
        description: "Complete bootcamp covering HTML, CSS, JavaScript, Node.js, Express, MongoDB, and React.",
        instructor: "Colt Steele",
        category: "web-development",
        level: "beginner",
        duration: "78 hours",
        price: 89.99,
        rating: 4.5,
        students: "18.7k",
        thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        videoUrl: "https://www.youtube.com/embed/nu_pCVPKzTk",
        curriculum: [
          {
            title: "Frontend",
            lessons: ["HTML/CSS", "JavaScript", "React"],
            duration: "35 hours"
          },
          {
            title: "Backend",
            lessons: ["Node.js", "Express", "Databases"],
            duration: "30 hours"
          }
        ]
      }
    ];

    sampleCourses.forEach(course => {
      this.courses.set(course.id, course);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.generateId();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Course methods
  async getCourse(id: string): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.generateId();
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.category === category);
  }

  async getCoursesByLevel(level: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(course => course.level === level);
  }

  // Enrollment methods
  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined> {
    return Array.from(this.enrollments.values()).find(
      enrollment => enrollment.userId === userId && enrollment.courseId === courseId
    );
  }

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return Array.from(this.enrollments.values()).filter(enrollment => enrollment.userId === userId);
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const id = this.generateId();
    const enrollment: Enrollment = { ...insertEnrollment, id };
    this.enrollments.set(id, enrollment);
    return enrollment;
  }

  async updateEnrollment(id: string, updates: Partial<Enrollment>): Promise<Enrollment | undefined> {
    const enrollment = this.enrollments.get(id);
    if (enrollment) {
      const updatedEnrollment = { ...enrollment, ...updates };
      this.enrollments.set(id, updatedEnrollment);
      return updatedEnrollment;
    }
    return undefined;
  }

  // Progress methods
  async getUserProgress(userId: string, courseId: string): Promise<Progress[]> {
    return Array.from(this.progress.values()).filter(
      progress => progress.userId === userId && progress.courseId === courseId
    );
  }

  async createProgress(insertProgress: InsertProgress): Promise<Progress> {
    const id = this.generateId();
    const progress: Progress = { ...insertProgress, id };
    this.progress.set(id, progress);
    return progress;
  }

  async updateProgress(id: string, updates: Partial<Progress>): Promise<Progress | undefined> {
    const progress = this.progress.get(id);
    if (progress) {
      const updatedProgress = { ...progress, ...updates };
      this.progress.set(id, updatedProgress);
      return updatedProgress;
    }
    return undefined;
  }

  // Study reminder methods
  async getUserReminders(userId: string): Promise<StudyReminder[]> {
    return Array.from(this.reminders.values()).filter(reminder => reminder.userId === userId);
  }

  async createReminder(insertReminder: InsertStudyReminder): Promise<StudyReminder> {
    const id = this.generateId();
    const reminder: StudyReminder = { ...insertReminder, id };
    this.reminders.set(id, reminder);
    return reminder;
  }

  async updateReminder(id: string, updates: Partial<StudyReminder>): Promise<StudyReminder | undefined> {
    const reminder = this.reminders.get(id);
    if (reminder) {
      const updatedReminder = { ...reminder, ...updates };
      this.reminders.set(id, updatedReminder);
      return updatedReminder;
    }
    return undefined;
  }
}

export const storage = new MemStorage();
