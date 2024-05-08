"use client";

import { useBoardListNickNameQuery, useFollowUser } from "@/queries/queries";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import { Button } from "@chakra-ui/react";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import {
  firestore,
  followUser,
  getUser,
  getUserNick,
} from "@/firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/store";

export default function Main({ nickname }: { nickname: string }) {
  const [targetInfo, setTargetInfo] = useState<DocumentData | null>(null);
  const [check, setCheck] = useState(false);
  const queryClient = useQueryClient();
  const boardList = useBoardListNickNameQuery(nickname);

  // 쿼리키로 할것
  const test = useMemo(() => {
    if (!boardList.data?.pages) return;
    return boardList.data?.pages;
  }, [boardList.data?.pages]);

<<<<<<< HEAD
  const currentUid = useAuthStore((state) => state.user?.uid);

  // 팔로우할 유저 정보 가져오기
  useEffect(() => {
    if (check) {
      const fetchData = async () => {
        try {
          const response = await getUserNick(nickname);
          setTargetInfo(response[0]);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      setCheck(false);
    }
  }, [nickname, check]);

  // 팔로우 버튼
  const followUser = useFollowUser();
  const follow = () => {
    followUser.mutate(
      { currentUid, targetInfo },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries();
          setCheck(true);
        },
        onError: async (error: any) => {
          await queryClient.invalidateQueries();
          console.log("error", error.message);
          setCheck(true);
        },
      }
    );
  };
=======

  // 계속 로그아웃 됨....
  // 내가 팔로우하고 있는지 체크
  const temp2 = userInfo2?.followerUserList?.includes(currentUid);
  console.log(temp2);
>>>>>>> 79ed9ef56de8aad3f13da0814e65942e5e3e562e

  return (
    <div>
      {nickname}님의 게시물
      {/* <Button>팔로우</Button> */}
      {currentUid !== targetInfo?.uid ? (
        <Button onClick={follow}>팔로우</Button>
      ) : null}

      <InfiniteScroll
        dataLength={boardList.data?.pages.flat().length ?? 0}
        next={boardList.fetchNextPage}
        hasMore={boardList.hasNextPage}
        loader={<div>Loading</div>}
        scrollThreshold={0.8}
      >
        {test?.map((page, pageIndex) => {
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
