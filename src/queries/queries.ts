import { Board } from "@/firebase/firebase.type";
import { storage } from "@/firebase/firestorage";
import { createBoardItem, firestore } from "@/firebase/firestore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  DocumentData,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// 게시물 불러오기
export const useBoardListQuery = () => {
  const fetchData = async () => {
    // collection 이름이 todos인 collection의 모든 document를 가져옵니다.
    const q = query(
      collection(firestore, "BoardItem"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot: QuerySnapshot = await getDocs(q);
    const initial: DocumentData[] = [];
    // document의 id와 데이터를 initialTodos에 저장합니다.
    // doc.id의 경우 따로 지정하지 않는 한 자동으로 생성되는 id입니다.
    // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있습니다.
    querySnapshot.forEach((doc) => {
      // 항상 id를 같이 넘겨줘야함 (문서 id가 필요하기 때문
      initial.push({ data: doc.data(), id: doc.id });
    });
    return initial;
  };
  return useQuery({
    queryKey: ["boardlist"],
    queryFn: fetchData,
  });
};

// export const usePostMailSendQuery = () => {
//     return useMutation((requestbody: IMailSend) =>
//       api.post('/api/mail-send', requestbody),
//     );
//   };
