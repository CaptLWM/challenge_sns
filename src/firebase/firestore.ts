import {
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebasedb from "./firebase";
import { Board, User } from "./firebase.type";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseAuth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firestorage";
import { create } from "domain";

export const firestore = getFirestore(firebasedb);

/*
  추가적으로 해야하는것
  1. 날짜 업데이트
  2. 경고문 수정\
*/

// 회원가입
export const signUpWithEmailAndPassword = async (
  email: string,
  password: string,
  nickname: string,
  bio: string,
  image: File[]
) => {
  try {
    // console.log("email", email);
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = credential.user;
    const imageRef = ref(storage, `${user?.uid}/${image[0]?.name}`);
    // const imageRef = ref(storage, `${user?.uid}/${image?.name}`);

    // 이미지 업로드

    // 파일 올리면 => uid 값으로 폴더 생성됨
    await uploadBytes(imageRef, image[0]); // 파일 업로드

    // 이미지 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(imageRef);

    const userDocRef = doc(firestore, "/User", user.uid);
    await setDoc(userDocRef, {
      bio: bio,
      uid: user.uid,
      email: email,
      nickname: nickname,
      profileImage: downloadURL,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return user.uid;
  } catch (error) {
    const errorMessage = error;
    alert(errorMessage);
    return error;
  }
};

// 회원 정보 읽기 함수
export const getUser = async (uid: string) => {
  const userDocRef = doc(firestore, "/User", uid);
  // getDoc(참조) : 이 DocumentReference 에서 참조하는 문서를 읽습니다. 참고: getDoc() 서버에서 데이터를 기다리면서 가능한 경우 최신 데이터를 제공하려고 시도하지만 오프라인 상태이고 서버에 연결할 수 없는 경우 캐시된 데이터를 반환하거나 실패할 수 있습니다. 이 동작을 지정하려면 getDocFromCache() 또는 getDocFromServer()를 호출합니다. .
  const userSnap = await getDoc(userDocRef);
  // exists() 메소드를 사용하여 문서의 존재를 명시적으로 확인할 수 있습니다.
  if (userSnap.exists()) {
    console.log("User data:", userSnap.data());
    return userSnap.data();
  } else {
    console.log("No such user");
    return null;
  }
};

// 회원 정보 업데이트 함수
export const updateUser = async (uid: string, updateData: Partial<User>) => {
  const userDocRef = doc(firestore, "/User", uid);
  await updateDoc(userDocRef, updateData);
  console.log("User updated:", updateData);
};

// 회원 정보 삭제 함수
export const deleteUser = async (uid: string) => {
  const userDocRef = doc(firestore, "/User/userInfo", uid);
  await deleteDoc(userDocRef);
  console.log("User deleted:", uid);
};

// 게시물 등록
export const createBoardItem = async (data: Board, uid: string | null) => {
  // const user = Credential.user;
  const imageRef = ref(storage, `${uid}/${data.image[0]?.name}`);
  // const imageRef = ref(storage, `${user?.uid}/${image?.name}`);

  // 이미지 업로드
  // 파일 올리면 => uid 값으로 폴더 생성됨
  await uploadBytes(imageRef, data.image[0]); // 파일 업로드

  // 이미지 다운로드 URL 가져오기
  const downloadURL = await getDownloadURL(imageRef);
  // console.log("URL", downloadURL);

  await addDoc(collection(firestore, "BoardItem"), {
    ...data,
    image: downloadURL,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    commentCount: 0,
    likeCount: 0,
  });
};

export const boardItemLike = async (
  props: DocumentData,
  uid: string,
  id: string
) => {
  const userLikeRef = doc(firestore, "/BoardItem", id);

  // 좋아요 리스트가 있는지 확인 없으면 빈 배열로 초기화
  const currentLikeUserList: string[] = Array.isArray(props.likeUserList)
    ? props.likeUserList
    : [];

  // 아이디 포함 되어 있는지 확인
  const isLiked = currentLikeUserList.includes(uid);

  if (isLiked) {
    // 사용자가 이미 좋아요를 누른 경우, likeUserList에서 제거합니다.
    const updatedLikeUserList = currentLikeUserList.filter(
      (user) => user !== uid
    );
    await updateDoc(userLikeRef, { likeUserList: updatedLikeUserList });
  } else {
    // 사용자가 좋아요를 누르지 않은 경우, likeUserList에 추가합니다.
    const updatedLikeUserList = currentLikeUserList.concat(uid);
    await updateDoc(userLikeRef, { likeUserList: updatedLikeUserList });
  }
};

export const modifyBoardItem = async (
  props: DocumentData,
  data: Board,
  id: string,
  uid: string
) => {
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
  });
};

// 게시물 좋아요

export const createBoardItemReply = async (data: any, id: any, uid: any) => {
  await addDoc(collection(firestore, "BoardItemReply"), {
    content: data.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    feedId: id,
    userId: uid,
  });
};

export const modifyBoardItemReply = async (
  data: any,
  uid: string,
  id: string
) => {
  console.log("uid!!!", id, uid);
  const userDocRef = doc(firestore, "BoardItemReply", id);
  await updateDoc(userDocRef, {
    userId: uid,
    content: data.content,
    updatedAt: new Date().toISOString(),
  });
};

export const deleteBoardItemReply = async (uid: string) => {
  const userDocRef = doc(firestore, "BoardItemReply", uid);
  await deleteDoc(userDocRef);
  console.log("성공");
};
