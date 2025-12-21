import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

/**
 * LIVE CONFIGURATION:
 * These values are connected to the 'velomarket-artisan' project.
 */
const firebaseConfig = {
  apiKey: "AIzaSyBmJgNTtlluOPI-Z7yRnXa1bd9GmNzKLds",
  authDomain: "velomarket-artisan.firebaseapp.com",
  projectId: "velomarket-artisan",
  storageBucket: "velomarket-artisan.firebasestorage.app",
  messagingSenderId: "433050804878",
  appId: "1:433050804878:web:1537c83e9109e9149fdfdf"
};

let app: FirebaseApp;
let db: Firestore | null = null;
let auth: Auth | null = null;

try {
  const apps = getApps();
  if (apps.length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = apps[0];
  }
  
  // Explicitly associate the services with the specific app instance.
  // This is critical in an ESM environment to ensure the service registry
  // is correctly linked across modular imports and matches the loaded version.
  db = getFirestore(app);
  auth = getAuth(app);
  
  console.log("🚀 VeloMarket: Firebase services successfully registered.");
} catch (error: any) {
  console.error("Firebase failed to initialize:", error.message || error);
  // Re-throw if critical, but here we let StorageService handle the null db
}

export { db, auth };