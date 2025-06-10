import { useState, useEffect } from 'react';
import { User } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Mock user data - in production, this would come from your Supabase database
const createMockUser = (authUser: any): User => ({
  id: authUser.id,
  name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
  email: authUser.email || '',
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
});

export function useUserData() {
  const { user: authUser, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (authUser) {
        // In production, fetch user data from Supabase database here
        const userData = createMockUser(authUser);
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    }
  }, [authUser, authLoading]);

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return { user, loading: loading || authLoading, updateUser };
}