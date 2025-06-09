import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, Calculator, Sparkles } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useColorScheme } from '@/hooks/useColorScheme';
import XPProgressCard from '@/components/XPProgressCard';
import LessonCard from '@/components/LessonCard';
import AchievementBadge from '@/components/AchievementBadge';
import { lessons } from '@/data/lessons';

export default function Dashboard() {
  const { user, loading } = useUserData();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-base font-inter-medium text-gray-600 dark:text-gray-400">
          Loading your financial journey...
        </Text>
      </View>
    );
  }

  const suggestedLessons = lessons
    .filter(lesson => !user.completedLessons.includes(lesson.id))
    .slice(0, 3);

  const recentAchievements = user.achievements.slice(-3);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient 
          colors={isDark ? ['#047857', '#065F46'] : ['#065F46', '#047857']} 
          className="px-5 py-8 rounded-b-3xl pt-16"
        >
          <Text className="text-base font-inter text-white/80">Good morning,</Text>
          <Text className="text-3xl font-poppins-bold text-white mb-1">{user.name} 👋</Text>
          <Text className="text-sm font-inter text-white/70">
            Ready to level up your financial knowledge?
          </Text>
        </LinearGradient>

        <View className="p-5">
          {/* XP Progress */}
          <XPProgressCard
            level={user.level}
            currentXP={user.xp}
            xpToNextLevel={500 - (user.xp % 500)}
            streak={user.streak}
          />

          {/* Quick Actions */}
          <View className="mb-8">
            <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </Text>
            <View className="flex-row gap-4">
              <TouchableOpacity 
                className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl items-center shadow-sm"
                onPress={() => router.push('/learn')}
              >
                <BookOpen size={24} color="#10B981" />
                <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300 mt-2 text-center">
                  Continue Learning
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                className="flex-1 bg-white dark:bg-gray-800 p-5 rounded-2xl items-center shadow-sm"
                onPress={() => router.push('/budget')}
              >
                <Calculator size={24} color="#3B82F6" />
                <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300 mt-2 text-center">
                  Track Budget
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Suggested Lessons */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white">
                Recommended for You
              </Text>
              <TouchableOpacity onPress={() => router.push('/learn')}>
                <Text className="text-sm font-inter-semibold text-primary-500">See All</Text>
              </TouchableOpacity>
            </View>
            
            {suggestedLessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                onPress={(lesson) => {
                  if (lesson.isPremium && user.subscriptionStatus === 'free') {
                    router.push('/premium');
                  } else {
                    router.push(`/lesson/${lesson.id}` as any);
                  }
                }}
                isCompleted={user.completedLessons.includes(lesson.id)}
              />
            ))}
          </View>

          {/* Recent Achievements */}
          {recentAchievements.length > 0 && (
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white">
                  Recent Achievements
                </Text>
                <TouchableOpacity onPress={() => router.push('/achievements')}>
                  <Text className="text-sm font-inter-semibold text-primary-500">See All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 pr-5">
                  {recentAchievements.map((achievement) => (
                    <AchievementBadge
                      key={achievement.id}
                      achievement={achievement}
                      size="medium"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Financial Tip of the Day */}
          <View className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-5">
            <View className="flex-row items-center mb-3">
              <Sparkles size={20} color="#F59E0B" />
              <Text className="text-base font-inter-semibold text-amber-800 dark:text-amber-200 ml-2">
                Financial Tip of the Day
              </Text>
            </View>
            <Text className="text-sm font-inter text-amber-900 dark:text-amber-100 leading-5">
              Start your emergency fund with just $25. Small consistent contributions 
              build powerful financial security over time.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}