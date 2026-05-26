// Mock Data Layer - mirrors Django models

export interface University {
  id: string;
  name: string;
}

export interface Faculty {
  id: string;
  name: string;
  universityId: string;
}

export interface Department {
  id: string;
  name: string;
  facultyId: string;
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  departmentId: string;
  lecturerId: string;
  lecturerName: string;
  materialsCount: number;
  studentsEnrolled: number;
  thumbnail?: string;
}

export interface CourseMaterial {
  id: string;
  courseId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
  status: "processing" | "ready" | "failed";
  pageCount?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { page: number; snippet: string; materialName: string }[];
  timestamp: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "course";
  read: boolean;
  createdAt: string;
}

export interface HeatmapData {
  topic: string;
  questionsAsked: number;
  avgConfidence: number;
  strugglingStudents: number;
}

// ---- Mock Data ----

const universities: University[] = [
  { id: "u1", name: "University of Cape Town" },
  { id: "u2", name: "Stellenbosch University" },
  { id: "u3", name: "University of the Witwatersrand" },
];

const faculties: Faculty[] = [
  { id: "f1", name: "Faculty of Engineering", universityId: "u1" },
  { id: "f2", name: "Faculty of Science", universityId: "u1" },
  { id: "f3", name: "Faculty of Humanities", universityId: "u1" },
  { id: "f4", name: "Faculty of Engineering", universityId: "u2" },
  { id: "f5", name: "Faculty of Medicine", universityId: "u2" },
  { id: "f6", name: "Faculty of Commerce", universityId: "u3" },
  { id: "f7", name: "Faculty of Science", universityId: "u3" },
];

const departments: Department[] = [
  { id: "d1", name: "Computer Science", facultyId: "f1" },
  { id: "d2", name: "Electrical Engineering", facultyId: "f1" },
  { id: "d3", name: "Mathematics", facultyId: "f2" },
  { id: "d4", name: "Physics", facultyId: "f2" },
  { id: "d5", name: "Philosophy", facultyId: "f3" },
  { id: "d6", name: "Mechanical Engineering", facultyId: "f4" },
  { id: "d7", name: "Biomedical Sciences", facultyId: "f5" },
  { id: "d8", name: "Accounting", facultyId: "f6" },
  { id: "d9", name: "Chemistry", facultyId: "f7" },
];

const courses: Course[] = [
  {
    id: "c1", title: "Introduction to Machine Learning", code: "CSC3022F",
    description: "Fundamentals of supervised and unsupervised learning, neural networks, and practical applications.",
    departmentId: "d1", lecturerId: "l1", lecturerName: "Prof. Sarah Chen",
    materialsCount: 12, studentsEnrolled: 145,
  },
  {
    id: "c2", title: "Data Structures & Algorithms", code: "CSC2001F",
    description: "Core data structures, algorithm design, and computational complexity analysis.",
    departmentId: "d1", lecturerId: "l1", lecturerName: "Prof. Sarah Chen",
    materialsCount: 8, studentsEnrolled: 210,
  },
  {
    id: "c3", title: "Linear Algebra", code: "MAM1020F",
    description: "Vector spaces, matrices, eigenvalues, and applications in data science.",
    departmentId: "d3", lecturerId: "l2", lecturerName: "Dr. James Moyo",
    materialsCount: 15, studentsEnrolled: 320,
  },
  {
    id: "c4", title: "Quantum Mechanics I", code: "PHY2014F",
    description: "Wave-particle duality, Schrödinger equation, and quantum states.",
    departmentId: "d4", lecturerId: "l3", lecturerName: "Prof. Amira Patel",
    materialsCount: 10, studentsEnrolled: 95,
  },
];

const notifications: Notification[] = [
  { id: "n1", title: "New Material Uploaded", message: "Prof. Chen uploaded 'Lecture 8 - Neural Networks.pdf' to CSC3022F.", type: "course", read: false, createdAt: "2026-03-11T10:30:00Z" },
  { id: "n2", title: "Study Streak!", message: "You've studied 5 days in a row. Keep it up!", type: "success", read: false, createdAt: "2026-03-10T18:00:00Z" },
  { id: "n3", title: "Heatmap Alert", message: "Students in CSC3022F are struggling with 'Backpropagation'. Consider adding resources.", type: "warning", read: true, createdAt: "2026-03-09T14:00:00Z" },
  { id: "n4", title: "System Update", message: "Acadexis will undergo maintenance on March 15th from 2-4 AM.", type: "info", read: true, createdAt: "2026-03-08T09:00:00Z" },
];

const heatmapData: HeatmapData[] = [
  { topic: "Backpropagation", questionsAsked: 89, avgConfidence: 0.32, strugglingStudents: 67 },
  { topic: "Gradient Descent", questionsAsked: 72, avgConfidence: 0.45, strugglingStudents: 51 },
  { topic: "Overfitting & Regularization", questionsAsked: 65, avgConfidence: 0.41, strugglingStudents: 48 },
  { topic: "Decision Trees", questionsAsked: 34, avgConfidence: 0.72, strugglingStudents: 18 },
  { topic: "K-Means Clustering", questionsAsked: 28, avgConfidence: 0.68, strugglingStudents: 15 },
  { topic: "Neural Network Architecture", questionsAsked: 56, avgConfidence: 0.38, strugglingStudents: 42 },
  { topic: "Loss Functions", questionsAsked: 45, avgConfidence: 0.52, strugglingStudents: 30 },
  { topic: "Feature Engineering", questionsAsked: 21, avgConfidence: 0.78, strugglingStudents: 10 },
];

const mockChatHistory: ChatMessage[] = [
  {
    id: "m1", role: "user", content: "What is backpropagation and how does it work in neural networks?",
    timestamp: "2026-03-11T10:00:00Z",
  },
  {
    id: "m2", role: "assistant",
    content: "Backpropagation is the primary algorithm for training neural networks. It works by computing the gradient of the loss function with respect to each weight through the chain rule, propagating errors backward from the output layer to the input layer.\n\nThe process involves two phases:\n1. **Forward pass**: Input data flows through the network to produce predictions\n2. **Backward pass**: The error is computed and gradients are calculated layer by layer\n\nThis allows the network to adjust weights to minimize the loss function.",
    sources: [
      { page: 42, snippet: "Backpropagation computes partial derivatives of the loss...", materialName: "Lecture 8 - Neural Networks.pdf" },
      { page: 45, snippet: "The chain rule enables efficient gradient computation...", materialName: "Lecture 8 - Neural Networks.pdf" },
    ],
    timestamp: "2026-03-11T10:00:05Z",
  },
];

// ---- API Service ----

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const api = {
  // Auth
  async login(email: string, _password: string) {
    await delay(800);
    const isLecturer = email.includes("prof") || email.includes("lecturer");
    return {
      user: {
        id: isLecturer ? "l1" : "s1",
        email,
        role: (isLecturer ? "lecturer" : "student") as "student" | "lecturer",
        universityId: "u1",
        firstName: isLecturer ? "Sarah" : "Alex",
        lastName: isLecturer ? "Chen" : "Nkosi",
        identificationNumber: isLecturer ? "LEC-001" : "STU-001",
        level: isLecturer ? "Professor" : "3rd Year",
        departmentId: "d1",
      },
    };
  },

  async register(_data: Record<string, string>) {
    await delay(1200);
    return { success: true };
  },

  // Universities cascade
  async getUniversities(): Promise<University[]> {
    await delay(300);
    return universities;
  },

  async getFaculties(universityId: string): Promise<Faculty[]> {
    await delay(300);
    return faculties.filter((f) => f.universityId === universityId);
  },

  async getDepartments(facultyId: string): Promise<Department[]> {
    await delay(300);
    return departments.filter((d) => d.facultyId === facultyId);
  },

  // Courses
  async getCourses(): Promise<Course[]> {
    await delay(500);
    return courses;
  },

  async getCourse(id: string): Promise<Course | undefined> {
    await delay(300);
    return courses.find((c) => c.id === id);
  },

  // Materials
  async getCourseMaterials(courseId: string): Promise<CourseMaterial[]> {
    await delay(400);
    return [
      { id: "cm1", courseId, fileName: "Lecture 8 - Neural Networks.pdf", fileType: "pdf", fileSize: 2400000, uploadedAt: "2026-03-05T10:00:00Z", status: "ready", pageCount: 52 },
      { id: "cm2", courseId, fileName: "Tutorial 4 - Gradient Descent.pdf", fileType: "pdf", fileSize: 890000, uploadedAt: "2026-03-07T14:30:00Z", status: "ready", pageCount: 18 },
      { id: "cm3", courseId, fileName: "Lab Manual - Week 9.pdf", fileType: "pdf", fileSize: 1500000, uploadedAt: "2026-03-10T09:00:00Z", status: "processing", pageCount: 30 },
    ];
  },

  async uploadMaterial(_courseId: string, _file: File) {
    await delay(2000);
    return { id: "cm-new", status: "processing" as const };
  },

  // Chat
  async getChatHistory(_courseId: string): Promise<ChatMessage[]> {
    await delay(400);
    return mockChatHistory;
  },

  async sendMessage(_courseId: string, message: string): Promise<ChatMessage> {
    await delay(1500);
    return {
      id: `m-${Date.now()}`,
      role: "assistant",
      content: `Based on the course materials, here's what I found regarding "${message.slice(0, 50)}":\n\nThe key concepts relate to the fundamental principles discussed in the lecture notes. The material emphasizes understanding through practical application and theoretical grounding.\n\nI'd recommend reviewing the referenced sections for a deeper understanding.`,
      sources: [
        { page: 15, snippet: "The fundamental theorem states that...", materialName: "Lecture 8 - Neural Networks.pdf" },
      ],
      timestamp: new Date().toISOString(),
    };
  },

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    await delay(300);
    return notifications;
  },

  async markNotificationRead(id: string) {
    await delay(200);
    const n = notifications.find((x) => x.id === id);
    if (n) n.read = true;
    return { success: true };
  },

  // Heatmap
  async getHeatmapData(_courseId: string): Promise<HeatmapData[]> {
    await delay(600);
    return heatmapData;
  },

  // Profile
  async updateProfile(_data: Record<string, string>) {
    await delay(800);
    return { success: true };
  },

  // Support
  async submitContactForm(_data: Record<string, string>) {
    await delay(1000);
    return { success: true };
  },

  async submitReport(_data: Record<string, string>) {
    await delay(1000);
    return { success: true };
  },

  async submitAdminRequest(_data: { reason: string; documentProof?: File }) {
    await delay(1200);
    return { success: true };
  },
};
