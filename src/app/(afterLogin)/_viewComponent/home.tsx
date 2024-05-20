"use client";

import { logout } from "@/firebase/firebaseAuth";
import {
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import BoardCreateCard from "../_CommonComponent/BoardCreateCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBoardListQuery, useFollowBoardListQuery } from "@/queries/queries";
import useAuthStore from "@/store/store";
import { getUser } from "@/firebase/firestore";

export default function Main() {
  const [followList, setFollowList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : null;


  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
          console.log("data", data);
          setFollowList(data?.followingUserList);
          setLoading(false);
        })
        .catch((err) => {
          setErr(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [uid]);

  const boardList = useBoardListQuery();
  // console.log("followingUser", followList);
  const followBoardList = useFollowBoardListQuery(followList);
  console.log("board", boardList.data);
  console.log("followBoard", followBoardList.data);
  return (
    <div>
      <BoardCreateCard />
      <Tabs>
        <TabList>
          <Tab>전체글</Tab>
          <Tab>팔로우</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
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
          </TabPanel>
          <TabPanel>

            <InfiniteScroll
              dataLength={followBoardList.data?.pages.flat().length ?? 0}
              next={followBoardList.fetchNextPage}
              hasMore={followBoardList.hasNextPage}
              loader={<div>Loading</div>}
              scrollThreshold={0.8}
            >
              {followBoardList.data?.pages.map((page, pageIndex) => {
                return (
                  <div key={pageIndex}>
                    {page.data.map((v, i) => (
                      <BoardItemCard key={v.id} props={v.data} id={v.id} />
                    ))}
                  </div>
                );
              })}
            </InfiniteScroll>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
