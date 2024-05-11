"use client";

import firebasedb from "@/firebase/firebase";
import { firestore, getUser, getUserNick } from "@/firebase/firestore";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect } from "react";
import { ChatType } from "./component.type";
import {
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import { set } from "react-hook-form";
import { profile } from "console";
import useAuthStore from "@/store/store";

// 채팅방
export default function Main({ params }: { params: { id: string } }) {
  console.log(params.id); // 유저 닉네임
  const [messages, setMessages] = React.useState<ChatType[]>([]); // 메시지 목록
  const [newMessage, setNewMessage] = React.useState<string>(""); // 새로운 메시지
  const [profileImg, setProfileImg] = React.useState<string>(""); // 프로필 이미지
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

  // 채팅 상대 이미지 가져오기
  useEffect(() => {
    // if (params) {
    const fetchReceiverInfo = async () => {
      try {
        const response = await getUserNick(params.id);
        // console.log(response[0])
        setProfileImg(response[0]?.profileImage);
      } catch (error) {
        console.log(error);
      }
      // console.log(response[0]);
    };
    fetchReceiverInfo();
    // }
  }, []);

  useEffect(() => {
    const q = query(
      collection(firestore, "Messages"),
      where("chatUser", "array-contains-any", [params.id, nickname])
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: any = []; // 추후 타입 수정
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(
        // msgs
        msgs.sort((a: ChatType, b: ChatType) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);

          return dateA.getTime() - dateB.getTime();
        })
      );
    });
    return () => unsubscribe();
  }, [params.id]);

  // 메세지 보내기
  const sendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(firestore, "Messages"), {
        text: newMessage,
        createdAt: new Date().toISOString(),
        chatUser: [nickname, params.id],
      });
      setNewMessage("");
    }
  };

  // chatUser[0] => 보낸사람, chatUser[1] => 받는사람
  console.log(messages);
  console.log("profileImg", profileImg);
  return (
    <>
      <div>
        <HStack>
          <Image
            src={profileImg}
            alt="프로필 이미지"
            width={12}
            loading="lazy"
          />
          <Heading size="md">{params.id}</Heading>
        </HStack>
      </div>
      <Divider marginBottom={10} marginTop={10} />
      <div>
        {messages.map((msg) => {
          if (msg.chatUser[0] === nickname) {
            return (
              <HStack key={msg.id} justify="flex-end" marginBottom={5}>
                <Text>{msg.text}</Text>
              </HStack>
            );
          } else {
            return (
              <HStack key={msg.id} align="flex-start" marginBottom={5}>
                <Image
                  src={profileImg}
                  alt="프로필 이미지"
                  width={12}
                  loading="lazy"
                />
                <Text>{msg.text}</Text>
                <Text>{msg.chatUser[0]}</Text>
              </HStack>
            );
          }
        })}
      </div>
      <Divider marginBottom={5} marginTop={5} />
      <div>
        <HStack>
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={sendMessage}>보내기</Button>
        </HStack>
      </div>
    </>
  );
}
