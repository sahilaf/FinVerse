import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, DollarSign, TrendingUp, TrendingDown, ChartPie as PieChart, Target, Edit3, Trash2 } from 'lucide-react-native';
import { useUserData } from '@/hooks/useUserData';
import { useBudgetData, FinanceItem } from '@/hooks/useBudgetData';

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Business', 'Other'],
  expense: ['Housing', 'Food', 'Transport', 'Healthcare', 'Lifestyle', 'Entertainment', 'Other'],
  savings: ['Emergency Fund', 'Retirement', 'Investment', 'Goal Savings', 'Other']
};

export default function Budget() {
  const { user } = useUserData();
  const { 
    financeItems, 
    loading, 
    error, 
    addFinanceItem, 
    updateFinanceItem, 
    deleteFinanceItem, 
    getBudgetStats,
    refetch 
  } = useBudgetData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FinanceItem | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newItem, setNewItem] = useState({
    type: 'expense' as 'income' | 'expense' | 'savings',
    amount: '',
    category: '',
    note: ''
  });

  const budgetStats = getBudgetStats();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const resetForm = () => {
    setNewItem({
      type: 'expense',
      amount: '',
      category: '',
      note: ''
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleAddItem = async () => {
    if (!newItem.amount || !newItem.category) {
      Alert.alert('Error', 'Please fill in amount and category');
      return;
    }

    try {
      await addFinanceItem({
        type: newItem.type,
        amount: parseFloat(newItem.amount),
        category: newItem.category,
        note: newItem.note || null
      });
      resetForm();
      Alert.alert('Success', 'Budget item added successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add budget item');
    }
  };

  const handleUpdateItem = async () => {
    if (!editingItem || !newItem.amount || !newItem.category) {
      Alert.alert('Error', 'Please fill in amount and category');
      return;
    }

    try {
      await updateFinanceItem(editingItem.id, {
        type: newItem.type,
        amount: parseFloat(newItem.amount),
        category: newItem.category,
        note: newItem.note || null
      });
      resetForm();
      Alert.alert('Success', 'Budget item updated successfully!');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update budget item');
    }
  };

  const handleDeleteItem = (item: FinanceItem) => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.note || item.category}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFinanceItem(item.id);
              Alert.alert('Success', 'Budget item deleted successfully!');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete budget item');
            }
          }
        }
      ]
    );
  };

  const handleEditItem = (item: FinanceItem) => {
    setEditingItem(item);
    setNewItem({
      type: item.type,
      amount: item.amount.toString(),
      category: item.category || '',
      note: item.note || ''
    });
    setShowAddForm(true);
  };

  const formatCurrency = (amount: number) => {
    return `${user?.currency === 'USD' ? '$' : user?.currency || '$'}${Math.abs(amount).toLocaleString()}`;
  };

  if (loading && financeItems.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your budget...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Budget Tracker</Text>
          <Text style={styles.subtitle}>Take control of your finances</Text>
        </View>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {/* Budget Overview */}
        <View style={styles.content}>
          <LinearGradient
            colors={budgetStats.budgetHealthy ? ['#10B981', '#059669'] : ['#EF4444', '#DC2626']}
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
                <Text style={styles.statValue}>{formatCurrency(budgetStats.income)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <TrendingDown size={20} color="#FFF" />
                <Text style={styles.statLabel}>Expenses</Text>
                <Text style={styles.statValue}>{formatCurrency(budgetStats.expenses)}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Target size={20} color="#FFF" />
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={[styles.statValue, !budgetStats.budgetHealthy && styles.negativeValue]}>
                  {formatCurrency(budgetStats.remaining)}
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
                    {formatCurrency(budgetStats.needsSpent)} / {formatCurrency(budgetStats.needsTarget)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(100, (budgetStats.needsSpent / budgetStats.needsTarget) * 100)}%`, 
                        backgroundColor: '#10B981' 
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.ruleItem}>
                <View style={styles.ruleItemHeader}>
                  <Text style={styles.ruleCategory}>Wants (30%)</Text>
                  <Text style={styles.ruleAmount}>
                    {formatCurrency(budgetStats.wantsSpent)} / {formatCurrency(budgetStats.wantsTarget)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(100, (budgetStats.wantsSpent / budgetStats.wantsTarget) * 100)}%`, 
                        backgroundColor: '#F59E0B' 
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={styles.ruleItem}>
                <View style={styles.ruleItemHeader}>
                  <Text style={styles.ruleCategory}>Savings (20%)</Text>
                  <Text style={styles.ruleAmount}>
                    {formatCurrency(budgetStats.savings)} / {formatCurrency(budgetStats.savingsTarget)}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill,
                      { 
                        width: `${Math.min(100, (budgetStats.savings / budgetStats.savingsTarget) * 100)}%`, 
                        backgroundColor: '#3B82F6' 
                      }
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

            {financeItems.map((item) => (
              <View key={item.id} style={styles.budgetItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.note || item.category}</Text>
                  <Text style={styles.itemCategory}>{item.category}</Text>
                  <Text style={styles.itemDate}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={styles.itemRight}>
                  <View style={styles.itemAmount}>
                    <Text style={[
                      styles.itemValue,
                      item.type === 'income' ? styles.incomeValue : 
                      item.type === 'savings' ? styles.savingsValue : styles.expenseValue
                    ]}>
                      {item.type === 'income' ? '+' : '-'}{formatCurrency(Number(item.amount))}
                    </Text>
                    <Text style={styles.itemType}>{item.type}</Text>
                  </View>
                  <View style={styles.itemActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEditItem(item)}
                    >
                      <Edit3 size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleDeleteItem(item)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {financeItems.length === 0 && !loading && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No budget items yet</Text>
                <Text style={styles.emptySubtext}>Add your first income or expense to get started</Text>
              </View>
            )}
          </View>

          {/* Add/Edit Item Form */}
          {showAddForm && (
            <View style={styles.addForm}>
              <Text style={styles.formTitle}>
                {editingItem ? 'Edit Budget Item' : 'Add Budget Item'}
              </Text>
              
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
                <TouchableOpacity
                  style={[styles.typeButton, newItem.type === 'savings' && styles.activeTypeButton]}
                  onPress={() => setNewItem({ ...newItem, type: 'savings', category: '' })}
                >
                  <Text style={[styles.typeButtonText, newItem.type === 'savings' && styles.activeTypeButtonText]}>
                    Savings
                  </Text>
                </TouchableOpacity>
              </View>

              <TextInput
                style={styles.formInput}
                placeholder="Amount"
                value={newItem.amount}
                onChangeText={(text) => setNewItem({ ...newItem, amount: text })}
                keyboardType="numeric"
              />

              <TextInput
                style={styles.formInput}
                placeholder="Description (optional)"
                value={newItem.note}
                onChangeText={(text) => setNewItem({ ...newItem, note: text })}
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
                  onPress={resetForm}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={editingItem ? handleUpdateItem : handleAddItem}
                >
                  <Text style={styles.saveButtonText}>
                    {editingItem ? 'Update Item' : 'Add Item'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
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
    paddingTop: 60
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
  errorContainer: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    margin: 20,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#DC2626',
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
    marginBottom: 2,
  },
  itemDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  itemRight: {
    alignItems: 'flex-end',
    gap: 8,
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
  savingsValue: {
    color: '#3B82F6',
  },
  itemType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'capitalize',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
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
    gap: 8,
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