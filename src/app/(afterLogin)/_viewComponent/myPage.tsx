"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/store";
import {
  getUser,
  getUserEmail,
  getUserNick,
  updateUser,
} from "@/firebase/firestore";
import { useRouter } from "next/navigation";
import {
  useBoardListNickNameQuery,
  useBoardListQuery,
  useModifyUser,
} from "@/queries/queries";
import { User, UserSignin } from "@/firebase/firebase.type";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import { useQueryClient } from "@tanstack/react-query";
import { BOARD_LIST } from "@/queries/queryKeys";

export default function Main() {
  const router = useRouter();
  const queryClient = useQueryClient();
  // 상태를 추가하여 사용자 정보를 저장
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [nicknameCheck, setNicknameCheck] = useState<boolean | undefined>(
    false
  );
  const [idCheck, setIdCheck] = useState<boolean | undefined>(false);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const {
    handleSubmit,
    register,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserSignin>({
    mode: "onBlur",
  });

  // 로그인한 유저정보 가져오기
  // TODO  이미지 변경도 추가해야함
  const user = useAuthStore((state) => state.user);
  const uid = user ? user.uid : null;
  useEffect(() => {
    if (uid) {
      getUser(uid)
        .then((data) => {
          setUserInfo({
            uid: data?.uid,
            email: data?.email,
            nickname: data?.nickname,
            bio: data?.bio,
            createdAt: data?.createdAt,
            updatedAt: data?.updatedAt,
            profileImage: data?.profileImage,
            followingUserList: data?.followingUserList,
            followUserList: data?.followUserList,
          });

          setLoading(false);
        })
        .catch((err) => {
          setErr(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [uid]);

  console.log("userInfo", userInfo);

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

  const user_uid: string = uid ? uid : "";
  const modifyUser = useModifyUser(user_uid);
  const boardList = useBoardListNickNameQuery(
    userInfo?.nickname ? userInfo.nickname : ""
  );

  // 이메일 중복확인
  const emailCheck = async (value: string) => {
    const response = await getUserEmail(value);
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

  const password = watch("password");

  // 쿼리키로 할것
  const test = useMemo(() => {
    if (!boardList.data?.pages) return;
    return boardList.data?.pages;
  }, [boardList.data?.pages]);

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
      <Tabs>
        <TabList>
          <Tab>내글목록</Tab>
          <Tab>내정보수정</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <InfiniteScroll
              dataLength={boardList.data?.pages.flat().length ?? 0}
              next={boardList.fetchNextPage}
              hasMore={boardList.hasNextPage}
              loader={<div>Loading</div>}
              scrollThreshold={0.8}
            >
              {test?.map((page, pageIndex) => {
                return (
                  <div key={pageIndex}>
                    {page.data.map((v, i) => (
                      <BoardItemCard key={v.id} props={v.data} id={v.id} />
                    ))}
                  </div>
                );
              })}
              {/* {boardList.data?.pages.map((page, pageIndex) => {
                return (
                  <div key={pageIndex}>
                    {page.data.map((v, i) => (
                      <BoardItemCard key={v.id} props={v.data} id={v.id} />
                    ))}
                  </div>
                );
              })} */}
            </InfiniteScroll>
          </TabPanel>
          <TabPanel>
            <form onSubmit={handleSubmit(onSubmitModify)} autoComplete="off">
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
                    defaultValue={userInfo?.email}
                    {...register("email", {
                      required: "필수 입력 항목입니다.",
                      validate: (value) => emailCheck(value),
                    })}
                  />
                </HStack>
                <Button onClick={handleCheckEmail}>중복확인</Button>
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
                  defaultValue=""
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
                  {typeof errors.bio?.message === "string"
                    ? errors.bio.message
                    : ""}
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
              <FormControl isInvalid={!!errors.profileImage}>
                <FormLabel htmlFor="image">프로필이미지</FormLabel>
                <Input
                  id="image"
                  placeholder="이미지"
                  type="file"
                  accept="image/*"
                  variant="unstyled"
                  {...register("profileImage", {
                    onChange: onFileChange,
                  })}
                />
                <FormErrorMessage>
                  {typeof errors.profileImage?.message === "string"
                    ? errors.profileImage.message
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
              <Button
                colorScheme="teal"
                isLoading={isSubmitting}
                type="submit"
                width="full"
              >
                내정보 수정
              </Button>
            </form>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
