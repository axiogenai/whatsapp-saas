import React from 'react';

type BadgeVariant = 'active' | 'paused' | 'disconnected' | 'info' | 'plan';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
  paused: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  disconnected: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' },
  info: { bg: 'bg-white/[0.06]', text: 'text-white/65', dot: 'bg-white/40' },
  plan: { bg: 'bg-[#25D366]/10', text: 'text-[#25D366]', dot: 'bg-[#25D366]' },
};

export function Badge({ variant = 'info', children, dot = false, className = '' }: BadgeProps) {
  const styles = variantClasses[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles.bg} ${styles.text} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${variant === 'active' ? 'animate-pulse-subtle' : ''}`} />}
      {children}
    </span>
  );
}
