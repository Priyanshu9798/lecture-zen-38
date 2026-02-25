import type { Lecture, LectureDetail, ChatMessage, QuizAttempt } from '@/types';

const API_BASE = '/api'; // swap to real backend URL later

// Simulate network delay
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

// ---- Mock Data ----

const mockLectures: Lecture[] = [
  {
    id: '1',
    title: 'Introduction to Machine Learning',
    date: '2026-02-20',
    duration: 3600,
    quizScore: 85,
    nextReviewDate: '2026-02-27',
    hasTranscript: true,
    hasSummary: true,
    fileType: 'audio',
  },
  {
    id: '2',
    title: 'Neural Networks & Deep Learning',
    date: '2026-02-18',
    duration: 2700,
    quizScore: 72,
    nextReviewDate: '2026-02-25',
    hasTranscript: true,
    hasSummary: true,
    fileType: 'audio',
  },
  {
    id: '3',
    title: 'Natural Language Processing Fundamentals',
    date: '2026-02-15',
    duration: 4200,
    hasTranscript: true,
    hasSummary: true,
    fileType: 'pdf',
  },
];

const mockLectureDetail: LectureDetail = {
  lecture: mockLectures[0],
  transcript: [
    { id: '1', timestamp: 0, text: 'Welcome to today\'s lecture on machine learning. We\'ll be covering the fundamentals of supervised and unsupervised learning.' },
    { id: '2', timestamp: 30, text: 'Machine learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.' },
    { id: '3', timestamp: 65, text: 'There are three main types: supervised learning, unsupervised learning, and reinforcement learning.' },
    { id: '4', timestamp: 120, text: 'In supervised learning, we train models using labeled data. The algorithm learns to map inputs to known outputs.' },
    { id: '5', timestamp: 180, text: 'Common supervised learning algorithms include linear regression, decision trees, and support vector machines.' },
    { id: '6', timestamp: 240, text: 'Unsupervised learning works with unlabeled data. The algorithm tries to find hidden patterns or structures.' },
    { id: '7', timestamp: 300, text: 'Clustering and dimensionality reduction are key unsupervised learning techniques.' },
    { id: '8', timestamp: 360, text: 'Let\'s now discuss the bias-variance tradeoff, which is fundamental to understanding model performance.' },
  ],
  summary: [
    {
      heading: 'Overview of Machine Learning',
      points: [
        'Machine learning is a subset of AI focused on learning from data',
        'Three main paradigms: supervised, unsupervised, and reinforcement learning',
        'Applications span healthcare, finance, NLP, and computer vision',
      ],
    },
    {
      heading: 'Supervised Learning',
      points: [
        'Uses labeled training data to learn input-output mappings',
        'Common algorithms: linear regression, decision trees, SVMs, neural networks',
        'Evaluated using metrics like accuracy, precision, recall, and F1 score',
      ],
    },
    {
      heading: 'Unsupervised Learning',
      points: [
        'Works with unlabeled data to discover hidden patterns',
        'Key techniques: K-means clustering, hierarchical clustering, PCA',
        'Used for customer segmentation, anomaly detection, and feature extraction',
      ],
    },
    {
      heading: 'Bias-Variance Tradeoff',
      points: [
        'High bias leads to underfitting — model too simple',
        'High variance leads to overfitting — model too complex',
        'Goal is to find the sweet spot that minimizes total error',
      ],
    },
  ],
  notes: '',
  quiz: [
    {
      id: 'q1',
      question: 'Which type of learning uses labeled data?',
      options: ['Unsupervised Learning', 'Supervised Learning', 'Reinforcement Learning', 'Transfer Learning'],
      correctIndex: 1,
      explanation: 'Supervised learning uses labeled training data where both inputs and desired outputs are provided to the algorithm.',
    },
    {
      id: 'q2',
      question: 'What is overfitting a result of?',
      options: ['High bias', 'High variance', 'Low variance', 'Low complexity'],
      correctIndex: 1,
      explanation: 'Overfitting occurs when a model has high variance — it fits the training data too closely and fails to generalize.',
    },
    {
      id: 'q3',
      question: 'Which technique is used in unsupervised learning?',
      options: ['Linear Regression', 'Decision Trees', 'K-means Clustering', 'Logistic Regression'],
      correctIndex: 2,
      explanation: 'K-means clustering is an unsupervised learning technique that groups data points into K clusters based on similarity.',
    },
    {
      id: 'q4',
      question: 'What does PCA stand for?',
      options: ['Primary Component Adjustment', 'Principal Component Analysis', 'Partial Cluster Analysis', 'Predictive Classification Algorithm'],
      correctIndex: 1,
      explanation: 'PCA (Principal Component Analysis) is a dimensionality reduction technique used in unsupervised learning.',
    },
    {
      id: 'q5',
      question: 'Which metric is NOT commonly used for classification?',
      options: ['Accuracy', 'Mean Squared Error', 'Precision', 'Recall'],
      correctIndex: 1,
      explanation: 'Mean Squared Error is primarily used for regression tasks, not classification. Classification uses accuracy, precision, recall, and F1.',
    },
  ],
  flashcards: [
    { id: 'f1', question: 'What is supervised learning?', answer: 'A type of machine learning where the model is trained on labeled data with known inputs and outputs.', nextReview: '2026-02-27', difficulty: 3 },
    { id: 'f2', question: 'Name three supervised learning algorithms.', answer: 'Linear regression, decision trees, and support vector machines (SVMs).', nextReview: '2026-02-28', difficulty: 2 },
    { id: 'f3', question: 'What is the bias-variance tradeoff?', answer: 'The balance between model simplicity (bias) and complexity (variance). High bias = underfitting, high variance = overfitting.', nextReview: '2026-03-01', difficulty: 4 },
    { id: 'f4', question: 'What is K-means clustering?', answer: 'An unsupervised learning algorithm that partitions data into K clusters by minimizing within-cluster variance.', nextReview: '2026-02-26', difficulty: 3 },
    { id: 'f5', question: 'What is PCA used for?', answer: 'Principal Component Analysis reduces dimensionality by projecting data onto the directions of maximum variance.', nextReview: '2026-03-02', difficulty: 4 },
  ],
};

// ---- API Functions ----

export async function login(email: string, password: string) {
  await delay(800);
  // Mock: accept any credentials
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: { id: '1', email, name: email.split('@')[0] },
  };
}

export async function signup(email: string, password: string, name: string) {
  await delay(800);
  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: { id: '1', email, name },
  };
}

export async function getLectures(): Promise<Lecture[]> {
  await delay(600);
  return mockLectures;
}

export async function getLectureDetail(id: string): Promise<LectureDetail> {
  await delay(800);
  const lecture = mockLectures.find(l => l.id === id) || mockLectures[0];
  return { ...mockLectureDetail, lecture };
}

export async function uploadLecture(
  file: File,
  title: string,
  onProgress: (pct: number) => void
): Promise<Lecture> {
  // Simulate upload progress
  for (let i = 0; i <= 100; i += 10) {
    await delay(200);
    onProgress(i);
  }
  // Simulate processing
  await delay(1500);
  const newLecture: Lecture = {
    id: String(Date.now()),
    title,
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    hasTranscript: false,
    hasSummary: false,
    fileType: file.type.includes('pdf') ? 'pdf' : 'audio',
  };
  return newLecture;
}

export async function submitQuiz(lectureId: string, answers: number[]): Promise<QuizAttempt> {
  await delay(500);
  const correct = answers.filter((a, i) => a === mockLectureDetail.quiz[i]?.correctIndex).length;
  return {
    lectureId,
    score: correct,
    total: mockLectureDetail.quiz.length,
    date: new Date().toISOString(),
  };
}

export async function sendChatMessage(lectureId: string, message: string): Promise<string> {
  await delay(300);
  const responses = [
    `Based on the lecture content, ${message.toLowerCase().includes('supervised') ? 'supervised learning uses labeled data where the algorithm learns to map inputs to known outputs.' : 'machine learning is a powerful approach that enables systems to learn from data.'}`,
    `Great question! The lecture at [02:00] discusses this topic in detail. The key insight is that model selection depends on the nature of your data and the problem you\'re trying to solve.`,
    `According to the lecture material, there are several important concepts here. At [05:00], the professor explains that unsupervised learning discovers hidden patterns without labeled data.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function searchLectures(query: string): Promise<Lecture[]> {
  await delay(400);
  return mockLectures.filter(l =>
    l.title.toLowerCase().includes(query.toLowerCase())
  );
}
