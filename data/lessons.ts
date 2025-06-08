import { Lesson } from '@/types';

export const lessons: Lesson[] = [
  {
    id: '1',
    title: 'The 50/30/20 Budgeting Rule',
    description: 'Learn the golden rule of budgeting that will transform your financial life',
    duration: 8,
    difficulty: 'beginner',
    category: 'Budgeting',
    isPremium: false,
    videoUrl: 'https://example.com/video1',
    thumbnailUrl: 'https://images.pexels.com/photos/4386366/pexels-photo-4386366.jpeg?auto=compress&cs=tinysrgb&w=800',
    xpReward: 100,
    topics: ['budgeting', 'saving', 'expenses']
  },
  {
    id: '2',
    title: 'Understanding Credit Scores',
    description: 'Demystify credit scores and learn how to build excellent credit',
    duration: 12,
    difficulty: 'beginner',
    category: 'Credit',
    isPremium: false,
    videoUrl: 'https://example.com/video2',
    thumbnailUrl: 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=800',
    xpReward: 120,
    topics: ['credit', 'credit score', 'financial health']
  },
  {
    id: '3',
    title: 'Emergency Fund Essentials',
    description: 'Build a safety net that protects you from financial emergencies',
    duration: 10,
    difficulty: 'beginner',
    category: 'Saving',
    isPremium: false,
    videoUrl: 'https://example.com/video3',
    thumbnailUrl: 'https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=800',
    xpReward: 110,
    topics: ['emergency fund', 'saving', 'financial security']
  },
  {
    id: '4',
    title: 'Investing 101: Stocks & ETFs',
    description: 'Start your investment journey with confidence and knowledge',
    duration: 15,
    difficulty: 'intermediate',
    category: 'Investing',
    isPremium: true,
    videoUrl: 'https://example.com/video4',
    thumbnailUrl: 'https://images.pexels.com/photos/4386433/pexels-photo-4386433.jpeg?auto=compress&cs=tinysrgb&w=800',
    xpReward: 200,
    topics: ['investing', 'stocks', 'ETFs', 'market basics']
  },
  {
    id: '5',
    title: 'Retirement Planning Strategies',
    description: 'Secure your future with smart retirement planning techniques',
    duration: 18,
    difficulty: 'intermediate',
    category: 'Retirement',
    isPremium: true,
    videoUrl: 'https://example.com/video5',
    thumbnailUrl: 'https://images.pexels.com/photos/4386372/pexels-photo-4386372.jpeg?auto=compress&cs=tinysrgb&w=800',
    xpReward: 250,
    topics: ['retirement', '401k', 'IRA', 'compound interest']
  },
  {
    id: '6',
    title: 'Cryptocurrency Fundamentals',
    description: 'Navigate the world of digital assets and blockchain technology',
    duration: 20,
    difficulty: 'advanced',
    category: 'Crypto',
    isPremium: true,
    videoUrl: 'https://example.com/video6',
    thumbnailUrl: 'https://images.pexels.com/photos/4386335/pexels-photo-4386335.jpeg?auto=compress&cs=tinysrgb&w=800',
    xpReward: 300,
    topics: ['cryptocurrency', 'blockchain', 'digital assets', 'DeFi']
  }
];