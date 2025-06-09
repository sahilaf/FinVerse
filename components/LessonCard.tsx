import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Star, Lock } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  onPress: (lesson: Lesson) => void;
  isCompleted?: boolean;
}

export default function LessonCard({ lesson, onPress, isCompleted = false }: LessonCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity 
      className="bg-white dark:bg-gray-800 rounded-2xl mb-4 shadow-sm overflow-hidden" 
      onPress={() => onPress(lesson)}
      activeOpacity={0.8}
    >
      <View className="relative h-48">
        <Image source={{ uri: lesson.thumbnailUrl }} className="w-full h-full" />
        {lesson.isPremium && (
          <View className="absolute top-3 right-3 bg-secondary-500 rounded-xl w-6 h-6 items-center justify-center">
            <Lock size={12} color="#FFF" />
          </View>
        )}
        {isCompleted && (
          <View className="absolute top-3 left-3 bg-primary-500 rounded-xl w-6 h-6 items-center justify-center">
            <Star size={16} color="#FFF" fill="#FFF" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          className="absolute bottom-0 left-0 right-0 h-16"
        />
        <View className="absolute bottom-3 right-3 flex-row items-center bg-black/60 px-2 py-1 rounded-xl">
          <Clock size={12} color="#FFF" />
          <Text className="text-white text-xs font-inter-medium ml-1">{lesson.duration}m</Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-xs font-inter-medium text-primary-500 uppercase tracking-wide mb-1">
          {lesson.category}
        </Text>
        <Text className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-2">
          {lesson.title}
        </Text>
        <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 leading-5 mb-4" numberOfLines={2}>
          {lesson.description}
        </Text>
        <View className="flex-row justify-between items-center">
          <View className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg">
            <Text className="text-xs font-inter-medium text-gray-600 dark:text-gray-400 capitalize">
              {lesson.difficulty}
            </Text>
          </View>
          <Text className="text-sm font-inter-semibold text-primary-500">
            +{lesson.xpReward} XP
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}