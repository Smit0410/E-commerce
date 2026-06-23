export interface ComponentProps {
  type?: "submit" | "button" | "reset";
  btnTxt: string | number;
  onClick?: VoidFunction;
  isLoading?: boolean;
  isDisable?: boolean;
  className?: string;
}
