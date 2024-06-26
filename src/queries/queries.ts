"use client";

import { Board, Reply, User } from "@/firebase/firebase.type";
import { storage } from "@/firebase/firestorage";
import {
  boardItemLike,
  createBoardItem,
  createBoardItemReply,
  deleteBoardItemReply,
  firestore,
  followUser,
  modifyBoardItem,
  modifyBoardItemReply,
  updateUser,
} from "@/firebase/firestore";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { BOARD_ITEM_REPLY, BOARD_LIST } from "./queryKeys";
import { ReplyType } from "@/app/(afterLogin)/_CommonComponent/component.type";

// 사용자 정보 수정
export const useModifyUser = (uid: string) => {
  return useMutation({
    mutationFn: async (data: User) => {
      await updateUser(uid, data);
    },
  });
};

// 게시물 불러오기
export const useBoardListQuery = (
  initialPageParam?: QueryDocumentSnapshot<DocumentData>
) => {
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
    queryKey: [BOARD_LIST],
    queryFn: fetchData,
    getNextPageParam: (lastPage) => lastPage.nextPageParam, // 다음 페이지를 위한 기준
    initialPageParam, // 첫 페이지의 기준 설정
  });
};
// 팔로우중인 사람 게시물 불러오기
export const useFollowBoardListQuery = (
  follow: string[],
  initialPageParam?: QueryDocumentSnapshot<DocumentData>
) => {
  const fetchData = async ({
    pageParam,
  }: {
    pageParam?: QueryDocumentSnapshot<DocumentData>;
  }) => {
    let q;
    if (pageParam) {
      q = query(
        collection(firestore, "BoardItem"),
        where("id", "in", follow),
        orderBy("id", "desc"),

        // orderBy("createdAt", "desc"),
        limit(2),
        startAfter(pageParam)
      );
    } else {
      q = query(
        collection(firestore, "BoardItem"),
        where("id", "in", follow),
        orderBy("id", "desc"),

        // orderBy("createdAt", "desc"),
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
    queryKey: [BOARD_LIST, follow],
    queryFn: fetchData,
    getNextPageParam: (lastPage) => lastPage.nextPageParam, // 다음 페이지를 위한 기준
    initialPageParam, // 첫 페이지의 기준 설정
  });
};

// 게시물 불러오기(닉네임)
export const useBoardListNickNameQuery = (
  nickName: string,
  initialPageParam?: QueryDocumentSnapshot<DocumentData>
) => {
  const fetchData = async ({
    pageParam,
  }: {
    pageParam?: QueryDocumentSnapshot<DocumentData>;
  }) => {
    let q;
    if (pageParam) {
      q = query(
        collection(firestore, "BoardItem"),
        where("nickname", "==", nickName),
        orderBy("createdAt", "desc"),
        limit(2),
        startAfter(pageParam)
      );
    } else {
      q = query(
        collection(firestore, "BoardItem"),
        where("nickname", "==", nickName),
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
    queryKey: [BOARD_LIST],
    queryFn: fetchData,
    getNextPageParam: (lastPage) => lastPage.nextPageParam, // 다음 페이지를 위한 기준
    initialPageParam, // 첫 페이지의 기준 설정
    enabled: !!nickName,
  });
};

// 게시물 생성
export const useCreateBoard = ({
  uid,
  userInfo,
}: {
  uid: string;
  userInfo: User | null;
}) => {
  return useMutation({
    mutationFn: async (data: Board) => {
      await createBoardItem(
        {
          ...data,
          id: uid,
          nickname: userInfo?.nickname ?? null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          commentCount: 0,
          likeCount: 0,
        },
        uid
      );
    },
  });
};

// 게시물 수정
export const useModifyBoard = (uid: string) => {
  return useMutation({
    mutationFn: async ({
      data,
      props,
      id,
    }: {
      data: Board;
      props: Board;
      id: string;
    }) => {
      await modifyBoardItem(props, data, id, uid);
    },
  });
};

// 게시글 삭제
export const useDeleteBoard = (props: DocumentData) => {
  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(firestore, "/BoardItem", id));
      try {
        await deleteObject(ref(storage, props.image));
      } catch (error: any) {
        console.log("파일삭제 error", error.message);
      }
    },
  });
};

// 게시물 좋아욧
export const useBoardItemLike = () => {
  return useMutation({
    mutationFn: async ({
      props,
      id,
      uid,
    }: {
      props: Board;
      id: string;
      uid: string;
    }) => {
      await boardItemLike(props, uid, id);
    },
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
    const initial: any[] = [];
    // document의 id와 데이터를 initialTodos에 저장합니다.
    // doc.id의 경우 따로 지정하지 않는 한 자동으로 생성되는 id입니다.
    // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있습니다.
    querySnapshot.forEach((doc) => {
      // 항상 id를 같이 넘겨줘야함 (문서 id가 필요하기 때문
      initial.push({ data: doc.data() as ReplyType, id: doc.id });
    });
    return initial;
  };
  return useQuery({
    queryKey: [BOARD_ITEM_REPLY],
    queryFn: fetchData,
    enabled: !!feedId,
  });
};

// 댓글 작성
export const useCreateReply = ({ id, uid }: { id: string; uid: string }) => {
  return useMutation({
    mutationFn: async (data: Reply) => {
      await createBoardItemReply(
        {
          content: data.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          feedId: id,
          userId: uid,
        },
        id,
        uid
      );
    },
  });
};

// 댓글 수정
export const useModifyReply = ({
  uid,
  id,
  modifyContent,
  replyId,
}: {
  uid: string;
  id: string;
  modifyContent: string;
  replyId: string;
}) => {
  return useMutation({
    mutationFn: async (data: Reply) => {
      await modifyBoardItemReply(
        {
          ...data,
          userId: uid,
          content: modifyContent,
          updatedAt: new Date().toISOString(),
        },
        uid,
        id,
        replyId
      );
    },
  });
};

// 댓글 삭제
export const useDeleteReply = (id: string) => {
  return useMutation({
    mutationFn: async () => {
      await deleteBoardItemReply(id);
    },
  });
};

// 사용자 팔로우
export const useFollowUser = () => {
  return useMutation({
    mutationFn: async ({
      currentUid,
      targetInfo,

      curUserInfo,
    }: {
      currentUid: string;
      targetInfo: User | null;
      curUserInfo: User | null;
    }) => {
      await followUser(currentUid, targetInfo, curUserInfo);
    },
  });
};
