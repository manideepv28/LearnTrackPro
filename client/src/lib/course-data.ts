import { Course } from "@shared/schema";

export const COURSE_DATA: Course[] = [
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

export const CATEGORIES = [
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'devops', label: 'DevOps' },
] as const;

export const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
] as const;
