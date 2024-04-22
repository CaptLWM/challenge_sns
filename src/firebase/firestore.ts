import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebasedb from "./firebase";
import { User } from "./firebase.type";

export const firestore = getFirestore(firebasedb);

// 회원 정보 저장 함수
export const saveUser = async (user: User) => {
  // doc(firestore, 경로, pathSegments)
  const userDocRef = doc(firestore, "/User/userInfo", user.uid);
  // setDoc(참조, 데이터, 옵션) 	지정된 DocumentReference 에서 참조하는 문서에 씁니다. 문서가 아직 존재하지 않으면 생성됩니다. merge 또는 mergeFields 제공하면 제공된 데이터를 기존 문서에 병합할 수 있습니다.
  // uid 있으면 덮어쓰고 없으면 새문서
  await setDoc(userDocRef, user);
  console.log("User", user);
};

// 회원 정보 읽기 함수
export const getUser = async (uid: string) => {
  const userDocRef = doc(firestore, "/User/userInfo", uid);
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
  const userDocRef = doc(firestore, "/User/userInfo", uid);
  await updateDoc(userDocRef, updateData);
  console.log("User updated:", updateData);
};

// 회원 정보 삭제 함수
export const deleteUser = async (uid: string) => {
  const userDocRef = doc(firestore, "/User/userInfo", uid);
  await deleteDoc(userDocRef);
  console.log("User deleted:", uid);
};
