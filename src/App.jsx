// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { getFirestore } from 'firebase/firestore';
// import './App.css'
import Button from './components/Button.jsx'
import Channel from './components/Channel.jsx'
import Header from './components/Header.jsx'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB2fdqMnw2nPS6WqKqaS1bZH2Dr4SG_SmQ",
  authDomain: "react-chat-a22c0.firebaseapp.com",
  projectId: "react-chat-a22c0",
  storageBucket: "react-chat-a22c0.firebasestorage.app",
  messagingSenderId: "831556412826",
  appId: "1:831556412826:web:16d6cd3540569fb3200623",
  measurementId: "G-ZB9T2F8FLJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user, setUser] = useState(() => auth.currentUser);
  const [initializing, setInitializing] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }

      if (initializing) {
        setInitializing(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    auth.useDeviceLanguage();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  }

  if (initializing) return "Loading...";

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="p-4">
        {user ? (
          <>
            <div className="flex flex-row justify-between">
              <p className="text-lg">Welcome, {user.displayName}</p>
              <Button onClick={handleSignOut}>Sign Out</Button>
            </div>
            <Channel db={db} />
          </>
        ) : (
          <div className="flex flex-row items-center justify-center">
            <Button onClick={signInWithGoogle} className="flex items-center bg-gray-800 text-white hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5 mr-2">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10 5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                <path d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
              </svg>
              Sign in with Google
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App;
