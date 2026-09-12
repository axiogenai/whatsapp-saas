'use client';

import { useState, useEffect } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { TenantBotConfig, VipContact, VipRule, AudienceMode, SavedContact } from '@/lib/types';

interface VipAudienceTabProps {
  config: TenantBotConfig;
  onConfigChange: (updates: Partial<TenantBotConfig>) => void;
  onSave: () => void;
  saving: boolean;
  tenantId: string;
}

const ruleDescriptions: Record<VipRule, { label: string; badge: string; color: string; desc: string }> = {
  human_only: {
    label: 'Human Only',
    badge: 'Human Only',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'AI never replies. Bot immediately mutes so you handle them personally.',
  },
  text_only: {
    label: 'Text Only',
    badge: 'Text Only',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'AI replies using text only. Never sends voice notes to this contact.',
  },
  voice_only: {
    label: 'Voice Note Preferred',
    badge: 'Voice Only',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    desc: 'AI always prioritizes sending spoken voice notes to this contact.',
  },
  ai_allowed: {
    label: 'VIP Priority AI',
    badge: 'VIP Priority',
    color: 'bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20',
    desc: 'AI replies with special high-priority greeting and personalization.',
  },
};

export function VipAudienceTab({
  config,
  onConfigChange,
  onSave,
  saving,
  tenantId,
}: VipAudienceTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [syncedContacts, setSyncedContacts] = useState<SavedContact[]>([]);
  const [loadingDirectory, setLoadingDirectory] = useState(false);

  // Add VIP Modal / Form State
  const [isAddingVip, setIsAddingVip] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [newName, setNewName] = useState('');
  const [newRule, setNewRule] = useState<VipRule>('human_only');
  const [newNotes, setNewNotes] = useState('');

  // Blocked Number Input
  const [blockInput, setBlockInput] = useState('');

  const currentAudienceMode = config.audienceMode || 'all';
  const vipContacts = config.vipContacts || [];
  const blockedNumbers = config.blockedNumbers || [];
  const useSavedNames = config.useSavedContactNames ?? true;

  // Load Synced Contacts from Phonebook
  useEffect(() => {
    let isMounted = true;
    async function loadDirectory() {
      setLoadingDirectory(true);
      try {
        const res = await fetch(`/api/whatsapp/contacts/directory?tenantId=${encodeURIComponent(tenantId)}`, {
          headers: { 'x-tenant-id': tenantId },
        });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data.contacts)) {
            setSyncedContacts(data.contacts);
          }
        }
      } catch (err) {
        console.error('Failed to load phonebook directory:', err);
      } finally {
        if (isMounted) setLoadingDirectory(false);
      }
    }
    loadDirectory();
    return () => {
      isMounted = false;
    };
  }, [tenantId]);

  const handleAddVip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim() || !newName.trim()) return;

    const cleanPhone = newPhone.replace(/\D/g, '');
    const filtered = vipContacts.filter((v) => v.phone.replace(/\D/g, '') !== cleanPhone);
    const updated: VipContact[] = [
      ...filtered,
      {
        phone: cleanPhone,
        name: newName.trim(),
        rule: newRule,
        notes: newNotes.trim() || undefined,
        addedAt: Date.now(),
      },
    ];

    onConfigChange({ vipContacts: updated });
    setNewPhone('');
    setNewName('');
    setNewNotes('');
    setNewRule('human_only');
    setIsAddingVip(false);
  };

  const handleRemoveVip = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const updated = vipContacts.filter((v) => v.phone.replace(/\D/g, '') !== cleanPhone);
    onConfigChange({ vipContacts: updated });
  };

  const handleUpdateVipRule = (phone: string, rule: VipRule) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const updated = vipContacts.map((v) => {
      if (v.phone.replace(/\D/g, '') === cleanPhone) {
        return { ...v, rule };
      }
      return v;
    });
    onConfigChange({ vipContacts: updated });
  };

  const handleQuickAddVip = (contact: SavedContact, rule: VipRule = 'human_only') => {
    const cleanPhone = contact.phone.replace(/\D/g, '');
    const filtered = vipContacts.filter((v) => v.phone.replace(/\D/g, '') !== cleanPhone);
    const bestName = contact.name || contact.verifiedName || contact.notify || `+${cleanPhone}`;
    const updated: VipContact[] = [
      ...filtered,
      {
        phone: cleanPhone,
        name: bestName,
        rule,
        addedAt: Date.now(),
      },
    ];
    onConfigChange({ vipContacts: updated });
  };

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

  const filteredVips = vipContacts.filter((v) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return v.name.toLowerCase().includes(q) || v.phone.includes(q) || (v.notes && v.notes.toLowerCase().includes(q));
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6 pb-24 md:pb-6">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366]">
              <Star className="w-5 h-5 fill-[#25D366]" />
            </span>
            <h2 className="text-lg font-semibold text-white tracking-tight">VIP Mode & Audience Control</h2>
          </div>
          <p className="text-xs text-white/40 mt-1 max-w-xl">
            Control exactly who gets AI replies vs. who is reserved for human responses. Ensure AI greets contacts by their exact saved phonebook names.
          </p>
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-medium text-sm transition-all shadow-lg shadow-[#25D366]/10 disabled:opacity-50 shrink-0"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* 1. Audience Mode Selector */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-1">Audience Reply Mode</h3>
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
              AI automatically responds to all incoming messages, except blocked numbers and specific &quot;Human Only&quot; VIPs.
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

      {/* 2. Saved Phonebook Name Personalization */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-[#25D366] mt-0.5">
              <Sparkles className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-white">Phonebook Name Awareness & Spelling</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Automatically address contacts by their exact saved name (e.g. &quot;Monali Ma&apos;am&quot;, &quot;Dr. Sharma&quot;, &quot;Rajesh Uncle&quot;).
              </p>
            </div>
          </div>

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

        {/* Live Preview Box */}
        <div className="mt-4 p-4 rounded-xl bg-[#090909] border border-white/[0.04] flex flex-col gap-2">
          <div className="text-[11px] font-mono text-[#25D366] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
            Live Prompt Simulation
          </div>
          <div className="text-xs text-white/70 space-y-1.5 pl-2 border-l-2 border-[#25D366]/40">
            <p className="text-white/40">
              Sender: <span className="text-white font-medium">Monali Ma&apos;am</span> (+91 98765 43210)
            </p>
            <p className="italic text-[#25D366]/90">
              &quot;Hello Monali Ma&apos;am, this is Aditya from Team Axiogen! I received your message and will be happy to help...&quot;
            </p>
          </div>
          <p className="text-[11px] text-white/30 mt-1">
            Names are automatically synced from your phone&apos;s WhatsApp address book. The AI is strictly instructed to spell and greet using their exact title.
          </p>
        </div>
      </section>

      {/* 3. VIP Contacts List & Rules */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-white">VIP Contacts ({vipContacts.length})</h3>
            <p className="text-xs text-white/40">Configure custom delivery rules per VIP recipient.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search VIPs..."
                className="w-40 sm:w-48 pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
              />
            </div>
            <button
              onClick={() => setIsAddingVip(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-white font-medium transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-[#25D366]" />
              <span>Add VIP</span>
            </button>
          </div>
        </div>

        {/* Add VIP Form Modal / Expanded */}
        {isAddingVip && (
          <form onSubmit={handleAddVip} className="mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">New VIP Contact</h4>
              <button
                type="button"
                onClick={() => setIsAddingVip(false)}
                className="text-xs text-white/40 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1">Contact Name (e.g. Monali Ma&apos;am)</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Monali Ma'am"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Phone Number (with country code)</label>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-white/50 block mb-1">Delivery Rule</label>
                <select
                  value={newRule}
                  onChange={(e) => setNewRule(e.target.value as VipRule)}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white focus:outline-none focus:border-[#25D366]"
                >
                  <option value="human_only">🛡️ Human Only (AI Never Replies)</option>
                  <option value="text_only">💬 Text Only (No Voice Notes)</option>
                  <option value="voice_only">🎤 Voice Only (Always Voice)</option>
                  <option value="ai_allowed">⭐ VIP Priority AI (Greeting Included)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-white/50 block mb-1">Notes / Relationship (Optional)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="E.g. Mentor, Core Enterprise Client"
                  className="w-full px-3 py-2 rounded-lg bg-[#0A0A0A] border border-white/[0.08] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#25D366]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black font-medium text-xs transition-all"
              >
                Save VIP Contact
              </button>
            </div>
          </form>
        )}

        {/* VIP Contacts List */}
        {filteredVips.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-white/[0.08] rounded-xl">
            <Star className="w-6 h-6 mx-auto text-white/20 mb-2" />
            <p className="text-xs text-white/40">No VIP contacts configured yet.</p>
            <p className="text-[11px] text-white/25 mt-0.5">
              Add key clients, partners, or family to specify how AI handles them.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {filteredVips.map((v) => {
              const ruleMeta = ruleDescriptions[v.rule] || ruleDescriptions.human_only;
              return (
                <div key={v.phone} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-xs font-semibold text-white/80">
                      {v.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">{v.name}</span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${ruleMeta.color}`}>
                          {ruleMeta.badge}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/40">
                        <span>+{v.phone}</span>
                        {v.notes && <span>• {v.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center self-end">
                    {/* Quick Rule Switcher */}
                    <select
                      value={v.rule}
                      onChange={(e) => handleUpdateVipRule(v.phone, e.target.value as VipRule)}
                      className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/70 focus:outline-none focus:border-[#25D366]"
                    >
                      <option value="human_only">Human Only</option>
                      <option value="text_only">Text Only</option>
                      <option value="voice_only">Voice Only</option>
                      <option value="ai_allowed">Priority AI</option>
                    </select>

                    <button
                      onClick={() => handleRemoveVip(v.phone)}
                      className="p-1.5 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Remove VIP"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Synced WhatsApp Address Book Quick-Add */}
      <section className="bg-[#0F0F0F] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookUser className="w-4 h-4 text-[#25D366]" />
            <h3 className="text-sm font-semibold text-white">Synced WhatsApp Contacts</h3>
          </div>
          {loadingDirectory && (
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Syncing...
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 mb-3">
          Recently synced contacts from your phonebook. Add them to VIP mode with one click.
        </p>

        {syncedContacts.length === 0 ? (
          <p className="text-xs text-white/30 italic py-2">
            No contacts synced yet. As soon as your WhatsApp is linked, contacts will automatically appear here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {syncedContacts.slice(0, 15).map((sc) => {
              const displayName = sc.name || sc.verifiedName || sc.notify || `+${sc.phone}`;
              const isAlreadyVip = vipContacts.some((v) => v.phone.replace(/\D/g, '') === sc.phone.replace(/\D/g, ''));

              return (
                <div
                  key={sc.phone}
                  className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-between gap-2"
                >
                  <div className="truncate">
                    <p className="text-xs font-medium text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-white/30">+{sc.phone}</p>
                  </div>

                  {isAlreadyVip ? (
                    <span className="text-[10px] text-[#25D366] px-2 py-0.5 rounded bg-[#25D366]/10 font-medium shrink-0">
                      VIP Added
                    </span>
                  ) : (
                    <button
                      onClick={() => handleQuickAddVip(sc, 'human_only')}
                      className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[10px] text-white/70 hover:text-white font-medium transition-all shrink-0 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3 text-[#25D366]" />
                      <span>Add VIP</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
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
    </div>
  );
}
