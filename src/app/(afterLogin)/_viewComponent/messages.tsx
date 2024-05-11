"use client";

import React, { useEffect } from "react";
import Chatitem from "../_CommonComponent/Chatitem";
import { collection, query } from "firebase/firestore";
import { firestore, getUser } from "@/firebase/firestore";
import useAuthStore from "@/store/store";

export default function Main() {
  const [chatRoom, setChatRoom] = React.useState<string[]>([]);
  const [nickname, setNickname] = React.useState<string>(""); // 로그인 중인 사용자닉네임

  const user = useAuthStore((state) => state.user);
  const currentUid = user ? user.uid : ""; // 로그인한 사용자의 uid

  useEffect(() => {
    if (currentUid) {
      getUser(currentUid)
        .then((data) => {
          setNickname(data?.nickname);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
    }
  }, [currentUid]); // uid가 변경될 때마다 effect 실행

  // 채팅방 목록 가져오기
  // useEffect(()=>{
  //   const q = query(
  //     collection(firestore, 'Messages'),
  //     where('chatUser', '')
  //   )
  // },[])

  return (
    <div>
      <div>메시지 리스트</div>
      <Chatitem nick="asdf" />
    </div>
  );
}
