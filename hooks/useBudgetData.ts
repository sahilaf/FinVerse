import { useState, useEffect } from 'react';
import { supabase, Database } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Define FinanceItem type based on Supabase schema
export type FinanceItem = Database['public']['Tables']['finance']['Row'];
export type FinanceInsert = Database['public']['Tables']['finance']['Insert'];
export type FinanceUpdate = Database['public']['Tables']['finance']['Update'];

export function useBudgetData() {
  const { user } = useAuth();
  const [financeItems, setFinanceItems] = useState<FinanceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch finance data for the current user
  const fetchFinanceData = async () => {
    if (!user) {
      setFinanceItems([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: supabaseError } = await supabase
        .from('finance')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Error fetching finance data:', supabaseError);
        setError(supabaseError.message);
      } else {
        setFinanceItems(data || []);
        setError(null);
      }
    } catch (err: any) {
      console.error('Unexpected error fetching finance data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new finance item
  const addFinanceItem = async (item: Omit<FinanceInsert, 'user_id' | 'id' | 'created_at'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('finance')
        .insert({
          ...item,
          user_id: user.id,
        })
        .select()
        .single();

      if (supabaseError) {
        console.error('Error adding finance item:', supabaseError);
        throw new Error(supabaseError.message);
      }

      // Optimistically update local state
      setFinanceItems(prev => [data, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Error in addFinanceItem:', error);
      throw error;
    }
  };

  // Update finance item
  const updateFinanceItem = async (id: string, updates: Omit<FinanceUpdate, 'user_id' | 'id'>) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error: supabaseError } = await supabase
        .from('finance')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (supabaseError) {
        console.error('Error updating finance item:', supabaseError);
        throw new Error(supabaseError.message);
      }

      // Update local state
      setFinanceItems(prev => 
        prev.map(item => item.id === id ? data : item)
      );
      return data;
    } catch (error: any) {
      console.error('Error in updateFinanceItem:', error);
      throw error;
    }
  };

  // Delete finance item
  const deleteFinanceItem = async (id: string) => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { error: supabaseError } = await supabase
        .from('finance')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (supabaseError) {
        console.error('Error deleting finance item:', supabaseError);
        throw new Error(supabaseError.message);
      }

      // Update local state
      setFinanceItems(prev => prev.filter(item => item.id !== id));
    } catch (error: any) {
      console.error('Error in deleteFinanceItem:', error);
      throw error;
    }
  };

  // Calculate budget statistics
  const getBudgetStats = () => {
    const income = financeItems
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const expenses = financeItems
      .filter(item => item.type === 'expense')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const savings = financeItems
      .filter(item => item.type === 'savings')
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const remaining = income - expenses - savings;

    // 50/30/20 Rule calculations
    const needsTarget = income * 0.5;
    const wantsTarget = income * 0.3;
    const savingsTarget = income * 0.2;

    const needsSpent = financeItems
      .filter(item => 
        item.type === 'expense' && 
        ['Housing', 'Food', 'Transport', 'Healthcare'].includes(item.category || '')
      )
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const wantsSpent = financeItems
      .filter(item => 
        item.type === 'expense' && 
        ['Lifestyle', 'Entertainment', 'Other'].includes(item.category || '')
      )
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      income,
      expenses,
      savings,
      remaining,
      needsTarget,
      wantsTarget,
      savingsTarget,
      needsSpent,
      wantsSpent,
      budgetHealthy: remaining >= 0,
    };
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    // Initial fetch
    fetchFinanceData();

    // Set up real-time subscription
    const subscription = supabase
      .channel('finance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'finance',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Real-time finance update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setFinanceItems(prev => [payload.new as FinanceItem, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setFinanceItems(prev =>
              prev.map(item =>
                item.id === payload.new.id ? payload.new as FinanceItem : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setFinanceItems(prev =>
              prev.filter(item => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return {
    financeItems,
    loading,
    error,
    addFinanceItem,
    updateFinanceItem,
    deleteFinanceItem,
    getBudgetStats,
    refetch: fetchFinanceData,
  };
}