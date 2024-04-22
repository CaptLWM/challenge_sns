"use client";

import {
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import firebasedb from "./firebase";

export const auth = getAuth(firebasedb);

export const signUp = async (email: string, password: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // 여기서 유저 정보를 조회할 수 있다
      console.log(user);
      alert("성공했습니다!");
    })
    .catch((error) => {
      const errorMessage = error;
      alert(errorMessage);
    });
};
// 이메일과 비밀번호를 사용하여 로그인
export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    ); // signInWithEmailAndPassword 함수 사용
    console.log("nn");
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
};

// 로그아웃
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

// 인증 상태 확인
export const checkAuthState = (callback: (user: User | null) => void) => {
  onAuthStateChanged(auth, (user) => {
    console.log("firebase", auth);
    callback(user);
  });
};
