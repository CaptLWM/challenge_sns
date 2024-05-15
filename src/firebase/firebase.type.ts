export interface User {
  bio: string;
  uid: string;
  email: string;
  nickname: string;
  createdAt: string;
  updatedAt: string;
  followingUserList: string[];
  followUserList: string[];
  profileImage: string;
}

export interface UserSignin extends User {
  password: string;
  confirmPassword?: string; // 비밀번호 체크용
}

export interface Board {
  // challenge : string; // 챌린지 등록기능 만들고 나면 추가
  id?: string;
  nickname?: string | null;
  content: string;
  commentCount?: number;
  image: FileList;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  likeUserList: string[];
}

export interface Reply {
  content: string;
  feedId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUp {
  email: string;
  password: string;
  bio: string;
  nickname: string;
  image: File[];
  confirmPassword?: string; // 비밀번호 체크용
}

export interface SignIn {
  email: string;
  password: string;
}
