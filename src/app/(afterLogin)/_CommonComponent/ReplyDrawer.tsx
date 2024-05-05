"use client";

import { Reply } from "@/firebase/firebase.type";
import {
  useBoardItemReplyQuery,
  useCreateReply,
  useDeleteReply,
  useModifyReply,
} from "@/queries/queries";
import useAuthStore from "@/store/store";
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
  HStack,
  Input,
  Text,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
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
  const [stateModify, setStateModify] = useState(false);
  const [modifyContent, setModifyContent] = useState("");
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<Reply>();

  const user = useAuthStore((state) => state.user);
  const loginuid = user ? user.uid : "";

  const replyList = useBoardItemReplyQuery(id);
  //   const replyList = useBoardItemReplyQuery(id)
  const createReply = useCreateReply({ id, uid });
  const modifyReply = useModifyReply({ uid, id, modifyContent });
  const deleteReply = useDeleteReply(id);

  const onSubmit = (data: Reply) => {
    createReply.mutate(data, {
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
  };

  return (
    <Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent paddingLeft={20} paddingRight={20}>
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
            ? replyList.data.map((v, i) =>
                v.data.userId === loginuid ? (
                  <HStack
                    key={i}
                    justifyContent="space-between"
                    padding="16px 24px" // Fix: Provide separate values for padding
                  >
                    {stateModify ? (
                      <>
                        <HStack>
                          <Text>작성자</Text>
                          <Input
                            id="content"
                            placeholder="content"
                            onChange={(e) => setModifyContent(e.target.value)}
                            defaultValue={v.data.content}
                          />
                        </HStack>
                        <HStack>
                          <>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                setStateModify(false);
                                modifyReply.mutate(v.id, {
                                  onSuccess: () => {
                                    queryClient.invalidateQueries();
                                    // 필요한 경우 폼 리셋
                                    alert("수정 성공");
                                  },
                                  onError: (error: any) => {
                                    console.log("error", error);
                                    queryClient.invalidateQueries();
                                    alert(`수정 실패`);
                                  },
                                });
                              }}
                            >
                              수정
                            </Button>
                            <Button
                              onClick={() =>
                                deleteReply.mutate(v.id, {
                                  onSuccess: () => {
                                    queryClient.invalidateQueries();
                                    // 필요한 경우 폼 리셋
                                    alert("삭제 성공");
                                  },
                                  onError: (error: any) => {
                                    queryClient.invalidateQueries();
                                    alert(`삭제 실패`);
                                  },
                                })
                              }
                            >
                              삭제
                            </Button>
                          </>
                        </HStack>
                      </>
                    ) : (
                      <>
                        <HStack>
                          <Text>작성자</Text>
                          <Text>{v.data.content}</Text>
                        </HStack>
                        <HStack>
                          <>
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                setStateModify(true);
                              }}
                            >
                              수정
                            </Button>
                            <Button onClick={() => deleteReply.mutate(v.id)}>
                              삭제
                            </Button>
                          </>
                        </HStack>
                      </>
                    )}
                  </HStack>
                ) : (
                  <HStack
                    key={i}
                    justifyContent="space-between"
                    padding="16px 24px" // Fix: Provide separate values for padding
                  >
                    <HStack>
                      <Text>작성자</Text>
                      <Text>{v.data.content}</Text>
                    </HStack>
                    <HStack></HStack>
                  </HStack>
                )
              )
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
