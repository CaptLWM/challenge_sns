import React from "react";
import Main from "../../_viewComponent/user";

export default function page({ params }: { params: { id: string } }) {
  console.log("nickname", params.id);
  return <Main nickname={params.id} />;
}
