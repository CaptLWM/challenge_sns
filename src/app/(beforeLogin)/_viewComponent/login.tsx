"use client";

import { auth, loginWithEmailAndPassword } from "@/firebase/firebaseAuth";
import firestore from "@/firebase/firestore";
import useUserInfo from "@/store/store";
import { Button, Input, Stack, Text } from "@chakra-ui/react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommonInputForm from "../_commonComponent/CommonInputForm";
import CommoneButtonForm from "../_commonComponent/CommonButtonForm";

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
        <CommonInputForm
          props={{
            label_width: "5rem",
            input_type: "email",
            label: "이메일",
            name: "email",
            onChange: (e) => onChange(e),
            placeholder: "이메일",
            required: true,
            value: email,
          }}
        />
        <CommonInputForm
          props={{
            label_width: "5rem",
            input_type: "password",
            label: "비밀번호",
            name: "password",
            onChange: (e) => onChange(e),
            placeholder: "password",
            required: true,
            value: password,
          }}
        />
        <div className="mt-5">
          <CommoneButtonForm
            props={{
              label: "회원가입",
              ml: 10,
              onClick: () => router.push("/signUp"),
            }}
          />
          <CommoneButtonForm
            props={{
              type: "submit",
              label: "로그인",
              ml: 10,
              onClick: (event) => signIn(event),
            }}
          />
        </div>
      </form>
    </div>
  );
}
