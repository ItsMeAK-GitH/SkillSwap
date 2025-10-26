import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile, signOut as firebaseSignOut, signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "./firebase"; // Correctly import the initialized services

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userDocRef = doc(firestore, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // Create a new user document if it doesn't exist
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        skillsToTeach: [],
        skillsToLearn: [],
      });
    }
    // Redirection is now handled by the useAuthRedirect hook.
  } catch (error: any) {
    if (error.code !== 'auth/popup-closed-by-user' && error.code !== 'auth/cancelled-popup-request') {
      console.error("Error signing in with Google", error);
      throw error;
    }
  }
}

export async function signUpWithEmailAndPassword(email: string, password: string, displayName: string, photoURL?: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await updateProfile(user, { displayName, photoURL });
    
    const userDocRef = doc(firestore, "users", user.uid);
    await setDoc(userDocRef, {
      name: displayName,
      email: user.email,
      photoURL: photoURL || user.photoURL || null,
      skillsToTeach: [],
      skillsToLearn: [],
    });

  } catch (error) {
    console.error("Error signing up with email and password", error);
    throw error;
  }
}

export async function signInWithEmailAndPassword(email: string, password: string) {
  try {
    await firebaseSignInWithEmailAndPassword(auth, email, password);
  } catch(error) {
    console.error("Error signing in with email and password", error);
    throw error;
  }
}


export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
}
