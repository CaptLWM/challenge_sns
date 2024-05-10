import React from "react";
import Main from "../../_viewComponent/chat";

export default function page({ params }: { params: { id: string } }) {
  return (
    <div>
      <Main params={params} />
    </div>
  );
}
