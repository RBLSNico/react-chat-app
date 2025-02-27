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
              Sign in with Google
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}

export default App;
