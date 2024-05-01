"use client";

import { createBoardItemReply } from "@/firebase/firestore";
import { useBoardItemReplyQuery } from "@/queries/queries";
// import { useBoardItemReplyQuery } from "@/queries/queries";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "domain";
import React from "react";
import { useForm } from "react-hook-form";

export default function ReplyDrawer({
  isOpen,
  onClose,
  id,
  uid,
}: {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  uid: string; // 댓글 작성자 id
}) {
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const createReply = useMutation({
    mutationFn: async (data: any) => {
      console.log("data", data);
      await createBoardItemReply(
        {
          content: data.content,
          createdAt: new Date().toISOString(),
          feedId: id,
          userId: uid,
        },
        id,
        uid
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      reset();
    },
    onError: (error: any) => {
      // queryClient.invalidateQueries();
      console.log("error", error.message);
      alert("실패");
    },
  });
  const onSubmit = (data: any) => {
    createReply.mutate(data);
  };

  const replyList = useBoardItemReplyQuery(id);
  console.log(replyList.data);
  //   const replyList = useBoardItemReplyQuery(id)
  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>
        {/* TODO 작성자 정보 있어야함 */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <DrawerBody>
            <FormControl>
              <FormLabel htmlFor="댓글">작성자 들어갈곳</FormLabel>
              <Input
                id="content"
                placeholder="content"
                {...register("content")}
              />
            </FormControl>
          </DrawerBody>
          {replyList.data
            ? replyList.data.map((v, i) => (
                <Text key={i}>{v.data.content}</Text>
              ))
            : null}
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Save
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
