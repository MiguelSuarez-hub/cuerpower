import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <input
        id={id}
        className={`h-11 rounded-lg border border-zinc-300 px-3.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 ${className}`}
        {...props}
      />
    </div>
  );
}
