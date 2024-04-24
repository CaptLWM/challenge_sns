"use client";

import {
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
import { getUser } from "@/firebase/firestore";

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
  // 상태를 추가하여 사용자 정보를 저장
  const [userInfo, setUserInfo] = useState<DocumentData | null>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  // 로그인한 유저정보 가져오기
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

  const update = async (data: any) => {};
  return (
    <div>
      <form onSubmit={handleSubmit(update)}>
        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email">이메일</FormLabel>
          <Input id="email" placeholder="Email" {...register("email")} />
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
          />
          <FormErrorMessage>
            {typeof errors.password?.message === "string"
              ? errors.password.message
              : ""}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.bio}>
          <FormLabel htmlFor="bio">자기소개</FormLabel>
          <Input id="bio" placeholder="bio" {...register("bio")} />
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
          />
          <FormErrorMessage>
            {typeof errors.nickname?.message === "string"
              ? errors.nickname.message
              : ""}
          </FormErrorMessage>
        </FormControl>
      </form>
    </div>
  );
}