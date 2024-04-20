import create from "zustand";
import { User } from "firebase/auth";
import {
  checkAuthState,
  loginWithEmailAndPassword,
  logout,
} from "@/firebase/firebaseAuth";

interface AuthStoreState {
  user: User | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  doLogout: () => void;
}

const useAuthStore = create<AuthStoreState>((set) => ({
  user: null,
  initializing: true,
  login: async (email, password) => {
    const user = await loginWithEmailAndPassword(email, password); // 인증 함수를 호출합니다.
    if (user) {
      set({ user });
      localStorage.setItem("token", await user.getIdToken());
    }
  },
  doLogout: () => {
    logout(); // 로그아웃 함수를 호출합니다.
    set({ user: null });
    localStorage.removeItem("token");
  },
}));

export const initAuthState = () => {
  checkAuthState((user) => {
    // 인증 상태 확인 함수를 호출합니다.

    if (user) {
      useAuthStore.setState({ user, initializing: true });
    } else {
      useAuthStore.setState({ user: null, initializing: false });
    }
  });
};

export default useAuthStore;
