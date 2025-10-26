
import { initializeFirebase } from "@/firebase";

// This file centralizes the Firebase services initialization.
// The `initializeFirebase` function handles both client-side initialization
// and ensures that we use the same instance across the app.

const { auth, firestore, firebaseApp } = initializeFirebase();

export { auth, firestore, firebaseApp };
