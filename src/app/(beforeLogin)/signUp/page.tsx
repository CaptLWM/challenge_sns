"use client";

import { useRouter } from "next/navigation";
import Main from "../_component/signUp";

export default function SignIn() {
  // redirect("/i/flow/login"); // 서버에서 리다이렉트 client에서는 안먹음
  const router = useRouter();
  // const { data: session } = useSession();
  // if (session?.user) {
  //   // client component에서f
  //   router.replace("/home");
  //   return null;
  // }
  // router.replace("/i/flow/login");
  return <Main />;
}
