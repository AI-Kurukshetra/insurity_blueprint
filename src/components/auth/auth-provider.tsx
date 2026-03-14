"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { ensureUserProfile, type UserProfile, type UserRole } from "@/lib/auth";
import { createSupabaseBrowserClient, supabaseConfig } from "@/lib/supabase";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  isConfigured: boolean;
  authError: string | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(supabaseConfig.isConfigured);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const sessionRef = useRef<Session | null>(null);
  const profileRef = useRef<UserProfile | null>(null);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  useEffect(() => {
    if (!supabaseConfig.isConfigured) {
      return;
    }

    const client = createSupabaseBrowserClient();
    let isActive = true;

    async function syncSession(nextSession: Session | null, forceProfileReload = false) {
      if (!isActive) {
        return;
      }

      const currentSession = sessionRef.current;
      const currentProfile = profileRef.current;
      const currentUserId = currentSession?.user?.id ?? null;
      const nextUserId = nextSession?.user?.id ?? null;
      const isSameAuthenticatedUser = Boolean(
        currentProfile && currentUserId && currentUserId === nextUserId
      );
      const shouldReloadProfile =
        forceProfileReload || !currentProfile || currentUserId !== nextUserId;

      setSession(nextSession);

      if (!nextSession?.user) {
        setProfile(null);
        setAuthError(null);
        setLoading(false);
        return;
      }

      if (!shouldReloadProfile) {
        setAuthError(null);
        setLoading(false);
        return;
      }

      if (!isSameAuthenticatedUser) {
        setLoading(true);
      }

      const { data, error } = await ensureUserProfile(client, nextSession.user);

      if (!isActive) {
        return;
      }

      if (error) {
        if (!isSameAuthenticatedUser) {
          setProfile(null);
          setAuthError(error.message);
        }
        setLoading(false);
        return;
      }

      setProfile(data);
      setAuthError(null);
      setLoading(false);
    }

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await client.auth.getSession();

      await syncSession(currentSession);
    }

    void loadSession();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, nextSession) => {
      const shouldForceProfileReload =
        event === "SIGNED_IN" || event === "USER_UPDATED";
      void syncSession(nextSession, shouldForceProfileReload);
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      session,
      profile,
      role: profile?.role ?? null,
      loading,
      isAuthenticated: Boolean(session?.user),
      isConfigured: supabaseConfig.isConfigured,
      authError,
      refreshProfile: async () => {
        if (!supabaseConfig.isConfigured) {
          return;
        }

        const client = createSupabaseBrowserClient();
        const currentUser = session?.user;

        if (!currentUser) {
          setProfile(null);
          setAuthError(null);
          return;
        }

        setLoading(true);
        const { data, error } = await ensureUserProfile(client, currentUser);
        setProfile(data);
        setAuthError(error?.message ?? null);
        setLoading(false);
      },
      signOut: async () => {
        if (!supabaseConfig.isConfigured) {
          return;
        }

        const client = createSupabaseBrowserClient();
        await client.auth.signOut();
      },
    }),
    [authError, loading, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
