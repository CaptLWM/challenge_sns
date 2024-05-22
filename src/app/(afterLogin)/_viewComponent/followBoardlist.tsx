"use client";

import { getUser } from "../../../firebase/firestore";
import { useFollowBoardListQuery } from "../../../queries/queries";
import useAuthStore from "../../../store/store";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";

export default function FollowBoardlist() {
  const [followList, setFollowList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
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

  const followBoardList = useFollowBoardListQuery(followList);

  return (
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
  );
}
