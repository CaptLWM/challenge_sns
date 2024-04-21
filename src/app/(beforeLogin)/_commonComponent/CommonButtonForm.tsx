"use client";

import React from "react";
import { ButtonType } from "./component.type";
import { Button } from "@chakra-ui/react";

export default function CommoneButtonForm({ props }: { props: ButtonType }) {
  return (
    <Button type={props.type} ml={props.ml} onClick={props.onClick}>
      {props.label}
    </Button>
  );
}
