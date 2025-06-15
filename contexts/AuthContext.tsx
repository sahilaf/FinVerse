import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'expo-router';
import { supabase, Database } from '@/lib/supabase'; // Assuming '@/lib/supabase' is correctly configured
import { Platform } from 'react-native';
// Define the Profile type from your Supabase database schema
type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean; // Indicates if any auth operation (initial fetch, sign-in/out, profile update) is in progress
  signUp: (
    email: string,
    password: string,
    fullName: string
  ) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  loading: true, // Default to true initially as auth state needs to be fetched
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
});

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component to manage authentication state
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Manages overall loading state for auth operations
  const [isInitialized, setIsInitialized] = useState(false); // Track if auth has been initialized
  const router = useRouter();

  // Effect to initialize auth state and listen for changes
  useEffect(() => {
    const initAuth = async () => {
      setLoading(true); // Start loading on initial auth check
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Initial session error:', error);
      }

      const currentSession = data.session;
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        await fetchProfile(currentUser.id, currentUser.email!);
      } else {
        setProfile(null); // Clear profile if no user
        setLoading(false); // Stop loading if no user or profile needed
      }
      
      setIsInitialized(true); // Mark as initialized
    };

    initAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        // Don't process auth changes until initial auth is complete
        if (!isInitialized && event !== 'SIGNED_IN') {
          return;
        }
        
        setLoading(true); // Start loading on auth state change
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // If user exists, fetch or create their profile
          await fetchProfile(currentUser.id, currentUser.email!);
        } else {
          // If no user, clear profile and stop loading
          setProfile(null);
          setLoading(false);
        }
      }
    );

    // Clean up the auth state listener on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router, isInitialized]); // Add isInitialized to dependency array

  // Function to fetch or create a user profile
  const fetchProfile = async (userId: string, email: string) => {
    try {
      setLoading(true); // Set loading true specifically for profile fetching
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle to handle cases where no profile exists

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null); // Ensure profile is null on error
        return;
      }

      if (data) {
        // Profile found
        console.log(
          'Profile fetched:',
          data.full_name,
          'Onboarding:',
          data.onboarding_completed
        );
        setProfile(data);
      } else {
        // No profile found - create a default one
        console.log('No profile found, creating default profile for:', email);
        const { data: insertData, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            email,
            full_name: 'User', // Default full name
            onboarding_completed: false, // Default to false for new users
            level: 1,
            xp: 0,
            streak: 0,
            currency: 'USD',
            region: 'US',
            completed_lessons: [],
            achievements: [],
            subscription_status: 'free',
          })
          .select()
          .single(); // Select the newly inserted row

        if (insertError) {
          console.error('Failed to create default profile:', insertError);
          setProfile(null); // Ensure profile is null on insert error
        } else {
          // Set the profile to the newly created one
          console.log('Default profile created:', insertData);
          setProfile(insertData);
        }
      }
    } catch (error: any) {
      console.error(
        'Unexpected error fetching/creating profile:',
        error.message
      );
      setProfile(null);
    } finally {
      setLoading(false); // Always stop loading after profile operation
    }
  };

  // Function for user sign-up
  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setLoading(false);
        return { error };
      }

      if (data.user && data.session) {
        // User is confirmed and signed in immediately
        console.log('User signed up and confirmed:', data.user.email);
        
        // Check if profile already exists
        const { data: existingProfile, error: profileCheckError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (profileCheckError && profileCheckError.code !== 'PGRST116') {
          // PGRST116 means no rows found, which is expected for new users
          console.error('Error checking profile:', profileCheckError);
          setLoading(false);
          return { error: profileCheckError };
        }

        if (!existingProfile) {
          // Create profile only if it doesn't exist
          const { data: newProfile, error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName,
              level: 1,
              xp: 0,
              streak: 0,
              currency: 'USD',
              region: 'US',
              completed_lessons: [],
              achievements: [],
              subscription_status: 'free',
              onboarding_completed: false,
            })
            .select()
            .single();

          if (profileError) {
            console.error('Error creating profile on signup:', profileError);
            setLoading(false);
            return { error: profileError };
          }

          // Set the profile immediately
          setProfile(newProfile);
        }

        // Set session and user state immediately
        setSession(data.session);
        setUser(data.user);
        setLoading(false);
        
        // Navigate to onboarding immediately
        router.replace('/onboarding');
        
        return { error: null };
      } else if (data.user && !data.session) {
        // Email confirmation required
        setLoading(false);
        return { error: null }; // This will show the "check email" message
      }

      setLoading(false);
      return { error: new Error('Unexpected signup response') };
    } catch (error: any) {
      setLoading(false);
      return { error };
    }
  };

  // Function for user sign-in
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setLoading(false); // Stop loading on signin error
        return { error };
      }
      // Auth state change listener will handle setting user and profile after successful sign-in
      return { error: null };
    } catch (error: any) {
      setLoading(false); // Stop loading on unexpected error
      return { error };
    }
  };

  // Function for user sign-out
  const signOut = async () => {
    console.log('🔄 SignOut: Starting signout process...');
    console.log('🔄 Current session exists:', !!session);
    console.log('🔄 Current user exists:', !!user);
    console.log('🔄 Platform:', Platform.OS);
    
    setLoading(true);
    
    try {
      // Step 1: Clear local state immediately
      console.log('🔄 Step 1: Clearing local state...');
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsInitialized(false);
      console.log('✅ Local state cleared');
      
      // Step 2: Clear Supabase session
      console.log('🔄 Step 2: Calling Supabase signOut...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Supabase signOut error:', error);
        throw error;
      }
      console.log('✅ Supabase session cleared');

      // Step 3: Clear localStorage on web
      if (Platform.OS === 'web') {
        console.log('🔄 Step 3: Clearing web localStorage...');
        try {
          // Get all localStorage keys before clearing
          const keysToRemove = Object.keys(localStorage).filter(key => 
            key.startsWith('supabase.auth')
          );
          console.log('🔄 Found Supabase keys to remove:', keysToRemove);
          
          // Clear all Supabase auth keys
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log('🗑️ Removed key:', key);
          });
          
          console.log('✅ localStorage cleared');
        } catch (e) {
          console.warn('⚠️ Failed to clear localStorage:', e);
        }
      }

      // Step 4: Navigate to auth screen
      console.log('🔄 Step 4: Navigating to auth screen...');
      
      // Add a small delay to ensure state is cleared
      setTimeout(() => {
        router.replace('/(auth)');
        console.log('✅ Navigation to /(auth) completed');
      }, 100);
      
    } catch (error: any) {
      console.error('❌ Error during signout:', error.message);
      console.error('❌ Full error:', error);
      throw error; // Re-throw so the UI can handle it
    } finally {
      setLoading(false);
      console.log('🔄 SignOut process completed (loading set to false)');
    }
  };

  // Function to update user profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('No user logged in to update profile') };
    }

    setLoading(true); // Indicate profile update is in progress
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() }) // Automatically add updated_at timestamp
        .eq('id', user.id)
        .select() // Select the updated row to get the latest data
        .single(); // Expect a single row back

      if (error) {
        console.error('Supabase profile update error:', error);
        return { error };
      }

      if (data) {
        // **IMPORTANT:** Update the local 'profile' state with the new data
        console.log('Profile updated successfully, new profile data:', data);
        setProfile(data);
        return { error: null };
      }

      return { error: new Error('Failed to update profile: No data returned') };
    } catch (error: any) {
      console.error('Unexpected error during profile update:', error.message);
      return { error };
    } finally {
      setLoading(false); // Stop loading after profile update attempt
    }
  };

  // The context value provided to consumers
  const value: AuthContextType = {
    session,
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};