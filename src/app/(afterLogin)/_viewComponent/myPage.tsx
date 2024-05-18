"use client";

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
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
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "@/firebase/firestorage";
import { profile } from "console";

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
  const passwordModal = useDisclosure();
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
          setPreview(data?.profileImage);
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
  // 닉네임 중복확인
  const nickCheck = async (value: string | undefined) => {
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

  const onSubmitModify = async (data: User) => {
    console.log("selected", selectedFile);
    let temp: User | null = {
      bio: "",
      uid: "",
      email: "",
      nickname: "",
      createdAt: "",
      updatedAt: "",
      followingUserList: [],
      followUserList: [],
      profileImage: "",
    };
    if (selectedFile) {
      const imageRef = ref(storage, `${uid}/${selectedFile.name}`);
      await uploadBytes(imageRef, selectedFile);
      const downloadURL = await getDownloadURL(imageRef);
      temp = {
        ...data,
        uid: userInfo?.uid,
        email: userInfo?.email,
        createdAt: userInfo?.createdAt,
        updatedAt: new Date().toISOString(),
        followingUserList: userInfo?.followingUserList,
        followUserList: userInfo?.followUserList,
        profileImage: downloadURL,
      };
    } else {
      temp = {
        ...data,
        uid: userInfo?.uid,
        email: userInfo?.email,
        createdAt: userInfo?.createdAt,
        updatedAt: new Date().toISOString(),
        followingUserList: userInfo?.followingUserList,
        followUserList: userInfo?.followUserList,
        profileImage: userInfo?.profileImage,
      };
    }

    console.log("temp", temp);

    modifyUser.mutate(temp),
      {
        onSuccess: () => {
          alert("수정되었습니다.");
          queryClient.invalidateQueries();
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
          {/* 내글목록 */}
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
          {/* 내정보 수정 */}
          <TabPanel>
            <Button onClick={passwordModal.onOpen}>비밀번호 변경</Button>
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
                    disabled
                  />
                </HStack>

                <FormErrorMessage>
                  {typeof errors.email?.message === "string"
                    ? errors.email.message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              {/* <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">비밀번호</FormLabel>
                <Input
                  id="password"
                  placeholder="password"
                  type="password"
                  {...register("password", {
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
              </FormControl> */}
              <FormControl isInvalid={!!errors.bio}>
                <FormLabel htmlFor="bio">자기소개</FormLabel>
                <HStack>
                  <Input
                    id="bio"
                    placeholder="bio"
                    {...register("bio", {
                      required: true,
                    })}
                    defaultValue={userInfo?.bio}
                  />
                </HStack>
                <FormErrorMessage>
                  {typeof errors.bio?.message === "string"
                    ? errors.bio.message
                    : ""}
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
                      validate: (value) => {
<<<<<<< HEAD
                        console.log(value, "vlaue");
=======
>>>>>>> 4ebe813f71723ea49432e221bc558a327bf36faf
                        if (value !== userInfo?.nickname) {
                          nickCheck(value);
                        }
                        return true;
                      },
                    })}
                    defaultValue={userInfo?.nickname}
                  />
                  <Button onClick={handleCheckNickName}>중복확인</Button>
                </HStack>
                <FormErrorMessage>
                  {typeof errors.nickname?.message === "string"
                    ? errors.nickname.message
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
              <FormControl marginTop={4}>
                <FormLabel htmlFor="image">
                  <Button
                    onClick={() =>
                      document.getElementById("profileImage")?.click()
                    }
                  >
                    이미지추가
                  </Button>
                  <Input
                    id="profileImage"
                    placeholder="이미지"
                    type="file"
                    accept="image/*"
                    variant="unstyled"
                    hidden
                    {...register("profileImage", {
                      onChange: (event) => {
                        const file = event.target.files[0];
                        if (file) {
                          onFileChange(event);
                        }
                      },
                    })}
                  />
                </FormLabel>
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
            <Modal
              id="delete"
              isCentered
              blockScrollOnMount={false}
              isOpen={passwordModal.isOpen}
              onClose={passwordModal.onClose}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>비밀번호 변경</ModalHeader>
                <ModalCloseButton />
                <ModalBody>비밀번호 변경 form</ModalBody>

                <ModalFooter>
                  <Button variant="ghost" onClick={passwordModal.onClose}>
                    취소
                  </Button>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() => passwordModal.onClose()}
                  >
                    삭제
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
