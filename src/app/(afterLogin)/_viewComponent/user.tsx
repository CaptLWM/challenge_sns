"use client";

import { useBoardListNickNameQuery, useFollowUser } from "@/queries/queries";
import React, { useEffect, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import { Button } from "@chakra-ui/react";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { firestore, getUser, getUserNick } from "@/firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/store/store";

export default function Main({ nickname }: { nickname: string }) {
  const [userInfo, setUserInfo] = useState<DocumentData | null>(null);
  const [userInfo2, setUserInfo2] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loading2, setLoading2] = useState(true);
  const [error2, setError2] = useState(null);
  const queryClient = useQueryClient();
  const boardList = useBoardListNickNameQuery(nickname);
  //   const test2 = getUserNick(nickname);
  const currentUser = useAuthStore((state) => state.user);
  const currentUid = currentUser ? currentUser.uid : null; // 현재 접속중인 유저의 uid
  console.log("currentUid", currentUser);

  useEffect(() => {
    if (nickname) {
      getUserNick(nickname)
        .then((data) => {
          //   console.log("1", data);
          setUserInfo(data);
          setLoading(false);
        })
        .catch((err) => {
          //   console.log("2");
          setError(err);
          setLoading(false);
        });
    } else {
      //   console.log("3");
      setLoading(false);
    }
  }, [nickname]);

  useEffect(() => {
    if (currentUid) {
      getUser(currentUid)
        .then((data) => {
          setUserInfo2(data);
          setLoading2(false);
        })
        .catch((err) => {
          setError2(err);
          setLoading2(false);
        });
    } else {
      setLoading2(false);
    }
  }, [currentUid]);

  const uid = userInfo ? userInfo[0].uid : ""; // 팔로우하려는 사람 uid
  console.log("userInfo", userInfo2);
  const temp = useFollowUser();
  const fowllowtest = () => {
    temp.mutate(
      { uid, userInfo },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
        onError: (error: any) => {
          queryClient.invalidateQueries();
          console.log("error", error.message);
        },
      }
    );
  };
  // 쿼리키로 할것
  const test = useMemo(() => {
    if (!boardList.data?.pages) return;
    return boardList.data?.pages;
  }, [boardList.data?.pages]);

  // 계속 로그아웃 됨....
  // 내가 팔로우하고 있는지 체크
  const temp2 = userInfo2?.followerUserList?.includes(currentUid);
  console.log(temp2);

  return (
    <div>
      {nickname}님의 게시물
      {currentUid !== uid ? (
        <Button onClick={fowllowtest}>팔로우</Button>
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
