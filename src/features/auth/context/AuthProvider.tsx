import { UserProfile } from "../../../features/profile/types";
import { ErrorHandler } from "../../../shared/services/errorHandling";
import { supabase } from "../../../integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { AuthContext } from "./AuthContext";
import type {
  DBProfile,
  DBAccount,
} from "../../../integrations/supabase/schema";
import type { AuthContextType } from "../types";

/**
 * Authentication Provider Component
 * Manages auth state and provides auth-related functionality throughout the application
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const hasShownWelcomeRef = useRef(false);

  // Fetch profile data from backend API
  const fetchProfile = useCallback(
    async (currentUser: User) => {
      if (!currentUser) return null;
      setProfileLoading(true);
      try {
        // Get profile data from public.profiles
        const { data: dbProfile, error: profileError } = await supabase
          .from("profiles")
          .select<"*", DBProfile>("*")
          .eq("id", currentUser.id)
          .single();

        if (profileError && profileError.code !== "PGRST116") {
          // Ignore "not found" errors profile might not exist yet
          throw profileError;
        }

        // Get account data
        const { data: dbAccount, error: accountError } = await supabase
          .from("accounts")
          .select<"*", DBAccount>("*")
          .eq("user_id", currentUser.id)
          .single();

        if (accountError && accountError.code !== "PGRST116") {
          throw accountError;
        }

        // Parse preferences<string, unknown> or default to empty object
        const preferences =
          dbProfile?.preferences && typeof dbProfile.preferences === "object"
            ? dbProfile.preferences
            : {};

        const profile: UserProfile = {
          id: currentUser.id,
          email: currentUser.email || "",
          first_name: dbProfile?.first_name || "",
          last_name: dbProfile?.last_name || "",
          experience_level: dbProfile?.experience_level || "BEGINNER",
          preferences,
          created_at: dbProfile?.created_at,
          last_login: dbProfile?.last_login,
          is_verified: Boolean(dbAccount?.is_verified),
          kyc_status: dbProfile?.kyc_status || "PENDING",
          country: dbProfile?.country || "",
          phone_number: dbProfile?.phone_number || "",
        };

        // Update the last login time
        await supabase.from("profiles").upsert({
          id: currentUser.id,
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        });

        setProfile(profile);
        return profile;
      } catch (error) {
        ErrorHandler.handleError(
          error instanceof Error ? error : String(error)
        );
        return null;
      } finally {
        setProfileLoading(false);
      }
    },
    [] // No dependencies needed
  );

  // Auth state change handler
  const handleAuthStateChange = useCallback(
    async (event: string, newSession: Session | null) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (event === "SIGNED_IN" && newSession?.user) {
        // Defer profile fetching to prevent auth deadlocks
        setTimeout(() => {
          fetchProfile(newSession.user).catch((error) => {
            // Log or handle error, though fetchProfile itself has error handling
            console.error("Error fetching profile in setTimeout:", error);
            ErrorHandler.handleError(
              error instanceof Error ? error : String(error)
            );
          });

          // Only show welcome toast for non-initial sessions and only once per login
          if (initialized && !hasShownWelcomeRef.current) {
            ErrorHandler.handleSuccess("Welcome to TradePro", {
              description: "You have successfully logged in.",
            });
            hasShownWelcomeRef.current = true;
          }
        }, 100);
      } else if (event === "SIGNED_OUT") {
        setProfile(null);
        hasShownWelcomeRef.current = false;
      }
    },
    [fetchProfile, initialized]
  );

  // Initialize auth on component mount
  useEffect(() => {
    let authSubscriptionUnsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Check current auth session
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        if (sessionData.session?.user) {
          setUser(sessionData.session.user);
          await fetchProfile(sessionData.session.user);
        }

        // Set up auth state change listener
        const { data: authListener } = supabase.auth.onAuthStateChange(
          handleAuthStateChange
        );
        authSubscriptionUnsubscribe = () => {
          authListener.subscription.unsubscribe();
        };

        setInitialized(true);
      } catch (error) {
        ErrorHandler.handleError(
          error instanceof Error ? error : String(error)
        );
      } finally {
        setLoading(false);
      }
    };

    initializeAuth().catch((error) => {
      // Catch any error from the async initializeAuth itself
      ErrorHandler.handleError(error instanceof Error ? error : String(error));
    });

    return () => {
      // Cleanup listener on unmount
      if (authSubscriptionUnsubscribe) {
        authSubscriptionUnsubscribe();
      }
    };
  }, [handleAuthStateChange, fetchProfile]); // fetchProfile is stable due to useCallback([])

  // Method to refresh the auth session
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      setSession(data.session);
      setUser(data.session?.user ?? null);

      return data.session;
    } catch (error) {
      ErrorHandler.handleError(error instanceof Error ? error : String(error));
      return null;
    }
  }, []);

  // Method to sign out the user
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      ErrorHandler.handleError(error instanceof Error ? error : String(error));
    }
  }, []);

  // Method to update the user profile
  const updateProfile = useCallback(
    async (profileData: Partial<UserProfile>) => {
      if (!user) {
        throw new Error("No authenticated user");
      }

      setProfileLoading(true);
      try {
        const { error } = await supabase.from("profiles").upsert({
          id: user.id,
          updated_at: new Date().toISOString(),
          ...profileData,
        });

        if (error) throw error;

        // Update the local profile state
        setProfile((prev) => {
          if (prev) {
            return { ...prev, ...profileData };
          }
          // If no previous profile, we can't just spread a partial.
          // This case should ideally not be hit if update is only called for existing profiles.
          // However, to satisfy types, we'd need to construct a full UserProfile.
          // For now, we'll assume update is only for existing profiles and just return null if not.
          // A better implementation might be to throw an error or handle it more gracefully.
          if (!profileData.email) {
            // email is required, so if it's not in the partial, we can't create a valid profile.
            return null;
          }
          return {
            id: user.id,
            email: profileData.email,
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            experience_level: profileData.experience_level || "BEGINNER",
            preferences: profileData.preferences || {},
            is_verified: profileData.is_verified || false,
            kyc_status: profileData.kyc_status || "PENDING",
            country: profileData.country || "",
            phone_number: profileData.phone_number || "",
            ...profileData,
          };
        });

        ErrorHandler.handleSuccess("Profile Updated", {
          description: "Your profile has been updated successfully.",
        });
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred";
        ErrorHandler.handleError(errorMessage);
        throw error;
      } finally {
        setProfileLoading(false);
      }
    },
    [user]
  );

  // Method to refresh the user profile
  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user);
    }
  }, [user, fetchProfile]);

  // Method to sign in with email and password
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } catch (error) {
        ErrorHandler.handleError(
          error instanceof Error ? error : String(error)
        );
        throw error;
      }
    },
    []
  );

  // Method to sign up with email and password
  const signUpWithEmail = useCallback(
    async (
      email: string,
      password: string,
      profileData?: Partial<UserProfile>
    ) => {
      try {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (data.user && profileData) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert({
              id: data.user.id,
              email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ...profileData,
            });
          if (profileError) throw profileError;
        }
      } catch (error) {
        ErrorHandler.handleError(
          error instanceof Error ? error : String(error)
        );
        throw error;
      }
    },
    []
  );

  // Context value to be provided to consumers
  const contextValue: AuthContextType = {
    session,
    user,
    profile,
    loading,
    profileLoading,
    signOut,
    updateProfile,
    refreshProfile,
    refreshSession,
    signInWithEmail,
    signUpWithEmail,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
