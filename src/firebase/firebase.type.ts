export interface User {
  bio: string;
  uid: string;
  email: string;
  nickname: string | null;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  // challenge : string; // 챌린지 등록기능 만들고 나면 추가
  id: string;
  nickname: string | null;
  content: string;
  commentCount: number;
  image: File[];
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}
