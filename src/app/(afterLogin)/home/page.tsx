"use client";

import useAuthStore, { initAuthState } from "@/store/store";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const initializing = useAuthStore((state) => state.initializing);
  const user = useAuthStore((state) => state.user);
  const doLogout = useAuthStore((state) => state.doLogout);
  const checkAuthState = initAuthState();

  console.log("home", initializing && user, initializing, user, checkAuthState);
  if (!initializing && !user) {
    router.replace("/login"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  }

  return (
    <div>
      <Text>처음화면</Text>
      <Button onClick={doLogout}>로그아웃</Button>
    </div>
  );
}
