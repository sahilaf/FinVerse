import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Filter, BookOpen } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useColorScheme } from '@/hooks/useColorScheme';
import LessonCard from '@/components/LessonCard';
import { lessons } from '@/data/lessons';

const categories = ['All', 'Budgeting', 'Credit', 'Saving', 'Investing', 'Retirement', 'Crypto'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function Learn() {
  const { user } = useUserData();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || 
                             lesson.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const freeLessons = filteredLessons.filter(lesson => !lesson.isPremium);
  const premiumLessons = filteredLessons.filter(lesson => lesson.isPremium);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
          <Text className="text-3xl font-poppins-bold text-gray-900 dark:text-white mb-1">Learn</Text>
          <Text className="text-base font-inter text-gray-600 dark:text-gray-400">
            Master your financial future
          </Text>
        </View>

        {/* Search and Filters */}
        <View className="flex-row px-5 py-4 gap-3">
          <View className="flex-1 flex-row items-center bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <TextInput
              className="flex-1 text-base font-inter text-gray-900 dark:text-white ml-3"
              placeholder="Search lessons..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            />
          </View>
          
          <TouchableOpacity 
            className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 items-center justify-center"
            onPress={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} color={showFilters ? '#10B981' : (isDark ? '#9CA3AF' : '#6B7280')} />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        {showFilters && (
          <View className="bg-white dark:bg-gray-800 px-5 pb-4 border-b border-gray-200 dark:border-gray-700">
            <View className="mb-4">
              <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300 mb-2">
                Category
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      className={`px-4 py-2 rounded-full ${
                        selectedCategory === category 
                          ? 'bg-primary-500' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text className={`text-sm font-inter-medium ${
                        selectedCategory === category 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View className="mb-4">
              <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300 mb-2">
                Difficulty
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2">
                  {difficulties.map((difficulty) => (
                    <TouchableOpacity
                      key={difficulty}
                      className={`px-4 py-2 rounded-full ${
                        selectedDifficulty === difficulty 
                          ? 'bg-primary-500' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      onPress={() => setSelectedDifficulty(difficulty)}
                    >
                      <Text className={`text-sm font-inter-medium ${
                        selectedDifficulty === difficulty 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {difficulty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Content */}
        <View className="p-5">
          {/* Free Lessons */}
          {freeLessons.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <BookOpen size={20} color="#10B981" />
                <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white ml-2">
                  Free Lessons
                </Text>
              </View>
              
              {freeLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onPress={(lesson) => router.push(`/lesson/${lesson.id}` as any)}
                  isCompleted={user?.completedLessons.includes(lesson.id)}
                />
              ))}
            </View>
          )}

          {/* Premium Lessons */}
          {premiumLessons.length > 0 && (
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="bg-secondary-500 px-2 py-1 rounded mr-2">
                  <Text className="text-xs font-inter-bold text-white tracking-wide">PREMIUM</Text>
                </View>
                <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white">
                  Premium Lessons
                </Text>
              </View>
              
              {premiumLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onPress={(lesson) => {
                    if (user?.subscriptionStatus === 'free') {
                      router.push('/premium');
                    } else {
                      router.push(`/lesson/${lesson.id}` as any);
                    }
                  }}
                  isCompleted={user?.completedLessons.includes(lesson.id)}
                />
              ))}
            </View>
          )}

          {filteredLessons.length === 0 && (
            <View className="items-center justify-center py-16">
              <BookOpen size={48} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
              <Text className="text-lg font-poppins-semibold text-gray-900 dark:text-white mt-4 mb-2">
                No lessons found
              </Text>
              <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 text-center">
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}