"use client";

import { auth, logout } from "@/firebase/firebaseAuth";
import useAuthStore from "@/store/store";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import FileUpload from "../_CommonComponent/FileUpload";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import BoardCreateCard from "../_CommonComponent/BoardCreateCard";
import {
  DocumentData,
  QuerySnapshot,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import firebasedb from "@/firebase/firebase";
import { firestore } from "@/firebase/firestore";
import { Board } from "@/firebase/firebase.type";

import { useBoardListQuery } from "@/queries/queries";

export default function Main() {
  const router = useRouter();
  const [temp, setTemp] = React.useState<DocumentData[]>([]);
  const doLogout = async (event: any) => {
    try {
      await logout();
      router.replace("/login");
    } catch (error: any) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

  // 데이터 호출 테스트

  const boardList = useBoardListQuery();
  return (
    <div>
      <Text>처음화면</Text>
      <Button onClick={doLogout}>로그아웃</Button>
      <BoardCreateCard />

      {boardList.data
        ? boardList.data.map((v, i) => (
            <BoardItemCard key={i} props={v.data} id={v.id} />
          ))
        : null}
    </div>
  );
}
