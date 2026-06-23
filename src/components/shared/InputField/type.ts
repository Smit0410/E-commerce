export interface ComponentProps {
  type: "text" | "password" | "email" | "search";
  className?: string;
  placeholder: string;
  isRequired?: boolean;
  value?: string;
  onChange: (e: string) => void;
}
