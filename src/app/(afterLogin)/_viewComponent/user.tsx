"use client";

import { useBoardListNickNameQuery, useFollowUser } from "@/queries/queries";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import { Button, Text } from "@chakra-ui/react";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import {
  firestore,
  followUser,
  getUser,
  getUserNick,
} from "@/firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore, { initAuthState } from "@/store/store";
import { set } from "react-hook-form";

export default function Main({ nickname }: { nickname: string }) {
  const [targetInfo, setTargetInfo] = useState<DocumentData | null>(null);
  const [curUserInfo, setCurUserInfo] = useState<DocumentData | null>(null);
  const [check, setCheck] = useState(true);
  const queryClient = useQueryClient();
  const boardList = useBoardListNickNameQuery(nickname);

  // 쿼리키로 할것
  const test = useMemo(() => {
    if (!boardList.data?.pages) return;
    return boardList.data?.pages;
  }, [boardList.data?.pages]);

  const user = useAuthStore((state) => state.user);
  const currentUid = user ? user.uid : ""; // 로그인한 사용자의 uid

  // useEffect(() => {
  //   if (currentUid && check) {
  //     const fetchData = async () => {
  //       try {
  //         const response2 = await getUser(currentUid);
  //         setCurUserInfo(response2);
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     };
  //     fetchData();
  //     setCheck(false);
  //   }
  // }, [currentUid, check]);
  // 팔로우할 유저 정보 가져오기
  useEffect(() => {
    if (check) {
      const fetchData = async () => {
        try {
          const response1 = await getUserNick(nickname);
          if (currentUid) {
            const response2 = await getUser(currentUid);
            setCurUserInfo(response2);
          }
          setTargetInfo(response1[0]);
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
      setCheck(false);
    }
  }, [nickname, check, currentUid]);

  // 팔로우 버튼
  const followUser = useFollowUser();
  const follow = () => {
    // setCheck(true);
    followUser.mutate(
      { currentUid, targetInfo, curUserInfo },
      {
        onSuccess: () => {
          // queryClient.invalidateQueries();
          setCheck(true);
        },
        onError: async (error: any) => {
          // await queryClient.invalidateQueries();
          console.log("error", error.message);
          setCheck(true);
        },
      }
    );
    queryClient.invalidateQueries();
  };

  return (
    <div>
      {nickname}님의 게시물
      {/* <Button>팔로우</Button> */}
      {currentUid !== targetInfo?.uid ? (
        <Button
          colorScheme={
            targetInfo?.followUserList.length > 0 ? "blue" : undefined
          }
          onClick={follow}
        >
          팔로우
        </Button>
      ) : null}
      {targetInfo?.followUserList.length > 0 ? (
        <Text>{targetInfo?.followUserList.length}</Text>
      ) : (
        <Text>0</Text>
      )}
      {/* {targetInfo?.followingUserList?.length > 0 ? (
        <Text>{targetInfo?.followingUserList.length}</Text>
      ) : (
        <Text>0</Text>
      )} */}
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
