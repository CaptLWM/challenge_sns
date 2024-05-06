"use client";

import { auth, logout } from "@/firebase/firebaseAuth";
import useAuthStore from "@/store/store";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
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
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import InfiniteScroll from "react-infinite-scroll-component";
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
  console.log("boardList", boardList.data);
  // const boardList = useBoardListQuery();
  // console.log("boardList", boardList.data);
  return (
    <div>
      <Text>처음화면</Text>
      <Button onClick={doLogout}>로그아웃</Button>
      <BoardCreateCard />
      <InfiniteScroll
        dataLength={boardList.data?.pages.flat().length ?? 0}
        next={boardList.fetchNextPage}
        hasMore={boardList.hasNextPage}
        loader={<div>Loading</div>}
        scrollThreshold={0.8}
      >
        {boardList.data?.pages.map((page, pageIndex) => {
          return (
            <div key={pageIndex}>
              {page.data.map((v, i) => (
                <BoardItemCard key={v.id} props={v.data} id={v.id} />
              ))}
            </div>
          );
        })}
      </InfiniteScroll>
    </div>
  );
}
