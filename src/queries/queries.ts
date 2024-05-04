import { Board } from "@/firebase/firebase.type";
import { storage } from "@/firebase/firestorage";
import { createBoardItem, firestore } from "@/firebase/firestore";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

// 게시물 불러오기
export const useBoardListQuery = (
  initialPageParam?: QueryDocumentSnapshot<DocumentData>
) => {
  console.log("initialPageParam", initialPageParam);
  const fetchData = async ({
    pageParam,
  }: {
    pageParam?: QueryDocumentSnapshot<DocumentData>;
  }) => {
    let q;
    if (pageParam) {
      q = query(
        collection(firestore, "BoardItem"),
        orderBy("createdAt", "desc"),
        limit(2),
        startAfter(pageParam)
      );
    } else {
      q = query(
        collection(firestore, "BoardItem"),
        orderBy("createdAt", "desc"),
        limit(2)
      );
    }
    // collection 이름이 todos인 collection의 모든 document를 가져옵니다.
    const querySnapshot: QuerySnapshot = await getDocs(q);
    // document의 id와 데이터를 initialTodos에 저장합니다.
    // doc.id의 경우 따로 지정하지 않는 한 자동으로 생성되는 id입니다.
    // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있습니다.

    // 튜플형태니까 순서 중요
    const data: { data: Board; id: string }[] = [];

    querySnapshot.forEach((doc) => {
      data.push({ data: doc.data() as Board, id: doc.id });
    });

    // 다음페이지를 가져오기 위한 기준점 설정
    const lastVisible =
      querySnapshot.docs.length > 0
        ? querySnapshot.docs[querySnapshot.docs.length - 1]
        : null;

    return {
      data,

      nextPageParam: lastVisible, // 다음 페이지를 위한 기준
    };
  };
  return useInfiniteQuery({
    queryKey: ["boardlist"],
    queryFn: fetchData,

    getNextPageParam: (lastPage) => lastPage.nextPageParam, // 다음 페이지를 위한 기준
    initialPageParam, // 첫 페이지의 기준 설정
  });
};

// 댓글 불러오기
export const useBoardItemReplyQuery = (feedId: string) => {
  const fetchData = async () => {
    // collection 이름이 todos인 collection의 모든 document를 가져옵니다.
    const q = query(
      collection(firestore, "BoardItemReply"),
      where("feedId", "==", feedId)
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
    queryKey: ["boarditem reply"],
    queryFn: fetchData,
    enabled: !!feedId,
  });
};
