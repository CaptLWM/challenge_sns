"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/store";
import { DocumentData } from "firebase/firestore";
import { getUser, updateUser } from "@/firebase/firestore";
import { useRouter } from "next/navigation";
import { useModifyUser } from "@/queries/queries";
import { User } from "@/firebase/firebase.type";

const signUpSchema = z.object({
  email: z
    .string()
    .email("유효하지 않은 이메일 형식입니다.")
    .min(1, "이메일을 입력해주세요"),
  password: z
    .string()
    .regex(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
    .min(8, "비밀번호 길이"),
  bio: z.string(),
  nickname: z.string(),
});

export default function Main() {
  const router = useRouter();
  // 상태를 추가하여 사용자 정보를 저장
  const [userInfo, setUserInfo] = useState<DocumentData | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: zodResolver(signUpSchema),
  });

  // 로그인한 유저정보 가져오기
  // TODO  이미지 변경도 추가해야함
  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : null;

  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
          setUserInfo(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [uid]);

  const user_uid: string = uid ? uid : "";
  const modifyUser = useModifyUser(user_uid);

  const onSubmitModify = (data: User) => {
    modifyUser.mutate(data),
      {
        onSuccess: () => {
          router.replace("/home");
        },
        onError: (error: any) => {
          const errorMessage = error.message;
          alert(errorMessage);
        },
      };
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitModify)} autoComplete="off">
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input
            id="email"
            placeholder="Email"
            defaultValue={userInfo?.email}
            {...register("email")}
          />
          <FormErrorMessage>
            {typeof errors.email?.message === "string"
              ? errors.email.message
              : ""}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="비밀번호">비밀번호</FormLabel>
          <Input
            id="password"
            placeholder="password"
            type="password"
            {...register("password")}
            defaultValue=""
          />
          <FormErrorMessage>
            {typeof errors.password?.message === "string"
              ? errors.password.message
              : ""}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.bio}>
          <FormLabel htmlFor="bio">자기소개</FormLabel>
          <Input
            id="bio"
            placeholder="bio"
            {...register("bio")}
            defaultValue={userInfo?.bio}
          />
          <FormErrorMessage>
            {typeof errors.bio?.message === "string" ? errors.bio.message : ""}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.nickname}>
          <FormLabel htmlFor="nickname">닉네임</FormLabel>
          <Input
            id="nickname"
            placeholder="nickname"
            {...register("nickname")}
            defaultValue={userInfo?.nickname}
          />
          <FormErrorMessage>
            {typeof errors.nickname?.message === "string"
              ? errors.nickname.message
              : ""}
          </FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="teal"
          isLoading={isSubmitting}
          type="submit"
          width="full"
        >
          내정보 수정
        </Button>
      </form>
    </div>
  );
}
