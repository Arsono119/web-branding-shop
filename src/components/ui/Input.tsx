import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-10 px-3 rounded-lg border bg-surface text-foreground text-sm transition-colors placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
            error ? 'border-error' : 'border-border'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-error">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
