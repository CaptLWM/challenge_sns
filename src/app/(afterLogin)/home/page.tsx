"use client";

import useAuthStore from "@/store/store";
import { useRouter } from "next/navigation";
import React from "react";
import Main from "../_viewComponent/home";

export default function Home() {
  const router = useRouter();
  const initializing = useAuthStore((state) => state.initializing);
  const user = useAuthStore((state) => state.user);

  if (!initializing && !user) {
    router.replace("/login"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  }

  return <Main />;
}
