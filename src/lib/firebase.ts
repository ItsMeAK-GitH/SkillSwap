
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

interface FirebaseServices {
  auth: Auth;
  firestore: Firestore;
  firebaseApp: FirebaseApp;
}

// This function provides a server-safe way to get Firebase services.
export function getFirebaseServices(): FirebaseServices {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  return { auth, firestore, firebaseApp: app };
}

// Export singleton instances for server-side use.
const { auth, firestore, firebaseApp } = getFirebaseServices();

export { auth, firestore, firebaseApp };
