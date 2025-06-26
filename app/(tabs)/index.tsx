import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { BookOpen, Calculator, Sparkles, Video } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import XPProgressCard from '@/components/XPProgressCard';
import LessonCard from '@/components/LessonCard';
import AchievementBadge from '@/components/AchievementBadge';
import { lessons } from '@/data/lessons';

export default function Dashboard() {
  const { user, loading } = useUserData();
  const router = useRouter();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (loading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your financial journey...</Text>
      </View>
    );
  }

  const suggestedLessons = lessons
    .filter(lesson => !user.completedLessons.includes(lesson.id))
    .slice(0, 3);

  const recentAchievements = user.achievements.slice(-3);

  return (
    <ScrollView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient colors={['#065F46', '#047857']} style={styles.header}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.userName}>{user.name} 👋</Text>
          <Text style={styles.subtitle}>Ready to level up your financial knowledge?</Text>
        </LinearGradient>

        <View style={styles.content}>
          {/* XP Progress */}
          <XPProgressCard
            level={user.level}
            currentXP={user.xp}
            xpToNextLevel={500 - (user.xp % 500)}
            streak={user.streak}
          />

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/learn')}
              >
                <BookOpen size={24} color="#10B981" />
                <Text style={styles.actionText}>Continue Learning</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/live-agent')}
              >
                <Video size={24} color="#3B82F6" />
                <Text style={styles.actionText}>Live Advisor</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionCard}
                onPress={() => router.push('/budget')}
              >
                <Calculator size={24} color="#F59E0B" />
                <Text style={styles.actionText}>Track Budget</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Suggested Lessons */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <TouchableOpacity onPress={() => router.push('/learn')}>
                <Text style={styles.seeAllText}>See All</Text>
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
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Achievements</Text>
                <TouchableOpacity onPress={() => router.push('/achievements')}>
                  <Text style={styles.seeAllText}>View All</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.achievementsRow}>
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
          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Sparkles size={20} color="#F59E0B" />
              <Text style={styles.tipTitle}>Financial Tip of the Day</Text>
            </View>
            <Text style={styles.tipText}>
              Start your emergency fund with just $25. Small consistent contributions 
              build powerful financial security over time.
            </Text>
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
    paddingVertical: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.7)',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  achievementsRow: {
    flexDirection: 'row',
    gap: 16,
    paddingRight: 20,
  },
  tipCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FED7AA',
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#78350F',
    lineHeight: 20,
  },
});