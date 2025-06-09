import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, DollarSign, TrendingUp, TrendingDown, ChartPie as PieChart, Target } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { BudgetItem } from '@/types';

const mockBudgetItems: BudgetItem[] = [
  { id: '1', name: 'Salary', amount: 3500, category: 'Income', type: 'income', isRecurring: true },
  { id: '2', name: 'Rent', amount: 1200, category: 'Housing', type: 'expense', isRecurring: true },
  { id: '3', name: 'Groceries', amount: 400, category: 'Food', type: 'expense', isRecurring: true },
  { id: '4', name: 'Transportation', amount: 150, category: 'Transport', type: 'expense', isRecurring: true },
  { id: '5', name: 'Entertainment', amount: 200, category: 'Lifestyle', type: 'expense', isRecurring: true },
];

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Other'],
  expense: ['Housing', 'Food', 'Transport', 'Healthcare', 'Lifestyle', 'Savings', 'Other']
};

export default function Budget() {
  const { user } = useUserData();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(mockBudgetItems);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    category: '',
    type: 'expense' as 'income' | 'expense',
    isRecurring: true
  });

  const totalIncome = budgetItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = budgetItems
    .filter(item => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const remainingBudget = totalIncome - totalExpenses;
  const budgetHealthy = remainingBudget >= 0;

  // 50/30/20 Rule Calculations
  const needsTarget = totalIncome * 0.5;
  const wantsTarget = totalIncome * 0.3;
  const savingsTarget = totalIncome * 0.2;

  const needsSpent = budgetItems
    .filter(item => item.type === 'expense' && ['Housing', 'Food', 'Transport', 'Healthcare'].includes(item.category))
    .reduce((sum, item) => sum + item.amount, 0);

  const wantsSpent = budgetItems
    .filter(item => item.type === 'expense' && ['Lifestyle', 'Entertainment', 'Other'].includes(item.category))
    .reduce((sum, item) => sum + item.amount, 0);

  const savingsAmount = budgetItems
    .filter(item => item.type === 'expense' && item.category === 'Savings')
    .reduce((sum, item) => sum + item.amount, 0);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.amount || !newItem.category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const item: BudgetItem = {
      id: Date.now().toString(),
      name: newItem.name,
      amount: parseFloat(newItem.amount),
      category: newItem.category,
      type: newItem.type,
      isRecurring: newItem.isRecurring
    };

    setBudgetItems([...budgetItems, item]);
    setNewItem({ name: '', amount: '', category: '', type: 'expense', isRecurring: true });
    setShowAddForm(false);
  };

  const formatCurrency = (amount: number) => {
    return `${user?.currency === 'USD' ? '$' : user?.currency || '$'}${Math.abs(amount).toLocaleString()}`;
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-5 py-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 pt-16">
          <Text className="text-3xl font-poppins-bold text-gray-900 dark:text-white mb-1">Budget Tracker</Text>
          <Text className="text-base font-inter text-gray-600 dark:text-gray-400">
            Take control of your finances
          </Text>
        </View>

        {/* Budget Overview */}
        <View className="p-5">
          <LinearGradient
            colors={budgetHealthy ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
            className="rounded-2xl p-5 mb-6"
          >
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-lg font-poppins-semibold text-white">Monthly Overview</Text>
              <DollarSign size={24} color="#FFF" />
            </View>
            
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <TrendingUp size={20} color="#FFF" />
                <Text className="text-sm font-inter-medium text-white/80 mt-2 mb-1">Income</Text>
                <Text className="text-lg font-poppins-semibold text-white">{formatCurrency(totalIncome)}</Text>
              </View>
              
              <View className="items-center flex-1">
                <TrendingDown size={20} color="#FFF" />
                <Text className="text-sm font-inter-medium text-white/80 mt-2 mb-1">Expenses</Text>
                <Text className="text-lg font-poppins-semibold text-white">{formatCurrency(totalExpenses)}</Text>
              </View>
              
              <View className="items-center flex-1">
                <Target size={20} color="#FFF" />
                <Text className="text-sm font-inter-medium text-white/80 mt-2 mb-1">Remaining</Text>
                <Text className={`text-lg font-poppins-semibold ${!budgetHealthy ? 'text-red-200' : 'text-white'}`}>
                  {formatCurrency(remainingBudget)}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* 50/30/20 Rule */}
          <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 mb-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <PieChart size={20} color="#3B82F6" />
              <Text className="text-lg font-poppins-semibold text-gray-900 dark:text-white ml-2">
                50/30/20 Rule Analysis
              </Text>
            </View>
            
            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300">Needs (50%)</Text>
                  <Text className="text-sm font-inter-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(needsSpent)} / {formatCurrency(needsTarget)}
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${Math.min(100, (needsSpent / needsTarget) * 100)}%` }}
                  />
                </View>
              </View>
              
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300">Wants (30%)</Text>
                  <Text className="text-sm font-inter-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(wantsSpent)} / {formatCurrency(wantsTarget)}
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-secondary-500 rounded-full"
                    style={{ width: `${Math.min(100, (wantsSpent / wantsTarget) * 100)}%` }}
                  />
                </View>
              </View>
              
              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-inter-semibold text-gray-700 dark:text-gray-300">Savings (20%)</Text>
                  <Text className="text-sm font-inter-medium text-gray-600 dark:text-gray-400">
                    {formatCurrency(savingsAmount)} / {formatCurrency(savingsTarget)}
                  </Text>
                </View>
                <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <View 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, (savingsAmount / savingsTarget) * 100)}%` }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Budget Items */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-poppins-semibold text-gray-900 dark:text-white">Budget Items</Text>
              <TouchableOpacity 
                className="bg-primary-500 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => setShowAddForm(true)}
              >
                <Plus size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {budgetItems.map((item) => (
              <View key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-3 flex-row justify-between items-center shadow-sm">
                <View className="flex-1">
                  <Text className="text-base font-inter-semibold text-gray-900 dark:text-white mb-1">{item.name}</Text>
                  <Text className="text-sm font-inter text-gray-600 dark:text-gray-400">{item.category}</Text>
                </View>
                <View className="items-end">
                  <Text className={`text-base font-inter-bold ${
                    item.type === 'income' ? 'text-primary-500' : 'text-red-500'
                  }`}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </Text>
                  {item.isRecurring && (
                    <Text className="text-xs font-inter-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mt-1">
                      Monthly
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Add Item Form */}
          {showAddForm && (
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg">
              <Text className="text-lg font-poppins-semibold text-gray-900 dark:text-white mb-4">Add Budget Item</Text>
              
              <View className="flex-row gap-3 mb-4">
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-lg items-center ${
                    newItem.type === 'income' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  onPress={() => setNewItem({ ...newItem, type: 'income', category: '' })}
                >
                  <Text className={`text-sm font-inter-semibold ${
                    newItem.type === 'income' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Income
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-lg items-center ${
                    newItem.type === 'expense' ? 'bg-primary-500' : 'bg-gray-100 dark:bg-gray-700'
                  }`}
                  onPress={() => setNewItem({ ...newItem, type: 'expense', category: '' })}
                >
                  <Text className={`text-sm font-inter-semibold ${
                    newItem.type === 'expense' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-base font-inter text-gray-900 dark:text-white mb-4"
                placeholder="Item name"
                placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              />

              <TextInput
                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-3 text-base font-inter text-gray-900 dark:text-white mb-4"
                placeholder="Amount"
                placeholderTextColor={isDark ? '#9CA3AF' : '#9CA3AF'}
                value={newItem.amount}
                onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
                keyboardType="numeric"
              />

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2 mb-5">
                  {categories[newItem.type].map((category) => (
                    <TouchableOpacity
                      key={category}
                      className={`px-3 py-2 rounded-2xl ${
                        newItem.category === category 
                          ? 'bg-primary-500' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}
                      onPress={() => setNewItem({ ...newItem, category })}
                    >
                      <Text className={`text-sm font-inter-medium ${
                        newItem.category === category 
                          ? 'text-white' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 dark:bg-gray-700 py-3 rounded-lg items-center"
                  onPress={() => setShowAddForm(false)}
                >
                  <Text className="text-base font-inter-semibold text-gray-600 dark:text-gray-400">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-primary-500 py-3 rounded-lg items-center"
                  onPress={handleAddItem}
                >
                  <Text className="text-base font-inter-semibold text-white">Add Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
}