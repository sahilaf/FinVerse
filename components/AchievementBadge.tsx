import React from 'react';
import { View, Text } from 'react-native';
import { Star, Flame, Trophy, Target, Award, Zap } from 'lucide-react-native';
import { Achievement } from '@/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
}

const iconMap = {
  Star,
  Flame,
  Trophy,
  Target,
  Award,
  Zap,
};

export default function AchievementBadge({ achievement, size = 'medium' }: AchievementBadgeProps) {
  const IconComponent = iconMap[achievement.iconName as keyof typeof iconMap] || Star;
  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const containerSize = size === 'small' ? 'w-10 h-10' : size === 'medium' ? 'w-12 h-12' : 'w-14 h-14';
  
  return (
    <View className="items-center max-w-24">
      <View className={`${containerSize} bg-secondary-500 rounded-full items-center justify-center mb-2 shadow-lg`}>
        <IconComponent size={iconSize} color="#FFF" />
      </View>
      <Text className={`font-inter-semibold text-gray-900 dark:text-white text-center mb-1 ${
        size === 'small' ? 'text-xs' : 'text-xs'
      }`}>
        {achievement.title}
      </Text>
      {size !== 'small' && (
        <Text className="text-xs font-inter text-gray-600 dark:text-gray-400 text-center leading-3" numberOfLines={2}>
          {achievement.description}
        </Text>
      )}
    </View>
  );
}