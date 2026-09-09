'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MessageSquare, Brain, Phone, MoreHorizontal, BarChart3, CreditCard, Settings, QrCode } from 'lucide-react';

interface MobileNavProps {
  tab: string;
  onTabChange: (tab: string) => void;
}

const mainTabs = [
  { id: 'overview', label: 'Home', icon: Home },
  { id: 'connection', label: 'Connection', icon: QrCode },
  { id: 'brain', label: 'AI Brain', icon: Brain },
  { id: 'tasks', label: 'Tasks', icon: Phone },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

const moreMenuTabs = [
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function MobileNav({ tab, onTabChange }: MobileNavProps) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const handleTabClick = (id: string) => {
    if (id === 'more') {
      setIsMoreOpen(!isMoreOpen);
    } else {
      onTabChange(id);
      setIsMoreOpen(false);
    }
  };

  const handleMoreItemClick = (id: string) => {
    onTabChange(id);
    setIsMoreOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {isMoreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreOpen(false)}
              className="fixed inset-0 z-20 bg-black/50 md:hidden"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-[calc(env(safe-area-inset-bottom,16px)+60px)] left-0 right-0 z-30 md:hidden bg-[#0F0F0F] border-t border-white/[0.08] rounded-t-2xl p-4 shadow-xl"
            >
              <div className="flex flex-col">
                {moreMenuTabs.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleMoreItemClick(item.id)}
                      className="flex items-center gap-3 py-4 border-b border-white/[0.04] last:border-b-0"
                    >
                      <Icon className="w-5 h-5 text-white/50" />
                      <span className="text-sm font-medium text-white">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#0A0A0A]/90 backdrop-blur-xl border-t border-white/[0.06] pb-[env(safe-area-inset-bottom,16px)]">
        <div className="flex items-center justify-around px-2 pt-2 pb-1">
          {mainTabs.map((item) => {
            const isActive = tab === item.id || (item.id === 'more' && isMoreOpen) || (item.id === 'more' && moreMenuTabs.some(t => t.id === tab));
            const Icon = item.icon;
            
            return (
              <div
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-3 relative cursor-pointer ${
                  isActive ? 'text-[#25D366]' : 'text-white/30'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-tab"
                    className="absolute -top-0.5 w-8 h-0.5 rounded-full bg-[#25D366]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
