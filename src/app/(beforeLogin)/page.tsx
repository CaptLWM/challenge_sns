// "use client";

import { redirect, useRouter } from "next/navigation";
import Login from "./login/page";
import useAuthStore, { initAuthState } from "@/store/store";
import { useEffect } from "react";
// import { useSession } from "next-auth/react";

export default function Page() {
  // redirect("/i/flow/login"); // 서버에서 리다이렉트 client에서는 안먹음
  //   const router = useRouter();
  //   const initializing = useAuthStore((state) => state.initializing);
  //   const user = useAuthStore((state) => state.user);
  //   if (initializing && user) {
  //     router.replace("/home"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
  //   }
  //   const { data: session } = useSession();
  //   if (session?.user) {
  //     // client component에서f
  //     router.replace("/home");
  //     return null;
  //   }
  //   router.replace("/i/flow/login");
  return <Login />;
}

// router. push => 뒤로가기 눌렀을때 바로 뒤로만 감
// localhost:3000 -> localhost:3000/login -> localhost:3000/i/flow/login

// router.replace => 중간 히스토리가 생략됨 즉 인터셉트 되기 전 주소를 기억해 두지 않음
// localhost:3000 -> localhost:3000/login -> localhost:3000/i/flow/login
