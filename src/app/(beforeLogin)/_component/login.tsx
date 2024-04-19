"use client";

import { auth, loginWithEmailAndPassword } from "@/firebase/firebaseAuth";
import firestore from "@/firebase/firestore";
import useUserInfo from "@/store/store";
import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Main() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
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

  const signIn = async (event: any) => {
    event.preventDefault();
    try {
      await loginWithEmailAndPassword(email, password);
      router.replace("/home");
    } catch (error: any) {
      //   const errorCode = error.code;
      const errorMessage = error.message;
      if (
        errorMessage === "Firebase: Error (auth/invalid-email)." ||
        errorMessage === "Firebase: Error (auth/invalid-credential)."
      ) {
        alert("아이디와 비밀번호를 확인해주세요.");
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="container mx-auto mr-20 ml-20">
      {/* <button onClick={onClickUploadButton}>등록테스트</button> */}
      <Stack spacing={3} mb={10}>
        <Text fontSize="6xl" as="b">
          Just Do It
        </Text>
      </Stack>
      <form>
        <div className="flex">
          <Text w="5rem">이메일</Text>
          <Input
            variant="outline"
            placeholder="email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div className="flex mt-3">
          <Text w="5rem">비밀번호</Text>
          <Input
            variant="outline"
            // type={show ? 'text' : 'password'}
            // show 를 state로 두고 전환 가능
            type="password"
            placeholder="Enter password"
            name="password"
            onChange={onChange}
            required
          />
        </div>

        <div className="mt-5">
          <Button
            ml={10}
            colorScheme="teal"
            onClick={() => router.push("/signUp")}
          >
            회원가입
          </Button>
          <Button ml={10} colorScheme="teal" onClick={signIn}>
            로그인
          </Button>
        </div>
      </form>
    </div>
  );
}
