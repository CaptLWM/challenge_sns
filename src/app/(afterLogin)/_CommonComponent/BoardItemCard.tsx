"use client";

import { firestore } from "@/firebase/firestore";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DocumentData, deleteDoc, doc } from "firebase/firestore";
import React from "react";

export default function BoardItemCard({ props }: DocumentData) {
  const deleteItem = async () => {
    console.log("props.id", props.id);
    const todoRef = doc(firestore, "/BoardItem", props.id);
    console.log("cost", todoRef);
    await deleteDoc(doc(firestore, "/BoardItem", todoRef.id));
  };

  // await deleteDoc(doc(db, "cities", "DC"));
  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      margin={10}
      padding={5}
    >
      <Image
        objectFit="cover"
        maxW={{ base: "100%", sm: "200px" }}
        src={props.image}
        alt="Caffe Latte"
      />
      <Button onClick={() => deleteItem()}>삭제</Button>
      <Button>수정</Button>
      <Stack>
        <CardBody>
          <Text py="2">{props.content}</Text>
        </CardBody>

        <CardFooter>
          <Button variant="solid" colorScheme="blue">
            Buy Latte
          </Button>
        </CardFooter>
      </Stack>
    </Card>
  );
}
