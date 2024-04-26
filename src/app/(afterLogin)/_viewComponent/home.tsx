"use client";

import { auth, logout } from "@/firebase/firebaseAuth";
import useAuthStore from "@/store/store";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import FileUpload from "../_CommonComponent/FileUpload";
import BoardItemCard from "../_CommonComponent/BoardItemCard";

import BoardCreateCard from "../_CommonComponent/BoardCreateCard";

export default function Main() {
  const router = useRouter();
  const doLogout = async (event: any) => {
    try {
      await logout();
      router.replace("/login");
    } catch (error: any) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };
  return (
    <div>
      <Text>처음화면</Text>
      <Button onClick={doLogout}>로그아웃</Button>
      <BoardCreateCard />
      <BoardItemCard />
    </div>
  );
}
