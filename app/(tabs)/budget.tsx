import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, DollarSign, TrendingUp, TrendingDown, ChartPie as PieChart, Target } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
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
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Budget Tracker</Text>
          <Text style={styles.subtitle}>Take control of your finances</Text>
        </View>

        {/* Budget Overview */}
        <View style={styles.content}>
          <LinearGradient
            colors={budgetHealthy ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
            style={styles.overviewCard}
          >
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Monthly Overview</Text>
              <DollarSign size={24} color="#FFF" />
            </View>
            
            <View style={styles.overviewStats}>
              <View style={styles.statItem}>
                <TrendingUp size={20} color="#FFF" />
                <Text style={styles.statLabel}>Income</Text>
                <Text style={styles.statValue}>{formatCurrency(totalIncome)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <TrendingDown size={20} color="#FFF" />
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statValue}>{formatCurrency(totalExpenses)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Target size={20} color="#FFF" />
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, !budgetHealthy && styles.negativeValue]}>
                  {formatCurrency(remainingBudget)}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* 50/30/20 Rule */}
          <View style={styles.ruleCard}>
            <View style={styles.ruleHeader}>
              <PieChart size={20} color="#3B82F6" />
              <Text style={styles.ruleTitle}>50/30/20 Rule Analysis</Text>
            </View>
            
            <View style={styles.ruleBreakdown}>
              <View style={styles.ruleItem}>
                <View style={styles.ruleItemHeader}>
                  <Text style={styles.ruleCategory}>Needs (50%)</Text>
                  <Text style={styles.ruleAmount}>
                    {formatCurrency(needsSpent)} / {formatCurrency(needsTarget)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, (needsSpent / needsTarget) * 100)}%`, backgroundColor: '#10B981' }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.ruleItem}>
                <View style={styles.ruleItemHeader}>
                  <Text style={styles.ruleCategory}>Wants (30%)</Text>
                  <Text style={styles.ruleAmount}>
                    {formatCurrency(wantsSpent)} / {formatCurrency(wantsTarget)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, (wantsSpent / wantsTarget) * 100)}%`, backgroundColor: '#F59E0B' }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.ruleItem}>
                <View style={styles.ruleItemHeader}>
                  <Text style={styles.ruleCategory}>Savings (20%)</Text>
                  <Text style={styles.ruleAmount}>
                    {formatCurrency(savingsAmount)} / {formatCurrency(savingsTarget)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { width: `${Math.min(100, (savingsAmount / savingsTarget) * 100)}%`, backgroundColor: '#3B82F6' }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Budget Items */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Budget Items</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setShowAddForm(true)}
              >
                <Plus size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {budgetItems.map((item) => (
              <View key={item.id} style={styles.budgetItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                </View>
                <View style={styles.itemAmount}>
                  <Text style={[
                    styles.itemValue,
                    item.type === 'income' ? styles.incomeValue : styles.expenseValue
                  ]}>
                    {item.type === 'income' ? '+' : '-'}{formatCurrency(item.amount)}
                  </Text>
                  {item.isRecurring && (
                    <Text style={styles.recurringBadge}>Monthly</Text>
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Add Item Form */}
          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>Add Budget Item</Text>
              
              <View style={styles.formRow}>
                <TouchableOpacity
                  style={[styles.typeButton, newItem.type === 'income' && styles.activeTypeButton]}
                  onPress={() => setNewItem({ ...newItem, type: 'income', category: '' })}
                >
                  <Text style={[styles.typeButtonText, newItem.type === 'income' && styles.activeTypeButtonText]}>
                    Income
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.typeButton, newItem.type === 'expense' && styles.activeTypeButton]}
                  onPress={() => setNewItem({ ...newItem, type: 'expense', category: '' })}
                >
                  <Text style={[styles.typeButtonText, newItem.type === 'expense' && styles.activeTypeButtonText]}>
                    Expense
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.formInput}
                placeholder="Item name"
                value={newItem.name}
                onChangeText={(text) => setNewItem({ ...newItem, name: text })}
              />

              <TextInput
                style={styles.formInput}
                placeholder="Amount"
                value={newItem.amount}
                onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
                keyboardType="numeric"
              />

              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoryOptions}>
                  {categories[newItem.type].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryChip,
                        newItem.category === category && styles.activeCategoryChip
                      ]}
                      onPress={() => setNewItem({ ...newItem, category })}
                    >
                      <Text style={[
                        styles.categoryChipText,
                        newItem.category === category && styles.activeCategoryChipText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.formActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowAddForm(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddItem}
                >
                  <Text style={styles.saveButtonText}>Add Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  overviewCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  overviewTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#FFF',
  },
  negativeValue: {
    color: '#FEE2E2',
  },
  ruleCard: {
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
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginLeft: 8,
  },
  ruleBreakdown: {
    gap: 16,
  },
  ruleItem: {
    gap: 8,
  },
  ruleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleCategory: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
  },
  ruleAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  section: {
    marginBottom: 24,
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
  addButton: {
    backgroundColor: '#10B981',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  budgetItem: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  itemAmount: {
    alignItems: 'flex-end',
  },
  itemValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  incomeValue: {
    color: '#10B981',
  },
  expenseValue: {
    color: '#EF4444',
  },
  recurringBadge: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addForm: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#111827',
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTypeButton: {
    backgroundColor: '#10B981',
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  activeTypeButtonText: {
    color: '#FFF',
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginBottom: 16,
  },
  categoryOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeCategoryChip: {
    backgroundColor: '#10B981',
  },
  categoryChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeCategoryChipText: {
    color: '#FFF',
  },
  formActions: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFF',
  },
});