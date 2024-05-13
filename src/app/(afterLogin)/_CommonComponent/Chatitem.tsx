import { Card, CardBody } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

// 채팅방 목록 하나하나
export default function Chatitem({
  nick,
  roomId,
}: {
  nick: string;
  roomId: string;
}) {
  return (
    <Link href={`/messages/${nick}?roomId=${roomId}`}>
      <Card>
        <CardBody>{nick} 채팅방</CardBody>
      </Card>
    </Link>
  );
}
