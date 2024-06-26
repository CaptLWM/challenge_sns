"use client";

import {
  User,
  UserCredential,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
} from "firebase/auth";
import firebasedb from "./firebase";

export const auth = getAuth(firebasedb);

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
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
};

// 비밀번호 변경

export const userPasswordUpdate = async (newPassword: string) => {
  const user = auth.currentUser;
  if (user) {
    updatePassword(user, newPassword)
      .then(() => {})
      .catch();
  } else {
    console.error("User is not logged in / 유저정보가 없습니다.");
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
    callback(user);
  });
};
// const AuthListener = (callback: (user: User | null) => void) => {
