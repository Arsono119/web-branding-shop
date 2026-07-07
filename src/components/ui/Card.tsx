import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface rounded-2xl border border-border p-4 transition-all duration-200 ${
        hover ? 'hover:shadow-lg hover:shadow-brand-500/10 hover:border-brand-200 hover:scale-[1.02] cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
