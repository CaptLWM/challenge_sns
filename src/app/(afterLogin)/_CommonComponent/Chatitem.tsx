import { Card, CardBody } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

// 채팅방 목록 하나하나
export default function Chatitem({ nick }: { nick: string }) {
  return (
    <Link href={`/messages/${nick}`}>
      <Card>
        <CardBody>{nick} 채팅방</CardBody>
      </Card>
    </Link>
  );
}
