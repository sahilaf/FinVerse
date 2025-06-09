import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Target, Award } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
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

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </View>
    );
  }

  const unlockedAchievements = allAchievements.filter(a => a.unlocked);
  const lockedAchievements = allAchievements.filter(a => !a.unlocked);
  const totalXPEarned = unlockedAchievements.reduce((sum, a) => sum + a.xpReward, 0);
  const achievementProgress = (unlockedAchievements.length / allAchievements.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>Track your learning milestones</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.content}>
          <LinearGradient
            colors={['#F59E0B', '#D97706']}
            style={styles.progressCard}
          >
            <View style={styles.progressHeader}>
              <Trophy size={24} color="#FFF" />
              <Text style={styles.progressTitle}>Achievement Progress</Text>
            </View>
            
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{unlockedAchievements.length}</Text>
                <Text style={styles.progressLabel}>Unlocked</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{allAchievements.length}</Text>
                <Text style={styles.progressLabel}>Total</Text>
              </View>
              
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{totalXPEarned}</Text>
                <Text style={styles.progressLabel}>XP Earned</Text>
              </View>
            </View>

            <View style={styles.progressBarContainer}>
              <ProgressBar 
                progress={achievementProgress / 100}
                backgroundColor="rgba(255,255,255,0.2)"
                fillColor="#FFF"
                height={12}
              />
              <Text style={styles.progressPercentage}>
                {Math.round(achievementProgress)}% Complete
              </Text>
            </View>
          </LinearGradient>

          {/* Current Level Stats */}
          <View style={styles.levelCard}>
            <View style={styles.levelHeader}>
              <Star size={20} color="#10B981" />
              <Text style={styles.levelTitle}>Current Level</Text>
            </View>
            
            <View style={styles.levelStats}>
              <View style={styles.levelStat}>
                <Text style={styles.levelNumber}>{user.level}</Text>
                <Text style={styles.levelLabel}>Level</Text>
              </View>
              
              <View style={styles.levelStat}>
                <Text style={styles.levelNumber}>{user.xp}</Text>
                <Text style={styles.levelLabel}>Total XP</Text>
              </View>
              
              <View style={styles.levelStat}>
                <Text style={styles.levelNumber}>{user.streak}</Text>
                <Text style={styles.levelLabel}>Day Streak</Text>
              </View>
            </View>
          </View>

          {/* Unlocked Achievements */}
          {unlockedAchievements.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Award size={20} color="#10B981" />
                <Text style={styles.sectionTitle}>Unlocked Achievements</Text>
              </View>
              
              <View style={styles.achievementGrid}>
                {unlockedAchievements.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <AchievementBadge
                      achievement={achievement}
                      size="large"
                    />
                    <View style={styles.achievementDetails}>
                      <Text style={styles.xpBadge}>+{achievement.xpReward} XP</Text>
                      <Text style={styles.unlockedDate}>
                        Unlocked {achievement.unlockedAt.toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Locked Achievements */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Target size={20} color="#6B7280" />
              <Text style={styles.sectionTitle}>Upcoming Achievements</Text>
            </View>
            
            <View style={styles.lockedAchievements}>
              {lockedAchievements.map((achievement) => (
                <View key={achievement.id} style={styles.lockedAchievement}>
                  <View style={styles.lockedBadge}>
                    <Trophy size={20} color="#9CA3AF" />
                  </View>
                  
                  <View style={styles.lockedInfo}>
                    <Text style={styles.lockedTitle}>{achievement.title}</Text>
                    <Text style={styles.lockedDescription}>{achievement.description}</Text>
                    
                    {achievement.progress !== undefined && achievement.target && (
                      <View style={styles.progressContainer}>
                        <ProgressBar 
                          progress={achievement.progress / achievement.target}
                          backgroundColor="#E5E7EB"
                          fillColor="#10B981"
                          height={6}
                        />
                        <Text style={styles.progressText}>
                          {achievement.progress} / {achievement.target}
                        </Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.lockedReward}>
                    <Text style={styles.lockedXP}>+{achievement.xpReward} XP</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  content: {
    padding: 20,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
    marginLeft: 8,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    textAlign: 'center',
  },
  levelCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  levelStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  levelStat: {
    alignItems: 'center',
  },
  levelNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#10B981',
  },
  levelLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  achievementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  achievementItem: {
    alignItems: 'center',
    width: '48%',
  },
  achievementDetails: {
    alignItems: 'center',
    marginTop: 8,
  },
  xpBadge: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 4,
  },
  unlockedDate: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  lockedAchievements: {
    gap: 16,
  },
  lockedAchievement: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  lockedBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  lockedInfo: {
    flex: 1,
  },
  lockedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  lockedDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  progressContainer: {
    gap: 4,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  lockedReward: {
    alignItems: 'center',
  },
  lockedXP: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
});