'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInWithGoogle, signUpWithEmailAndPassword } from "@/lib/auth";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function SignupPage() {
  useAuthRedirect();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const displayName = `${firstName} ${lastName}`;
    try {
      await signUpWithEmailAndPassword(email, password, displayName);
    } catch (error) {
      console.error("Signup failed", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google Sign-In failed", error);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfilePicture(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">Create an account</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-1.5 mb-4">
            <Label htmlFor="first-name">First name</Label>
            <Input type="text" id="first-name" placeholder="Enter your first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-4">
            <Label htmlFor="last-name">Last name</Label>
            <Input type="text" id="last-name" placeholder="Enter your last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-4">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-4">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid w-full items-center gap-1.5 mb-8">
            <Label htmlFor="profile-picture">Profile picture (optional)</Label>
            <Input type="file" id="profile-picture" onChange={handleFileChange} />
          </div>
          <Button type="submit" className="w-full">Create account</Button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-muted"></div>
          <span className="mx-4 text-muted-foreground">or</span>
          <div className="flex-grow border-t border-muted"></div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
