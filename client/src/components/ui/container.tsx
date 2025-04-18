import { cn } from "@/utils/cn";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={cn("container mx-auto px-4", className)}>
      {children}
    </div>
  );
} 