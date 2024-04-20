export type InputType = {
  label_width: string;
  label: string;
  placeholder: string;
  input_type: "email" | "password" | "text"; // 회원가입, 로그인에는 3가지만 사용할듯?
  name: string;
  required: boolean;
  value: string;
  onChange: () => void;
};
