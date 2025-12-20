import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Save, 
  Palette, 
  Globe, 
  User, 
  Shield, 
  Settings2, 
  Database,
  Moon,
  Sun,
  Languages,
  Key,
  LogOut,
  History,
  Mail,
  Building,
  AlertTriangle,
  Download,
  RefreshCw,
  Trash2,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Monitor,
  Smartphone
} from 'lucide-react';
import { SEOSettingsManager } from './SEOSettingsManager';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SiteSettings {
  id?: string;
  site_name: string;
  site_tagline: string;
  contact_email: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  google_analytics_id: string;
}

interface AdminProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
}

interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip_address: string;
  location: string;
  created_at: string;
  is_current: boolean;
}

interface LoginHistory {
  id: string;
  email: string;
  status: 'success' | 'failed';
  ip_address: string;
  device: string;
  created_at: string;
}

const settingsTabs = [
  { id: 'appearance', label: 'รูปลักษณ์', labelEn: 'Appearance', icon: Palette },
  { id: 'seo', label: 'SEO', labelEn: 'SEO', icon: Globe },
  { id: 'profile', label: 'โปรไฟล์', labelEn: 'Profile', icon: User },
  { id: 'security', label: 'ความปลอดภัย', labelEn: 'Security', icon: Shield },
  { id: 'site', label: 'ตั้งค่าเว็บ', labelEn: 'Site', icon: Settings2 },
  { id: 'backup', label: 'สำรองข้อมูล', labelEn: 'Backup', icon: Database },
];

export const SettingsManager = () => {
  const [activeTab, setActiveTab] = useState('appearance');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Appearance states
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const [language, setLanguage] = useState('th');
  const [accentColor, setAccentColor] = useState('#3B82F6');
  
  // Profile states
  const [profile, setProfile] = useState<AdminProfile>({
    id: '',
    email: '',
    display_name: 'Admin User',
    avatar_url: '',
    created_at: new Date().toISOString(),
  });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Site settings states
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'CodeX',
    site_tagline: 'Developer Portfolio',
    contact_email: '',
    maintenance_mode: false,
    maintenance_message: 'เว็บไซต์กำลังปรับปรุง กรุณากลับมาใหม่ภายหลัง',
    google_analytics_id: '',
  });
  
  // Security states
  const [sessions, setSessions] = useState<LoginSession[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  
  // Export states
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // Load admin profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          id: user.id,
          email: user.email || '',
          display_name: user.user_metadata?.display_name || 'Admin User',
          avatar_url: user.user_metadata?.avatar_url || '',
          created_at: user.created_at || new Date().toISOString(),
        });
      }

      // Load site settings
      const { data: siteData } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (siteData) {
        setSiteSettings(siteData);
      }

      // Load sessions (mock data for now)
      setSessions([
        {
          id: '1',
          device: 'Desktop',
          browser: 'Chrome',
          ip_address: '192.168.1.xxx',
          location: 'Bangkok, Thailand',
          created_at: new Date().toISOString(),
          is_current: true,
        },
      ]);

      // Load login history (mock data)
      setLoginHistory([
        {
          id: '1',
          email: user?.email || 'admin@example.com',
          status: 'success',
          ip_address: '192.168.1.xxx',
          device: 'Desktop - Chrome',
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          email: user?.email || 'admin@example.com',
          status: 'success',
          ip_address: '192.168.1.xxx',
          device: 'Mobile - Safari',
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);

    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Appearance handlers
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast.success(newMode ? 'เปิดใช้งาน Dark Mode' : 'ปิดใช้งาน Dark Mode');
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    toast.success(`เปลี่ยนภาษาเป็น ${lang === 'th' ? 'ภาษาไทย' : 'English'}`);
  };

  // Profile handlers
  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profile.display_name,
          avatar_url: profile.avatar_url,
        },
      });

      if (error) throw error;
      toast.success('อัปเดตโปรไฟล์สำเร็จ!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('เปลี่ยนรหัสผ่านสำเร็จ!');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน');
    } finally {
      setSaving(false);
    }
  };

  // Site settings handlers
  const handleSiteSettingsSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: siteSettings.id || crypto.randomUUID(),
          ...siteSettings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      toast.success('บันทึกการตั้งค่าเว็บไซต์สำเร็จ!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast.error('เกิดข้อผิดพลาดในการบันทึก');
    } finally {
      setSaving(false);
    }
  };

  // Security handlers
  const handleLogoutAllSessions = async () => {
    try {
      await supabase.auth.signOut({ scope: 'global' });
      toast.success('ออกจากระบบทุกอุปกรณ์สำเร็จ');
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out all sessions:', error);
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  // Export handlers
  const handleExportData = async (format: 'json' | 'csv') => {
    setExporting(true);
    try {
      // Fetch all data
      const [projectsRes, educationRes, experienceRes, personalInfoRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('education').select('*'),
        supabase.from('experience').select('*'),
        supabase.from('personal_info').select('*'),
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        projects: projectsRes.data || [],
        education: educationRes.data || [],
        experience: experienceRes.data || [],
        personalInfo: personalInfoRes.data || [],
      };

      let blob: Blob;
      let filename: string;

      if (format === 'json') {
        blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        filename = `codex-backup-${new Date().toISOString().split('T')[0]}.json`;
      } else {
        // Simple CSV export for projects
        const csvRows = ['title,description_th,url,tags'];
        exportData.projects.forEach((p: { title: string; description_th: string; url: string; tags: string[] }) => {
          csvRows.push(`"${p.title}","${p.description_th}","${p.url}","${p.tags?.join(', ')}"`);
        });
        blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        filename = `codex-projects-${new Date().toISOString().split('T')[0]}.csv`;
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(`ส่งออกข้อมูลเป็น ${format.toUpperCase()} สำเร็จ!`);
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
    } finally {
      setExporting(false);
    }
  };

  const accentColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Green', value: '#10B981' },
    { name: 'Orange', value: '#F59E0B' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Cyan', value: '#06B6D4' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Settings Navigation */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile: Horizontal scroll tabs */}
          <div className="border-b border-slate-200 dark:border-slate-700">
            <TabsList className="w-full h-auto p-1.5 bg-transparent flex flex-nowrap overflow-x-auto gap-1 scrollbar-hide">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                      data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 
                      data-[state=active]:text-white data-[state=active]:shadow-lg
                      data-[state=inactive]:text-slate-600 data-[state=inactive]:dark:text-slate-400
                      data-[state=inactive]:hover:bg-slate-100 data-[state=inactive]:dark:hover:bg-slate-800"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.labelEn}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>

          <div className="p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {/* Appearance Tab */}
              <TabsContent value="appearance" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50">
                    <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">รูปลักษณ์</CardTitle>
                          <CardDescription>ปรับแต่งการแสดงผลของเว็บไซต์</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      {/* Theme Mode */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ธีม</Label>
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isDarkMode ? 'bg-indigo-100 dark:bg-indigo-900' : 'bg-amber-100'}`}>
                              {isDarkMode ? (
                                <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                              ) : (
                                <Sun className="w-5 h-5 text-amber-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                              <p className="text-sm text-muted-foreground">{isDarkMode ? 'ธีมมืดสบายตา' : 'ธีมสว่างชัดเจน'}</p>
                            </div>
                          </div>
                          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
                        </div>
                      </div>

                      {/* Accent Color */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">สีหลักของเว็บไซต์</Label>
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="flex flex-wrap gap-3">
                            {accentColors.map((color) => (
                              <button
                                key={color.value}
                                onClick={() => {
                                  setAccentColor(color.value);
                                  toast.success(`เปลี่ยนสีหลักเป็น ${color.name}`);
                                }}
                                className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                                  accentColor === color.value
                                    ? 'bg-white dark:bg-slate-800 shadow-md ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500'
                                    : 'hover:bg-white dark:hover:bg-slate-800'
                                }`}
                              >
                                <div
                                  className={`w-8 h-8 rounded-full shadow-inner transition-transform group-hover:scale-110 ${
                                    accentColor === color.value ? 'ring-2 ring-offset-2' : ''
                                  }`}
                                  style={{ 
                                    backgroundColor: color.value,
                                    ringColor: color.value
                                  }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                  {color.name}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Language */}
                      <div className="space-y-3">
                        <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ภาษา</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => handleLanguageChange('th')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              language === 'th'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <span className="text-2xl">🇹🇭</span>
                            <div className="text-left">
                              <p className="font-medium">ภาษาไทย</p>
                              <p className="text-xs text-muted-foreground">Thai</p>
                            </div>
                            {language === 'th' && (
                              <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto" />
                            )}
                          </button>
                          <button
                            onClick={() => handleLanguageChange('en')}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                              language === 'en'
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/50'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <span className="text-2xl">🇺🇸</span>
                            <div className="text-left">
                              <p className="font-medium">English</p>
                              <p className="text-xs text-muted-foreground">English</p>
                            </div>
                            {language === 'en' && (
                              <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <Button 
                          onClick={() => toast.success('บันทึกการตั้งค่าสำเร็จ!')}
                          className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white shadow-lg"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* SEO Tab */}
              <TabsContent value="seo" className="mt-0">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SEOSettingsManager />
                </motion.div>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Profile Info Card */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                          <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">ข้อมูลส่วนตัว</CardTitle>
                          <CardDescription>จัดการข้อมูลโปรไฟล์ของคุณ</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                          {profile.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-lg">{profile.display_name}</p>
                          <p className="text-sm text-muted-foreground">{profile.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            สมาชิกตั้งแต่: {new Date(profile.created_at).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="display_name">Display Name</Label>
                          <Input
                            id="display_name"
                            value={profile.display_name}
                            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            disabled
                            className="bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
                          />
                          <p className="text-xs text-muted-foreground">Email ไม่สามารถเปลี่ยนได้</p>
                        </div>
                      </div>

                      <Button 
                        onClick={handleProfileUpdate} 
                        disabled={saving}
                        className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        บันทึกข้อมูล
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Change Password Card */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/30">
                          <Key className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">เปลี่ยนรหัสผ่าน</CardTitle>
                          <CardDescription>อัปเดตรหัสผ่านของคุณ</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">รหัสผ่านปัจจุบัน</Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">รหัสผ่านใหม่</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">ยืนยันรหัสผ่านใหม่</Label>
                          <Input
                            id="confirm_password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>

                      <Button 
                        onClick={handlePasswordChange} 
                        disabled={saving || !newPassword || !confirmPassword}
                        className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Key className="w-4 h-4 mr-2" />}
                        เปลี่ยนรหัสผ่าน
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Active Sessions Card */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                            <Monitor className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">อุปกรณ์ที่เข้าสู่ระบบ</CardTitle>
                            <CardDescription>จัดการ sessions ที่กำลังใช้งาน</CardDescription>
                          </div>
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                              <LogOut className="w-4 h-4 mr-2" />
                              ออกจากระบบทุกอุปกรณ์
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ยืนยันการออกจากระบบทุกอุปกรณ์?</AlertDialogTitle>
                              <AlertDialogDescription>
                                การดำเนินการนี้จะทำให้คุณต้องเข้าสู่ระบบใหม่ในทุกอุปกรณ์
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction onClick={handleLogoutAllSessions} className="bg-red-600 hover:bg-red-700">
                                ออกจากระบบทั้งหมด
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {sessions.map((session) => (
                          <div
                            key={session.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-center gap-4">
                              {session.device === 'Desktop' ? (
                                <Monitor className="w-8 h-8 text-slate-500" />
                              ) : (
                                <Smartphone className="w-8 h-8 text-slate-500" />
                              )}
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{session.browser} - {session.device}</p>
                                  {session.is_current && (
                                    <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                                      ปัจจุบัน
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {session.location} • {session.ip_address}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {new Date(session.created_at).toLocaleString('th-TH')}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Login History Card */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30">
                          <History className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">ประวัติการเข้าสู่ระบบ</CardTitle>
                          <CardDescription>รายการเข้าสู่ระบบล่าสุด</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {loginHistory.map((history) => (
                          <div
                            key={history.id}
                            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700"
                          >
                            <div className="flex items-center gap-4">
                              {history.status === 'success' ? (
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-500" />
                              )}
                              <div>
                                <p className="font-medium">{history.device}</p>
                                <p className="text-sm text-muted-foreground">{history.ip_address}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                history.status === 'success'
                                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                              }`}>
                                {history.status === 'success' ? 'สำเร็จ' : 'ล้มเหลว'}
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(history.created_at).toLocaleString('th-TH')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Site Settings Tab */}
              <TabsContent value="site" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* General Site Settings */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30">
                          <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">ข้อมูลเว็บไซต์</CardTitle>
                          <CardDescription>ตั้งค่าข้อมูลพื้นฐานของเว็บไซต์</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="site_name">ชื่อเว็บไซต์</Label>
                          <Input
                            id="site_name"
                            value={siteSettings.site_name}
                            onChange={(e) => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="site_tagline">Tagline</Label>
                          <Input
                            id="site_tagline"
                            value={siteSettings.site_tagline}
                            onChange={(e) => setSiteSettings({ ...siteSettings, site_tagline: e.target.value })}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contact_email">Contact Email</Label>
                        <Input
                          id="contact_email"
                          type="email"
                          value={siteSettings.contact_email}
                          onChange={(e) => setSiteSettings({ ...siteSettings, contact_email: e.target.value })}
                          className="bg-white dark:bg-slate-900"
                          placeholder="contact@example.com"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Analytics Settings */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center border border-green-500/30">
                          <ExternalLink className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Google Analytics</CardTitle>
                          <CardDescription>เชื่อมต่อกับ Google Analytics</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ga_id">Measurement ID</Label>
                        <Input
                          id="ga_id"
                          value={siteSettings.google_analytics_id}
                          onChange={(e) => setSiteSettings({ ...siteSettings, google_analytics_id: e.target.value })}
                          className="bg-white dark:bg-slate-900"
                          placeholder="G-XXXXXXXXXX"
                        />
                        <p className="text-xs text-muted-foreground">
                          ใส่ Measurement ID จาก Google Analytics 4
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Maintenance Mode */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${
                          siteSettings.maintenance_mode
                            ? 'bg-gradient-to-br from-red-500/20 to-orange-500/20 border-red-500/30'
                            : 'bg-gradient-to-br from-slate-500/20 to-slate-500/20 border-slate-500/30'
                        }`}>
                          <AlertTriangle className={`w-5 h-5 ${
                            siteSettings.maintenance_mode ? 'text-red-600 dark:text-red-400' : 'text-slate-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">Maintenance Mode</CardTitle>
                          <CardDescription>ปิดเว็บไซต์ชั่วคราวเพื่อปรับปรุง</CardDescription>
                        </div>
                        <Switch
                          checked={siteSettings.maintenance_mode}
                          onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, maintenance_mode: checked })}
                        />
                      </div>
                    </CardHeader>
                    {siteSettings.maintenance_mode && (
                      <CardContent>
                        <div className="space-y-2">
                          <Label htmlFor="maintenance_message">ข้อความแจ้งผู้ใช้</Label>
                          <Input
                            id="maintenance_message"
                            value={siteSettings.maintenance_message}
                            onChange={(e) => setSiteSettings({ ...siteSettings, maintenance_message: e.target.value })}
                            className="bg-white dark:bg-slate-900"
                          />
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSiteSettingsSave} 
                      disabled={saving}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900"
                    >
                      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      บันทึกการตั้งค่า
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              {/* Backup Tab */}
              <TabsContent value="backup" className="mt-0 space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Export Data Card */}
                  <Card className="border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30">
                          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">ส่งออกข้อมูล</CardTitle>
                          <CardDescription>ดาวน์โหลดข้อมูลทั้งหมดในรูปแบบที่ต้องการ</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <button
                          onClick={() => handleExportData('json')}
                          disabled={exporting}
                          className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-all text-left group"
                        >
                          <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📦</span>
                          </div>
                          <p className="font-semibold">Export as JSON</p>
                          <p className="text-sm text-muted-foreground">ดาวน์โหลดข้อมูลครบถ้วนในรูปแบบ JSON</p>
                        </button>
                        <button
                          onClick={() => handleExportData('csv')}
                          disabled={exporting}
                          className="p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-green-300 dark:hover:border-green-700 transition-all text-left group"
                        >
                          <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <span className="text-2xl">📊</span>
                          </div>
                          <p className="font-semibold">Export as CSV</p>
                          <p className="text-sm text-muted-foreground">ดาวน์โหลดโปรเจกต์ในรูปแบบ CSV</p>
                        </button>
                      </div>
                      {exporting && (
                        <div className="flex items-center justify-center gap-2 mt-4 text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          กำลังส่งออกข้อมูล...
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Reset Settings Card */}
                  <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30">
                          <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-red-700 dark:text-red-400">Danger Zone</CardTitle>
                          <CardDescription className="text-red-600/70 dark:text-red-400/70">
                            การดำเนินการเหล่านี้ไม่สามารถย้อนกลับได้
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Reset to Defaults
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>รีเซ็ตการตั้งค่าทั้งหมด?</AlertDialogTitle>
                              <AlertDialogDescription>
                                การดำเนินการนี้จะรีเซ็ตการตั้งค่าทั้งหมดกลับเป็นค่าเริ่มต้น ข้อมูลเนื้อหาจะไม่ถูกลบ
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                รีเซ็ต
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};
