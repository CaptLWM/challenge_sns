"use client";

import useAuthStore, { initAuthState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Main from "../_viewComponent/challenge";

export default function Challenge() {
  const router = useRouter();
  const initializing = useAuthStore((state) => state.initializing);
  const user = useAuthStore((state) => state.user);

  const checkAuthState = initAuthState();

  console.log("home", initializing && user, initializing, user, checkAuthState);
  if (!initializing && !user) {
    router.replace("/login"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  }

  return <Main />;
}
