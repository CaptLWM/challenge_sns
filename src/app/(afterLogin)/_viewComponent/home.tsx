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
  useEffect(() => {
    const fetchData = async () => {
      // collection 이름이 todos인 collection의 모든 document를 가져옵니다.
      const q = query(
        collection(firestore, "BoardItem"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot: QuerySnapshot = await getDocs(q);
      const initial: DocumentData[] = [];
      // document의 id와 데이터를 initialTodos에 저장합니다.
      // doc.id의 경우 따로 지정하지 않는 한 자동으로 생성되는 id입니다.
      // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있습니다.
      querySnapshot.forEach((doc) => {
        // 항상 id를 같이 넘겨줘야함 (문서 id가 필요하기 때문
        initial.push({ data: doc.data(), id: doc.id });
      });
      setTemp(initial);
    };

    fetchData();
  }, []);

  console.log("temp", temp);
  return (
    <div>
      <Text>처음화면</Text>
      <Button onClick={doLogout}>로그아웃</Button>
      <BoardCreateCard />
      {temp.map((v, i) => (
        <BoardItemCard key={i} props={v.data} id={v.id} />
      ))}
    </div>
  );
}
