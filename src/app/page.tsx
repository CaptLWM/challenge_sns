"use client";

import { auth } from "@/firebase/firebaseAuth";
// import auth from "@/firebase/firebaseAuth";
import firestore from "@/firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }
  };

  const signUp = (event: any) => {
    event.preventDefault();
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

  const signIn = (event: any) => {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // 여기서 유저 정보를 조회할 수 있다
        console.log(user);
        alert("성공했습니다!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
      });
  };

  const logOut = (event: any) => {
    event.preventDefault();
    signOut(auth)
      .then(() => {
        alert("로그아웃 성공");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const onClickUploadButton = async () => {
    await addDoc(collection(firestore, "temp"), {
      value: "test",
    });
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={onClickUploadButton}>등록테스트</button>
      <form>
        <div>
          <label>이메일 : </label>
          <input
            className="border-solid border-black border-2 mb-2"
            type="email"
            value={email}
            name="email"
            onChange={onChange}
            required
          ></input>
        </div>
        <div>
          <label>비밀번호 : </label>
          <input
            className="border-solid border-black border-2"
            type="password"
            value={password}
            name="password"
            onChange={onChange}
            required
          ></input>
        </div>
        <button onClick={signUp}>회원가입</button>
        <button onClick={signIn}>로그인</button>
        <button onClick={logOut}>로그아웃</button>
      </form>
    </main>
  );
}
