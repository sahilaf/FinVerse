import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Flame } from 'lucide-react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import ProgressBar from './ProgressBar';

interface XPProgressCardProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
}

export default function XPProgressCard({ level, currentXP, xpToNextLevel, streak }: XPProgressCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const progress = currentXP / (currentXP + xpToNextLevel);
  
  return (
    <LinearGradient
      colors={isDark ? ['#059669', '#047857'] : ['#10B981', '#059669']}
      className="rounded-2xl p-5 mb-6"
    >
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <View className="flex-row items-center mb-1">
            <Trophy size={16} color="#FFF" />
            <Text className="text-lg font-poppins-semibold text-white ml-2">Level {level}</Text>
          </View>
          <Text className="text-sm font-inter-medium text-white/80">{currentXP} XP</Text>
        </View>
        
        <View className="flex-row items-center bg-white/10 px-3 py-2 rounded-xl">
          <Flame size={20} color="#F59E0B" />
          <Text className="text-sm font-inter-semibold text-white ml-2">{streak} day streak</Text>
        </View>
      </View>
      
      <View className="gap-2">
        <ProgressBar 
          progress={progress} 
          backgroundColor="rgba(255,255,255,0.2)"
          fillColor="#FFF"
          height={10}
        />
        <Text className="text-xs font-inter-medium text-white/80 text-center">
          {xpToNextLevel} XP to Level {level + 1}
        </Text>
      </View>
    </LinearGradient>
  );
}