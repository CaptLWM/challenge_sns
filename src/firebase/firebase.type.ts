export interface User {
  bio: string;
  uid: string;
  email: string;
  nickname: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  // challenge : string; // 챌린지 등록기능 만들고 나면 추가
  content: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
}
