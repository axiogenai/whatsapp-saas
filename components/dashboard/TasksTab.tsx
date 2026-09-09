'use client';

import { useState, FormEvent } from 'react';
import { Clock, Phone, Users, X, ExternalLink, Plus, Loader2 } from 'lucide-react';

interface TasksTabProps {
  reminders: {
    id: string;
    task: string;
    recipientJid: string;
    recipientName?: string;
    dueTimestamp: number;
    status: string;
  }[];
  scheduledCalls: {
    id: string;
    clientName: string;
    preferredTime: string;
    topic: string;
    status: string;
    phone?: string;
    meetLink?: string;
  }[];
  leads: {
    id: string;
    clientName: string;
    requirements: string;
    budgetRange?: string;
    phone?: string;
  }[];
  loading: boolean;
  onCreateReminder: (task: string, phone: string, delayMinutes: number) => void;
  onCancelReminder: (id: string) => void;
  creating: boolean;
}

export function TasksTab({
  reminders,
  scheduledCalls,
  leads,
  loading,
  onCreateReminder,
  onCancelReminder,
  creating,
}: TasksTabProps) {
  const [taskText, setTaskText] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [delayMins, setDelayMins] = useState('15');

  const pendingReminders = reminders.filter((r) => r.status !== 'completed');

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    if (!taskText || !phoneInput) return;
    onCreateReminder(taskText, phoneInput, parseInt(delayMins, 10));
    setTaskText('');
    setPhoneInput('');
  };

  const getMinutesRemaining = (ts: number) => {
    const diffMs = ts * 1000 - Date.now();
    if (diffMs <= 0) return 'Overdue';
    return `${Math.ceil(diffMs / 60000)}m left`;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden group">
          <div className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Pending Reminders
          </div>
          <div className="text-2xl font-semibold text-white font-mono mt-1">
            {pendingReminders.length}
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Clock className="w-4 h-4 text-white/20" />
          </div>
        </div>
        <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden group">
          <div className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Scheduled Calls
          </div>
          <div className="text-2xl font-semibold text-white font-mono mt-1">
            {scheduledCalls.length}
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Phone className="w-4 h-4 text-white/20" />
          </div>
        </div>
        <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 relative overflow-hidden group">
          <div className="text-xs text-white/40 uppercase tracking-wider font-medium">
            Captured Leads
          </div>
          <div className="text-2xl font-semibold text-white font-mono mt-1">
            {leads.length}
          </div>
          <div className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
            <Users className="w-4 h-4 text-white/20" />
          </div>
        </div>
      </div>

      {/* Create Reminder */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-white">Schedule Follow-up</h3>
        <form onSubmit={handleCreate} className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Remind about..."
              value={taskText}
              onChange={(e) => setTaskText(e.target.value)}
              className="col-span-1 sm:col-span-3 h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.12] transition-colors"
            />
            <input
              type="text"
              placeholder="+91 XXXXX XXXXX"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-white/[0.12] transition-colors"
            />
            <select
              value={delayMins}
              onChange={(e) => setDelayMins(e.target.value)}
              className="h-10 px-4 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-white/[0.12] transition-colors appearance-none"
            >
              <option value="5" className="bg-[#0F0F0F]">5 min</option>
              <option value="15" className="bg-[#0F0F0F]">15 min</option>
              <option value="30" className="bg-[#0F0F0F]">30 min</option>
              <option value="60" className="bg-[#0F0F0F]">1 hour</option>
              <option value="1440" className="bg-[#0F0F0F]">24 hours</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={creating || !taskText || !phoneInput}
            className="mt-4 h-10 px-5 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Create Reminder
          </button>
        </form>
      </div>

      {/* Pending Reminders List */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 text-sm font-medium text-white bg-white/[0.02]">
          Pending Reminders
        </div>
        {pendingReminders.length > 0 ? (
          <div>
            {pendingReminders.map((reminder) => (
              <div
                key={reminder.id}
                className="px-5 py-3 flex items-center gap-3 border-t border-white/[0.04]"
              >
                <Clock className="w-4 h-4 text-white/20 shrink-0" />
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className="text-sm text-white truncate">{reminder.task}</span>
                  <span className="text-xs text-white/30 truncate shrink-0">
                    {reminder.recipientName || reminder.recipientJid.split('@')[0]}
                  </span>
                </div>
                <div className="text-xs font-mono text-white/30 shrink-0">
                  {getMinutesRemaining(reminder.dueTimestamp)}
                </div>
                <button
                  onClick={() => onCancelReminder(reminder.id)}
                  className="p-1 hover:bg-white/[0.06] rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white/20 hover:text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-white/20 border-t border-white/[0.04]">
            No pending reminders
          </div>
        )}
      </div>

      {/* Scheduled Calls List */}
      <div className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 text-sm font-medium text-white bg-white/[0.02]">
          Scheduled Consultations
        </div>
        {scheduledCalls.length > 0 ? (
          <div>
            {scheduledCalls.map((call) => (
              <div
                key={call.id}
                className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 border-t border-white/[0.04]"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white truncate">
                      {call.clientName}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/60 uppercase tracking-wider">
                      {call.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                    <span>Topic: {call.topic}</span>
                    <span>Time: {call.preferredTime}</span>
                  </div>
                </div>
                {call.meetLink && (
                  <a
                    href={call.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition-colors shrink-0 self-start sm:self-center"
                  >
                    Join Meeting <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-white/20 border-t border-white/[0.04]">
            No scheduled calls
          </div>
        )}
      </div>
    </div>
  );
}
