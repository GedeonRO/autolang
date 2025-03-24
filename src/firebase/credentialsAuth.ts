import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseAuth } from "./config";
import { createFirebaseUser } from "@/lib/helpers/extensionAuth";

export const signUpWithCredentials = async (
  email: string,
  password: string,
) => {
  try {
    const res = await createUserWithEmailAndPassword(
      FirebaseAuth,
      email,
      password
    );
    await createFirebaseUser(res.user);
    return res.user;
  } catch (e) {
    console.log(e);
    // throw error to the parent component
    throw e;
  }
};

export const loginWithCredentials = async (
  email: string,
  password: string,
) => {
  try {
    const res = await signInWithEmailAndPassword(FirebaseAuth, email, password);

    await createFirebaseUser(res.user);
    return res.user;
  } catch (e) {
    console.log(e);
    // throw error to the parent component
    throw e;
  }
};

export const logoutFirebase = async () => {
  await FirebaseAuth.signOut();

};
