import React from "react";
import Main from "../../_viewComponent/user";

export default function page({ params }: { params: { id: string } }) {
  return <Main nickname={params.id} />;
}
