'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Shield, 
  UserCheck, 
  Users, 
  Volume2, 
  MessageSquare, 
  UserX, 
  Star, 
  Plus, 
  Trash2, 
  Search, 
  Check, 
  Sparkles, 
  PhoneCall, 
  Save, 
  Loader2, 
  BookUser,
  AlertCircle,
  RefreshCw,
  Edit2,
  Mic,
  MicOff,
  Sliders,
  CheckCheck
} from 'lucide-react';
import { TenantBotConfig, VipContact, VipRule, AudienceMode, SavedContact } from '@/lib/types';

interface VipAudienceTabProps {
  config: TenantBotConfig;
  onConfigChange: (updates: Partial<TenantBotConfig>) => void;
  onSave: () => void;
  saving: boolean;
  tenantId: string;
}

type FilterTab = 'all' | 'ai_active' | 'human_only' | 'text_only' | 'vips';

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

  // Greeting preview modal
  const [previewContact, setPreviewContact] = useState<SavedContact | null>(null);

  // Manual Add Modal
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [newAiEnabled, setNewAiEnabled] = useState(true);
  const [newVoiceMode, setNewVoiceMode] = useState<'default' | 'text_only' | 'voice_only'>('default');
  const [newIsVip, setNewIsVip] = useState(false);
  const [newNotes, setNewNotes] = useState('');

  // Blocked Number Input
  const [blockInput, setBlockInput] = useState('');

  const currentAudienceMode = config.audienceMode || 'all';
  const blockedNumbers = config.blockedNumbers || [];
  const useSavedNames = config.useSavedContactNames ?? true;
  const ownerName = config.ownerName || 'Aditya';
  const businessName = config.businessName || 'Team Axiogen';

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

  // Toggle AI Active vs Human Only
  const handleToggleAi = (contact: SavedContact) => {
    const nextAi = contact.aiEnabled === false ? true : false;
    handleUpdateContact(contact.phone, { aiEnabled: nextAi });
  };

  // Change Voice Delivery Mode
  const handleChangeVoiceMode = (contact: SavedContact, voiceMode: 'default' | 'text_only' | 'voice_only') => {
    handleUpdateContact(contact.phone, { voiceMode });
  };

  // Toggle VIP
  const handleToggleVip = (contact: SavedContact) => {
    handleUpdateContact(contact.phone, { isVip: !contact.isVip });
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

  // Add Contact Form Submit
  const handleAddContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = newPhone.replace(/\D/g, '');
    if (!cleanPhone || !newName.trim()) return;

    await handleUpdateContact(cleanPhone, {
      name: newName.trim(),
      aiEnabled: newAiEnabled,
      voiceMode: newVoiceMode,
      isVip: newIsVip,
      notes: newNotes.trim() || undefined,
    });

    setIsAddingContact(false);
    setNewPhone('');
    setNewName('');
    setNewNotes('');
    setNewAiEnabled(true);
    setNewVoiceMode('default');
    setNewIsVip(false);
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
        const matchesNotes = c.notes?.toLowerCase().includes(q);
        if (!matchesName && !matchesNotify && !matchesPhone && !matchesNotes) return false;
      }

      // 2. Tab filter
      if (activeFilter === 'ai_active') return c.aiEnabled !== false;
      if (activeFilter === 'human_only') return c.aiEnabled === false;
      if (activeFilter === 'text_only') return c.voiceMode === 'text_only';
      if (activeFilter === 'vips') return Boolean(c.isVip);

      return true;
    });
  }, [contacts, searchQuery, activeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = contacts.length;
    const aiActive = contacts.filter((c) => c.aiEnabled !== false).length;
    const humanOnly = contacts.filter((c) => c.aiEnabled === false).length;
    const textOnly = contacts.filter((c) => c.voiceMode === 'text_only').length;
    const vips = contacts.filter((c) => c.isVip).length;
    return { total, aiActive, humanOnly, textOnly, vips };
  }, [contacts]);

  // Format Dynamic Greeting for simulation
  const getGreetingPreview = (contactName: string) => {
    return `Hello ${contactName}, this is ${ownerName} from ${businessName}! How can I help you today?`;
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 pb-28 md:pb-8">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366]">
              <BookUser className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-semibold text-white tracking-tight">
              WhatsApp Contacts Directory & AI Control Center
            </h2>
          </div>
          <p className="text-xs text-white/40 mt-1 max-w-2xl leading-relaxed">
            All WhatsApp contacts and conversations are automatically imported here. Control who receives AI replies, who receives voice notes, and personalize their exact saved name and honorific title.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => loadDirectory(true)}
            disabled={syncing || loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-white transition-all disabled:opacity-50"
            title="Scan WhatsApp sessions and sync contacts"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#25D366] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync WhatsApp'}</span>
          </button>

          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-medium text-xs transition-all shadow-lg shadow-[#25D366]/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </div>

      {/* 1. Metric Counter Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div 
          onClick={() => setActiveFilter('all')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'all' 
              ? 'bg-[#25D366]/[0.08] border-[#25D366]' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="text-[11px] font-medium text-white/40 uppercase tracking-wider">All Contacts</div>
          <div className="text-2xl font-bold font-mono text-white mt-0.5">{stats.total}</div>
          <div className="text-[10px] text-white/30 mt-0.5">Synced phonebook</div>
        </div>

        <div 
          onClick={() => setActiveFilter('ai_active')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'ai_active' 
              ? 'bg-emerald-500/[0.12] border-emerald-500' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="text-[11px] font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            AI Active
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-300 mt-0.5">{stats.aiActive}</div>
          <div className="text-[10px] text-emerald-400/50 mt-0.5">Automated replies</div>
        </div>

        <div 
          onClick={() => setActiveFilter('human_only')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'human_only' 
              ? 'bg-amber-500/[0.12] border-amber-500' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="text-[11px] font-medium text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Human Only
          </div>
          <div className="text-2xl font-bold font-mono text-amber-300 mt-0.5">{stats.humanOnly}</div>
          <div className="text-[10px] text-amber-400/50 mt-0.5">AI muted for you</div>
        </div>

        <div 
          onClick={() => setActiveFilter('text_only')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'text_only' 
              ? 'bg-blue-500/[0.12] border-blue-500' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="text-[11px] font-medium text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Text Only
          </div>
          <div className="text-2xl font-bold font-mono text-blue-300 mt-0.5">{stats.textOnly}</div>
          <div className="text-[10px] text-blue-400/50 mt-0.5">No voice notes</div>
        </div>

        <div 
          onClick={() => setActiveFilter('vips')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            activeFilter === 'vips' 
              ? 'bg-purple-500/[0.12] border-purple-500' 
              : 'bg-[#0F0F0F] border-white/[0.06] hover:border-white/[0.12]'
          }`}
        >
          <div className="text-[11px] font-medium text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3 h-3 fill-purple-400" />
            VIP Contacts
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300 mt-0.5">{stats.vips}</div>
          <div className="text-[10px] text-purple-400/50 mt-0.5">High priority</div>
        </div>
      </div>

      {/* 2. Phonebook Name Personalization & Honorific Mandate Banner */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-[#25D366] mt-0.5">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">
                Phonebook Title & Dynamic Greeting Mandate
              </h3>
              <p className="text-xs text-white/40 mt-0.5 leading-relaxed">
                When active, the AI assistant will strictly address contacts using their exact saved name and honorific title (e.g. &quot;Monali ma&apos;am&quot;, &quot;Dr. Sharma&quot;, &quot;Rajesh Bhai&quot;).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-white/60 font-medium">
              {useSavedNames ? 'Strict Title Mandate ON' : 'Generic Greeting'}
            </span>
            <button
              onClick={() => onConfigChange({ useSavedContactNames: !useSavedNames })}
              className={`relative w-12 h-7 rounded-full transition-colors flex items-center px-1 shrink-0 ${
                useSavedNames ? 'bg-[#25D366]' : 'bg-white/[0.08]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                  useSavedNames ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Dynamic Greeting Simulation Box */}
        <div className="mt-4 p-4 rounded-xl bg-[#080808] border border-white/[0.04] flex flex-col gap-2">
          <div className="text-[11px] font-mono text-[#25D366] uppercase tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
              Exact Title & Greeting Prompt Output
            </span>
            <span className="text-white/30 text-[10px] lowercase">sender: {ownerName} • team: {businessName}</span>
          </div>

          <div className="text-xs text-white/80 space-y-1.5 pl-3 border-l-2 border-[#25D366]/40 py-0.5">
            <p className="text-white/40 text-[11px]">
              Recipient: <span className="text-white font-medium">Monali ma&apos;am</span> (+91 98765 43210)
            </p>
            <p className="italic text-[#25D366] font-mono text-[12px]">
              &quot;{getGreetingPreview("Monali ma'am")}&quot;
            </p>
          </div>

          <p className="text-[11px] text-white/30 mt-0.5">
            Zero misspelling. The AI model is strictly instructed to preserve all titles (&quot;ma&apos;am&quot;, &quot;sir&quot;, &quot;dr&quot;, &quot;ji&quot;) with no alteration.
          </p>
        </div>
      </section>

      {/* 3. Main Contact Directory & AI Controls Table */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        {/* Search, Filter Tabs & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by saved name, title, phone, or notes..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-white/[0.02] p-1 rounded-xl border border-white/[0.06] text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'all' ? 'bg-white/[0.08] text-white font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                All ({stats.total})
              </button>
              <button
                onClick={() => setActiveFilter('ai_active')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'ai_active' ? 'bg-emerald-500/20 text-emerald-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                AI Active ({stats.aiActive})
              </button>
              <button
                onClick={() => setActiveFilter('human_only')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'human_only' ? 'bg-amber-500/20 text-amber-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                Human Only ({stats.humanOnly})
              </button>
              <button
                onClick={() => setActiveFilter('text_only')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'text_only' ? 'bg-blue-500/20 text-blue-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                Text Only ({stats.textOnly})
              </button>
              <button
                onClick={() => setActiveFilter('vips')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'vips' ? 'bg-purple-500/20 text-purple-400 font-medium' : 'text-white/40 hover:text-white'
                }`}
              >
                VIPs ({stats.vips})
              </button>
            </div>

            {/* Add Contact Button */}
            <button
              onClick={() => setIsAddingContact(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-white font-medium transition-all shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Add Number</span>
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
                onClick={() => handleBatchUpdate({ aiEnabled: false })}
                className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 font-medium"
              >
                Mute AI (Human Only)
              </button>
              <button
                onClick={() => handleBatchUpdate({ aiEnabled: true })}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 font-medium"
              >
                Enable AI
              </button>
              <button
                onClick={() => handleBatchUpdate({ voiceMode: 'text_only' })}
                className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/20 font-medium"
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
          <form onSubmit={handleAddContactSubmit} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Add / Override Contact Control</h4>
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
                <label className="text-[11px] text-white/50 block mb-1">Exact Saved Name & Title</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Monali ma'am or Dr. Monaalii"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Phone Number or LID (with country code)</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="919876543210"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1">AI Messages</label>
                <select
                  value={newAiEnabled ? 'yes' : 'no'}
                  onChange={(e) => setNewAiEnabled(e.target.value === 'yes')}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#25D366]"
                >
                  <option value="yes">🟢 AI Active (Auto-Reply)</option>
                  <option value="no">🔴 Human Only (AI Muted)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Voice Notes</label>
                <select
                  value={newVoiceMode}
                  onChange={(e) => setNewVoiceMode(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#25D366]"
                >
                  <option value="default">⚡ Adaptive (Replies voice if they speak)</option>
                  <option value="text_only">💬 Text Only (Never Voice Notes)</option>
                  <option value="voice_only">🎤 Always Voice Notes</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Relationship / Notes</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="e.g. VIP Client, Mentor"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black font-medium text-xs transition-all"
              >
                Save Contact
              </button>
            </div>
          </form>
        )}

        {/* Directory Table */}
        {loading ? (
          <div className="py-16 text-center text-xs text-white/40 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#25D366]" />
            <span>Loading contacts from WhatsApp...</span>
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
                <tr className="border-b border-white/[0.06] text-white/40 uppercase tracking-wider text-[10px]">
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
                      className="rounded bg-white/[0.06] border-white/[0.1] text-[#25D366] focus:ring-0 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Contact Name & Title</th>
                  <th className="py-3 px-3">AI Auto-Reply</th>
                  <th className="py-3 px-3">Voice Notes</th>
                  <th className="py-3 px-3">VIP Priority</th>
                  <th className="py-3 px-3">AI Greeting Preview</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredContacts.map((c) => {
                  const isSelected = selectedPhones.has(c.phone);
                  const isEditing = editingPhone === c.phone;
                  const isSaving = savingPhone === c.phone;
                  const justSaved = savedSuccessPhone === c.phone;
                  const displayName = c.name || c.verifiedName || c.notify || `+${c.phone}`;
                  const isAiActive = c.aiEnabled !== false;

                  return (
                    <tr 
                      key={c.phone} 
                      className={`hover:bg-white/[0.02] transition-colors group ${
                        isSelected ? 'bg-[#25D366]/[0.02]' : ''
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
                          className="rounded bg-white/[0.06] border-white/[0.1] text-[#25D366] focus:ring-0 cursor-pointer"
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
                                  className="px-2 py-1 rounded bg-[#080808] border border-[#25D366] text-xs text-white focus:outline-none w-44"
                                />
                                <button
                                  onClick={() => handleSaveName(c.phone)}
                                  className="p-1 rounded bg-[#25D366] text-black hover:bg-[#20bd5a]"
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
                                  className="font-medium text-white truncate cursor-pointer hover:text-[#25D366] transition-colors"
                                  title="Click to edit name & title"
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
                                  <span className="text-[10px] text-[#25D366] font-mono flex items-center gap-0.5">
                                    <Check className="w-3 h-3" /> Saved
                                  </span>
                                )}
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-[10px] text-white/40 mt-0.5">
                              <span>+{c.phone}</span>
                              {c.notify && c.notify !== displayName && (
                                <span className="text-white/25">({c.notify})</span>
                              )}
                              {c.notes && (
                                <span className="text-white/50 bg-white/[0.04] px-1.5 py-0.2 rounded">
                                  {c.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Message Toggle (Select who NOT to send AI messages) */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleAi(c)}
                          disabled={isSaving}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                            isAiActive
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                              : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]'
                          }`}
                          title={isAiActive ? 'Click to MUTE AI (Human Only)' : 'Click to ACTIVATE AI'}
                        >
                          <span className={`w-2 h-2 rounded-full ${isAiActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                          <span>{isAiActive ? 'AI Active' : 'Human Only (Muted)'}</span>
                        </button>
                      </td>

                      {/* Voice Note Delivery Mode (Select who NOT to send voice notes) */}
                      <td className="py-3.5 px-3">
                        <select
                          value={c.voiceMode || 'default'}
                          onChange={(e) => handleChangeVoiceMode(c, e.target.value as any)}
                          className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium focus:outline-none transition-all ${
                            c.voiceMode === 'text_only'
                              ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                              : c.voiceMode === 'voice_only'
                              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                              : 'bg-white/[0.04] text-white/70 border-white/[0.08]'
                          }`}
                        >
                          <option value="default">⚡ Adaptive (Speech when spoken)</option>
                          <option value="text_only">💬 Text Only (No Voice Notes)</option>
                          <option value="voice_only">🎤 Always Voice Notes</option>
                        </select>
                      </td>

                      {/* VIP Priority Toggle */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => handleToggleVip(c)}
                          className={`p-1.5 rounded-lg border transition-all ${
                            c.isVip
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : 'bg-white/[0.02] text-white/30 border-white/[0.06] hover:text-white'
                          }`}
                          title={c.isVip ? 'Remove VIP Status' : 'Mark as VIP'}
                        >
                          <Star className={`w-4 h-4 ${c.isVip ? 'fill-purple-400 text-purple-400' : ''}`} />
                        </button>
                      </td>

                      {/* Live Greeting Preview */}
                      <td className="py-3.5 px-3">
                        <button
                          onClick={() => setPreviewContact(c)}
                          className="flex items-center gap-1.5 text-[11px] text-[#25D366] hover:underline"
                          title="Preview dynamic greeting"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Preview Greeting</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleToggleAi(c)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.04] transition-colors"
                            title={isAiActive ? 'Mute AI' : 'Enable AI'}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 4. Audience Reply Mode Cards */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Global Audience Scope</h3>
        <p className="text-xs text-white/40 mb-4">Choose the general scope of who the AI assistant is authorized to message.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Mode 1: All */}
          <div
            onClick={() => onConfigChange({ audienceMode: 'all' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentAudienceMode === 'all'
                ? 'bg-[#25D366]/[0.08] border-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.1)]'
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-white/[0.04] text-white/80">
                <Users className="w-4 h-4" />
              </span>
              {currentAudienceMode === 'all' && (
                <span className="text-[11px] font-medium text-[#25D366] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-medium text-white">All Contacts</h4>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              AI automatically responds to all incoming messages, except contacts marked &quot;Human Only&quot; or numbers in the blocklist.
            </p>
          </div>

          {/* Mode 2: Exclude VIPs */}
          <div
            onClick={() => onConfigChange({ audienceMode: 'exclude_vip' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentAudienceMode === 'exclude_vip'
                ? 'bg-[#25D366]/[0.08] border-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.1)]'
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Shield className="w-4 h-4" />
              </span>
              {currentAudienceMode === 'exclude_vip' && (
                <span className="text-[11px] font-medium text-[#25D366] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-medium text-white">Exclude VIPs (Human First)</h4>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              AI handles new inquiries and public leads, but leaves all VIP contacts muted so you personally answer important clients.
            </p>
          </div>

          {/* Mode 3: Whitelist Only */}
          <div
            onClick={() => onConfigChange({ audienceMode: 'whitelist_only' })}
            className={`p-4 rounded-xl border cursor-pointer transition-all ${
              currentAudienceMode === 'whitelist_only'
                ? 'bg-[#25D366]/[0.08] border-[#25D366] shadow-[0_0_20px_rgba(37,211,102,0.1)]'
                : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <UserCheck className="w-4 h-4" />
              </span>
              {currentAudienceMode === 'whitelist_only' && (
                <span className="text-[11px] font-medium text-[#25D366] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active
                </span>
              )}
            </div>
            <h4 className="text-sm font-medium text-white">Whitelist & VIP Only</h4>
            <p className="text-xs text-white/40 mt-1 leading-relaxed">
              Strict privacy mode. AI only responds to your approved VIP or Whitelisted contacts; completely ignores unlisted numbers.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Blocklist / Blacklisted Numbers */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
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
            className="flex-1 px-3 py-2 rounded-xl bg-[#0A0A0A] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-400"
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

      {/* Greeting Preview Modal / Popover */}
      {previewContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F0F0F] border border-white/[0.08] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#25D366]">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-sm font-semibold text-white">Dynamic AI Greeting Simulation</h3>
              </div>
              <button
                onClick={() => setPreviewContact(null)}
                className="text-white/40 hover:text-white text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#080808] border border-white/[0.04] space-y-2">
                <div className="flex justify-between text-xs text-white/40">
                  <span>Saved Name & Title:</span>
                  <span className="text-white font-medium">
                    {previewContact.name || previewContact.verifiedName || previewContact.notify || `+${previewContact.phone}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>AI Message Status:</span>
                  <span className={previewContact.aiEnabled !== false ? 'text-emerald-400' : 'text-amber-400'}>
                    {previewContact.aiEnabled !== false ? '🟢 AI Active' : '🔴 Human Only (AI Muted)'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-white/40">
                  <span>Voice Delivery:</span>
                  <span className="text-white">
                    {previewContact.voiceMode === 'text_only'
                      ? '💬 Text Only'
                      : previewContact.voiceMode === 'voice_only'
                      ? '🎤 Always Voice'
                      : '⚡ Adaptive'}
                  </span>
                </div>
              </div>

              {/* Dynamic Speech / Message Bubble */}
              <div className="p-4 rounded-xl bg-[#005c4b]/20 border border-[#25D366]/20 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#25D366] flex items-center justify-between">
                  <span>Exact Opening Greeting</span>
                  <span>WhatsApp Message Preview</span>
                </div>
                <p className="text-sm text-[#e9edef] font-normal leading-relaxed italic">
                  &quot;{getGreetingPreview(previewContact.name || previewContact.verifiedName || previewContact.notify || `+${previewContact.phone}`)}&quot;
                </p>
              </div>

              <p className="text-[11px] text-white/40 leading-relaxed">
                When this contact messages you, the Groq AI brain will dynamically greet them with their exact saved name and title, without altering or dropping their honorifics (&quot;ma&apos;am&quot;, &quot;sir&quot;, &quot;dr&quot;, etc.).
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviewContact(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-medium text-white transition-all"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
