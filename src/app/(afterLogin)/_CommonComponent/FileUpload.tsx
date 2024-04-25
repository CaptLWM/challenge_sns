import { auth } from "@/firebase/firebaseAuth";
import { storage } from "@/firebase/firestorage";
import { Button, Input, Text } from "@chakra-ui/react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";

export default function FileUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleFileSelect = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };
  const handleUpload = async () => {
    if (selectedFile) {
      // 이미지파일로 접근
      // ref(storage, '폴더/파일이름')
      const imageRef = ref(
        storage,
        `${auth.currentUser?.uid}/${selectedFile.name}`
      );
      try {
        // 파일 올리면 => uid 값으로 폴더 생성됨
        await uploadBytes(imageRef, selectedFile);
        const downloadURL = await getDownloadURL(imageRef);
        console.log(downloadURL);
        console.log("성공");
      } catch (error) {
        console.log("파일업로드 실패", error);
      }
    } else {
      console.log("파일이 없습니다.");
    }
  };
  return (
    <div>
      <Text>파일업로드 테스트</Text>
      <Input type="file" onChange={handleFileSelect} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
}
