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


export interface Quiz {
  courseId: string;
  title: string;
  description: string;
  totalQuestions: number;
  timeLimit: number; // in minutes
  passingScore: number; // percentage
  questions: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
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
  body: string;
  message: string;
  notification_type: "material_ready" | "new_enrollment" | "course_announcement" | "admin_request_approved" | "info" | "success" | "warning" | "course";
  type: "material_ready" | "new_enrollment" | "course_announcement" | "admin_request_approved" | "info" | "success" | "warning" | "course";
  read: boolean;
  data: Record<string, string>;
  created_at: string;
}

export interface HeatmapData {
  topic: string;
  questions_asked: number;
  avg_confidence: number;
  struggling_students: number;
  questionsAsked?: number;
  avgConfidence?: number;
  strugglingStudents?: number;
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

const quizzes: Quiz[] = [
   {
      courseId: "c1",
      title: "Introduction to Machine Learning Quiz",
      description: "Test your knowledge of abstract data types, algorithms, and complexity analysis.",
      totalQuestions: 10,
      timeLimit: 15,
      passingScore: 70,
      questions: [
        {id: "q-001-01", question: "What is the time complexity of accessing an element in an array by index?", options: ["O(n)", "O(log n)", "O(1)", "O(n²)"], correctIndex: 2, explanation: "Array index access is O(1) — constant time — because elements are stored contiguously in memory."},
        {id: "q-001-02", question: "Which data structure operates on a Last-In-First-Out (LIFO) principle?", options: ["Queue", "Stack", "Linked List", "Heap"], correctIndex: 1, explanation: "A Stack follows LIFO: the last element pushed is the first one popped."},
        {id: "q-001-03", question: "What is the worst-case time complexity of QuickSort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], correctIndex: 2, explanation: "QuickSort degrades to O(n²) when the pivot is consistently the smallest or largest element."},
        {id: "q-001-04", question: "In Big O notation, which describes the fastest growth rate?", options: ["O(n log n)", "O(2ⁿ)", "O(n³)", "O(n!)"], correctIndex: 3, explanation: "O(n!) — factorial time — grows faster than exponential O(2ⁿ) and polynomial complexities."},
        {id: "q-001-05", question: "Which traversal visits the root node first in a binary tree?", options: ["Inorder", "Postorder", "Preorder", "Level-order"], correctIndex: 2, explanation: "Preorder traversal visits: Root → Left → Right."},
        {id: "q-001-06", question: "What is the average-case lookup time for a Hash Table?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctIndex: 3, explanation: "Hash tables provide O(1) average lookup using a hash function to directly address memory."},
        {id: "q-001-07", question: "A linked list node contains which of the following?", options: ["Only data", "Data and a pointer to the next node", "Only a pointer", "Index and data"], correctIndex: 1, explanation: "Each linked list node stores data and a reference (pointer) to the next node in the chain."},
        {id: "q-001-08", question: "Which data structure is best suited for implementing a breadth-first search?", options: ["Stack", "Heap", "Queue", "Array"], correctIndex: 2, explanation: "BFS uses a Queue to process nodes level by level, ensuring FIFO ordering."},
        {id: "q-001-09", question: "What property must a Max-Heap satisfy?", options: ["Parent is always smaller than its children", "Parent is always greater than or equal to its children", "Left child is always greater than right child", "All leaves must be at the same level"], correctIndex: 1, explanation: "In a Max-Heap, every parent node is ≥ its children, ensuring the maximum is always at the root."},
        {id: "q-001-10", question: "What is the space complexity of Merge Sort?", options: ["O(1)", "O(log n)", "O(n)", "O(n²)"], "correctIndex": 2, explanation: "Merge Sort requires O(n) auxiliary space to hold the temporary arrays during merging."}
      ]
    },
     {
      courseId: "c2",
      title: "Data Structures & Algorithms Quiz",
      description: "Assess your grasp of HTML, CSS, JavaScript, and modern web development practices.",
      totalQuestions: 10,
      timeLimit: 15,
      passingScore: 70,
      questions: [
        {id: "q-002-01", question: "Which HTML element is used to define the main content of a document?", options: ["<section>", "<article>", "<main>", "<body>"], correctIndex: 2, explanation: "<main> represents the dominant content of the <body>, unique to the document."},
        {id: "q-002-02", question: "In CSS Flexbox, which property aligns items along the cross axis?", options: ["justify-content", "align-items", "flex-direction", "flex-wrap"], correctIndex: 1, explanation: "align-items controls alignment perpendicular to the main axis (the cross axis)."},
        {id: "q-002-03", question: "What does the JavaScript `typeof null` return?", options: ["'null'", "'undefined'", "'object'", "'boolean'"], correctIndex: 2, explanation: "This is a known JavaScript bug — typeof null returns 'object' due to legacy implementation."},
        {id: "q-002-04", question: "Which method is used to add an event listener to a DOM element?", options: ["element.on()", "element.addEvent()", "element.addEventListener()", "element.listen()"], correctIndex: 2, explanation: "addEventListener() is the standard method for attaching event handlers to DOM elements."},
        {id: "q-002-05", question: "What is the output of `Promise.resolve(1).then(x => x + 1).then(x => x * 2)`?", options: ["2", "3", "4", "6"], correctIndex: 2, explanation: "1 + 1 = 2, then 2 * 2 = 4. Each .then() chains the resolved value forward."},
        {id: "q-002-06", question: "Which CSS property controls the stacking order of elements?", options: ["order", "z-index", "position", "layer"], correctIndex: 1, explanation: "z-index determines which elements appear on top when they overlap, on positioned elements."},
        {id: "q-002-07", question: "In React, what hook would you use to run a side effect after render?", options: ["useState", "useContext", "useEffect", "useRef"], correctIndex: 2, explanation: "useEffect runs after every render by default, ideal for API calls, subscriptions, and DOM mutations."},
        {id: "q-002-08", question: "What HTTP status code indicates a resource was successfully created?", options: ["200", "204", "301", "201"], correctIndex: 3, explanation: "201 Created is returned when a POST request successfully creates a new resource."},
        {id: "q-002-09", question: "Which of the following is NOT a valid way to declare a variable in modern JavaScript?", options: ["let x = 1", "const x = 1", "var x = 1", "def x = 1"], correctIndex: 3, explanation: "`def` is not a JavaScript keyword — it's used in Python. JS uses var, let, and const."},
        {id: "q-002-10", question: "What does CSS `box-sizing: border-box` do?", options: ["Adds a visible border to all elements", "Includes padding and border in the element's total width/height", "Removes default margins from elements", "Sets the box shadow on all sides"], correctIndex: 1, explanation: "border-box makes width/height include padding and border, preventing layout overflow surprises."}
      ]
    },
    {
      courseId: "c3",
      title: "Linear Algebra Quiz",
      description: "Challenge your knowledge of relational databases, SQL queries, and optimization strategies.",
      totalQuestions: 10,
      timeLimit: 15,
      passingScore: 70,
      questions: [
        {id: "q-003-01", question: "Which SQL clause is used to filter grouped results?", options: ["WHERE", "HAVING", "FILTER", "GROUP BY"], correctIndex: 1, explanation: "HAVING filters groups after GROUP BY; WHERE filters rows before grouping."},
        {id: "q-003-02", question: "What is a PRIMARY KEY in a relational database?", options: ["A key that can contain NULL values", "A foreign reference to another table", "A unique, non-null identifier for each row", "An index on multiple columns"], correctIndex: 2, explanation: "A PRIMARY KEY uniquely identifies each record and cannot be NULL."},
        {id: "q-003-03", question: "Which JOIN returns all rows from both tables, with NULLs where there is no match?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], correctIndex: 3, explanation: "FULL OUTER JOIN returns all rows from both tables, filling NULLs where matches don't exist."},
        {id: "q-003-04", question: "What is database normalization primarily designed to reduce?", options: ["Query speed", "Data redundancy", "Table count", "Index size"], correctIndex: 1, explanation: "Normalization organizes data to minimize redundancy and dependency anomalies."},
        {id: "q-003-05", question: "Which SQL command removes all rows from a table without logging individual row deletions?", options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"], correctIndex: 2, explanation: "TRUNCATE is faster than DELETE as it deallocates data pages without logging each row removal."},
        {id: "q-003-06", question: "What does an index in a database primarily improve?", options: ["Write performance", "Storage efficiency", "Read/query performance", "Data integrity"], correctIndex: 2, explanation: "Indexes speed up SELECT queries by allowing the database to find rows without a full table scan."},
        {id: "q-003-07", question: "Which normal form eliminates transitive dependencies?", options: ["1NF", "2NF", "3NF", "BCNF"], correctIndex: 2, explanation: "3NF eliminates transitive dependencies — non-key columns depending on other non-key columns."},
        {id: "q-003-08", question: "What does ACID stand for in database transactions?", options: ["Atomic, Consistent, Isolated, Durable", "Accurate, Complete, Indexed, Defined", "Async, Cached, Integrated, Distributed", "Automated, Committed, Isolated, Dynamic"], correctIndex: 0, explanation: "ACID ensures reliable transactions: Atomicity, Consistency, Isolation, Durability."},
        {id: "q-003-09", question: "Which SQL function returns the number of rows in a result set?", options: ["SUM()", "TOTAL()", "COUNT()", "LENGTH()"], correctIndex: 2, explanation: "COUNT() returns the number of rows matching the query criteria."},
        {id: "q-003-10", question: "What is a composite index?", options: ["An index on a JSON column", "An index created on multiple columns", "A clustered index on the primary key", "An index that covers all columns"], correctIndex: 1, explanation: "A composite index spans multiple columns and is most effective when queries filter by those columns in order."}
      ]
    },
    {
      courseId: "c4",
      title: "Quantum Mechanics I Quiz",
      description: "Test your understanding of ML algorithms, model evaluation, and practical applications.",
      totalQuestions: 10,
      timeLimit: 15,
      passingScore: 70,
      questions: [
        {id: "q-004-01", question: "What is overfitting in machine learning?", options: ["Model performs well on training and test data", "Model performs poorly on all data", "Model performs well on training data but poorly on unseen data", "Model trains too slowly"], correctIndex: 2, explanation: "Overfitting occurs when a model memorizes training data and fails to generalize to new examples."},
        {id: "q-004-02", question: "Which metric is most appropriate for evaluating a classification model with imbalanced classes?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "R² Score"], correctIndex: 1, explanation: "F1 Score balances precision and recall, making it ideal when class distribution is uneven."},
        {id: "q-004-03", question: "What does a gradient descent algorithm minimize?", options: ["Training data size", "Number of features", "Loss function", "Learning rate"], correctIndex: 2, explanation: "Gradient descent iteratively adjusts parameters to minimize the model's loss (error) function."},
        {id: "q-004-04", question: "Which technique is used to prevent overfitting by penalizing large weights?", options: ["Normalization", "Regularization", "Activation", "Batching"], correctIndex: 1, explanation: "Regularization (L1/L2) adds a penalty term to the loss function to discourage overly complex models."},
        {id: "q-004-05", question: "In supervised learning, what is the training data composed of?", options: ["Unlabeled examples", "Input features only", "Input-output pairs (features and labels)", "Output labels only"], correctIndex: 2, explanation: "Supervised learning requires labeled examples — pairs of input features and their correct output labels."},
        {id: "q-004-06", question: "What is the purpose of a validation set in model training?", options: ["To train the final model", "To tune hyperparameters and detect overfitting during training", "To replace the test set", "To augment training data"], correctIndex: 1, explanation: "The validation set helps tune hyperparameters and monitor for overfitting without touching the test set."},
        {id: "q-004-07", question: "Which algorithm builds a model by combining multiple weak learners?", options: ["Linear Regression", "K-Nearest Neighbors", "Random Forest", "PCA"], correctIndex: 2, explanation: "Random Forest is an ensemble method that combines many decision trees to produce better predictions."},
        {id: "q-004-08", question: "What does PCA (Principal Component Analysis) primarily do?", options: ["Classifies data into categories", "Reduces dimensionality while preserving variance", "Imputes missing values", "Normalizes feature scales"], correctIndex: 1, explanation: "PCA transforms data into fewer dimensions (principal components) capturing the most variance."},
        {id: "q-004-09", question: "Which activation function is most commonly used in hidden layers of deep neural networks?", options: ["Sigmoid", "Softmax", "ReLU", "Tanh"], correctIndex: 2, explanation: "ReLU (Rectified Linear Unit) is preferred for hidden layers as it mitigates the vanishing gradient problem."},
        {id: "q-004-10", question: "What is cross-validation used for?", options: ["Augmenting training data", "Estimating how well a model generalizes to independent data", "Cleaning noisy datasets", "Selecting the right activation function"], correctIndex: 1, explanation: "Cross-validation (e.g. k-fold) estimates generalization performance by testing on different data splits."}
      ]
    }
]



const notifications: Notification[] = [
  {
    id: "n1",
    title: "New Material Uploaded",
    body: "Prof. Chen uploaded 'Lecture 8 - Neural Networks.pdf' to CSC3022F.",
    message: "Prof. Chen uploaded 'Lecture 8 - Neural Networks.pdf' to CSC3022F.",
    notification_type: "course",
    type: "course",
    read: false,
    data: { course_id: "c1" },
    created_at: "2026-03-11T10:30:00Z",
  },
  {
    id: "n2",
    title: "Study Streak!",
    body: "You've studied 5 days in a row. Keep it up!",
    message: "You've studied 5 days in a row. Keep it up!",
    notification_type: "success",
    type: "success",
    read: false,
    data: {},
    created_at: "2026-03-10T18:00:00Z",
  },
  {
    id: "n3",
    title: "Heatmap Alert",
    body: "Students in CSC3022F are struggling with 'Backpropagation'. Consider adding resources.",
    message: "Students in CSC3022F are struggling with 'Backpropagation'. Consider adding resources.",
    notification_type: "warning",
    type: "warning",
    read: true,
    data: {},
    created_at: "2026-03-09T14:00:00Z",
  },
  {
    id: "n4",
    title: "System Update",
    body: "Acadexis will undergo maintenance on March 15th from 2-4 AM.",
    message: "Acadexis will undergo maintenance on March 15th from 2-4 AM.",
    notification_type: "info",
    type: "info",
    read: true,
    data: {},
    created_at: "2026-03-08T09:00:00Z",
  },
];

const heatmapData: HeatmapData[] = [
  {
    topic: "Backpropagation",
    questions_asked: 89,
    avg_confidence: 0.32,
    struggling_students: 67,
    questionsAsked: 89,
    avgConfidence: 0.32,
    strugglingStudents: 67,
  },
  {
    topic: "Gradient Descent",
    questions_asked: 72,
    avg_confidence: 0.45,
    struggling_students: 51,
    questionsAsked: 72,
    avgConfidence: 0.45,
    strugglingStudents: 51,
  },
  {
    topic: "Overfitting & Regularization",
    questions_asked: 65,
    avg_confidence: 0.41,
    struggling_students: 48,
    questionsAsked: 65,
    avgConfidence: 0.41,
    strugglingStudents: 48,
  },
  {
    topic: "Decision Trees",
    questions_asked: 34,
    avg_confidence: 0.72,
    struggling_students: 18,
    questionsAsked: 34,
    avgConfidence: 0.72,
    strugglingStudents: 18,
  },
  {
    topic: "K-Means Clustering",
    questions_asked: 28,
    avg_confidence: 0.68,
    struggling_students: 15,
    questionsAsked: 28,
    avgConfidence: 0.68,
    strugglingStudents: 15,
  },
  {
    topic: "Neural Network Architecture",
    questions_asked: 56,
    avg_confidence: 0.38,
    struggling_students: 42,
    questionsAsked: 56,
    avgConfidence: 0.38,
    strugglingStudents: 42,
  },
  {
    topic: "Loss Functions",
    questions_asked: 45,
    avg_confidence: 0.52,
    struggling_students: 30,
    questionsAsked: 45,
    avgConfidence: 0.52,
    strugglingStudents: 30,
  },
  {
    topic: "Feature Engineering",
    questions_asked: 21,
    avg_confidence: 0.78,
    struggling_students: 10,
    questionsAsked: 21,
    avgConfidence: 0.78,
    strugglingStudents: 10,
  },
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

  async getQuizByCourseId(courseId: string): Promise<Quiz | undefined> {
    await delay(400);
    return quizzes.find((quiz) => quiz.courseId === courseId);
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
