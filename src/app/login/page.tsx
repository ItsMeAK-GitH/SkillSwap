'use client';

import { Button } from "@/components/ui/button";
import { signInWithGoogle } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function LoginPage() {
  useAuthRedirect();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Login to SkillSwap</h1>
      <Button onClick={handleSignIn}>Login with Google</Button>
    </div>
  );
}
