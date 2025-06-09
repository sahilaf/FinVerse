import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Star, Lock } from 'lucide-react-native';
import { Lesson } from '@/types';

interface LessonCardProps {
  lesson: Lesson;
  onPress: (lesson: Lesson) => void;
  isCompleted?: boolean;
}

export default function LessonCard({ lesson, onPress, isCompleted = false }: LessonCardProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onPress(lesson)}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: lesson.thumbnailUrl }} style={styles.image} />
        {lesson.isPremium && (
          <View style={styles.premiumBadge}>
            <Lock size={12} color="#FFF" />
          </View>
        )}
        {isCompleted && (
          <View style={styles.completedBadge}>
            <Star size={16} color="#FFF" fill="#FFF" />
          </View>
        )}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.4)']}
          style={styles.gradient}
        />
        <View style={styles.duration}>
          <Clock size={12} color="#FFF" />
          <Text style={styles.durationText}>{lesson.duration}m</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.category}>{lesson.category}</Text>
        <Text style={styles.title}>{lesson.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {lesson.description}
        </Text>
        <View style={styles.footer}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{lesson.difficulty}</Text>
          </View>
          <Text style={styles.xpReward}>+{lesson.xpReward} XP</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  premiumBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  duration: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  content: {
    padding: 16,
  },
  category: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  xpReward: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
});