"use client";

import { useRouter } from "next/navigation";
import Main from "../_viewComponent/login";
import useAuthStore, { initAuthState } from "@/store/store";

export default function Login() {
  // redirect("/i/flow/login"); // 서버에서 리다이렉트 client에서는 안먹음
  const router = useRouter();

  const initializing = useAuthStore((state) => state.initializing);
  const user = useAuthStore((state) => state.user);
  const checkAuthState = initAuthState();

  if (initializing && user) {
    router.replace("/home"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
    return null;
  }
  // const { data: session } = useSession();
  // if (session?.user) {
  //   // client component에서f
  //   router.replace("/home");
  //   return null;
  // }
  // router.replace("/i/flow/login");
  return <Main />;
}
