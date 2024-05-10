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
import {
  getUserEmail,
  getUserNick,
  signUpWithEmailAndPassword,
} from "@/firebase/firestore";
import Image from "next/image";
import { SignUp } from "@/firebase/firebase.type";

// const signUpSchema = z.object({

//   password: z
//     .string()
//     .regex(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
//     .min(8, "비밀번호 길이"),
//   confirmPassword: z
//     .string()
//     .regex(/^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/)
//     .min(8, "비밀번호 길이"),
//   bio: z.string(),
//   nickname: z.string(),
//   image: z.string(),
// });

// TODO : 회원가입할때 이메일 중복확인(알아서 걸러주긴 함), 닉네임 중복확인, 비밀번호 확인 필요
export default function Main() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [nicknameCheck, setNicknameCheck] = useState<boolean | undefined>(
    false
  );
  const [idCheck, setIdCheck] = useState<boolean | undefined>(false);
  const {
    handleSubmit,
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<SignUp>({
    mode: "onBlur",
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const signUp = async (data: SignUp) => {
    // console.log(selectedFile);
    try {
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

  // 닉네임 중복확인
  const emailCheck = async (value: string) => {
    const response = await getUserEmail(value);
    console.log("response", response);
    if (response.length > 0) {
      console.log("이메일 사용 불가");
      return false;
    } else {
      console.log("이메일 사용가능");
      return true;
    }
  };

  const handleCheckEmail = async () => {
    const check = watch("email");
    if (!check) {
      setError("email", {
        type: "manual",
        message: "이메일을 먼저 입력하세요.",
      });
      return;
    }
    const regExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regExp.test(check)) {
      setError("email", {
        type: "manual",
        message: "이메일 양식을 확인해 주세요",
      });
    } else {
      setIdCheck(true);

      const isAvailable = await emailCheck(check);

      setIdCheck(false);
      console.log(isAvailable);
      if (isAvailable) {
        clearErrors("email");
        alert("이메일 사용가능합니다");
        return;
      } else {
        setError("email", {
          type: "manual",
          message: "이메일이 이미 사용 중입니다.",
        });
      }
    }
  };

  // 닉네임 중복확인
  const nickCheck = async (value: string) => {
    const response = await getUserNick(value);
    if (response.length > 0) {
      console.log("닉네임 사용 불가");
      return false;
    } else {
      console.log("닉네임 사용가능");
      return true;
    }
  };

  const handleCheckNickName = async () => {
    const check = watch("nickname");
    if (!check) {
      setError("nickname", {
        type: "manual",
        message: "닉네임을 먼저 입력하세요.",
      });
      return;
    }
    setNicknameCheck(true);

    const isAvailable = await nickCheck(check);

    setNicknameCheck(false);

    if (isAvailable) {
      clearErrors("nickname");
      alert("닉네임 사용가능합니다");
      return;
    } else {
      setError("nickname", {
        type: "manual",
        message: "이름이 이미 사용 중입니다.",
      });
    }
  };

  // useEffect(() => {
  //   if (nicknameCheck) {
  //     console.log("상태가 닉네임 사용가능으로 변경되었습니다.");

  //   } else {
  //     console.log("상태가 닉네임 사용 불가로 변경되었습니다.");

  //   }
  // }, [nicknameCheck]);

  // console.log(nicknameCheck);

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
          <HStack>
            <Input
              id="email"
              placeholder="Email"
              {...register("email", {
                required: "필수 입력 항목입니다.",
                validate: (value) => emailCheck(value),
                // validate: (value) => {
                //   if (idCheck) {
                //     return "중복된 이메일입니다.";
                //   }
                //   return true;
                // },
              })}
            />
            <Button onClick={handleCheckEmail}>중복확인</Button>
          </HStack>
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
            {...register("password", {
              required: "필수 입력 항목입니다.",
              minLength: {
                value: 8,
                message: "비밀번호는 8자 이상이어야 합니다.",
              },
              pattern: {
                value:
                  /^.*(?=^.{8,15}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/,
                message: "비밀번호는 숫자와 문자를 포함해야 합니다.",
              },
            })}
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
              required: true,
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
          <HStack>
            <Input
              id="nickname"
              placeholder="nickname"
              {...register("nickname", {
                required: true,
                validate: (value) => nickCheck(value),
              })}
            />
            <Button onClick={handleCheckNickName}>중복확인</Button>
          </HStack>
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
            variant="unstyled"
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
