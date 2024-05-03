"use client";

import { Button, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import BoardCreateCard from "../_CommonComponent/BoardCreateCard";
import { DocumentData } from "firebase/firestore";

import InfiniteScroll from "react-infinite-scroll-component";
import { useBoardListQuery } from "@/queries/queries";

export default function Main() {
  const router = useRouter();
  const [temp, setTemp] = React.useState<DocumentData[]>([]);

  // 데이터 호출 테스트
  const boardList = useBoardListQuery();
  console.log("boardList", boardList.data);
  // const boardList = useBoardListQuery();
  // console.log("boardList", boardList.data);
  return (
    <div>
      <Text margin={2.5} padding={5}>
        Just Do It!
      </Text>
      <BoardCreateCard />
      <InfiniteScroll
        dataLength={boardList.data?.pages.flat().length ?? 0} // 현재까지 로드된 데이터 총 수(필수)
        next={boardList.fetchNextPage} // 스크롤 끝에 도달하면 함수 호출(필수))
        hasMore={boardList.hasNextPage} // 다음 페이지가 있는지 여부(필수)
        loader={<div>Loading</div>} // 로드할때 보여줄 것(필수)
        scrollThreshold={0.8} // 스크롤 임계값, 스크롤이 컨테이너의 80%에 도달하면 next 호출
      >
        {boardList.data?.pages.map((page, pageIndex) => {
          console.log("pageIndex", pageIndex);
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
