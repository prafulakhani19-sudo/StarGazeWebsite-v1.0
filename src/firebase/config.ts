import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import configData from '../../firebase-applet-config.json';

const firebaseConfig = {
  projectId: configData.projectId,
  appId: configData.appId,
  apiKey: configData.apiKey,
  authDomain: configData.authDomain,
  storageBucket: configData.storageBucket,
  messagingSenderId: configData.messagingSenderId,
};

// Initialize Firebase client app
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app, configData.firestoreDatabaseId || undefined);

export default app;
