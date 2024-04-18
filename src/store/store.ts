import { create } from "zustand";

// interface ModalState {
//     mode: "new" | "comment";
//     data: Post | null;
//     setMode(mode: "new" | "comment"): void;
//     setData(data: Post): void;
//     reset(): void;
//   }

const useStore = create((set) => ({
  //  상태관리 할 함수, 변수들 저장
  //   data: null, // 초기값
  //   setMode(mode) {
  //     // 모드 변경
  //     set({ mode });
  //   },
  //   setData(data) {
  //     // 데이터 변경
  //     set({ data });
  //   },
  //   reset() {
  //     // 초기화
  //     set({
  //       mode: "new",
  //       data: null,
  //     });
  //   },
  //   bears: 0,
  //   increasePopulation: () =>
  //     set((state: { bears: number }) => ({ bears: state.bears + 1 })),
  //   removeAllBears: () => set({ bears: 0 }),
  //   updateBears: (newBears: any) => set({ bears: newBears }),
}));
