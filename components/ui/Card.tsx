import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'interactive' | 'featured';
  className?: string;
  padding?: boolean;
}

const variantClasses = {
  default: 'bg-[#0F0F0F] border border-white/[0.06]',
  interactive: 'bg-[#0F0F0F] border border-white/[0.06] hover:border-white/[0.12] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
  featured: 'bg-[#0F0F0F] border border-[#25D366]/20 shadow-[0_0_40px_rgba(37,211,102,0.08)]',
};

export function Card({ children, variant = 'default', className = '', padding = true }: CardProps) {
  return (
    <div className={`rounded-2xl ${padding ? 'p-6' : ''} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
}
