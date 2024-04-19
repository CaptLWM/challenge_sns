"use client";

import { useRouter } from "next/navigation";
import Main from "../_component/login";
import useAuthStore from "@/store/store";

export default function Login() {
  // redirect("/i/flow/login"); // 서버에서 리다이렉트 client에서는 안먹음
  const router = useRouter();

  const initializing = useAuthStore((state) => state.initializing);
  const user = useAuthStore((state) => state.user);

  console.log("login", initializing, user);

  if (initializing && user) {
    router.push("/home"); // 로그인되지 않은 경우 로그인 페이지로 리디렉션
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
