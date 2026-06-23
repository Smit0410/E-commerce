import { type FC } from "react";
import type { ComponentProps } from "./type";

const index: FC<ComponentProps> = ({
  type = "button",
  btnTxt,
  onClick,
  isLoading = false,
  isDisable = false,
  className = "bg-gray-400",
}) => {
  return (
    <button
      onClick={onClick}
      className={` rounded-full active:scale-95 px-3 py-2 bg-orange-600 hover:bg-gray-600  text-white ${className}`}
      type={type}
      disabled={isLoading || isDisable}
    >
      {isLoading ? (
        <p className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></p>
      ) : (
        btnTxt
      )}
    </button>
  );
};

export default index;
