import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Target, Award } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useColorScheme } from '@/hooks/useColorScheme';
import AchievementBadge from '@/components/AchievementBadge';
import ProgressBar from '@/components/ProgressBar';

const allAchievements = [
  {
    id: '1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    iconName: 'Star',
    unlockedAt: new Date(),
    xpReward: 50,
    unlocked: true
  },
  {
    id: '2',
    title: 'Streak Master',
    description: 'Maintain a 7-day learning streak',
    iconName: 'Flame',
    unlockedAt: new Date(),
    xpReward: 100,
    unlocked: true
  },
  {
    id: '3',
    title: 'Knowledge Seeker',
    description: 'Complete 5 lessons',
    iconName: 'Trophy',
    xpReward: 150,
    unlocked: false,
    unlockedAt: new Date(0),
    progress: 3,
    target: 5
  },
  {
    id: '4',
    title: 'Budget Master',
    description: 'Create your first budget',
    iconName: 'Target',
    xpReward: 100,
    unlocked: false,
    unlockedAt: new Date(0)
  },
  {
    id: '5',
    title: 'Quiz Ace',
    description: 'Score 100% on 3 quizzes',
    iconName: 'Award',
    xpReward: 200,
    unlocked: false,
    unlockedAt: new Date(0),
    progress: 1,
    target: 3
  },
  {
    id: '6',
    title: 'Financial Guru',
    description: 'Reach Level 5',
    iconName: 'Zap',
    xpReward: 500,
    unlocked: false,
    unlockedAt: new Date(0),
    progress: 3,
    target: 5
  }
];

export default function Achievements() {
  const { user } = useUserData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-base font-inter-medium text-gray-600 dark:text-gray-400">
          Loading achievements...
        </Text>
      </View>
    );
  }

  const unlockedAchievements = allAchievements.filter(a => a.unlocked);
  const lockedAchievements = allAchievements.filter(a => !a.unlocked);
  const totalXPEarned = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);
  const achievementProgress = (unlockedAchievements.length / allAchievements.length) * 100;

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
          <Text className="text-3xl font-poppins-bold text-gray-900 dark:text-white mb-1">Achievements</Text>
          <Text className="text-base font-inter text-gray-600 dark:text-gray-400">
            Track your learning milestones
          </Text>
        </View>

        {/* Progress Overview */}
        <View className="p-5">
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            className="rounded-2xl p-5 mb-6"
          >
            <View className="flex-row items-center mb-5">
              <Trophy size={24} color="#FFF" />
              <Text className="text-lg font-poppins-semibold text-white ml-2">Achievement Progress</Text>
            </View>
            
            <View className="flex-row justify-between mb-5">
              <View className="items-center">
                <Text className="text-2xl font-poppins-bold text-white">{unlockedAchievements.length}</Text>
                <Text className="text-sm font-inter-medium text-white/80">Unlocked</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-poppins-bold text-white">{allAchievements.length}</Text>
                <Text className="text-sm font-inter-medium text-white/80">Total</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-poppins-bold text-white">{totalXPEarned}</Text>
                <Text className="text-sm font-inter-medium text-white/80">XP Earned</Text>
              </View>
            </View>

            <View className="gap-2">
              <ProgressBar 
                progress={achievementProgress / 100}
                backgroundColor="rgba(255,255,255,0.2)"
                fillColor="#FFF"
                height={12}
              />
              <Text className="text-sm font-inter-semibold text-white text-center">
                {Math.round(achievementProgress)}% Complete
              </Text>
            </View>
          </LinearGradient>

          {/* Current Level Stats */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Star size={20} color="#10B981" />
              <Text className="text-lg font-poppins-semibold text-gray-900 dark:text-white ml-2">Current Level</Text>
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-poppins-bold text-primary-500">{user.level}</Text>
                <Text className="text-sm font-inter-medium text-gray-600 dark:text-gray-400 mt-1">Level</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-poppins-bold text-primary-500">{user.xp}</Text>
                <Text className="text-sm font-inter-medium text-gray-600 dark:text-gray-400 mt-1">Total XP</Text>
              </View>
              
              <View className="items-center">
                <Text className="text-2xl font-poppins-bold text-primary-500">{user.streak}</Text>
                <Text className="text-sm font-inter-medium text-gray-600 dark:text-gray-400 mt-1">Day Streak</Text>
              </View>
            </View>
          </View>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <Award size={20} color="#10B981" />
                <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white ml-2">
                  Unlocked Achievements
                </Text>
              </View>
              
              <View className="flex-row flex-wrap gap-4">
                {unlockedAchievements.map((achievement) => (
                  <View key={achievement.id} className="items-center w-24">
                    <AchievementBadge
                      achievement={achievement}
                      size="large"
                    />
                    <View className="items-center mt-2">
                      <Text className="text-xs font-inter-semibold text-white bg-primary-500 px-2 py-1 rounded-lg mb-1">
                        +{achievement.xpReward} XP
                      </Text>
                      <Text className="text-xs font-inter text-gray-600 dark:text-gray-400 text-center">
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Locked Achievements */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <Target size={20} color="#6B7280" />
              <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white ml-2">
                Upcoming Achievements
              </Text>
            </View>
            
            <View className="gap-4">
              {lockedAchievements.map((achievement) => (
                <View key={achievement.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 flex-row items-center shadow-sm">
                  <View className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center mr-4">
                    <Trophy size={20} color="#9CA3AF" />
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-base font-inter-semibold text-gray-900 dark:text-white mb-1">
                      {achievement.title}
                    </Text>
                    <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 mb-2">
                      {achievement.description}
                    </Text>
                    
                    {achievement.progress !== undefined && achievement.target && (
                      <View className="gap-1">
                        <ProgressBar 
                          progress={achievement.progress / achievement.target}
                          backgroundColor={isDark ? '#374151' : '#E5E7EB'}
                          fillColor="#10B981"
                          height={6}
                        />
                        <Text className="text-xs font-inter-medium text-gray-600 dark:text-gray-400">
                          {achievement.progress} / {achievement.target}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="items-center">
                    <Text className="text-xs font-inter-semibold text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20 px-2 py-1 rounded-lg">
                      +{achievement.xpReward} XP
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
}