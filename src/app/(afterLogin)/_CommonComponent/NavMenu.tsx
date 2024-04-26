"use client";

import { User } from "@/firebase/firebase.type";
import { checkAuthState } from "@/firebase/firebaseAuth";
import { getUser } from "@/firebase/firestore";
import useAuthStore, { initAuthState } from "@/store/store";
import { Text } from "@chakra-ui/react";
import { DocumentData } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React, { useEffect, useState } from "react";
import { TbTargetArrow } from "react-icons/tb"; // challenge
import { TbSearch } from "react-icons/tb"; // search
import { TbHome } from "react-icons/tb"; // home
import { TbMessageDots } from "react-icons/tb"; // message

export default function NavMenu() {
  // 상태를 추가하여 사용자 정보를 저장
  const [userInfo, setUserInfo] = useState<DocumentData | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 즉 주소를 가지고 올 수 있음
  // 이거 활용해서 그 페이지 방문 했을때 안했을때 아이콘 변경할 수 있음
  // 호출된 레이아웃보다 한 단계 아래에서 활성 경로 세그먼트를 읽을 수 있게 해줍니다.
  const segment = useSelectedLayoutSegment();

  // 사용자 ID 가져오기
  const checkAuth = initAuthState();
  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : null;

  // TODO 지금 처음 회원가입하고 로그인 했을때 닉네임 잘 못찾아옴
  // getuser는 promise를 반환함 => q비동기
  // 데이터가 도착하기 전에 닉네임에 접근하려고 하니 에러가 발생
  // useEffect는 컴포넌트가 마운트될 때 및 uid가 변경될 때 사용자 정보를 가지고옴
  // useEffect를 활용하여 처리 가능 + 로딩 에러 상태 가져오기

  useEffect(() => {
    console.log("uid1", uid);
    if (uid) {
      console.log("uid2", uid);
      getUser(uid)
        .then((data) => {
          console.log("data", data);
          setUserInfo(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
          setError(err);
          setLoading(false);
        });
    } else {
      console.log("uid3", uid);
      setLoading(false);
    }
  }, [uid]); // uid가 변경될 때마다 effect 실행

  if (loading) {
    return <Text>Loading...</Text>; // 로딩 상태 표시
  }

  if (error) {
    return <Text>Error loading user info</Text>; // 에러 처리
  }

  console.log("navuserInfo", userInfo);

  return (
    <>
      <li className="flex justify-center items-center mb-3">
        <Link href="/home">
          <div>
            <TbHome size="40px" />
          </div>
        </Link>
      </li>
      <li className="flex justify-center items-center mb-3">
        <Link href="/search">
          <div>
            <TbSearch size="40px" />
          </div>
        </Link>
      </li>
      <li className="flex justify-center items-center mb-3">
        <Link href="/messages">
          <div>
            <TbMessageDots size="40px" />
          </div>
        </Link>
      </li>
      <li className="flex justify-center items-center mb-3">
        <Link href="/challenge">
          <div>
            <TbTargetArrow size="40px" />
          </div>
        </Link>
      </li>
      <li className="flex justify-center items-center mb-3">
        {userInfo ? (
          <Link href="/myPage">
            <div>
              <Text>{userInfo.nickname}</Text>
              <Image
                src={userInfo.profileImage}
                alt="미리보기"
                width={50}
                height={50}
              />
            </div>
          </Link>
        ) : (
          <Text>No user info</Text>
        )}
      </li>
    </>
  );
}
