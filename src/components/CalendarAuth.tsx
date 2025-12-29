"use client";

import { useEffect, useState } from "react";
import { initClient, signIn, signOut, isSignedIn } from "@/lib/googleCalendarClient";
import { Button } from "@/components/ui/button";
import { FaGoogle, FaSignOutAlt, FaCheckCircle } from "react-icons/fa";

interface CalendarAuthProps {
  onAuthChange?: (isSignedIn: boolean) => void;
}

export default function CalendarAuth({ onAuthChange }: CalendarAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeGapi = async () => {
      try {
        await initClient();
        const signedIn = isSignedIn();
        setAuthenticated(signedIn);
        onAuthChange?.(signedIn);
        setIsLoading(false);
      } catch (error) {
        console.error("Error initializing Google API:", error);
        setError("Failed to initialize Google Calendar");
        setIsLoading(false);
      }
    };

    initializeGapi();
  }, [onAuthChange]);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const success = await signIn();
      if (success) {
        setAuthenticated(true);
        onAuthChange?.(true);
      } else {
        setError("Failed to sign in");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      const success = await signOut();
      if (success) {
        setAuthenticated(false);
        onAuthChange?.(false);
      }
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span>Loading Google Calendar...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {authenticated ? (
        <>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FaCheckCircle />
            <span>Connected to Google Calendar</span>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <FaSignOutAlt />
            Sign Out
          </Button>
        </>
      ) : (
        <Button
          onClick={handleSignIn}
          className="gap-2"
          size="sm"
        >
          <FaGoogle />
          Sign in with Google
        </Button>
      )}
    </div>
  );
}
