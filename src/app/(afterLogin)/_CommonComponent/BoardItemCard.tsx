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
import { DocumentData, deleteDoc, doc, getDoc } from "firebase/firestore";
import React from "react";

export default function BoardItemCard({
  props,
  id,
}: {
  props: DocumentData;
  id: string;
}) {
  console.log("props", props, id);
  const deleteItem = async () => {
    console.log("id", id);
    await deleteDoc(doc(firestore, "/BoardItem", id));
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
