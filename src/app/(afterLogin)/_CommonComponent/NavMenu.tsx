"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import { TbTargetArrow } from "react-icons/tb"; // challenge
import { TbSearch } from "react-icons/tb"; // search
import { TbHome } from "react-icons/tb"; // home
import { TbMessageDots } from "react-icons/tb"; // message

export default function NavMenu() {
  // 호출된 레이아웃보다 한 단계 아래에서 활성 경로 세그먼트를 읽을 수 있게 해줍니다.
  // 즉 주소를 가지고 올 수 있음
  // 이거 활용해서 그 페이지 방문 했을때 안했을때 아이콘 변경할 수 있음
  const segment = useSelectedLayoutSegment();
  return (
    <>
      <li>
        <Link href="/home">
          <div>
            <TbHome />
          </div>
        </Link>
      </li>
      <li>
        <Link href="/search">
          <div>
            <TbSearch />
          </div>
        </Link>
      </li>
      <li>
        <Link href="/messages">
          <div>
            <TbMessageDots />
          </div>
        </Link>
      </li>
      <li>
        <Link href="/challenge">
          <div>
            <TbTargetArrow />
          </div>
        </Link>
      </li>
    </>
  );
}
