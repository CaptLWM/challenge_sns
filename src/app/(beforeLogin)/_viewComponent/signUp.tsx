import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
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
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  return (
    <div className="container mx-auto mr-20 ml-20">
      <Text fontSize="6xl" as="b">
        Just Do It
      </Text>

      <form>
        <VStack spacing={3}>
          {/* 이메일 양식 추가 필요 */}
          <HStack mb={5}>
            <Text w="10rem">이메일</Text>
            <Input></Input>
          </HStack>
          <HStack mb={5}>
            <Text w="10rem">닉네임</Text>
            <Input></Input>
          </HStack>
          <HStack mb={5}>
            <Text w="10rem">비밀번호</Text>
            <Input></Input>
          </HStack>
          <HStack mb={5}>
            <Text w="10rem">비밀번호 확인</Text>
            <Input></Input>
          </HStack>

          {/* TODO 자기소개 100자이내 */}
          <HStack mb={5}>
            <Text w="10rem">자기소개</Text>
            <Input></Input>
          </HStack>
          {/* TODO 프로필사진 */}
          <HStack mb={5}>
            <Text w="10rem">프로필사진</Text>
            <Input></Input>
          </HStack>
        </VStack>
        <HStack>
          <Button colorScheme="teal" width="full">
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
