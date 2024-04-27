"use client";

import firebasedb from "@/firebase/firebase";
import { createBoardItem, getUser } from "@/firebase/firestore";
import useAuthStore from "@/store/store";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { DocumentData, getFirestore } from "firebase/firestore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BoardCreateCard() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  //////
  const [userInfo, setUserInfo] = useState<DocumentData | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //////
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // DB저장된 사용자 정보 가져오기
  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : "";

  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
          console.log("data", data);
          setUserInfo(data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
          setError(err);
          setLoading(false);
        });
    } else {
      console.log("uid3", uid);
      setLoading(false);
    }
  }, [router, uid]); // uid가 변경될 때마다 effect 실행

  // 게시물 등록
  const createItem = async (data: any, uid: string) => {
    try {
      // 게시물 등록
      await createBoardItem(
        {
          id: uid,
          content: data.content,
          image: data.image,
          nickname: userInfo?.nickname ?? null, // Add null check here
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          commentCount: 0,
          likeCount: 0,
        },
        uid // Add the missing uid argument here
      );
      // TODO 리액트 쿼리로 바꿔서 업데이트 되도록 해야함
    } catch (error) {
      const errorMessage = error;
      alert(errorMessage);
      return error;
    }
  };

  // 미리보기
  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  return (
    <Card
      direction={{ base: "column", sm: "row" }}
      overflow="hidden"
      variant="outline"
      margin={10}
      padding={5}
    >
      <Stack>
        <form onSubmit={handleSubmit((data) => createItem(data, uid))}>
          <CardBody>
            {/* 제목은 추후 챌린지로 변경 */}
            {/* <FormControl>
              <FormLabel htmlFor="email">제목</FormLabel>
              <Input id="email" placeholder="Email" {...register("email")} />
            </FormControl> */}
            <FormControl>
              <FormLabel htmlFor="내용">내용</FormLabel>
              <Input
                id="password"
                placeholder="content"
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
                <Image src={preview} alt="미리보기" width={200} height={200} />
              </div>
            )}
          </CardBody>

          <CardFooter>
            <Button
              isLoading={isSubmitting}
              type="submit"
              variant="solid"
              colorScheme="blue"
            >
              제출
            </Button>
          </CardFooter>
        </form>
      </Stack>
    </Card>
  );
}
