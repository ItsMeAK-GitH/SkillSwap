
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle, signUpWithEmailAndPassword } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUpWithEmailAndPassword(email, password, name);
      router.push('/onboarding');
    } catch (error: any) {
      console.error("Signup failed", error);
      let description = "There was a problem creating your account.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already in use. Please log in instead.";
      }
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: description,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(router);
    } catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-sm p-6">
        <h1 className="text-4xl font-bold mb-8 text-center font-headline">Create an Account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">Full Name</Label>
            <Input type="text" id="name" placeholder="Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="6+ characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="mx-4 text-muted-foreground">OR</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          Sign up with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
