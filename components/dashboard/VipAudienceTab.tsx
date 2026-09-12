'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  UserCheck, 
  Users, 
  MessageSquare, 
  UserX, 
  Plus, 
  Search, 
  Check, 
  Save, 
  Loader2, 
  BookUser, 
  RefreshCw, 
  Edit2 
} from 'lucide-react';
import { TenantBotConfig, SavedContact } from '@/lib/types';

interface VipAudienceTabProps {
  config: TenantBotConfig;
  onConfigChange: (updates: Partial<TenantBotConfig>) => void;
  onSave: () => void;
  saving: boolean;
  tenantId: string;
}

type FilterTab = 'all' | 'vips' | 'ai_active' | 'text_only';

export function VipAudienceTab({
  config,
  onConfigChange,
  onSave,
  saving,
  tenantId,
}: VipAudienceTabProps) {
  const [contacts, setContacts] = useState<SavedContact[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [selectedPhones, setSelectedPhones] = useState<Set<string>>(new Set());

  // Inline name editing state: phone -> temporary edited name
  const [editingPhone, setEditingPhone] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [savingPhone, setSavingPhone] = useState<string | null>(null);
  const [savedSuccessPhone, setSavedSuccessPhone] = useState<string | null>(null);

  // Inline real phone editing state: phone -> temporary edited real phone
  const [editingRealPhoneKey, setEditingRealPhoneKey] = useState<string | null>(null);
  const [editingRealPhoneValue, setEditingRealPhoneValue] = useState<string>('');

  // Manual Add Modal (Add to VIP Protection)
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [newVoiceMode, setNewVoiceMode] = useState<'default' | 'text_only' | 'voice_only'>('default');
  const [newNotes, setNewNotes] = useState('');

  // Blocked Number Input
  const [blockInput, setBlockInput] = useState('');

  const blockedNumbers = config.blockedNumbers || [];

  // Load Contacts Directory
  const loadDirectory = async (forceSync = false) => {
    if (forceSync) setSyncing(true);
    else setLoading(true);

    try {
      const endpoint = forceSync 
        ? `/api/whatsapp/contacts/sync?tenantId=${encodeURIComponent(tenantId)}`
        : `/api/whatsapp/contacts/directory?tenantId=${encodeURIComponent(tenantId)}`;
      
      const res = await fetch(endpoint, {
        method: forceSync ? 'POST' : 'GET',
        headers: { 'x-tenant-id': tenantId },
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.contacts)) {
          setContacts(data.contacts);
        }
      }
    } catch (err) {
      console.error('Failed fetching contacts directory:', err);
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadDirectory(false);
  }, [tenantId]);

  // Update single contact control
  const handleUpdateContact = async (phone: string, updates: Partial<SavedContact>) => {
    // Optimistic UI update
    setContacts((prev) =>
      prev.map((c) => (c.phone === phone ? { ...c, ...updates, updatedAt: Date.now() } : c))
    );

    setSavingPhone(phone);
    try {
      const res = await fetch(`/api/whatsapp/contacts/control?tenantId=${encodeURIComponent(tenantId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({
          phone,
          ...updates,
        }),
      });

      if (res.ok) {
        setSavedSuccessPhone(phone);
        setTimeout(() => setSavedSuccessPhone(null), 2000);
      }
    } catch (err) {
      console.error(`Failed to update contact ${phone}:`, err);
    } finally {
      setSavingPhone(null);
    }
  };

  // Toggle VIP (CRITICAL: VIP = AI NEVER REPLIES)
  const handleToggleVip = (contact: SavedContact) => {
    const nextIsVip = !contact.isVip;
    handleUpdateContact(contact.phone, { 
      isVip: nextIsVip,
      aiEnabled: !nextIsVip // If VIP -> AI Muted (false). If not VIP -> AI Active (true)
    });
  };

  // Change Voice Delivery Mode
  const handleChangeVoiceMode = (contact: SavedContact, voiceMode: 'default' | 'text_only' | 'voice_only') => {
    handleUpdateContact(contact.phone, { voiceMode });
  };

  // Start editing contact name inline
  const handleStartEditing = (contact: SavedContact) => {
    setEditingPhone(contact.phone);
    setEditingName(contact.name || contact.verifiedName || contact.notify || '');
  };

  // Save edited name
  const handleSaveName = async (phone: string) => {
    const trimmed = editingName.trim();
    setEditingPhone(null);
    if (!trimmed) return;
    await handleUpdateContact(phone, { name: trimmed });
  };

  // Start editing real phone inline
  const handleStartEditingRealPhone = (contact: SavedContact) => {
    setEditingRealPhoneKey(contact.phone);
    setEditingRealPhoneValue(contact.realPhone || (contact.phone.length <= 12 ? contact.phone : ''));
  };

  // Save edited real phone
  const handleSaveRealPhone = async (phone: string) => {
    const trimmed = editingRealPhoneValue.replace(/\D/g, '');
    setEditingRealPhoneKey(null);
    await handleUpdateContact(phone, { realPhone: trimmed || undefined });
  };

  // Batch Control
  const handleBatchUpdate = async (updates: Partial<SavedContact>) => {
    if (selectedPhones.size === 0) return;
    const phones = Array.from(selectedPhones);

    // Optimistic UI
    setContacts((prev) =>
      prev.map((c) => (selectedPhones.has(c.phone) ? { ...c, ...updates, updatedAt: Date.now() } : c))
    );

    try {
      await fetch(`/api/whatsapp/contacts/batch-control?tenantId=${encodeURIComponent(tenantId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': tenantId,
        },
        body: JSON.stringify({ phones, updates }),
      });
      setSelectedPhones(new Set());
    } catch (err) {
      console.error('Failed batch update:', err);
    }
  };

  // Add Contact to VIP Form Submit
  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhone.replace(/\D/g, '');
    if (!cleanPhone || !newName.trim()) return;

    // Added contacts default to VIP (AI Never Replies)
    await handleUpdateContact(cleanPhone, {
      name: newName.trim(),
      isVip: true,
      aiEnabled: false,
      voiceMode: newVoiceMode,
      notes: newNotes.trim() || undefined,
    });

    setIsAddingContact(false);
    setNewPhone('');
    setNewName('');
    setNewNotes('');
    setNewVoiceMode('default');
    loadDirectory(false);
  };

  // Blocked Number
  const handleAddBlockedNumber = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = blockInput.replace(/\D/g, '');
    if (!clean || blockedNumbers.includes(clean)) return;
    onConfigChange({ blockedNumbers: [...blockedNumbers, clean] });
    setBlockInput('');
  };

  const handleRemoveBlockedNumber = (num: string) => {
    onConfigChange({ blockedNumbers: blockedNumbers.filter((n) => n !== num) });
  };

  // Filtered & Searched Contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      // 1. Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name?.toLowerCase().includes(q);
        const matchesNotify = c.notify?.toLowerCase().includes(q);
        const matchesPhone = c.phone.includes(q);
        const matchesRealPhone = c.realPhone?.includes(q);
        const matchesNotes = c.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesNotify && !matchesPhone && !matchesRealPhone && !matchesNotes) return false;
      }

      // 2. Tab filter
      if (activeFilter === 'vips') return Boolean(c.isVip || c.aiEnabled === false);
      if (activeFilter === 'ai_active') return !c.isVip && c.aiEnabled !== false;
      if (activeFilter === 'text_only') return c.voiceMode === 'text_only';

      return true;
    });
  }, [contacts, searchQuery, activeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = contacts.length;
    const vips = contacts.filter((c) => c.isVip || c.aiEnabled === false).length;
    const aiActive = contacts.filter((c) => !c.isVip && c.aiEnabled !== false).length;
    const textOnly = contacts.filter((c) => c.voiceMode === 'text_only').length;
    return { total, vips, aiActive, textOnly };
  }, [contacts]);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 pb-28 md:pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-white/[0.04] text-white border border-white/[0.08]">
              <Shield className="w-5 h-5 text-amber-400" />
            </span>
            <div>
              <h2 className="text-lg font-semibold text-white tracking-tight">
                VIP Protection & Audience Control
              </h2>
              <p className="text-xs text-white/40 mt-0.5">
                Contacts marked as VIP are strictly protected: the AI will <span className="text-amber-400 font-medium">NEVER reply</span> to them.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => loadDirectory(true)}
            disabled={syncing || loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white transition-all disabled:opacity-50"
            title="Scan WhatsApp sessions and sync contacts"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync WhatsApp'}</span>
          </button>

          <button
            onClick={() => setIsAddingContact(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add VIP</span>
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-medium text-xs transition-all shadow-lg disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* Metric Counter Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setActiveFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'all' 
              ? 'bg-white/[0.08] border-white/40' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="text-[11px] font-medium text-white/50 uppercase tracking-wider">All Contacts</div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.total}</div>
          <div className="text-[10px] text-white/30 mt-0.5">Synced WhatsApp phonebook</div>
        </div>

        <div 
          onClick={() => setActiveFilter('vips')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'vips' 
              ? 'bg-amber-500/10 border-amber-500/50' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Shield className="w-3 h-3" />
            VIP Protected
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-1">{stats.vips}</div>
          <div className="text-[10px] text-amber-400/60 mt-0.5">AI will NEVER reply (Muted)</div>
        </div>

        <div 
          onClick={() => setActiveFilter('ai_active')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'ai_active' 
              ? 'bg-white/[0.08] border-white/40' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="text-[11px] font-medium text-white/70 uppercase tracking-wider">
            AI Active
          </div>
          <div className="text-2xl font-bold font-mono text-white mt-1">{stats.aiActive}</div>
          <div className="text-[10px] text-white/40 mt-0.5">Automated replies based on prompt</div>
        </div>

        <div 
          onClick={() => setActiveFilter('text_only')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'text_only' 
              ? 'bg-blue-500/10 border-blue-500/50' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.14]'
          }`}
        >
          <div className="text-[11px] font-medium text-blue-400 uppercase tracking-wider">
            Text Only
          </div>
          <div className="text-2xl font-bold font-mono text-blue-300 mt-1">{stats.textOnly}</div>
          <div className="text-[10px] text-blue-400/60 mt-0.5">No voice notes dispatched</div>
        </div>
      </div>

      {/* Main Contact Directory & VIP Management Table */}
      <section className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5 space-y-4">
        {/* Search & Action Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, title, phone, or notes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/40"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06] text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-white/[0.1] text-white font-medium' : 'text-white/40 hover:text-white'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter('vips')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'vips' ? 'bg-amber-500/20 text-amber-300 font-medium' : 'text-white/40 hover:text-white'
              }`}
            >
              VIP Protected ({stats.vips})
            </button>
            <button
              onClick={() => setActiveFilter('ai_active')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'ai_active' ? 'bg-white/[0.1] text-white font-medium' : 'text-white/40 hover:text-white'
              }`}
            >
              AI Active ({stats.aiActive})
            </button>
            <button
              onClick={() => setActiveFilter('text_only')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'text_only' ? 'bg-blue-500/20 text-blue-300 font-medium' : 'text-white/40 hover:text-white'
              }`}
            >
              Text Only ({stats.textOnly})
            </button>
          </div>
        </div>

        {/* Batch Selection Action Bar */}
        {selectedPhones.size > 0 && (
          <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between gap-3 text-xs">
            <span className="text-white font-medium">
              {selectedPhones.size} contact{selectedPhones.size > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBatchUpdate({ isVip: true, aiEnabled: false })}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center gap-1.5"
              >
                <Shield className="w-3 h-3" />
                <span>Move to VIP (Mute AI)</span>
              </button>
              <button
                onClick={() => handleBatchUpdate({ isVip: false, aiEnabled: true })}
                className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/[0.1] font-medium"
              >
                Enable AI (Remove VIP)
              </button>
              <button
                onClick={() => handleBatchUpdate({ voiceMode: 'text_only' })}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 font-medium"
              >
                Set Text Only
              </button>
              <button
                onClick={() => setSelectedPhones(new Set())}
                className="text-white/40 hover:text-white px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add Contact Modal / Expanded Form */}
        {isAddingContact && (
          <form onSubmit={handleAddContactSubmit} className="p-4 rounded-xl bg-[#080808] border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-400" />
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                  Add Contact to VIP (AI Never Replies)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingContact(false)}
                className="text-xs text-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1">Saved Name & Honorific Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Monali ma'am or Dr. Sharma"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Phone Number or WhatsApp LID</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1">Voice Delivery</label>
                <select
                  value={newVoiceMode}
                  onChange={(e) => setNewVoiceMode(e.target.value as any)}
                  style={{ backgroundColor: '#18181b', color: '#ffffff' }}
                  className="w-full px-3 py-2 rounded-lg bg-[#18181b] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-white/30 cursor-pointer"
                >
                  <option value="default" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>Adaptive</option>
                  <option value="text_only" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>Text Only (Never Voice Notes)</option>
                  <option value="voice_only" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>Always Voice Notes</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Notes / Relationship (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. Senior Mentor, Key Client"
                  className="w-full px-3 py-2 rounded-lg bg-[#141414] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1 gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-black font-medium text-xs hover:bg-amber-400 transition-all"
              >
                Protect in VIP
              </button>
            </div>
          </form>
        )}

        {/* Directory Table */}
        {loading ? (
          <div className="py-16 text-center text-xs text-white/40 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-white/60" />
            <span>Loading contacts...</span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-white/[0.08] rounded-xl space-y-2">
            <BookUser className="w-8 h-8 mx-auto text-white/20" />
            <p className="text-xs text-white/40">No contacts matching your current filter.</p>
            <p className="text-[11px] text-white/25">
              Click &quot;Sync WhatsApp&quot; above to import contacts from active phone sessions.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/40 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 w-8">
                    <input
                      type="checkbox"
                      checked={selectedPhones.size === filteredContacts.length && filteredContacts.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPhones(new Set(filteredContacts.map((c) => c.phone)));
                        } else {
                          setSelectedPhones(new Set());
                        }
                      }}
                      className="rounded bg-white/[0.06] border-white/[0.1] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Contact Name & Title</th>
                  <th className="py-3 px-3">AI Reply Status</th>
                  <th className="py-3 px-3">Voice Notes</th>
                  <th className="py-3 px-3">Notes</th>
                  <th className="py-3 px-3 text-right">Protection Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredContacts.map((c) => {
                  const isSelected = selectedPhones.has(c.phone);
                  const isEditing = editingPhone === c.phone;
                  const isSaving = savingPhone === c.phone;
                  const justSaved = savedSuccessPhone === c.phone;
                  const displayName = c.name || c.verifiedName || c.notify || (c.realPhone ? `+${c.realPhone}` : c.phone.length <= 12 ? `+${c.phone}` : `Contact`);
                  const isVip = Boolean(c.isVip || c.aiEnabled === false);

                  return (
                    <tr 
                      key={c.phone} 
                      className={`hover:bg-white/[0.02] transition-colors ${
                        isSelected ? 'bg-white/[0.03]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            const copy = new Set(selectedPhones);
                            if (e.target.checked) copy.add(c.phone);
                            else copy.delete(c.phone);
                            setSelectedPhones(copy);
                          }}
                          className="rounded bg-white/[0.06] border-white/[0.1] focus:ring-0 cursor-pointer"
                        />
                      </td>

                      {/* Contact Identity & Inline Name Editor */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/80 shrink-0 uppercase">
                            {displayName.slice(0, 2)}
                          </div>

                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  autoFocus
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveName(c.phone);
                                    if (e.key === 'Escape') setEditingPhone(null);
                                  }}
                                  placeholder="e.g. Monali ma'am"
                                  className="px-2 py-1 rounded bg-[#080808] border border-white/40 text-xs text-white focus:outline-none w-44"
                                />
                                <button
                                  onClick={() => handleSaveName(c.phone)}
                                  className="p-1 rounded bg-white text-black hover:bg-white/90"
                                  title="Save Name"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setEditingPhone(null)}
                                  className="p-1 rounded bg-white/[0.04] text-white/40 hover:text-white"
                                  title="Cancel"
                                >
                                  &times;
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 group/name">
                                <span 
                                  onClick={() => handleStartEditing(c)}
                                  className="font-medium text-white truncate cursor-pointer hover:text-white/80 transition-colors"
                                  title="Click to edit saved name & title"
                                >
                                  {displayName}
                                </span>
                                <button
                                  onClick={() => handleStartEditing(c)}
                                  className="opacity-0 group-hover/name:opacity-100 p-1 text-white/30 hover:text-white transition-opacity"
                                  title="Rename / Set Title"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                {justSaved && (
                                  <span className="text-[10px] text-white/60 font-mono flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Saved
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Phone number or LID display & editor */}
                            <div className="flex items-center gap-2 text-[10px] text-white/40 mt-1">
                              {editingRealPhoneKey === c.phone ? (
                                <div className="flex items-center gap-1">
                                  <span className="text-white/40 text-[10px] font-mono">+</span>
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editingRealPhoneValue}
                                    onChange={(e) => setEditingRealPhoneValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleSaveRealPhone(c.phone);
                                      if (e.key === 'Escape') setEditingRealPhoneKey(null);
                                    }}
                                    placeholder="e.g. 919876543210"
                                    className="px-1.5 py-0.5 rounded bg-[#080808] border border-white/40 text-xs font-mono text-white focus:outline-none w-32"
                                  />
                                  <button
                                    onClick={() => handleSaveRealPhone(c.phone)}
                                    className="p-1 rounded bg-white text-black hover:bg-white/90"
                                    title="Save Phone Number"
                                  >
                                    <Check className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => setEditingRealPhoneKey(null)}
                                    className="p-1 rounded bg-white/[0.04] text-white/40 hover:text-white"
                                    title="Cancel"
                                  >
                                    &times;
                                  </button>
                                </div>
                              ) : c.realPhone ? (
                                <div className="flex items-center gap-1.5">
                                  <span className="text-white/90 font-mono text-[11px] font-medium">
                                    +{c.realPhone}
                                  </span>
                                  <button
                                    onClick={() => handleStartEditingRealPhone(c)}
                                    className="text-white/25 hover:text-white"
                                    title="Edit real phone number"
                                  >
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  {c.phone.length > 12 && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 font-mono" title="WhatsApp LID">
                                      LID: {c.phone.slice(-6)}
                                    </span>
                                  )}
                                </div>
                              ) : c.phone.length <= 12 ? (
                                <span className="font-mono text-white/70 text-[11px]">+{c.phone}</span>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <span className="font-mono text-white/40 text-[10px]">LID: {c.phone}</span>
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-white/[0.04] text-white/30 border border-white/[0.08] font-mono">
                                    LID
                                  </span>
                                  <button
                                    onClick={() => handleStartEditingRealPhone(c)}
                                    className="text-[10px] text-white/60 hover:text-white hover:underline flex items-center gap-0.5"
                                    title="Link actual phone number"
                                  >
                                    <Plus className="w-2.5 h-2.5" /> Link Phone
                                  </button>
                                </div>
                              )}

                              {c.notify && c.notify !== displayName && (
                                <span className="text-white/25">({c.notify})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* VIP Status Badge / One-Click Toggle */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleVip(c)}
                          disabled={isSaving}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                            isVip
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] text-white/70 border-white/[0.08]'
                          }`}
                          title={isVip ? 'Click to remove VIP (Allow AI)' : 'Click to protect in VIP (Mute AI)'}
                        >
                          {isVip ? <Shield className="w-3.5 h-3.5 text-amber-400" /> : <UserCheck className="w-3.5 h-3.5 text-white/40" />}
                          <span>{isVip ? 'VIP (AI Never Replies)' : 'AI Active'}</span>
                        </button>
                      </td>

                      {/* Voice Note Delivery Mode */}
                      <td className="py-3.5 px-3">
                        <select
                          value={c.voiceMode || 'default'}
                          onChange={(e) => handleChangeVoiceMode(c, e.target.value as any)}
                          style={{ backgroundColor: '#18181b', color: '#ffffff' }}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium focus:outline-none transition-all cursor-pointer ${
                            c.voiceMode === 'text_only'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              : c.voiceMode === 'voice_only'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : 'bg-[#18181b] text-white/90 border-white/[0.08]'
                          }`}
                        >
                          <option value="default" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>Adaptive</option>
                          <option value="text_only" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>Text Only (No Voice Notes)</option>
                          <option value="voice_only" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>Always Voice Notes</option>
                        </select>
                      </td>

                      {/* Notes / Relationship */}
                      <td className="py-3.5 px-3 text-white/40 text-xs">
                        {c.notes || '-'}
                      </td>

                      {/* Quick Protection Action */}
                      <td className="py-3.5 px-3 text-right">
                        <button
                          onClick={() => handleToggleVip(c)}
                          className="text-xs text-white/40 hover:text-white px-2 py-1 rounded transition-colors"
                          title={isVip ? 'Remove from VIP' : 'Add to VIP'}
                        >
                          {isVip ? 'Unprotect' : 'Mute in VIP'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Blocklist / Blacklisted Numbers */}
      <section className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-1">
          <UserX className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-white">Blocked Numbers (Blacklist)</h3>
        </div>
        <p className="text-xs text-white/40 mb-3">
          Numbers added here will never receive any automated AI messages or voice notes.
        </p>

        <form onSubmit={handleAddBlockedNumber} className="flex gap-2 mb-3">
          <input
            type="text"
            value={blockInput}
            onChange={(e) => setBlockInput(e.target.value)}
            placeholder="Add phone number to block (e.g. 919876543210)"
            className="flex-1 px-3 py-2 rounded-xl bg-[#141414] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-400"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-all shrink-0"
          >
            Block Number
          </button>
        </form>

        {blockedNumbers.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {blockedNumbers.map((num) => (
              <span
                key={num}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-500/[0.08] border border-red-500/20 text-xs text-red-300"
              >
                <span>+{num}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedNumber(num)}
                  className="hover:text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/30 italic">No numbers currently blocked.</p>
        )}
      </section>
    </div>
  );
}
