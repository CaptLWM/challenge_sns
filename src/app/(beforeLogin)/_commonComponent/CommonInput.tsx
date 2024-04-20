"use client";

import { FormControl, FormLabel, HStack, Input, Text } from "@chakra-ui/react";
import React from "react";
import { InputType } from "./component.type";

export default function CommonInputForm({ props }: { props: InputType }) {
  return (
    <FormControl mb={5}>
      <FormLabel w={props.label_width}>{props.label}</FormLabel>
      <Input
        variant="outline"
        placeholder={props.placeholder}
        type={props.input_type}
        name={props.name}
        required={props.required}
        value={props.value}
        onChange={props.onChange}
      />
      {/* 비밀번호같은 경우 양식 틀리면 경고문구 표시해 줘야할듯?? */}
      {/* {isError && (
            <FormErrorMessage>First name is required.</FormErrorMessage>
      )} */}
    </FormControl>
  );
}
