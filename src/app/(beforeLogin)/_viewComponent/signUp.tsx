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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpWithEmailAndPassword } from "@/firebase/firestore";
import Image from "next/image";
import { SignUp } from "@/firebase/firebase.type";

const signUpSchema = z.object({
  email: z
    .string()
    .email("유효하지 않은 이메일 형식입니다.")
    .min(1, "이메일을 입력해주세요"),
  password: z
    .string()
    .regex(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
    .min(8, "비밀번호 길이"),
  confirmPassword: z
    .string()
    .regex(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
    .min(8, "비밀번호 길이"),
  bio: z.string(),
  nickname: z.string(),
  image: z.string(),
});

// TODO : 회원가입할때 이메일 중복확인(알아서 걸러주긴 함), 닉네임 중복확인, 비밀번호 확인 필요
export default function Main() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUp>({
    resolver: zodResolver(signUpSchema),
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const signUp = async (data: SignUp) => {
    // console.log(selectedFile);
    try {
      console.log(data.password, data.confirmPassword);
      if (
        data.email === "" ||
        data.password === "" ||
        data.bio === "" ||
        data.nickname === "" ||
        data.image.length === 0
      ) {
        alert("빈칸을 채워주세요");
        return;
      }
      if (data.password !== data.confirmPassword) {
        alert("비밀번호가 일치하지 않습니다.");
        return;
      }
      // 회원가입 하고
      await signUpWithEmailAndPassword(
        data.email,
        data.password,
        data.bio,
        data.nickname,
        data.image
      );
    } catch (error) {
      console.log("!!!!", error);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  const password = watch("password");

  return (
    <div className="container mx-auto mr-20 ml-20">
      <Text fontSize="6xl" as="b">
        Just Do It
      </Text>

      <form onSubmit={handleSubmit(signUp)} autoComplete="new-password">
        {/* 자동완성 막기 위한 가짜 태그 */}
        <input
          type="text"
          name="fakeField1"
          style={{ display: "none" }}
          autoComplete="off"
        />
        <input
          type="password"
          name="fakeField2"
          style={{ display: "none" }}
          autoComplete="new-password"
        />
        {/* 자동완성 막기 위한 가짜 태그 */}
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
        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="confirmPassword">비밀번호 확인</FormLabel>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="비밀번호 확인"
            {...register("confirmPassword", {
              required: "비밀번호 확인은 필수 항목입니다.",
              validate: (value) =>
                value === password || "비밀번호가 일치하지 않습니다.",
            })}
          />
          <FormErrorMessage>
            {typeof errors.confirmPassword?.message === "string"
              ? errors.confirmPassword.message
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
        <FormControl isInvalid={!!errors.image}>
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
          <FormErrorMessage>
            {typeof errors.image?.message === "string"
              ? errors.image.message
              : ""}
          </FormErrorMessage>
        </FormControl>
        {preview && (
          <div>
            <Image
              loading="lazy"
              src={preview}
              alt="미리보기"
              width={200}
              height={200}
            />
          </div>
        )}
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
      </form>
    </div>
  );
}
