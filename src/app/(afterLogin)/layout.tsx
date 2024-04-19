import React from "react";

export default function AfterLoginlayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto grid place-items-center content-center safe-top safe-left safe-right safe-bottom h-lvh">
      {children}
    </div>
  );
}
