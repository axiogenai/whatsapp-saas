'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({ items, active, onChange, size = 'md', className = '' }: TabsProps) {
  const sizeClasses = size === 'sm'
    ? 'text-xs px-3 py-1.5'
    : 'text-sm px-4 py-2';

  return (
    <div className={`relative flex gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06] ${className}`}>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={`relative flex items-center gap-2 ${sizeClasses} rounded-lg font-medium transition-colors duration-150 z-10 ${
            active === item.id ? 'text-white' : 'text-white/40 hover:text-white/65'
          }`}
        >
          {active === item.id && (
            <motion.div
              className="absolute inset-0 bg-white/[0.08] border border-white/[0.08] rounded-lg"
              layoutId="tab-indicator"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            {item.icon}
            {item.label}
            {item.badge != null && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded-md bg-white/[0.08]">
                {item.badge}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}
