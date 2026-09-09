import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-white/65">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30">{icon}</span>}
        <input
          className={`
            w-full h-11 px-3.5 ${icon ? 'pl-10' : ''} rounded-xl
            bg-[#0F0F0F] border border-white/[0.08]
            text-white text-sm placeholder:text-white/25
            focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20
            transition-colors duration-150
            disabled:opacity-40 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-white/65">{label}</label>}
      <textarea
        className={`
          w-full px-3.5 py-3 rounded-xl resize-none
          bg-[#0F0F0F] border border-white/[0.08]
          text-white text-sm placeholder:text-white/25 leading-relaxed
          focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20
          transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          ${error ? 'border-red-500/50' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}

export function Select({ label, options, className = '', ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-white/65">{label}</label>}
      <select
        className={`
          w-full h-11 px-3.5 rounded-xl appearance-none
          bg-[#0F0F0F] border border-white/[0.08]
          text-white text-sm
          focus:outline-none focus:border-[#25D366]/50 focus:ring-1 focus:ring-[#25D366]/20
          transition-colors duration-150
          disabled:opacity-40 disabled:cursor-not-allowed
          ${className}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}
