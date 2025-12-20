"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconSettings,
  IconLayoutDashboard,
  IconDatabaseEdit,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { ContentManager } from "@/components/admin/ContentManager";
import { SettingsManager } from "@/components/admin/SettingsManager";
import { useAuth } from "@/contexts/AuthContext";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'content' | 'settings'>('dashboard');
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconLayoutDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveTab('dashboard'),
    },
    {
      label: "Manage Content",
      href: "#",
      icon: (
        <IconDatabaseEdit className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveTab('content'),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => setActiveTab('settings'),
    },
    {
      label: "Back to Home",
      href: "/",
      icon: (
        <IconHome className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
      onClick: () => {}, // href handles navigation
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row w-full flex-1 mx-auto overflow-hidden",
        "h-screen bg-slate-50 dark:bg-[#0B1120]" 
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white dark:bg-[#0F172A] border-r border-slate-200 dark:border-slate-800">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <div key={idx} onClick={link.onClick}>
                  <SidebarLink link={link} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <SidebarLink
              link={{
                label: user?.username || user?.email || "Admin",
                href: "#",
                icon: (
                  <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                    {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
                  </div>
                ),
              }}
            />
            <button
              onClick={logout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <IconLogout className="h-4 w-4" />
              {open && <span>ออกจากระบบ</span>}
            </button>
          </div>
      </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 flex-col overflow-hidden pt-14 md:pt-0">
        <div className="p-2 sm:p-4 md:p-8 flex flex-col gap-4 sm:gap-6 flex-1 w-full h-full overflow-y-auto overflow-x-hidden">
          {/* Header Card with Glass Effect */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#1E293B] rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-black gradient-text mb-1 sm:mb-2 truncate">
                  {activeTab === 'dashboard' && 'Web Analytics'}
                  {activeTab === 'content' && 'Content Management'}
                  {activeTab === 'settings' && 'Settings'}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Welcome back, {user?.username || user?.first_name || 'Admin'} • {new Date().toLocaleDateString('th-TH', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-muted-foreground">System Online</span>
              </div>
            </div>
          </motion.div>
          
          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            {activeTab === 'dashboard' && <AnalyticsDashboard />}
            {activeTab === 'content' && <ContentManager />}
            {activeTab === 'settings' && <SettingsManager />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-3 items-center text-sm py-1 relative z-20"
    >
      <img 
        src="/Logo.png" 
        alt="CodeX Logo" 
        className="h-8 w-8 object-contain rounded-lg"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-lg bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent whitespace-pre"
      >
        CodeX Admin
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
    >
      <img 
        src="/Logo.png" 
        alt="CodeX Logo" 
        className="h-8 w-8 object-contain rounded-lg"
      />
    </a>
  );
};
