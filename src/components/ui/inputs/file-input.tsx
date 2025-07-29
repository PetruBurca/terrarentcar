import React from "react";
import { cn } from "@/lib/utils";

interface FileInputProps {
  name: string;
  accept?: string;
  required?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  children?: React.ReactNode;
}

export const FileInput: React.FC<FileInputProps> = ({
  name,
  accept = "image/*",
  required = false,
  onChange,
  className,
  children,
}) => {
  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        name={name}
        accept={accept}
        required={required}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="pointer-events-none">{children}</div>
    </div>
  );
};
