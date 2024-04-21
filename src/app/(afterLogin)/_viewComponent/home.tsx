"use client";

import useAuthStore from "@/store/store";
import { Button, Text } from "@chakra-ui/react";
import React from "react";

export default function Main() {
  const doLogout = useAuthStore((state) => state.doLogout);
  return (
    <div>
      <Text>처음화면</Text>
      <Button onClick={doLogout}>로그아웃</Button>
    </div>
  );
}
