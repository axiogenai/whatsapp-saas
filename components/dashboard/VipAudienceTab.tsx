'use client';

import { useState, useMemo } from 'react';
import { 
  Shield, 
  Plus, 
  Trash2, 
  UserX, 
  Save, 
  Loader2, 
  Phone, 
  User, 
  FileText, 
  Search,
  Check,
  UserCheck
} from 'lucide-react';
import { TenantBotConfig, VipContact, SavedContact } from '@/lib/types';

interface VipAudienceTabProps {
  config: TenantBotConfig;
  onConfigChange: (updates: Partial<TenantBotConfig>) => void;
  onSave: () => void;
  saving: boolean;
  tenantId: string;
}

export function VipAudienceTab({
  config,
  onConfigChange,
  onSave,
  saving,
  tenantId,
}: VipAudienceTabProps) {
  // Input form state
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Bulk paste state
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState('');

  // Blocked number input
  const [blockInput, setBlockInput] = useState('');

  // Active VIP list from config
  const vipList: VipContact[] = useMemo(() => {
    return config.vipContacts || [];
  }, [config.vipContacts]);

  // Blocked numbers list
  const blockedList: string[] = useMemo(() => {
    return config.blockedNumbers || [];
  }, [config.blockedNumbers]);

  // Normalize phone digits
  const cleanDigits = (val: string) => val.replace(/\D/g, '');

  // Add single VIP number
  const handleAddVip = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    const digits = cleanDigits(phoneInput);
    if (!digits || digits.length < 7) {
      setFormError('Please enter a valid phone number (at least 7 digits)');
      return;
    }

    // Check if already in VIP
    const exists = vipList.some((v) => cleanDigits(v.phone) === digits);
    if (exists) {
      setFormError('This phone number is already protected in VIP list');
      return;
    }

    const newVip: VipContact = {
      phone: digits,
      name: nameInput.trim() || `+${digits}`,
      rule: 'human_only', // VIP is always 100% human-only! AI never replies.
      notes: notesInput.trim() || undefined,
      addedAt: Date.now(),
    };

    const updated = [newVip, ...vipList];
    onConfigChange({ vipContacts: updated });

    // Clear form
    setPhoneInput('');
    setNameInput('');
    setNotesInput('');
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);

    // Also sync with server contact store
    fetch(`/api/whatsapp/contacts/control?tenantId=${encodeURIComponent(tenantId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: digits,
        name: newVip.name,
        isVip: true,
        aiEnabled: false,
        notes: newVip.notes,
      }),
    }).catch(() => {});
  };

  // Remove single VIP number
  const handleRemoveVip = (phoneToRemove: string) => {
    const digits = cleanDigits(phoneToRemove);
    const updated = vipList.filter((v) => cleanDigits(v.phone) !== digits);
    onConfigChange({ vipContacts: updated });

    // Also sync with server
    fetch(`/api/whatsapp/contacts/control?tenantId=${encodeURIComponent(tenantId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: digits,
        isVip: false,
        aiEnabled: true,
      }),
    }).catch(() => {});
  };

  // Bulk add multiple numbers
  const handleBulkAdd = () => {
    if (!bulkInput.trim()) return;

    const rawEntries = bulkInput.split(/[\n,;]+/);
    const newItems: VipContact[] = [];
    const currentPhones = new Set(vipList.map((v) => cleanDigits(v.phone)));

    for (const entry of rawEntries) {
      const digits = cleanDigits(entry);
      if (digits && digits.length >= 7 && !currentPhones.has(digits)) {
        currentPhones.add(digits);
        newItems.push({
          phone: digits,
          name: `+${digits}`,
          rule: 'human_only',
          addedAt: Date.now(),
        });
      }
    }

    if (newItems.length > 0) {
      onConfigChange({ vipContacts: [...newItems, ...vipList] });
      setBulkInput('');
      setIsBulkOpen(false);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2500);
    }
  };

  // Add blocked number
  const handleAddBlocked = () => {
    const digits = cleanDigits(blockInput);
    if (!digits || digits.length < 7) return;

    if (!blockedList.includes(digits)) {
      onConfigChange({ blockedNumbers: [...blockedList, digits] });
    }
    setBlockInput('');
  };

  // Remove blocked number
  const handleRemoveBlocked = (phone: string) => {
    onConfigChange({
      blockedNumbers: blockedList.filter((b) => cleanDigits(b) !== cleanDigits(phone)),
    });
  };

  // Filter VIP list by search query
  const filteredVips = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return vipList;
    return vipList.filter((v) => {
      return (
        v.name.toLowerCase().includes(q) ||
        v.phone.includes(q) ||
        (v.notes && v.notes.toLowerCase().includes(q))
      );
    });
  }, [vipList, searchQuery]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a0a0c] border border-white/[0.08] p-5 rounded-2xl">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-white tracking-wide">
                VIP Protection &amp; Muted Numbers
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-medium">
                {vipList.length} Protected
              </span>
            </div>
            <p className="text-xs text-white/50 mt-1 max-w-xl leading-relaxed">
              Enter phone numbers that the AI must <strong className="text-amber-300 font-semibold">NEVER</strong> message or reply to. When these numbers text you, AI is completely silenced.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-black font-semibold text-xs transition-all shadow-md shadow-[#25D366]/20 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Add VIP Form Card (Clean, Simple, Direct) */}
      <div className="bg-[#0f0f12] border border-white/[0.08] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Add Protected Number</h3>
          </div>
          <button
            type="button"
            onClick={() => setIsBulkOpen(!isBulkOpen)}
            className="text-xs text-amber-400/80 hover:text-amber-300 transition-colors"
          >
            {isBulkOpen ? '← Single Number Entry' : '+ Bulk Paste Numbers'}
          </button>
        </div>

        {!isBulkOpen ? (
          <form onSubmit={handleAddVip} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Phone Number */}
              <div>
                <label className="block text-[11px] font-medium text-white/60 mb-1">
                  Phone Number <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full h-10 bg-[#070709] border border-white/[0.08] focus:border-amber-500/60 rounded-xl pl-9 pr-3 text-xs text-white placeholder-white/25 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Name / Title */}
              <div>
                <label className="block text-[11px] font-medium text-white/60 mb-1">
                  Contact Name / Title
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Monali Ma'am, Client X"
                    className="w-full h-10 bg-[#070709] border border-white/[0.08] focus:border-amber-500/60 rounded-xl pl-9 pr-3 text-xs text-white placeholder-white/25 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] font-medium text-white/60 mb-1">
                  Relationship / Notes (Optional)
                </label>
                <div className="relative">
                  <FileText className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    placeholder="e.g. Senior Mentor, Family"
                    className="w-full h-10 bg-[#070709] border border-white/[0.08] focus:border-amber-500/60 rounded-xl pl-9 pr-3 text-xs text-white placeholder-white/25 outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {formError && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                {formError}
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-white/40">
                AI will never contact or auto-reply to this number.
              </span>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Added to VIP!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add to VIP Protection</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Bulk Paste Mode */
          <div className="space-y-3">
            <textarea
              rows={3}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder="Paste numbers separated by commas or newlines:&#10;919876543210, 919822334455, 919811223344"
              className="w-full bg-[#070709] border border-white/[0.08] focus:border-amber-500/60 rounded-xl p-3 text-xs text-white placeholder-white/25 outline-none transition-colors font-mono"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsBulkOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-white/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkAdd}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs transition-colors"
              >
                Add All Numbers to VIP
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Protected Numbers List Card */}
      <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              Protected VIP Numbers ({filteredVips.length})
            </h3>
            <span className="text-[11px] text-white/40">
              (AI is strictly silenced for these people)
            </span>
          </div>

          {vipList.length > 3 && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search VIPs by name or number..."
                className="w-full h-8 bg-[#141416] border border-white/[0.08] focus:border-amber-500/50 rounded-lg pl-8 pr-3 text-xs text-white placeholder-white/30 outline-none transition-colors"
              />
            </div>
          )}
        </div>

        {filteredVips.length === 0 ? (
          <div className="py-12 text-center">
            <Shield className="w-8 h-8 text-amber-400/30 mx-auto mb-2" />
            <div className="text-xs font-medium text-white/60">No VIP numbers added yet</div>
            <p className="text-[11px] text-white/35 mt-1 max-w-sm mx-auto">
              Enter a phone number above (like your mentor, key client, or family) to ensure the AI never replies to them.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04] mt-2">
            {filteredVips.map((vip) => {
              const initials = vip.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2) || 'VIP';

              return (
                <div
                  key={vip.phone}
                  className="flex items-center justify-between py-3 px-2 hover:bg-white/[0.02] rounded-xl transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center font-semibold text-xs text-amber-400 shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs text-white tracking-wide">
                          {vip.name}
                        </span>
                        <span className="text-[11px] font-mono text-white/50">
                          +{vip.phone}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono">
                          AI Never Replies
                        </span>
                      </div>
                      {vip.notes && (
                        <div className="text-[11px] text-white/40 truncate mt-0.5">
                          {vip.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVip(vip.phone)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/15 border border-white/[0.06] hover:border-red-500/30 text-white/50 hover:text-red-300 text-xs transition-colors shrink-0"
                    title="Remove from VIP Protection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Unprotect</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Blocked / Blacklisted Numbers Section (Spam / Dropped) */}
      <div className="bg-[#0a0a0c] border border-white/[0.08] rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <UserX className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-white">Blocked Numbers (Spam Drop)</h3>
        </div>
        <p className="text-xs text-white/40 mb-3">
          Messages from these numbers are completely ignored and dropped without processing.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="tel"
            value={blockInput}
            onChange={(e) => setBlockInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddBlocked();
              }
            }}
            placeholder="Enter number to block (e.g. 919812345678)"
            className="flex-1 h-9 bg-[#070709] border border-white/[0.08] focus:border-red-500/50 rounded-xl px-3 text-xs text-white placeholder-white/25 outline-none transition-colors"
          />
          <button
            type="button"
            onClick={handleAddBlocked}
            className="px-4 h-9 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-xl text-red-300 text-xs font-medium transition-colors"
          >
            Block Number
          </button>
        </div>

        {blockedList.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/[0.04]">
            {blockedList.map((num) => (
              <div
                key={num}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/70"
              >
                <span className="font-mono">+{num}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveBlocked(num)}
                  className="text-white/30 hover:text-red-400 p-0.5 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
