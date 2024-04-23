import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpWithEmailAndPassword } from "@/firebase/firestore";

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
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const signUp = async (data: any) => {
    try {
      // 회원가입 하고
      const user = await signUpWithEmailAndPassword(
        data.email,
        data.password,
        data.bio,
        data.nickname
      );
      console.log("signup", user);
      // 세부정보 저장 하는거 까지 문제 없으면 home으로 이동
      // router.replace('/home')
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto mr-20 ml-20">
      <Text fontSize="6xl" as="b">
        Just Do It
      </Text>

      <form onSubmit={handleSubmit(signUp)}>
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
        <HStack mt={5}>
          <Button
            isLoading={isSubmitting}
            type="submit"
            colorScheme="teal"
            width="full"
          >
            회원가입
          </Button>
          <Button
            colorScheme="teal"
            width="full"
            onClick={() => router.replace("/login")}
          >
            로그인
          </Button>
        </HStack>
        {/* <CommonInputForm
          props={{
            label_width: "5rem",
            input_type: "email",
            label: "이메일",
            name: "email",
            onChange: (e) => void,
            placeholder: "이메일",
            required: true,
            value: email,
          }}
        /> */}
      </form>
    </div>
  );
}
