'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, ChevronLeft, Bot, User } from 'lucide-react';

interface InboxTabProps {
  contacts: {
    jid: string;
    senderName: string;
    lastMessage: string;
    lastTimestamp: number;
    isHumanTakeover: boolean;
    takeoverRemainingMs: number;
  }[];
  telemetry: {
    id: string;
    jid: string;
    senderName: string;
    fromMe: boolean;
    text: string;
    timestamp: number;
    isBotReply?: boolean;
  }[];
  activeContact: string | null;
  onSelectContact: (jid: string) => void;
  onSendMessage: (text: string) => void;
  sendingMessage: boolean;
  onTakeover: (jid: string, action: 'pause' | 'resume') => void;
  trialExhausted: boolean;
}

export function InboxTab({
  contacts,
  telemetry,
  activeContact,
  onSelectContact,
  onSendMessage,
  sendingMessage,
  onTakeover,
  trialExhausted,
}: InboxTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredContacts = contacts
    .filter(
      (c) =>
        c.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.lastTimestamp - a.lastTimestamp);

  const activeContactData = contacts.find((c) => c.jid === activeContact);
  const activeTelemetry = telemetry
    .filter((t) => t.jid === activeContact)
    .sort((a, b) => a.timestamp - b.timestamp);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTelemetry]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || trialExhausted || sendingMessage) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-56px)] overflow-hidden">
      {/* Left Panel — Contact List */}
      <div
        className={`w-full md:w-[280px] lg:w-[320px] border-r border-white/[0.06] flex-col shrink-0 ${
          activeContact ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="px-4 py-3 border-b border-white/[0.06] relative">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 px-3 pl-9 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.12] transition-colors"
          />
          <Search className="w-4 h-4 text-white/20 absolute left-7 top-1/2 -translate-y-1/2" />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.jid}
              onClick={() => onSelectContact(contact.jid)}
              className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] ${
                activeContact === contact.jid ? 'bg-white/[0.04]' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-sm text-white/40 font-medium shrink-0">
                {contact.senderName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                  <span className="text-sm text-white truncate pr-2">
                    {contact.senderName}
                  </span>
                  <span className="text-[10px] text-white/20 shrink-0">
                    {formatTime(contact.lastTimestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/30 truncate flex-1">
                    {contact.lastMessage}
                  </span>
                  {contact.isHumanTakeover && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400/70 font-mono shrink-0">
                      HUMAN
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {filteredContacts.length === 0 && (
            <div className="p-4 text-center text-sm text-white/20">
              No contacts found.
            </div>
          )}
        </div>
      </div>

      {/* Center Panel — Chat Thread */}
      <div
        className={`flex-1 flex-col min-w-0 ${
          !activeContact ? 'hidden md:flex' : 'flex'
        }`}
      >
        {activeContact && activeContactData ? (
          <>
            {/* Chat Header */}
            <div className="h-14 px-4 flex items-center gap-3 border-b border-white/[0.06] shrink-0 bg-[#050505]">
              <button
                onClick={() => onSelectContact('')}
                className="md:hidden p-1 -ml-1 text-white/60 hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-xs text-white/40 font-medium shrink-0">
                {activeContactData.senderName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {activeContactData.senderName}
                </div>
                <div className="text-[10px] text-white/40 truncate">
                  {activeContactData.jid.split('@')[0]}
                </div>
              </div>
              <div>
                {activeContactData.isHumanTakeover ? (
                  <button
                    onClick={() => onTakeover(activeContact, 'resume')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    Resume AI
                  </button>
                ) : (
                  <button
                    onClick={() => onTakeover(activeContact, 'pause')}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.04] text-amber-400 hover:bg-white/[0.08] transition-colors"
                  >
                    Take Over
                  </button>
                )}
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2 bg-[#050505]">
              {activeTelemetry.map((msg, idx) => {
                const prevMsg = activeTelemetry[idx - 1];
                const showSender =
                  !msg.fromMe &&
                  (!prevMsg || prevMsg.fromMe || prevMsg.senderName !== msg.senderName);

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] ${
                      msg.fromMe ? 'self-end' : 'self-start'
                    }`}
                  >
                    <div
                      className={`px-3.5 py-2 relative ${
                        msg.fromMe
                          ? 'bg-[#005c4b] rounded-xl rounded-tr-sm'
                          : 'bg-[#202c33] rounded-xl rounded-tl-sm'
                      }`}
                    >
                      {msg.fromMe ? (
                        <div className="text-[9px] font-mono mb-0.5 flex items-center gap-1">
                          {msg.isBotReply ? (
                            <span className="text-[#25D366]/50">AI</span>
                          ) : (
                            <span className="text-white/20">You</span>
                          )}
                        </div>
                      ) : showSender ? (
                        <div className="text-[10px] font-medium text-[#25D366]/50 mb-0.5">
                          {msg.senderName || activeContactData.senderName}
                        </div>
                      ) : null}
                      <div className="text-sm text-[#e9edef] leading-relaxed break-words whitespace-pre-wrap">
                        {msg.text}
                      </div>
                      <div className="text-[10px] text-white/20 text-right mt-1">
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="px-4 py-3 flex flex-col gap-2 border-t border-white/[0.06] shrink-0 bg-[#050505]">
              {trialExhausted && (
                <div className="text-xs text-white/30 text-center">
                  Free trial messages exhausted.{' '}
                  <a href="#billing" className="text-[#25D366] hover:underline">
                    Upgrade plan
                  </a>
                </div>
              )}
              <form onSubmit={handleSend} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={trialExhausted || sendingMessage}
                  className="flex-1 h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.12] transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || trialExhausted || sendingMessage}
                  className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#22c55e] flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-sm text-white/20">Select a conversation</span>
          </div>
        )}
      </div>
    </div>
  );
}
