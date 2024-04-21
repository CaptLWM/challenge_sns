import { ColorSchemeEnum } from "next/dist/lib/metadata/types/metadata-types";

export type InputType = {
  label_width: string;
  label: string;
  placeholder: string;
  input_type: "email" | "password" | "text"; // 회원가입, 로그인에는 3가지만 사용할듯?
  name: string;
  required: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ButtonType = {
  type?: "button" | "submit" | "reset" | undefined;
  label: string;
  ml: number;
  onClick: (event: any) => void;
};
