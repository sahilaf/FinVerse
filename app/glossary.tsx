import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Search, BookOpen, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { glossaryTerms } from '@/data/glossary';

const categories = ['All', 'Credit', 'Saving', 'Investing', 'Retirement'];

export default function Glossary() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTerms = glossaryTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || term.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
          <TouchableOpacity 
            className="mr-4"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={isDark ? '#FFF' : '#111827'} />
          </TouchableOpacity>
          
          <View className="flex-1">
            <Text className="text-3xl font-poppins-bold text-gray-900 dark:text-white mb-1">Glossary</Text>
            <Text className="text-base font-inter text-gray-600 dark:text-gray-400">
              Financial terms made simple
            </Text>
          </View>
        </View>

        {/* Search */}
        <View className="px-5 py-4">
          <View className="flex-row items-center bg-white dark:bg-gray-800 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700">
            <Search size={20} color={isDark ? '#9CA3AF' : '#6B7280'} />
            <TextInput
              className="flex-1 text-base font-inter text-gray-900 dark:text-white ml-3"
              placeholder="Search terms..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Categories */}
        <View className="px-5 pb-4">
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

        {/* Terms */}
        <View className="p-5">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((term) => (
              <View key={term.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-4 shadow-sm">
                <View className="flex-row justify-between items-start mb-3">
                  <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white flex-1 mr-3">
                    {term.term}
                  </Text>
                  <View className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
                    <Text className="text-xs font-inter-medium text-blue-600 dark:text-blue-400">
                      {term.category}
                    </Text>
                  </View>
                </View>
                
                <Text className="text-base font-inter text-gray-700 dark:text-gray-300 leading-6 mb-4">
                  {term.definition}
                </Text>
                
                {term.relatedTerms.length > 0 && (
                  <View className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border-l-4 border-primary-500">
                    <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Related Terms:
                    </Text>
                    <Text className="text-sm font-inter text-gray-600 dark:text-gray-400">
                      {term.relatedTerms.join(', ')}
                    </Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-16">
              <BookOpen size={48} color={isDark ? '#9CA3AF' : '#9CA3AF'} />
              <Text className="text-lg font-poppins-semibold text-gray-900 dark:text-white mt-4 mb-2">
                No terms found
              </Text>
              <Text className="text-sm font-inter text-gray-600 dark:text-gray-400 text-center">
                Try adjusting your search or category filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}