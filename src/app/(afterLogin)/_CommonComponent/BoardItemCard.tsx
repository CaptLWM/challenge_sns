"use client";

import useAuthStore from "@/store/store";
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
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
  Center,
  Heading,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ReplyDrawer from "./ReplyDrawer";
import { Board } from "@/firebase/firebase.type";
import {
  useBoardItemLike,
  useDeleteBoard,
  useModifyBoard,
} from "@/queries/queries";
import Link from "next/link";
import { TbMessage } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { firestore, getUser } from "@/firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";
import Image from "next/image";

export default function BoardItemCard({
  props,
  id,
}: {
  props: Board;
  id: string;
}) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(String(props.image));
  const [nickname, setNickname] = useState<string>(""); // 로그인 중인 사용자닉네임
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 이미지가 뷰포트에 들어왔는지 확인하는 변수와 레퍼런스
  const [isInView, setIsInView] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  // Intersection Observer를 사용하여 이미지가 뷰포트에 들어왔을 때 로드
  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setIsInView(true);
  //           observer.disconnect();
  //         }
  //       });
  //     },
  //     { threshold: 0.1 }
  //   );

  //   if (imageRef.current) {
  //     observer.observe(imageRef.current);
  //   }

  //   return () => {
  //     if (imageRef.current) {
  //       observer.unobserve(imageRef.current);
  //     }
  //   };
  // }, []);

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

  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
          setNickname(data?.nickname);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [uid]);

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
        <Stack width={{ base: "100%" }}>
          {/* TODO 작성자에 따라 삭제 여부 체크 */}
          <CardBody>
            <HStack justifyContent="flex-end" marginBottom={8}>
              <Link href={`/user/${props.nickname}`}>
                <Heading size="md" marginRight={4}>
                  {props.nickname}
                </Heading>
              </Link>
              {props.id !== uid ? (
                // TODO 채팅방 아이디를 여기서는 안보내줌
                <Button
                  onClick={async () => {
                    try {
                      const q = query(
                        collection(firestore, "ChatRooms"),
                        where("participants", "array-contains", props.nickname)
                      );
                      const querySnapshot = await getDocs(q); // await를 사용하여 비동기 작업 완료를 기다림
                      querySnapshot.forEach((doc) => {
                        if (doc.data().participants.includes(nickname)) {
                          router.push(
                            `/messages/${props.nickname}?roomId=${doc.id}`
                          );
                        }
                      });
                      // 여기에 쿼리 결과를 처리하는 코드를 추가하면 됩니다.
                    } catch (error) {
                      console.error("채팅 방 쿼리 중 오류:", error);
                    }
                  }}
                >
                  <TbMessage size="30px" />
                </Button>
              ) : null}
              {props.id === uid ? (
                <div>
                  <Button onClick={modifyModal.onOpen} marginRight={4}>
                    수정
                  </Button>
                  <Button colorScheme="red" onClick={deleteModal.onOpen}>
                    삭제
                  </Button>
                </div>
              ) : null}
            </HStack>
            <Center>
              <Image
                src={String(props.image)}
                alt="Caffe Latte"
                // width={100}
                // height={100}
                layout="fill"
                style={{ width: "100px", height: "100px" }}
                priority
              />
            </Center>
            <HStack justifyContent="space-between">
              <Text py="2">{props.content}</Text>
            </HStack>
          </CardBody>
          <CardFooter justifyContent="end">
            <Button
              colorScheme={test ? "blue" : undefined}
              onClick={onSubmitLike}
              marginRight={4}
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
