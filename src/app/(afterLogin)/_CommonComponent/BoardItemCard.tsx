"use client";

import { storage } from "@/firebase/firestorage";
import { firestore, modifyBoardItem } from "@/firebase/firestore";
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
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DocumentData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReplyDrawer from "./ReplyDrawer";

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
  } = useForm();
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

  const deleteBoard = useMutation({
    mutationFn: async (id: string) => {
      console.log("id", id);
      await deleteDoc(doc(firestore, "/BoardItem", id));
    },
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
  });

  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  const modifyBoard = useMutation({
    mutationFn: async ({
      data,
      props,
      id,
    }: {
      data: any;
      props: DocumentData;
      id: string;
    }) => {
      console.log("data", data, props);
      await modifyBoardItem(props, data, id, uid);
    },
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
  });

  const onSubmitModify = (data: any) => {
    console.log("data3", data);
    modifyBoard.mutate({ data, props, id }); // Mutation을 통해 데이터 등록 요청
  };
  // await deleteDoc(doc(db, "cities", "DC"));
  return (
    <>
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
        {/* TODO 작성자에 따라 삭제 여부 체크 */}
        <Button onClick={deleteModal.onOpen}>삭제</Button>
        <Button onClick={modifyModal.onOpen}>수정</Button>
        <Stack>
          <CardBody>
            <Text py="2">{props.content}</Text>
          </CardBody>
          <CardFooter>
            <Button>좋아요</Button>
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
              onClick={() => deleteBoard.mutate(id)}
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
              console.log("data12", data);
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
      <ReplyDrawer
        isOpen={replyDrawer.isOpen}
        onClose={replyDrawer.onClose}
        id={id}
        uid={uid}
      />
    </>
  );
}
