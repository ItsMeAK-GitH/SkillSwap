
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

interface FirebaseServices {
  auth: Auth;
  firestore: Firestore;
  firebaseApp: FirebaseApp;
}

let services: FirebaseServices | null = null;

// This function provides a server-safe way to get Firebase services.
// It initializes Firebase only once and reuses the instance.
export function getFirebaseServices(): FirebaseServices {
  if (services) {
    return services;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);
  const auth = getAuth(app);
  
  services = { auth, firestore, firebaseApp: app };
  
  return services;
}
