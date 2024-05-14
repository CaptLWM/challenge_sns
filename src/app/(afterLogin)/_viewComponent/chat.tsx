"use client";

import firebasedb from "@/firebase/firebase";
import { firestore, getUser, getUserNick } from "@/firebase/firestore";
import {
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
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

import { useRouter, useSearchParams } from "next/navigation";

// 채팅방
export default function Main({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 초기 roomId 설정
  const initRoomId = searchParams.get("roomId") || undefined;
  const [messages, setMessages] = useState<ChatType[]>([]); // 메시지 목록
  const [newMessage, setNewMessage] = useState<string>(""); // 새로운 메시지
  const [roomId, setRoomId] = useState<string | undefined>(initRoomId); // 채팅방 id
  const [profileImg, setProfileImg] = useState<string>(""); // 프로필 이미지
  const [nickname, setNickname] = useState<string>(""); // 로그인 중인 사용자닉네임

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = useAuthStore((state) => state.user);
  const currentUid = user ? user.uid : ""; // 로그인한 사용자의 uid
  console.log("uid", currentUid);
  useEffect(() => {
    if (currentUid) {
      getUser(currentUid)
        .then((data) => {
          setNickname(data?.nickname);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
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
  }, [params.id]);

  const createChatRoom = async () => {
    const chatRoomRef = await addDoc(collection(firestore, "ChatRooms"), {
      participants: [nickname, params.id],
    });
    return chatRoomRef.id;
  };

  // ChatRoom 생성
  const createOrGetChatRoom = async () => {
    if (nickname && params.id) {
      const q = query(
        collection(firestore, "ChatRooms"),
        where("participants", "in", [nickname, params.id])
      );
      const querySnapshot = await getDocs(q);

      console.log(querySnapshot);
      if (querySnapshot.empty) {
        // 채팅방 없으니 생성
        const roomId = await createChatRoom();
        setRoomId(roomId);
      } else {
        querySnapshot.forEach((doc) => {
          setRoomId(doc.id);
        });
      }
    }
  };

  // 메세지 보내기
  const sendMessage = async () => {
    if (newMessage.trim() && roomId) {
      await addDoc(collection(firestore, "Chats"), {
        text: newMessage,
        createdAt: new Date().toISOString(),
        roomId: roomId,
        sender: nickname,
      });
      setNewMessage("");
    } else {
      // 채팅방 없으면 채팅방 생성 후 메세지 전송
      await createOrGetChatRoom();
      if (roomId) {
        await addDoc(collection(firestore, "Chats"), {
          text: newMessage,
          createdAt: new Date().toISOString(),
          roomId: roomId,
          sender: nickname,
        });
        setNewMessage("");
      }
    }
  };
  // 채팅 메시지 불러오기
  useEffect(() => {
    if (!roomId) return;

    const q = query(
      collection(firestore, "Chats"),
      where("roomId", "==", roomId)
      // orderBy("createdAt")
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
      console.log("msgs", msgs);
    });


    return () => unsubscribe();
  }, [roomId]);
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
        {/*  */}
        {messages.map((msg) => {
          if (msg.sender === nickname) {
            return (
              <HStack key={msg.sender} justify="flex-end" marginBottom={5}>
                <Text>{msg.text}</Text>
              </HStack>
            );
          } else {
            return (
              <HStack key={msg.sender} align="flex-start" marginBottom={5}>
                <Image
                  src={profileImg}
                  alt="프로필 이미지"
                  width={12}
                  loading="lazy"
                />
                <Text>{msg.text}</Text>
                <Text>{msg.sender}</Text>
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
