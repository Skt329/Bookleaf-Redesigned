'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { SectionWrapper } from '@/components/shared';
import { User, Mail, Phone, MapPin, Pen, FileText, Lock, Save, CheckCircle2 } from 'lucide-react';

/* -----------------------------------------------------------------------
   Types
   ----------------------------------------------------------------------- */

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
  penName: string;
  authorBio: string;
}

/* -----------------------------------------------------------------------
   Component
   ----------------------------------------------------------------------- */

export default function ProfileClient({ initial }: { initial: ProfileData }) {
  const [personal, setPersonal] = useState({
    name: initial.name || '',
    phone: initial.phone || '',
    city: initial.city || '',
  });
  const [authorInfo, setAuthorInfo] = useState({
    penName: initial.penName || '',
    authorBio: initial.authorBio || '',
  });
  const [passwords, setPasswords] = useState({
    current: '',
    newPassword: '',
    confirm: '',
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSave(section: string) {
    setSaving(section);
    setSuccess(null);

    try {
      let body: Record<string, unknown> = {};
      if (section === 'personal') body = personal;
      if (section === 'author') body = authorInfo;
      if (section === 'password') {
        if (passwords.newPassword !== passwords.confirm) {
          alert('Passwords do not match');
          setSaving(null);
          return;
        }
        body = { currentPassword: passwords.current, newPassword: passwords.newPassword };
      }

      const res = await fetch('/api/author/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section, ...body }),
      });

      if (res.ok) {
        setSuccess(section);
        if (section === 'password') {
          setPasswords({ current: '', newPassword: '', confirm: '' });
        }
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch {
      // handle error
    } finally {
      setSaving(null);
    }
  }

  const inputClasses =
    'w-full rounded-lg border border-border bg-surface-background px-4 py-2.5 text-body-md text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-colors font-body';

  return (
    <div className="space-y-8">
      {/* Personal Info */}
      <SectionWrapper>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-heading-sm text-text-primary flex items-center gap-2">
              <User className="size-5 text-brand-accent" />
              Personal Information
            </h2>
            {success === 'personal' && (
              <span className="flex items-center gap-1 text-status-success text-body-sm">
                <CheckCircle2 className="size-4" /> Saved
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">
                <User className="inline size-3.5 mr-1" /> Full Name
              </label>
              <input
                type="text"
                value={personal.name}
                onChange={(e) => setPersonal((p) => ({ ...p, name: e.target.value }))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">
                <Mail className="inline size-3.5 mr-1" /> Email
              </label>
              <input type="email" value={initial.email} disabled className={cn(inputClasses, 'opacity-60 cursor-not-allowed')} />
              <p className="text-caption text-text-muted mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">
                <Phone className="inline size-3.5 mr-1" /> Phone
              </label>
              <input
                type="tel"
                value={personal.phone}
                onChange={(e) => setPersonal((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210"
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">
                <MapPin className="inline size-3.5 mr-1" /> City
              </label>
              <input
                type="text"
                value={personal.city}
                onChange={(e) => setPersonal((p) => ({ ...p, city: e.target.value }))}
                placeholder="Mumbai"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave('personal')}
              disabled={saving === 'personal'}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 bg-brand-primary text-text-inverse font-body font-semibold text-body-sm hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving === 'personal' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* Author Info */}
      <SectionWrapper delay={0.1}>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-heading-sm text-text-primary flex items-center gap-2">
              <Pen className="size-5 text-brand-accent" />
              Author Information
            </h2>
            {success === 'author' && (
              <span className="flex items-center gap-1 text-status-success text-body-sm">
                <CheckCircle2 className="size-4" /> Saved
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">Pen Name</label>
              <input
                type="text"
                value={authorInfo.penName}
                onChange={(e) => setAuthorInfo((p) => ({ ...p, penName: e.target.value }))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">
                <FileText className="inline size-3.5 mr-1" /> Bio
              </label>
              <textarea
                value={authorInfo.authorBio}
                onChange={(e) => setAuthorInfo((p) => ({ ...p, authorBio: e.target.value }))}
                rows={4}
                placeholder="Tell readers about yourself..."
                className={cn(inputClasses, 'resize-none')}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave('author')}
              disabled={saving === 'author'}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 bg-brand-primary text-text-inverse font-body font-semibold text-body-sm hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
            >
              <Save className="size-4" />
              {saving === 'author' ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* Password */}
      <SectionWrapper delay={0.2}>
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-heading-sm text-text-primary flex items-center gap-2">
              <Lock className="size-5 text-brand-accent" />
              Change Password
            </h2>
            {success === 'password' && (
              <span className="flex items-center gap-1 text-status-success text-body-sm">
                <CheckCircle2 className="size-4" /> Updated
              </span>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">Current Password</label>
              <input
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">New Password</label>
              <input
                type="password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                className={inputClasses}
              />
            </div>
            <div>
              <label className="block text-body-sm font-medium text-text-secondary mb-1">Confirm Password</label>
              <input
                type="password"
                value={passwords.confirm}
                onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => handleSave('password')}
              disabled={saving === 'password' || !passwords.current || !passwords.newPassword}
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 bg-brand-primary text-text-inverse font-body font-semibold text-body-sm hover:bg-brand-primary-hover transition-colors disabled:opacity-50"
            >
              <Lock className="size-4" />
              {saving === 'password' ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
