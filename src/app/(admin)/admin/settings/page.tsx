import type { Metadata } from 'next';
import { Settings } from 'lucide-react';

export const metadata: Metadata = { title: 'Settings — BookLeaf Admin' };

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">Settings</h1>
        <p className="mt-1 text-body-md text-text-secondary">Platform configuration and preferences</p>
      </div>
      <div className="card p-10 text-center">
        <Settings className="size-12 text-text-muted mx-auto mb-4" />
        <h2 className="font-display text-heading-sm text-text-primary mb-2">Coming Soon</h2>
        <p className="text-body-md text-text-muted max-w-md mx-auto">
          Platform settings including email templates, royalty policies, feature flags, and admin user management will be available in a future update.
        </p>
      </div>
    </div>
  );
}
