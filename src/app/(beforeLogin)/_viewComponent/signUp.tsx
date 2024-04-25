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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firestorage";
import { auth } from "@/firebase/firebaseAuth";
import Image from "next/image";

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
  image: z.any(),
});

export default function Main() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const signUp = async (data: any) => {
    // console.log("hi");

    try {
      // 회원가입 하고
      await signUpWithEmailAndPassword(
        data.email,
        data.password,
        data.bio,
        data.nickname,
        data.image[0]
      );
      router.replace("/home");
    } catch (error) {
      console.log(error);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  }, [selectedFile]);
  // const test = getValues("image");

  // if (test && test.length > 0) {
  //   const firstFile = test[0];
  //   if (firstFile instanceof File) {
  //     const fileURL = URL.createObjectURL(test[0]);
  //     console.log(fileURL);
  //     setPreview(fileURL);
  //   } else {
  //     console.log("file 아님");
  //   }
  // } else {
  //   console.log("타입에러");
  // }

  return (
    <div className="container mx-auto mr-20 ml-20">
      <Text fontSize="6xl" as="b">
        Just Do It
      </Text>

      <form onSubmit={handleSubmit(signUp)} autoComplete="off">
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
            <Image src={preview} alt="미리보기" width={200} height={200} />
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
