export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  streak: number;
  currency: string;
  region: string;
  completedLessons: string[];
  achievements: Achievement[];
  subscriptionStatus: 'free' | 'premium';
  goal?: string;
  
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  isPremium: boolean;
  videoUrl: string;
  thumbnailUrl: string;
  xpReward: number;
  topics: string[];
}

export interface Quiz {
  id: string;
  lessonId: string;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt: Date;
  xpReward: number;
}

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
  isRecurring: boolean;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  relatedTerms: string[];
}