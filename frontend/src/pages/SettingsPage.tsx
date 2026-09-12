import React from 'react';
import { User, Bell, Palette } from 'lucide-react';


export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2d1f19]">Settings</h1>
        <p className="text-sm text-[#8c7b75]">Manage app preferences, notifications, and organization details</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#efe6da] shadow-card divide-y divide-[#efe6da]">
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fbebe3] text-[#c85a28] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2d1f19]">Organization Profile</h3>
              <p className="text-xs text-[#8c7b75]">Vivekananda Balaka Sangha (VBS) / VYS</p>
            </div>
          </div>
          <button type="button" className="px-4 py-1.5 text-xs font-semibold rounded-full border border-[#efe6da] text-[#6e5c54] hover:bg-[#faf7f2]">
            Edit
          </button>
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2d1f19]">Event Reminders & Notifications</h3>
              <p className="text-xs text-[#8c7b75]">Configure automated email and push alerts</p>
            </div>
          </div>
          <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#c85a28]" />
        </div>

        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fce7f3] text-[#db2777] flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#2d1f19]">Theme & Appearance</h3>
              <p className="text-xs text-[#8c7b75]">Warm calm palette tokens active</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#8c7b75]">Terracotta & Cream</span>
        </div>
      </div>
    </div>
  );
};
