import { db } from "@/firebase/config";
import { IUser } from "@/types/user";

import { User as FirebaseUser } from "firebase/auth";

import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { ENV } from "../env";

export const handleExtLogin = async (uid: string) => {
  await setUserCookie(uid).then(() => {
    localStorage.setItem("uid", uid);
    const isExtauth = window.location.href.includes("extensionAuth=true");

    setTimeout(() => isExtauth && window.close(), 500);
  });
};

// On your web application (extractor-userpanel.vercel.app)
export const encryptUserId = (userId: string): string => {
  // A simple encryption method - in production use a more secure approach
  const encoder = new TextEncoder();
  const data = encoder.encode(JSON.stringify({ uid: userId }));

  // Convert to base64 for cookie storage
  return btoa(String.fromCharCode(...new Uint8Array(data)));
};

// When user logs in:
export const setUserCookie = async (userId: string) => {
  const encryptedData = encryptUserId(userId);
  console.log(encryptedData, "Encrypted uid");
  // Set persistent cookie (with expiration far in the future)
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year expiration

  document.cookie = `auth_token=${encryptedData}; path=/; domain=${ENV.auth_domain
    }; expires=${expirationDate.toUTCString()}`;
};

export const createFirebaseUser = async (
  firebaseUser: FirebaseUser
): Promise<IUser> => {
  const userRef = doc(db, "users", firebaseUser.uid);
  const userSnap = await getDoc(userRef);

  const userData: Partial<IUser> = {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    lastLogin: new Date(),
  };

  if (!userSnap.exists()) {
    // New user - create record
    userData.createdAt = new Date();
    await setDoc(userRef, {
      ...userData,
      lastLogin: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  } else {
    // Existing user - update last login
    userData.createdAt = (userSnap.data().createdAt as Timestamp).toDate();
    await setDoc(
      userRef,
      { ...userData, lastLogin: serverTimestamp() },
      { merge: true }
    );
  }

  return userData as IUser;
};
