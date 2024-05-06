"use client";

import useAuthStore from "@/store/store";
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Input,
  useDisclosure,
  CardFooter,
  HStack,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReplyDrawer from "./ReplyDrawer";
import { Board } from "@/firebase/firebase.type";

import {
  useBoardItemLike,
  useDeleteBoard,
  useModifyBoard,
} from "@/queries/queries";
import Link from "next/link";

export default function BoardItemCard({
  props,
  id,
}: {
  props: DocumentData;
  id: string;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(props.image);
  const deleteModal = useDisclosure();
  const modifyModal = useDisclosure();
  const replyDrawer = useDisclosure();
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<Board>();
  const queryClient = useQueryClient();
  // TODO 수정, 삭제 후 모달창 닫고 새로고침
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // DB저장된 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : ""; // 로그인한 사용자의 uid

  const deleteBoard = useDeleteBoard(props);
  const modifyBoard = useModifyBoard(uid);

  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  const onSubmitModify = (data: Board) => {
    modifyBoard.mutate(
      { data, props, id },
      {
        onSuccess: () => {
          modifyModal.onClose();
          queryClient.invalidateQueries();
          // 필요한 경우 폼 리셋
          reset();
          setPreview(null);
          alert("게시물이 성공적으로 등록되었습니다.");
        },
        onError: (error: any) => {
          queryClient.invalidateQueries();
          alert(`게시물 등록에 실패했습니다: ${error.message}`);
        },
      }
    ); // Mutation을 통해 데이터 등록 요청
  };

  // const onSubmitLike = () => {
  // console.log("게시물 uid", id);
  // console.log("지금 로그인한 사람 id", uid);
  // console.log("props", props.id === id);

  // };
  const likeMutate = useBoardItemLike();

  const onSubmitLike = () => {
    likeMutate.mutate(
      { props, id, uid },
      {
        onSuccess: () => {
          queryClient.invalidateQueries();
        },
        onError: (error: any) => {
          queryClient.invalidateQueries();
          console.log("error", error.message);
        },
      }
    );
  };
  const test = props?.likeUserList?.includes(uid);
  // await deleteDoc(doc(db, "cities", "DC"));
  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        width={{ base: "100%", sm: "80%" }}
        margin={10}
        padding={5}
      >
        <Link href={`/user/${props.nickname}`}>
          <Button>{props.nickname}</Button>
        </Link>

        <Image
          objectFit="cover"
          boxSize={{
            base: "200px",
            sm: "100px", // 작은 화면
            md: "150px", // 중간 화면
          }}
          // maxW={{ base: "100%", sm: "200px" }}
          src={props.image}
          alt="Caffe Latte"
        />
        {/* TODO 작성자에 따라 삭제 여부 체크 */}

        <Stack width={{ base: "100%" }}>
          <CardBody>
            <HStack justifyContent="space-between">
              <Text py="2">{props.content}</Text>

              {props.id === uid ? (
                <div>
                  <Button onClick={deleteModal.onOpen}>삭제</Button>
                  <Button onClick={modifyModal.onOpen}>수정</Button>
                </div>
              ) : null}
            </HStack>
          </CardBody>
          <CardFooter justifyContent="end">
            <Button
              colorScheme={test ? "blue" : undefined}
              onClick={onSubmitLike}
            >
              좋아요
            </Button>
            <Button onClick={replyDrawer.onOpen}>댓글</Button>
          </CardFooter>
        </Stack>
      </Card>
      <Modal
        id="delete"
        isCentered
        blockScrollOnMount={false}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 삭제</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={deleteModal.onClose}>
              취소
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() =>
                deleteBoard.mutate(id, {
                  onSuccess: () => {
                    deleteModal.onClose();
                    queryClient.invalidateQueries();
                    // 필요한 경우 폼 리셋
                    reset();
                    setPreview(null);
                    alert("게시물이 성공적으로 삭제되었습니다.");
                  },
                  onError: (error: any) => {
                    queryClient.invalidateQueries();
                    alert(`게시물 삭제에 실패했습니다: ${error.message}`);
                  },
                })
              }
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        id="modify"
        isCentered
        blockScrollOnMount={false}
        isOpen={modifyModal.isOpen}
        onClose={modifyModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 수정</ModalHeader>
          <ModalCloseButton />

          <form
            onSubmit={handleSubmit((data) => {
              onSubmitModify(data);
            })}
          >
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="내용">내용</FormLabel>
                <Input
                  id="password"
                  placeholder="content"
                  defaultValue={props.content}
                  {...register("content")}
                />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="image">프로필이미지</FormLabel>
                <Input
                  id="image"
                  placeholder="이미지"
                  type="file"
                  accept="image/*"
                  {...register("image", {
                    onChange: onFileChange,
                  })}
                />
              </FormControl>
              {preview && (
                <div>
                  <Image
                    src={preview}
                    alt="미리보기"
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={modifyModal.onClose}>
                취소
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isSubmitting}
              >
                수정
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      {replyDrawer.isOpen ? (
        <ReplyDrawer
          isOpen={replyDrawer.isOpen}
          onClose={replyDrawer.onClose}
          id={id}
          uid={uid}
        />
      ) : null}
    </>
  );
}
