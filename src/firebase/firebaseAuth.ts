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

// 회원가입
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      // 여기서 유저 정보를 조회할 수 있다
      console.log("회원가입", user.uid);

      alert("성공했습니다!");
      return user.uid;
    })
    .catch((error) => {
      const errorMessage = error;
      alert(errorMessage);
      return error;
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
    callback(user);
  });
};
