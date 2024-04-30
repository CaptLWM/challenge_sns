"use client";

import { storage } from "@/firebase/firestorage";
import { firestore } from "@/firebase/firestore";
import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Input,
  useDisclosure,
} from "@chakra-ui/react";
import {
  DocumentData,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function BoardItemCard({
  props,
  id,
}: {
  props: DocumentData;
  id: string;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(props.image);
  const deleteModal = useDisclosure();
  const modifyModal = useDisclosure();
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  // TODO 수정, 삭제 후 모달창 닫고 새로고침
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // 게시물 삭제
  const deleteItem = async () => {
    console.log("id", id);
    await deleteDoc(doc(firestore, "/BoardItem", id)).then(() =>
      deleteModal.onClose()
    );
  };

  const modifyItem = async (data: any, uid: string) => {
    const itemRef = doc(firestore, "/BoardItem", id);
    // console.log(data.image);
    // console.log("modify", props.image);
    // console.log("modify2", data.image);
    const previousImage = props.image ?? "default_image_url_or_placeholder";

    // 다운로드 URL을 기본값으로 설정
    const downloadURL =
      data.image && data.image.length > 0
        ? await (async () => {
            const imageFile = data.image[0];
            const imageRef = ref(storage, `${uid}/${imageFile.name}`);
            await uploadBytes(imageRef, imageFile);
            return await getDownloadURL(imageRef);
          })()
        : previousImage;

    await updateDoc(itemRef, {
      id: uid,
      nickname: props.nickname ?? null, // Add null check here
      commentCount: 0,
      likeCount: 0,
      content: data.content,
      image: data.image ? downloadURL : props.image,
      createdAt: props.createdAt,
      updatedAt: new Date().toISOString(),
    }).then(() => modifyModal.onClose());
  };

  useEffect(() => {
    if (selectedFile) {
      const fileURL = URL.createObjectURL(selectedFile);
      setPreview(fileURL);
    }
  }, [selectedFile]);

  // await deleteDoc(doc(db, "cities", "DC"));
  return (
    <>
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        margin={10}
        padding={5}
      >
        <Image
          objectFit="cover"
          maxW={{ base: "100%", sm: "200px" }}
          src={props.image}
          alt="Caffe Latte"
        />
        {/* TODO 작성자에 따라 삭제 여부 체크 */}
        <Button onClick={deleteModal.onOpen}>삭제</Button>
        <Button onClick={modifyModal.onOpen}>수정</Button>
        <Stack>
          <CardBody>
            <Text py="2">{props.content}</Text>
          </CardBody>
        </Stack>
      </Card>
      <Modal
        id="delete"
        isCentered
        blockScrollOnMount={false}
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 삭제</ModalHeader>
          <ModalCloseButton />
          <ModalBody>삭제하시겠습니까?</ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={deleteModal.onClose}>
              취소
            </Button>
            <Button colorScheme="blue" mr={3} onClick={deleteItem}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        id="modify"
        isCentered
        blockScrollOnMount={false}
        isOpen={modifyModal.isOpen}
        onClose={modifyModal.onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>게시글 수정</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit((data) => modifyItem(data, id))}>
            <ModalBody>
              <FormControl>
                <FormLabel htmlFor="내용">내용</FormLabel>
                <Input
                  id="password"
                  placeholder="content"
                  defaultValue={props.content}
                  {...register("content")}
                />
              </FormControl>

              <FormControl>
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
              </FormControl>
              {preview && (
                <div>
                  <Image
                    src={preview}
                    alt="미리보기"
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" onClick={modifyModal.onClose}>
                취소
              </Button>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isSubmitting}
              >
                수정
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
