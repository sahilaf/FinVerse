import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

export function useUserData() {
  const { profile, loading, updateProfile } = useAuth();

  // Convert Supabase profile to app User type
  const user: User | null = profile ? {
    id: profile.id,
    name: profile.full_name,
    email: profile.email,
    avatarUrl: profile.avatar_url,
    level: profile.level,
    xp: profile.xp,
    streak: profile.streak,
    currency: profile.currency,
    region: profile.region,
    completedLessons: profile.completed_lessons,
    achievements: profile.achievements,
    subscriptionStatus: profile.subscription_status,
  } : null;

  const updateUser = async (updates: Partial<User>) => {
    // Convert User updates to profile updates
    const profileUpdates: any = {};
    
    if (updates.name) profileUpdates.full_name = updates.name;
    if (updates.avatarUrl) profileUpdates.avatar_url = updates.avatarUrl;
    if (updates.level !== undefined) profileUpdates.level = updates.level;
    if (updates.xp !== undefined) profileUpdates.xp = updates.xp;
    if (updates.streak !== undefined) profileUpdates.streak = updates.streak;
    if (updates.currency) profileUpdates.currency = updates.currency;
    if (updates.region) profileUpdates.region = updates.region;
    if (updates.completedLessons) profileUpdates.completed_lessons = updates.completedLessons;
    if (updates.achievements) profileUpdates.achievements = updates.achievements;
    if (updates.subscriptionStatus) profileUpdates.subscription_status = updates.subscriptionStatus;

    return await updateProfile(profileUpdates);
  };

  return { user, loading, updateUser };
}