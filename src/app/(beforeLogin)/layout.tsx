import React from "react";

type Props = { children: React.ReactNode; modal: React.ReactNode };

// 모달 사용하게 되면 추가
export default function BeforeLoginlayout({ children, modal }: Props) {
  return (
    <div className="container mx-auto grid place-items-center content-center safe-top safe-left safe-right safe-bottom h-lvh">
      {children}
    </div>
  );
}
