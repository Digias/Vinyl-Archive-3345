// firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth, sendEmailVerification } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDAtz04UCcuUiqaylY_GzgpNmWGdabbABA",
  authDomain: "vinyl-archive-3345.firebaseapp.com",
  projectId: "vinyl-archive-3345",
  storageBucket: "vinyl-archive-3345.firebasestorage.app",
  messagingSenderId: "489537021870",
  appId: "1:489537021870:web:d35eb57953d5f18eec0a3f",
  measurementId: "G-GS5F5MLZ3K"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const sendVerificationEmail = sendEmailVerification;