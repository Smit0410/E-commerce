import { type FC } from "react";
import type { ComponentProps } from "./type";

const index: FC<ComponentProps> = ({
  type,
  placeholder,
  isRequired,
  className,
  onChange,
  value,
}) => {
  return (
    <input
      onChange={(e) => {
        onChange(e.target.value);
      }}
      className={`border-b rounded p-2 ${className}`}
      value={value}
      type={type}
      name=""
      id=""
      placeholder={placeholder}
      required={!!isRequired}
    />
  );
};

export default index;
