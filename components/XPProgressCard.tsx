import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Flame } from 'lucide-react-native';
import ProgressBar from './ProgressBar';

interface XPProgressCardProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  streak: number;
}

export default function XPProgressCard({ level, currentXP, xpToNextLevel, streak }: XPProgressCardProps) {
  const progress = currentXP / (currentXP + xpToNextLevel);
  
  return (
    <LinearGradient
      colors={['#10B981', '#059669']}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.levelSection}>
          <View style={styles.levelBadge}>
            <Trophy size={16} color="#FFF" />
            <Text style={styles.levelText}>Level {level}</Text>
          </View>
          <Text style={styles.xpText}>{currentXP} XP</Text>
        </View>
        
        <View style={styles.streakSection}>
          <Flame size={20} color="#F59E0B" />
          <Text style={styles.streakText}>{streak} day streak</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <ProgressBar 
          progress={progress} 
          backgroundColor="rgba(255,255,255,0.2)"
          fillColor="#FFF"
          height={10}
        />
        <Text style={styles.progressText}>
          {xpToNextLevel} XP to Level {level + 1}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelSection: {
    flex: 1,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginLeft: 8,
  },
  xpText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginLeft: 6,
  },
  progressSection: {
    gap: 8,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
});