import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '../utils/supabase/client';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  balance: number;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateBalance: (amount: number, type: 'add' | 'subtract') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TEMPORARY: enable bypass so the site can be inspected without DB/auth
  // Set to `false` to restore normal authentication flow.
  const BYPASS_LOGIN = true;
  const BYPASS_USER: User = {
    id: 'bypass-user',
    email: 'cesarrosario516@gmail.com',
    name: 'Bypass User',
    balance: 1000,
  };

  const [user, setUser] = useState<User | null>(BYPASS_LOGIN ? BYPASS_USER : null);
  const [accessToken, setAccessToken] = useState<string | null>(BYPASS_LOGIN ? 'bypass-token' : null);
  const [loading, setLoading] = useState(BYPASS_LOGIN ? false : true);

  const supabase = createClient();

  // Check for existing session on mount
  useEffect(() => {
    if (BYPASS_LOGIN) return; // skip real session check when bypassing

    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        setLoading(false);
        return;
      }

      if (session?.access_token) {
        setAccessToken(session.access_token);
        // Set minimal user ASAP so UI doesn't block on edge function
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            setUser({
              id: userData.user.id,
              email: userData.user.email || '',
              name: (userData.user.user_metadata as any)?.name || '',
              balance: 0,
            });
          }
        } catch (e) {
          // Ignore; we'll still try to fetch full profile
        }
        // Fetch full profile in background (don't block)
        fetchUserProfile(session.access_token).catch(() => {
          // Silently fail - user is already logged in with minimal data
        });
      }
    } catch (error) {
      console.error('Error in checkSession:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      // Try the correct URL format: /functions/v1/{function-name}/{route}
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/make-server-b1c23bba/user-profile`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setUser(data.user);
        }
      } else {
        const errorText = await response.text();
        console.warn('Error fetching user profile (non-critical):', errorText);
      }
    } catch (error) {
      // Silently handle - this is a background fetch, user is already logged in
      console.warn('Could not fetch full user profile (non-critical):', error);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      // First, create user in backend
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/make-server-b1c23bba/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password, name }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      // Then, sign in the user
      await login(email, password);
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.session?.access_token) {
        setAccessToken(data.session.access_token);
        // Set minimal user immediately; don't block on function call
        if (data.user) {
          setUser({
            id: data.user.id,
            email: data.user.email || '',
            name: (data.user.user_metadata as any)?.name || '',
            balance: 0,
          });
        }
        // Fetch full profile in background (don't await - non-blocking)
        fetchUserProfile(data.session.access_token).catch(() => {
          // Silently fail - user is already logged in with minimal data
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setAccessToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    if (accessToken) {
      await fetchUserProfile(accessToken);
    }
  };

  const updateBalance = async (amount: number, type: 'add' | 'subtract') => {
    if (!accessToken) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/server/make-server-b1c23bba/update-balance`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ amount, type }),
        }
      );

      const data = await response.json();

      if (response.ok && user) {
        setUser({ ...user, balance: data.balance });
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        balance: user?.balance ?? 0,
        loading,
        login,
        signup,
        logout,
        refreshUser,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}