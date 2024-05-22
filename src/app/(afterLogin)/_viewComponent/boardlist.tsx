"use client";

import { useBoardListQuery } from "../../../queries/queries";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";

export default function Boardlist() {
  const boardList = useBoardListQuery();
  return (
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
  );
}
