import type { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}
const Card: FC<CardProps> = ({ children, className }) => {
  return (
    <div className={`bg-white p-5 rounded-lg shadow-md  ${className}`}>
      {children}
    </div>
  );
};

export default Card;
