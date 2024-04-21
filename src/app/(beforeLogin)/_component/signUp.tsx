import { Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React from "react";
import CommonInputForm from "../_commonComponent/CommonInputForm";

export default function Main() {
  // 회원가입
  //   const signUp = (event: any) => {
  //     event.preventDefault();
  //     createUserWithEmailAndPassword(auth, email, password)
  //       .then((userCredential) => {
  //         const user = userCredential.user;
  //         // 여기서 유저 정보를 조회할 수 있다
  //         console.log(user);
  //         alert("성공했습니다!");
  //       })
  //       .catch((error) => {
  //         const errorMessage = error;
  //         alert(errorMessage);
  //       });
  //   };

  return (
    <div className="container mx-auto mr-20 ml-20">
      <VStack spacing={3} mb={10}>
        <Text fontSize="6xl" as="b">
          Just Do It
        </Text>
        <form>
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
        <HStack mb={5}>
          <Text w="10rem">아이디</Text>
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
        {/* 이메일 양식 추가 필요 */}
        <HStack mb={5}>
          <Text w="10rem">이메일</Text>
          <Input></Input>
        </HStack>
        {/* TODO 자기소개 100자이내 */}
        <HStack mb={5}>
          <Text w="10rem">자기소개</Text>
          <Input></Input>
        </HStack>
        {/* TODO 프로필사진 */}
        <HStack mb={10}>
          <Text w="10rem">프로필사진</Text>
          <Input></Input>
        </HStack>

        <Button>회원가입</Button>
      </VStack>
    </div>
  );
}
