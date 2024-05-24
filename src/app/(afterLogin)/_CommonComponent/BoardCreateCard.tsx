"use client";

import { Board, User } from "@/firebase/firebase.type";
import { getUser } from "@/firebase/firestore";
import useAuthStore from "@/store/store";
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBoard } from "@/queries/queries";
import Image from "next/image";

export default function BoardCreateCard() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const [userInfo, setUserInfo] = useState<User>({
    uid: "",
    email: "",
    nickname: "",
    bio: "",
    createdAt: "",
    updatedAt: "",
    profileImage: "",
    followingUserList: [],
    followUserList: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<Board>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files);
    }
    if (e.target.files?.length === 0) {
      console.log("파일선택 취소");
      return;
    }
  };

  // DB저장된 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : "";
  const createBoard = useCreateBoard({ uid, userInfo });

  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
          setUserInfo({
            uid: data?.id,
            email: data?.email,
            nickname: data?.nickname,
            bio: data?.bio,
            profileImage: data?.profileImage,
            createdAt: data?.createdAt,
            updatedAt: data?.updatedAt,
            followingUserList: data?.followingUserList,
            followUserList: data?.followUserList,
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [router, uid]); // uid가 변경될 때마다 effect 실행

  // 게시물 등록

  // 미리보기
  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile[0]);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  const onSubmit = (data: Board) => {
    // console.log("data", data.image, selectedFile?.length);

    if (data.image.length === 0 && selectedFile) {
      data.image = selectedFile;
    }
    if (!data.image || data.image.length === 0 || data.content.length === 0) {
      alert("내용을 입력해주세요");
      return;
    }
    // console.log("final data", data);
    createBoard.mutate(data, {
      onSuccess: () => {
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
    }); // Mutation을 통해 데이터 등록 요청
  };

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      width={{ base: "100%", sm: "80%" }}
      margin={10}
      padding={5}
    >
      <Stack width={{ base: "100%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            {/* 제목은 추후 챌린지로 변경 */}
            {/* <FormControl>
              <FormLabel htmlFor="email">제목</FormLabel>
              <Input id="email" placeholder="Email" {...register("email")} />
            </FormControl> */}
            <FormControl>
              <HStack justifyContent="space-between" marginBottom={4}>
                <FormLabel htmlFor="content">오늘의 도전은 어땠나요?</FormLabel>
                <Button
                  isLoading={isSubmitting}
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                >
                  등록
                </Button>
              </HStack>
              <Textarea
                id="content"
                placeholder="content"
                height={200}
                marginBottom={8}
                {...register("content")}
              />
            </FormControl>
            <HStack justifyContent="space-between">
              {preview && (
                <Image src={preview} alt="미리보기" width={200} height={200} />
              )}
              <FormControl>
                <FormLabel htmlFor="image">
                  <Button
                    onClick={() => document.getElementById("image")?.click()}
                  >
                    이미지추가
                  </Button>
                  <Input
                    id="image"
                    placeholder="이미지"
                    type="file"
                    accept="image/*"
                    variant="unstyled"
                    hidden
                    {...register("image", {
                      onChange: (event) => {
                        const file = event.target.files[0];
                        if (file) {
                          onFileChange(event);
                        }
                      },
                    })}
                  />
                </FormLabel>
              </FormControl>
            </HStack>
          </CardBody>
        </form>
      </Stack>
    </Card>
  );
}
