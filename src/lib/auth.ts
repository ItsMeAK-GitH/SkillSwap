
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signOut as firebaseSignOut, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseServices } from "./firebase";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const { auth, firestore } = getFirebaseServices();

export async function signInWithGoogle(router: AppRouterInstance) {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // New user
      await setDoc(userDocRef, {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        skillsToTeach: [],
        skillsToLearn: [],
        onboardingCompleted: false,
      });
      router.push('/onboarding');
    } else {
      // Existing user
      const userData = userDoc.data();
      if (userData.onboardingCompleted) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    }
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      console.error("Error signing in with Google", error);
      throw error;
    }
  }
}

export async function signUpWithEmailAndPassword(email: string, password: string, displayName: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName });
    
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, {
      id: user.uid,
      name: displayName,
      email: user.email,
      photoURL: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(displayName)}`,
      skillsToTeach: [],
      skillsToLearn: [],
      onboardingCompleted: false,
    });
    // For email sign-up, we can assume they need onboarding.
    // The redirect will be handled by useUser hook watching the user state.
  } catch (error) {
    console.error("Error signing up with email and password", error);
    throw error;
  }
}

export async function signInWithEmailAndPassword(email: string, password: string) {
  try {
    await firebaseSignInWithEmailAndPassword(auth, email, password);
    // useUser hook will handle routing after login
  } catch(error) {
    console.error("Error signing in with email and password", error);
    throw error;
  }
}


export async function signOut() {
  try {
    await firebaseSignOut(auth);
    // After signing out, redirect to login page.
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  } catch (error) {
    console.error("Error signing out", error);
  }
}
