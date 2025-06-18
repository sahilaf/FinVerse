import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Custom storage adapter for Expo SecureStore
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return Promise.resolve();
    }
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return Promise.resolve();
    }
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          level: number;
          xp: number;
          streak: number;
          currency: string;
          region: string;
          completed_lessons: string[];
          achievements: any[];
          subscription_status: 'free' | 'premium';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
          goal?: string;
          knowledge_level?: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name: string;
          avatar_url?: string;
          level?: number;
          xp?: number;
          streak?: number;
          currency?: string;
          region?: string;
          completed_lessons?: string[];
          achievements?: any[];
          subscription_status?: 'free' | 'premium';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          goal?: string;
          knowledge_level?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          avatar_url?: string;
          level?: number;
          xp?: number;
          streak?: number;
          currency?: string;
          region?: string;
          completed_lessons?: string[];
          achievements?: any[];
          subscription_status?: 'free' | 'premium';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
          goal?: string;
          knowledge_level?: string;
        };
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          type: 'user' | 'ai';
          amount: number;
          note: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'user' | 'ai';
          amount?: number;
          note: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'user' | 'ai';
          amount?: number;
          note?: string;
          created_at?: string;
        };
      };
    };
  };
};