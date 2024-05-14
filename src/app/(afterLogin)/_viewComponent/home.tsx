"use client";

import { logout } from "@/firebase/firebaseAuth";
import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import BoardCreateCard from "../_CommonComponent/BoardCreateCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useBoardListQuery } from "@/queries/queries";

export default function Main() {
  const boardList = useBoardListQuery();

  return (
    <div>
      <BoardCreateCard />
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
    </div>
  );
}
