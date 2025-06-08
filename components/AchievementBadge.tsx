import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  const containerSize = size === 'small' ? 40 : size === 'medium' ? 48 : 56;
  
  return (
    <View style={styles.container}>
      <View style={[styles.badge, { width: containerSize, height: containerSize }]}>
        <IconComponent size={iconSize} color="#FFF" />
      </View>
      <Text style={[styles.title, size === 'small' && styles.smallTitle]}>
        {achievement.title}
      </Text>
      {size !== 'small' && (
        <Text style={styles.description} numberOfLines={2}>
          {achievement.description}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    maxWidth: 100,
  },
  badge: {
    backgroundColor: '#F59E0B',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  smallTitle: {
    fontSize: 10,
  },
  description: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
});