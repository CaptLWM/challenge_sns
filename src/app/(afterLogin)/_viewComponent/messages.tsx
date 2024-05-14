"use client";

import React, { use, useEffect } from "react";
import Chatitem from "../_CommonComponent/Chatitem";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore, getUser } from "@/firebase/firestore";
import useAuthStore from "@/store/store";

export default function Main() {
  const [chatRoomId, setChatRoomId] = React.useState<
    {
      id: string;
      participants: string[];
    }[]
  >([]);
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

  console.log("niciname", nickname);
  // 채팅방 목록ID 가져오기
  useEffect(() => {
    if (nickname) {
      const q = query(
        collection(firestore, "ChatRooms"),
        where("participants", "array-contains", nickname)
      );
      const unscribe = onSnapshot(q, (querySnapshot) => {
        const chatRoomList: {
          id: string;
          participants: string[];
        }[] = [];
        querySnapshot.forEach((doc) => {
          chatRoomList.push({
            id: doc.id,
            participants: doc.data().participants,
          });
        });

        // querySnapshot.forEach((doc) => {
        //   chatRoomList.push(doc.id);
        // });
        setChatRoomId(chatRoomList);
      });

      return () => unscribe();
    }
  }, [nickname]);

  console.log(chatRoomId);

  return (
    <div>
      <div>메시지 리스트</div>
      {/* <Chatitem nick="asdf" /> */}
      {chatRoomId.map((chat) => {
        if (chat.participants.includes(nickname)) {
          const temp = chat.participants.filter((item) => item !== nickname);
          // eslint-disable-next-line react/jsx-key

          return <Chatitem key={chat.id} nick={temp[0]} roomId={chat.id} />;
        } else return null;
      })}
    </div>
  );
}
