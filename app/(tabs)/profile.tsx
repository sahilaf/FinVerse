import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Settings, Crown, BookOpen, Award, CircleHelp as HelpCircle, LogOut, ChevronRight, Globe, Bell, Shield, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserData } from '@/hooks/useUserData';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  {
    id: 'subscription',
    title: 'Upgrade to Premium',
    subtitle: 'Unlock all lessons and features',
    icon: Crown,
    iconColor: '#F59E0B',
    isPremium: true,
    route: '/premium'
  },
  {
    id: 'glossary',
    title: 'Financial Glossary',
    subtitle: 'Learn financial terms',
    icon: BookOpen,
    iconColor: '#3B82F6',
    route: '/glossary'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    subtitle: 'View your progress',
    icon: Award,
    iconColor: '#10B981',
    route: '/achievements'
  },
  {
    id: 'notifications',
    title: 'Notifications',
    subtitle: 'Manage your alerts',
    icon: Bell,
    iconColor: '#8B5CF6',
  },
  {
    id: 'language',
    title: 'Language & Region',
    subtitle: 'English (US)',
    icon: Globe,
    iconColor: '#06B6D4',
  },
  {
    id: 'privacy',
    title: 'Privacy & Security',
    subtitle: 'Manage your data',
    icon: Shield,
    iconColor: '#EF4444',
  },
  {
    id: 'help',
    title: 'Help & Support',
    subtitle: 'Get assistance',
    icon: HelpCircle,
    iconColor: '#6B7280',
  },
];

export default function Profile() {
  const { user } = useUserData();
  const { signOut } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.route) {
      router.push(item.route as any);
    } else {
      Alert.alert('Coming Soon', `${item.title} feature is coming soon!`);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive', 
          onPress: async () => {
            try {
              console.log('Starting signout process...');
              await signOut();
              console.log('Signout completed successfully');
              // The AuthContext will handle navigation automatically
            } catch (error) {
              console.error('Signout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const completionRate = Math.round((user.completedLessons.length / 6) * 100);

  return (
    <ScrollView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#065F46', '#047857']}
          style={styles.header}
        >
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <User size={32} color="#FFF" />
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              
              <View style={styles.levelBadge}>
                <Star size={16} color="#F59E0B" />
                <Text style={styles.levelText}>Level {user.level}</Text>
                {user.subscriptionStatus === 'premium' && (
                  <Crown size={16} color="#F59E0B" style={{ marginLeft: 8 }} />
                )}
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.xp}</Text>
              <Text style={styles.statLabel}>Total XP</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{user.streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completionRate}%</Text>
              <Text style={styles.statLabel}>Complete</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.content}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                item.isPremium && user.subscriptionStatus === 'free' && styles.premiumMenuItem
              ]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIcon, { backgroundColor: `${item.iconColor}15` }]}>
                  <item.icon size={20} color={item.iconColor} />
                </View>
                
                <View style={styles.menuItemContent}>
                  <Text style={styles.menuItemTitle}>{item.title}</Text>
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                </View>
              </View>
              
              <View style={styles.menuItemRight}>
                {item.isPremium && user.subscriptionStatus === 'free' && (
                  <View style={styles.premiumBadge}>
                    <Crown size={12} color="#F59E0B" />
                  </View>
                )}
                <ChevronRight size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Sign Out</Text>
          </TouchableOpacity>

          {/* App Version */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>FinVerse v1.0.0</Text>
            <Text style={styles.copyrightText}>
              Made with ❤️ for financial education
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
    paddingTop: 60
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  levelText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  content: {
    padding: 20,
  },
  menuItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  premiumMenuItem: {
    borderWidth: 1,
    borderColor: '#FED7AA',
    backgroundColor: '#FFFBEB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  menuItemSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premiumBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
});