"use client";

import { loginWithEmailAndPassword } from "@/firebase/firebaseAuth";
import {
  FormControl,
  FormLabel,
  Stack,
  Text,
  Input,
  FormErrorMessage,
  Button,
  HStack,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import CommonInputForm from "../_commonComponent/CommonInputForm";
import CommoneButtonForm from "../_commonComponent/CommonButtonForm";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z
    .string()
    .email("유효하지 않은 이메일 형식입니다.")
    .min(1, "이메일을 입력해주세요"),
  password: z
    .string()
    .regex(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
    .min(8, "비밀번호 길이"),
});

export default function Main() {
  // zod 스키마 정의

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();

  const signIn = async (data: any) => {
    try {
      await loginWithEmailAndPassword(data.email, data.password);
      router.replace("/home");
    } catch (error: any) {
      //   const errorCode = error.code;
      const errorMessage = error.message;
      if (
        errorMessage === "Firebase: Error (auth/invalid-email)." ||
        errorMessage === "Firebase: Error (auth/invalid-credential)."
      ) {
        alert("아이디와 비밀번호를 확인해주세요.");
      } else {
        alert(errorMessage);
      }
    }
  };

  return (
    <div className="container mx-auto mr-20 ml-20">
      <Stack spacing={3} mb={10}>
        <Text fontSize="6xl" as="b">
          Just Do It
        </Text>
      </Stack>
      <form onSubmit={handleSubmit(signIn)}>
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
        <HStack mt={5}>
          <Button
            colorScheme="teal"
            isLoading={isSubmitting}
            type="submit"
            width="full"
          >
            로그인
          </Button>
          <Button
            colorScheme="teal"
            isLoading={isSubmitting}
            width="full"
            onClick={() => router.replace("/signUp")}
          >
            회원가입
          </Button>
        </HStack>
      </form>
    </div>
  );
}
