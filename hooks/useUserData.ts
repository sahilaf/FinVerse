import { useState, useEffect } from 'react';
import { User } from '@/types';

// Mock user data - in production, this would come from your backend/database
const mockUser: User = {
  id: '1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  level: 3,
  xp: 1250,
  streak: 7,
  currency: 'USD',
  region: 'US',
  completedLessons: ['1', '2', '3'],
  achievements: [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      iconName: 'Star',
      unlockedAt: new Date(),
      xpReward: 50
    },
    {
      id: '2',
      title: 'Streak Master',
      description: 'Maintain a 7-day learning streak',
      iconName: 'Flame',
      unlockedAt: new Date(),
      xpReward: 100
    }
  ],
  subscriptionStatus: 'free'
};

export function useUserData() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => {
      setUser(mockUser);
      setLoading(false);
    }, 1000);
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return { user, loading, updateUser };
}