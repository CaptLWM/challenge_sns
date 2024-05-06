"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import { DocumentData } from "firebase/firestore";
import { getUser, updateUser } from "@/firebase/firestore";
import { useRouter } from "next/navigation";
import {
  useBoardListNickNameQuery,
  useBoardListQuery,
  useModifyUser,
} from "@/queries/queries";
import { User } from "@/firebase/firebase.type";
import InfiniteScroll from "react-infinite-scroll-component";
import BoardItemCard from "../_CommonComponent/BoardItemCard";
import { useQueryClient } from "@tanstack/react-query";
import { BOARD_LIST } from "@/queries/queryKeys";

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
  const queryClient = useQueryClient();
  // 상태를 추가하여 사용자 정보를 저장
  const [userInfo, setUserInfo] = useState<DocumentData | null>(null);
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
  const boardList = useBoardListNickNameQuery(userInfo?.nickname);

  // 쿼리키로 할것
  const test = useMemo(() => {
    if (!boardList.data?.pages) return;
    return boardList.data?.pages;
  }, [boardList.data?.pages]);

  console.log(test);

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
