'use client';

import React, { useRef, useState, useEffect } from "react";
import {
  LayoutDashboard, FileText, Settings, LogOut, Menu,
  Eye, ChevronLeft, Bell, Search,
  Globe, Edit3, Trash2, Plus, EyeOff,
  Handshake, Save, ChevronDown, ChevronUp, ExternalLink,
  Upload, CheckCircle, XCircle, X,
  Mail, MessageSquare, Phone, Inbox, PanelBottom, Newspaper
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/business/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/business/ui/card";
import { Badge } from "@/components/business/ui/badge";
import { encodeImagePath } from "@/utils/imagePath";
import { useSiteData, type FooterData, type FooterNavItem, type FooterSocialItem, type SectionField } from "./SiteDataContext";
import {
  parseWhatsAppConversationPrices,
  parseWhatsAppPlans,
  serializeWhatsAppConversationPrices,
  serializeWhatsAppPlans,
  type WhatsAppConversationPrice,
  type WhatsAppPlanConfig,
  type WhatsAppPlanTier,
} from "@/lib/cms/whatsappPricing";
import { CmsPagesView } from './views/CmsPagesView';
import { CmsPageEditorView } from './views/CmsPageEditorView';
import { CmsSeoView } from './views/CmsSeoView';

type AdminView = "dashboard" | "partners" | "submissions" | "footer" | "blog" | "wa-requests" | "cms-pages" | "cms-page-editor" | "cms-seo";

const adminLogoSrc = encodeImagePath("/logo/شعار المدار-01.svg");
const ADMIN_EMAIL = "admin@corbit";
const ADMIN_PASSWORD = "AAaa12341234";
const ADMIN_AUTH_STORAGE_KEY = "orbit-admin-authenticated";
const MOBILE_BREAKPOINT_QUERY = "(max-width: 1023px)";

const isRemoteLogo = (logo: string) => /^(https?:\/\/|data:|blob:)/i.test(logo);

const resolvePartnerLogoSrc = (logo: string) => {
  const trimmed = logo.trim();
  if (!trimmed) return "";
  if (isRemoteLogo(trimmed)) return trimmed;
  const normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return encodeImagePath(normalized);
};

const isTrustedFolderLogo = (logo: string) => {
  const normalized = logo.trim().replace(/\\/g, "/");
  return normalized.toLowerCase().startsWith("/trustedlogos/");
};

export const AdminDashboard = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentView, setCurrentView] = useState<AdminView>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authResolved, setAuthResolved] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const isAr = lang === "ar";

  const sidebarItems = [
    { id: "dashboard" as AdminView, icon: LayoutDashboard, label: isAr ? "لوحة التحكم" : "Dashboard" },
    { id: "cms-pages" as AdminView, icon: Edit3, label: isAr ? "إدارة المحتوى" : "Content CMS" },
    { id: "blog" as AdminView, icon: Newspaper, label: isAr ? "المدونة" : "Blog" },
    { id: "partners" as AdminView, icon: Handshake, label: isAr ? "شركاء النجاح" : "Success Partners" },
    { id: "wa-requests" as AdminView, icon: MessageSquare, label: isAr ? "طلبات واتساب" : "WhatsApp Requests" },
    { id: "submissions" as AdminView, icon: Inbox, label: isAr ? "طلبات تواصل" : "Contact Submissions" },
    { id: "footer" as AdminView, icon: PanelBottom, label: isAr ? "الفوتر" : "Footer CMS" },
    { id: "cms-seo" as AdminView, icon: Globe, label: isAr ? "إعدادات الموقع" : "Site Settings" },
  ];

  const { contactSubmissions } = useSiteData();
  const unreadCount = contactSubmissions.filter(s => !s.read).length;

  const viewToPath: Record<AdminView, string> = {
    dashboard: "/admin",
    blog: "/admin/blog",
    partners: "/admin/success-partners",
    submissions: "/admin/submissions",
    footer: "/admin/footer",
    "wa-requests": "/admin/wa-requests",
    "cms-pages": "/admin/cms/pages",
    "cms-page-editor": "/admin/cms/pages/edit",
    "cms-seo": "/admin/cms/seo",
  };

  const resolveViewFromPath = (path: string): AdminView => {
    if (path === "/admin/blog") return "blog";
    if (path === "/admin/success-partners") return "partners";
    if (path === "/admin/submissions") return "submissions";
    if (path === "/admin/footer") return "footer";
    if (path === "/admin/wa-requests") return "wa-requests";
    if (path === "/admin/cms/pages/edit") return "cms-page-editor";
    if (path === "/admin/cms/pages") return "cms-pages";
    if (path === "/admin/cms/seo") return "cms-seo";
    return "dashboard";
  };

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const storedAuth = window.sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === "true";
    setIsAuthenticated(storedAuth);
    setAuthResolved(true);
  }, []);

  React.useEffect(() => {
    if (!isAuthenticated) return;
    const nextView = resolveViewFromPath(pathname || "/admin");
    setCurrentView(nextView);
    if (nextView === "cms-page-editor") {
      setEditingPage(searchParams.get("id"));
    }
  }, [isAuthenticated, pathname, searchParams]);

  React.useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  const navigateToView = (view: AdminView, options?: { pageId?: string }) => {
    setMobileSidebarOpen(false);
    if (view === "cms-page-editor") {
      const id = options?.pageId || editingPage || "home";
      router.push(`${viewToPath[view]}?id=${encodeURIComponent(id)}`);
      return;
    }
    router.push(viewToPath[view]);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = loginEmail.trim().toLowerCase();
    const isValid = normalizedEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD;

    if (!isValid) {
      setAuthError(isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
      toast.error(isAr ? "بيانات الدخول غير صحيحة" : "Invalid credentials");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, "true");
    }
    setAuthError(null);
    setLoginPassword("");
    setIsAuthenticated(true);
    toast.success(isAr ? "تم تسجيل الدخول" : "Signed in");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    }
    setIsAuthenticated(false);
    setCurrentView("dashboard");
    setEditingPage(null);
    router.push("/admin");
    toast.success(isAr ? "تم تسجيل الخروج" : "Signed out");
  };

  const toggleSidebar = () => {
    if (typeof window !== "undefined" && window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches) {
      setMobileSidebarOpen((prev) => !prev);
      return;
    }
    setSidebarOpen((prev) => !prev);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView isAr={isAr} onNavigate={navigateToView} onEditPage={(id) => { setEditingPage(id); navigateToView("cms-page-editor", { pageId: id }); }} />;
      case "blog":
        return <BlogView isAr={isAr} onEditPage={(id) => { setEditingPage(id); navigateToView("cms-page-editor", { pageId: id }); }} />;
      case "partners":
        return <PartnersView isAr={isAr} />;
      case "wa-requests":
        return <WhatsAppRequestsView isAr={isAr} />;
      case "submissions":
        return <SubmissionsView isAr={isAr} />;
      case "footer":
        return <FooterView isAr={isAr} />;
      case "cms-pages":
        return <CmsPagesView isAr={isAr} onNavigate={navigateToView} />;
      case "cms-page-editor":
        return <CmsPageEditorView isAr={isAr} pageId={editingPage} onBack={() => navigateToView("cms-pages")} />;
      case "cms-seo":
        return <CmsSeoView isAr={isAr} />;
      default:
        return null;
    }
  };

  if (!authResolved) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-sm">{isAr ? "جاري التحقق..." : "Checking authentication..."}</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5" dir={isAr ? "rtl" : "ltr"}>
          <div className="text-center space-y-2">
            <img src={adminLogoSrc} alt="Orbit" className="h-12 w-auto mx-auto" />
            <h1 className="text-xl text-[#104E8B]">{isAr ? "تسجيل دخول لوحة التحكم" : "Admin Dashboard Login"}</h1>
            <p className="text-sm text-gray-500">{isAr ? "أدخل البريد وكلمة المرور للمتابعة" : "Enter your credentials to continue"}</p>
          </div>
          <form className="space-y-3" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{isAr ? "البريد الإلكتروني" : "Email"}</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
                required
                className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20"
                dir="ltr"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-600">{isAr ? "كلمة المرور" : "Password"}</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full h-11 border border-gray-200 rounded-lg px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20"
                dir="ltr"
              />
            </div>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            <button type="submit" className="w-full h-11 rounded-lg bg-[#104E8B] text-white text-sm hover:bg-[#0A2647] transition-colors">
              {isAr ? "دخول" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const desktopSidebarOffsetClass = sidebarOpen
    ? (isAr ? "lg:mr-64" : "lg:ml-64")
    : (isAr ? "lg:mr-20" : "lg:ml-20");
  const sidebarEdgeClass = isAr ? "right-0" : "left-0";
  const mobileSidebarTranslateClass = mobileSidebarOpen
    ? "translate-x-0"
    : (isAr ? "translate-x-full lg:translate-x-0" : "-translate-x-full lg:translate-x-0");
  const showSidebarLabels = sidebarOpen || mobileSidebarOpen;

  return (
    <div className="min-h-screen bg-gray-50" dir={isAr ? "rtl" : "ltr"} style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>
      {mobileSidebarOpen && (
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-label={isAr ? "إغلاق القائمة الجانبية" : "Close sidebar"}
        />
      )}

      <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed ${sidebarEdgeClass} top-0 h-full w-72 max-w-[85vw] ${sidebarOpen ? "lg:w-64" : "lg:w-20"} ${mobileSidebarTranslateClass} bg-[#0A2647] text-white transition-all duration-300 flex flex-col z-50`}>
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {showSidebarLabels && (
            <div className="flex items-center gap-2">
              <img src={adminLogoSrc} alt="Orbit" className="h-10 w-auto brightness-0 invert" />
              <span className="text-sm text-white/60">CMS</span>
            </div>
          )}
          <button onClick={toggleSidebar} className="p-2 hover:bg-white/10 rounded-lg transition-colors hidden lg:flex">
            {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors lg:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => navigateToView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                currentView === item.id
                  ? "bg-[#104E8B] text-white shadow-lg"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {showSidebarLabels && <span className="flex-1">{item.label}</span>}
              {showSidebarLabels && item.id === "submissions" && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{unreadCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <Globe className="w-5 h-5 flex-shrink-0" />
            {showSidebarLabels && <span>{isAr ? "English" : "العربية"}</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all text-sm"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {showSidebarLabels && <span>{isAr ? "تسجيل الخروج" : "Sign Out"}</span>}
          </button>
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-all text-sm"
          >
            <ExternalLink className="w-5 h-5 flex-shrink-0" />
            {showSidebarLabels && <span>{isAr ? "العودة للموقع" : "Back to Site"}</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 ${desktopSidebarOffsetClass} transition-all duration-300`}>
        <header className="bg-white border-b border-gray-200 px-3 sm:px-4 lg:px-6 py-3 flex items-center justify-between gap-2 sticky top-0 z-30">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              aria-label={isAr ? "فتح القائمة الجانبية" : "Open sidebar"}
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-base sm:text-lg text-[#104E8B] truncate">
              {currentView === "cms-page-editor" ? (isAr ? "محرر الصفحة" : "Page Editor") : sidebarItems.find(i => i.id === currentView)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute top-2.5 text-gray-400" style={{ [isAr ? "right" : "left"]: "10px" }} />
              <input
                type="text"
                placeholder={isAr ? "بحث..." : "Search..."}
                className="bg-gray-100 rounded-lg py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20"
                style={{ [isAr ? "paddingRight" : "paddingLeft"]: "36px", [isAr ? "paddingLeft" : "paddingRight"]: "12px" }}
              />
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-lg hidden sm:flex">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 sm:px-3 py-1.5">
              <div className="w-7 h-7 bg-[#104E8B] rounded-full flex items-center justify-center text-white text-xs">A</div>
              <span className="text-sm text-gray-700 hidden sm:inline">Admin</span>
            </div>
          </div>
        </header>

        <div className="p-3 sm:p-4 lg:p-6">
          {renderContent()}
        </div>
      </main>
      </div>
    </div>
  );
};

// ──────────────────── Dashboard View ────────────────────
const DashboardView = ({ isAr, onNavigate, onEditPage }: { isAr: boolean; onNavigate: (v: AdminView) => void; onEditPage: (id: string) => void }) => {
  const { pages, contactSubmissions, whatsAppRequests, fetchWhatsAppRequests } = useSiteData();

  useEffect(() => {
    fetchWhatsAppRequests();
  }, [fetchWhatsAppRequests]);

  const waRequestsCount = whatsAppRequests.length;
  const newWaRequests = whatsAppRequests.filter(r => r.status === 'new').length;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#104E8B]">{isAr ? "لوحة التحكم" : "Control Panel"}</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start" onClick={() => onNavigate("cms-pages")}>
            <FileText className="w-4 h-4" />
            {isAr ? "إدارة المحتوى" : "Manage Content"}
          </Button>
          <Button className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start" onClick={() => onNavigate("partners")}>
            <Handshake className="w-4 h-4" />
            {isAr ? "إدارة الشركاء" : "Manage Partners"}
          </Button>
          <Button className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start" onClick={() => onNavigate("blog")}>
            <Newspaper className="w-4 h-4" />
            {isAr ? "إدارة المدونة" : "Manage Blog"}
          </Button>
          <Button className="bg-[#25D366] hover:bg-[#1da954] text-white justify-start" onClick={() => onNavigate("submissions")}>
            <MessageSquare className="w-4 h-4" />
            {isAr ? "طلبات واتساب" : "WhatsApp Requests"} ({waRequestsCount})
            {newWaRequests > 0 && <Badge className="ml-2 bg-white text-[#25D366] text-xs">{newWaRequests}</Badge>}
          </Button>
          <Button className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start" onClick={() => onNavigate("submissions")}>
            <Inbox className="w-4 h-4" />
            {isAr ? "طلبات التواصل" : "Contact Submissions"} ({contactSubmissions.length})
          </Button>
          <Button className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start" onClick={() => onNavigate("footer")}>
            <PanelBottom className="w-4 h-4" />
            {isAr ? "إدارة الفوتر" : "Manage Footer"}
          </Button>
          <Button className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start" onClick={() => onNavigate("cms-seo")}>
            <Settings className="w-4 h-4" />
            {isAr ? "إعدادات الموقع" : "Site Settings"}
          </Button>
        </CardContent>
      </Card>

      {/* WhatsApp Requests Section */}
      {waRequestsCount > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-[#25D366] flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {isAr ? "طلبات خدمة واتساب" : "WhatsApp Service Requests"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {whatsAppRequests.slice(0, 5).map((req) => (
              <div key={req._id || req.id || req.email + req.phone} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-[#161616]">{req.name}</p>
                  <p className="text-sm text-gray-500" dir="ltr">{req.phone} • {req.email}</p>
                  <p className="text-sm text-gray-500">{req.companyName || '-'} • {req.planId}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={req.status === 'new' ? 'bg-[#25D366] text-white' : 'bg-gray-200 text-gray-600'}>
                    {req.status === 'new' ? (isAr ? 'جديد' : 'New') : req.status === 'contacted' ? (isAr ? 'تم التواصل' : 'Contacted') : (isAr ? 'مغلق' : 'Closed')}
                  </Badge>
                </div>
              </div>
            ))}
            {waRequestsCount > 5 && (
              <p className="text-center text-sm text-gray-500">
                {isAr ? `و${waRequestsCount - 5} طلبات أخرى` : `+${waRequestsCount - 5} more requests`}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#104E8B]">{isAr ? "تعديل الصفحات" : "Edit Pages"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => onEditPage(page.id)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-[#104E8B]/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-[#104E8B]" />
                <div className="text-start">
                  <span className="text-sm text-gray-700 block">{isAr ? page.title : page.titleEn}</span>
                  <span className="text-xs text-gray-400">{page.sections.length} {isAr ? "أقسام" : "sections"}</span>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-700 text-xs">{isAr ? "منشور" : "Published"}</Badge>
            </button>
          ))}
          {pages.length === 0 && (
            <p className="text-sm text-gray-500">{isAr ? "لا توجد صفحات في قاعدة البيانات." : "No pages found in the database."}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ──────────────────── Blog View ────────────────────
interface BlogEntry {
  _id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  content?: string;
  contentAr?: string;
  image?: string;
  category: string;
  slug: string;
  isActive: boolean;
  featured?: boolean;
  publishedAt?: string;
  order: number;
}

interface BlogDraft {
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  content: string;
  contentAr: string;
  image: string;
  category: string;
  slug: string;
  isActive: boolean;
  featured: boolean;
  order: number;
}

const emptyBlogDraft: BlogDraft = {
  title: "",
  titleAr: "",
  description: "",
  descriptionAr: "",
  content: "",
  contentAr: "",
  image: "",
  category: "General",
  slug: "",
  isActive: true,
  featured: false,
  order: 0,
};

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");

const summarize = (value: string, limit = 180) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
};

const resolveImageSrc = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://") ? value : encodeImagePath(value);

const BlogView = ({ isAr, onEditPage }: { isAr: boolean; onEditPage: (id: string) => void }) => {
  const { pages } = useSiteData();
  const blogPage = pages.find((page) => page.path === "/blog" || page.path === "/news" || page.id === "blog" || page.id === "news");
  const [posts, setPosts] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [featureFilter, setFeatureFilter] = useState<"all" | "featured" | "regular">("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogEntry | null>(null);
  const [draft, setDraft] = useState<BlogDraft>(emptyBlogDraft);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadPosts = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/news?admin=true", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      const rows = Array.isArray(data?.news) ? (data.news as BlogEntry[]) : [];
      setPosts(rows);
    } catch (error) {
      console.error(error);
      toast.error(isAr ? "تعذر تحميل المقالات" : "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }, [isAr]);

  React.useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const filteredPosts = React.useMemo(() => {
    return posts.filter((post) => {
      const query = search.trim().toLowerCase();
      const matchesQuery = !query
        || post.title.toLowerCase().includes(query)
        || (post.titleAr || "").toLowerCase().includes(query)
        || post.slug.toLowerCase().includes(query)
        || post.category.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "all" || (statusFilter === "active" ? post.isActive : !post.isActive);
      const matchesFeature = featureFilter === "all" || (featureFilter === "featured" ? Boolean(post.featured) : !post.featured);
      return matchesQuery && matchesStatus && matchesFeature;
    });
  }, [posts, search, statusFilter, featureFilter]);

  const categories = React.useMemo(() => {
    return [...new Set(posts.map((post) => post.category).filter(Boolean))].sort();
  }, [posts]);

  const resetDraft = () => {
    setDraft(emptyBlogDraft);
    setEditingPost(null);
  };

  const openCreate = () => {
    resetDraft();
    setEditorOpen(true);
  };

  const openEdit = (post: BlogEntry) => {
    setEditingPost(post);
    setDraft({
      title: post.title || "",
      titleAr: post.titleAr || "",
      description: post.description || "",
      descriptionAr: post.descriptionAr || "",
      content: post.content || "",
      contentAr: post.contentAr || "",
      image: post.image || "",
      category: post.category || "General",
      slug: post.slug || "",
      isActive: post.isActive,
      featured: Boolean(post.featured),
      order: post.order || 0,
    });
    setEditorOpen(true);
  };

  const applySmartFill = () => {
    setDraft((prev) => ({
      ...prev,
      slug: prev.slug || toSlug(prev.title),
      description: prev.description || summarize(prev.content, 180),
      descriptionAr: prev.descriptionAr || summarize(prev.contentAr, 180),
    }));
    toast.success(isAr ? "تم ملء الحقول الذكية" : "Smart fields generated");
  };

  const saveDraft = async () => {
    if (!draft.title.trim()) {
      toast.error(isAr ? "العنوان الإنجليزي مطلوب" : "English title is required");
      return;
    }
    if (!draft.description.trim()) {
      toast.error(isAr ? "الوصف الإنجليزي مطلوب" : "English description is required");
      return;
    }
    if (!draft.category.trim()) {
      toast.error(isAr ? "التصنيف مطلوب" : "Category is required");
      return;
    }

    const finalSlug = draft.slug.trim() || toSlug(draft.title);
    if (!finalSlug) {
      toast.error(isAr ? "تعذر إنشاء الرابط المختصر" : "Unable to generate slug");
      return;
    }

    const payload = {
      ...draft,
      slug: finalSlug,
      category: draft.category.trim(),
      publishedAt: new Date().toISOString(),
    };

    try {
      setSubmitting(true);
      const url = editingPost?._id ? `/api/news/${editingPost._id}` : "/api/news";
      const method = editingPost?._id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const errText = typeof errJson?.error === "string" ? errJson.error : "";
        throw new Error(errText || "Failed to save");
      }
      toast.success(editingPost ? (isAr ? "تم تحديث المقال" : "Post updated") : (isAr ? "تم إنشاء المقال" : "Post created"));
      setEditorOpen(false);
      resetDraft();
      await loadPosts();
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "";
      if (message.includes("duplicate key") || message.toLowerCase().includes("slug")) {
        toast.error(isAr ? "هذا الرابط مستخدم مسبقاً، غيّره ثم احفظ." : "This slug already exists. Change it and save again.");
      } else {
        toast.error(isAr ? `تعذر حفظ المقال: ${message || "خطأ غير متوقع"}` : `Failed to save post: ${message || "Unexpected error"}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const updatePost = async (postId: string, updates: Partial<BlogEntry>, successMessage: string) => {
    try {
      setActionId(postId);
      const res = await fetch(`/api/news/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed update");
      toast.success(successMessage);
      await loadPosts();
    } catch (error) {
      console.error(error);
      toast.error(isAr ? "تعذر تحديث المقال" : "Failed to update post");
    } finally {
      setActionId(null);
    }
  };

  const deletePost = async (post: BlogEntry) => {
    const ok = window.confirm(
      isAr
        ? `هل تريد حذف المقال "${post.titleAr || post.title}"؟`
        : `Delete post "${post.title}"?`
    );
    if (!ok) return;

    try {
      setActionId(post._id);
      const res = await fetch(`/api/news/${post._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed delete");
      toast.success(isAr ? "تم حذف المقال" : "Post deleted");
      await loadPosts();
    } catch (error) {
      console.error(error);
      toast.error(isAr ? "تعذر حذف المقال" : "Failed to delete post");
    } finally {
      setActionId(null);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      setUploading(true);
      const res = await fetch("/api/upload-image", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      if (!data?.url) throw new Error("No URL returned");
      setDraft((prev) => ({ ...prev, image: data.url as string }));
      toast.success(isAr ? "تم رفع الصورة" : "Image uploaded");
    } catch (error) {
      console.error(error);
      toast.error(isAr ? "فشل رفع الصورة" : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const totalPosts = posts.length;
  const activePosts = posts.filter((post) => post.isActive).length;
  const featuredPosts = posts.filter((post) => post.featured).length;
  const draftPosts = posts.filter((post) => !post.isActive).length;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-[#104E8B]">{isAr ? "إدارة المدونة (CMS كامل)" : "Blog CMS Management"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {isAr
              ? "اكتب المقالات هنا، تُحفظ في MongoDB وتظهر مباشرة في /blog وتفتح كصفحات تفصيلية عند الضغط."
              : "Create posts here, they are stored in MongoDB, shown on /blog, and opened as full article pages on click."}
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <Button
              className="bg-[#104E8B] hover:bg-[#0A2647] text-white justify-start"
              onClick={() => {
                if (!blogPage) {
                  toast.error(isAr ? "صفحة المدونة غير موجودة في صفحات CMS." : "Blog page not found in CMS pages.");
                  return;
                }
                onEditPage(blogPage.id);
              }}
            >
              <Edit3 className="w-4 h-4" />
              {isAr ? "تحرير صفحة /blog" : "Edit /blog Page"}
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-700 justify-start" asChild>
              <Link href="/blog" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                {isAr ? "معاينة المدونة" : "Preview Blog"}
              </Link>
            </Button>
            <Button className="bg-[#FFA502] hover:bg-[#E59400] text-white justify-start" onClick={openCreate}>
              <Plus className="w-4 h-4" />
              {isAr ? "مقال جديد" : "New Article"}
            </Button>
          </div>
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
            <p className="text-xs text-gray-500">{isAr ? "المسارات العامة" : "Public Routes"}</p>
            <code dir="ltr" className="text-sm text-gray-700">/blog</code>
            <span className="text-gray-400 mx-2">•</span>
            <code dir="ltr" className="text-sm text-gray-700">/blog/[slug]</code>
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-xs text-gray-500">{isAr ? "إجمالي المقالات" : "Total Posts"}</p><p className="text-2xl text-[#104E8B] mt-1">{totalPosts}</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-xs text-gray-500">{isAr ? "منشور" : "Published"}</p><p className="text-2xl text-green-700 mt-1">{activePosts}</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-xs text-gray-500">{isAr ? "مميز" : "Featured"}</p><p className="text-2xl text-amber-700 mt-1">{featuredPosts}</p></CardContent></Card>
        <Card className="border-0 shadow-sm"><CardContent className="p-4"><p className="text-xs text-gray-500">{isAr ? "مسودة/مخفي" : "Draft/Hidden"}</p><p className="text-2xl text-gray-700 mt-1">{draftPosts}</p></CardContent></Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-4 grid md:grid-cols-4 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isAr ? "بحث بالعنوان أو التصنيف أو الرابط" : "Search by title, category, or slug"}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm md:col-span-2"
          />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "inactive")} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">{isAr ? "كل الحالات" : "All Statuses"}</option>
            <option value="active">{isAr ? "منشور" : "Published"}</option>
            <option value="inactive">{isAr ? "مخفي/مسودة" : "Hidden/Draft"}</option>
          </select>
          <select value={featureFilter} onChange={(e) => setFeatureFilter(e.target.value as "all" | "featured" | "regular")} className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">{isAr ? "كل المقالات" : "All Posts"}</option>
            <option value="featured">{isAr ? "مميزة فقط" : "Featured only"}</option>
            <option value="regular">{isAr ? "عادية فقط" : "Regular only"}</option>
          </select>
        </CardContent>
      </Card>

      <div className="grid xl:grid-cols-2 gap-4">
        {loading && (
          <Card className="xl:col-span-2 border-0 shadow-sm">
            <CardContent className="p-8 text-center text-sm text-gray-500">{isAr ? "جار تحميل المقالات..." : "Loading posts..."}</CardContent>
          </Card>
        )}

        {!loading && filteredPosts.length === 0 && (
          <Card className="xl:col-span-2 border-0 shadow-sm">
            <CardContent className="p-8 text-center text-sm text-gray-500">{isAr ? "لا توجد مقالات مطابقة للفلاتر الحالية." : "No posts match current filters."}</CardContent>
          </Card>
        )}

        {!loading && filteredPosts.map((post) => (
          <Card key={post._id} className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid sm:grid-cols-[180px_1fr]">
                <div className="h-44 sm:h-full bg-gray-100">
                  {post.image ? (
                    <img src={resolveImageSrc(post.image)} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#104E8B]/15 to-[#FFA502]/15 flex items-center justify-center text-xs text-gray-500">
                      {isAr ? "بدون صورة" : "No image"}
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${post.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"} text-xs`}>
                        {post.isActive ? (isAr ? "منشور" : "Published") : (isAr ? "مخفي" : "Hidden")}
                      </Badge>
                      {post.featured && <Badge className="bg-amber-100 text-amber-700 text-xs">{isAr ? "مميز" : "Featured"}</Badge>}
                      <Badge className="bg-blue-50 text-blue-700 text-xs">{post.category}</Badge>
                    </div>
                    <span className="text-xs text-gray-500">#{post.order}</span>
                  </div>
                  <div>
                    <h3 className="text-base text-gray-900 line-clamp-2">{isAr ? (post.titleAr || post.title) : post.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{isAr ? (post.descriptionAr || post.description) : post.description}</p>
                  </div>
                  <div className="text-xs text-gray-500" dir="ltr">/{post.slug}</div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-8 text-xs" onClick={() => openEdit(post)}>
                      <Edit3 className="w-3.5 h-3.5" />
                      {isAr ? "تحرير" : "Edit"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs border-gray-200" asChild>
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />
                        {isAr ? "فتح" : "Open"}
                      </a>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-8 text-xs ${post.isActive ? "border-amber-200 text-amber-700 hover:bg-amber-50" : "border-green-200 text-green-700 hover:bg-green-50"}`}
                      disabled={actionId === post._id}
                      onClick={() => updatePost(post._id, { isActive: !post.isActive }, post.isActive ? (isAr ? "تم إخفاء المقال" : "Post hidden") : (isAr ? "تم نشر المقال" : "Post published"))}
                    >
                      {post.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      {post.isActive ? (isAr ? "إخفاء" : "Hide") : (isAr ? "نشر" : "Publish")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={`h-8 text-xs ${post.featured ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-blue-200 text-blue-700 hover:bg-blue-50"}`}
                      disabled={actionId === post._id}
                      onClick={() => updatePost(post._id, { featured: !post.featured }, post.featured ? (isAr ? "تم إلغاء التمييز" : "Removed from featured") : (isAr ? "تم تمييز المقال" : "Post marked featured"))}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      {post.featured ? (isAr ? "إلغاء مميز" : "Unfeature") : (isAr ? "تمييز" : "Feature")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs border-red-200 text-red-600 hover:bg-red-50"
                      disabled={actionId === post._id}
                      onClick={() => deletePost(post)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {isAr ? "حذف" : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg text-[#104E8B]">
                {editingPost ? (isAr ? "تعديل المقال" : "Edit Article") : (isAr ? "إنشاء مقال جديد" : "Create New Article")}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditorOpen(false);
                  resetDraft();
                }}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "العنوان (EN)" : "Title (EN)"}</label>
                  <input
                    type="text"
                    value={draft.title}
                    onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "العنوان (AR)" : "Title (AR)"}</label>
                  <input
                    type="text"
                    value={draft.titleAr}
                    onChange={(e) => setDraft((prev) => ({ ...prev, titleAr: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "Slug (الرابط)" : "Slug"}</label>
                  <input
                    type="text"
                    value={draft.slug}
                    onChange={(e) => setDraft((prev) => ({ ...prev, slug: toSlug(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "التصنيف" : "Category"}</label>
                  <input
                    type="text"
                    value={draft.category}
                    onChange={(e) => setDraft((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    list="blog-categories"
                  />
                  <datalist id="blog-categories">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "الترتيب" : "Order"}</label>
                  <input
                    type="number"
                    value={draft.order}
                    onChange={(e) => setDraft((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "وصف مختصر (EN)" : "Short Description (EN)"}</label>
                  <textarea
                    rows={3}
                    value={draft.description}
                    onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "وصف مختصر (AR)" : "Short Description (AR)"}</label>
                  <textarea
                    rows={3}
                    value={draft.descriptionAr}
                    onChange={(e) => setDraft((prev) => ({ ...prev, descriptionAr: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "محتوى المقال الكامل (EN)" : "Full Content (EN)"}</label>
                  <textarea
                    rows={8}
                    value={draft.content}
                    onChange={(e) => setDraft((prev) => ({ ...prev, content: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{isAr ? "محتوى المقال الكامل (AR)" : "Full Content (AR)"}</label>
                  <textarea
                    rows={8}
                    value={draft.contentAr}
                    onChange={(e) => setDraft((prev) => ({ ...prev, contentAr: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-y"
                    dir="rtl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs text-gray-500 block">{isAr ? "صورة الغلاف" : "Cover Image"}</label>
                <div className="grid md:grid-cols-[1fr_auto] gap-3">
                  <input
                    type="text"
                    value={draft.image}
                    onChange={(e) => setDraft((prev) => ({ ...prev, image: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                    placeholder="https://..."
                    dir="ltr"
                  />
                  <label className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm border ${uploading ? "border-gray-200 text-gray-400" : "border-[#104E8B]/30 text-[#104E8B] hover:bg-[#104E8B]/5"} cursor-pointer`}>
                    <Upload className="w-4 h-4" />
                    {uploading ? (isAr ? "جار الرفع..." : "Uploading...") : (isAr ? "رفع صورة" : "Upload")}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        await uploadImage(file);
                      }}
                    />
                  </label>
                </div>
                {draft.image && (
                  <img src={resolveImageSrc(draft.image)} alt="Preview" className="w-full max-w-sm h-44 object-cover rounded-xl border border-gray-200" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    onChange={(e) => setDraft((prev) => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  {isAr ? "منشور" : "Published"}
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => setDraft((prev) => ({ ...prev, featured: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  {isAr ? "مميز" : "Featured"}
                </label>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                className="border-blue-200 text-[#104E8B] hover:bg-blue-50"
                onClick={applySmartFill}
              >
                <CheckCircle className="w-4 h-4" />
                {isAr ? "ملء ذكي" : "Smart Fill"}
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-200 text-gray-700"
                  onClick={() => {
                    setEditorOpen(false);
                    resetDraft();
                  }}
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="button"
                  className="bg-[#FFA502] hover:bg-[#E59400] text-white"
                  disabled={submitting}
                  onClick={() => void saveDraft()}
                >
                  <Save className="w-4 h-4" />
                  {submitting ? (isAr ? "جار الحفظ..." : "Saving...") : (isAr ? "حفظ المقال" : "Save Article")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ──────────────────── Field Editor ────────────────────
interface SmsPlanRow {
  messages: string;
  price: string;
  feature: string;
  description: string;
  featured: boolean;
  custom: boolean;
}

const parseSmsPlanRows = (value: string): SmsPlanRow[] => value
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [messages = "", price = "", feature = "", description = "", featured = "false", custom = "false"] = line.split("|");
    return {
      messages,
      price,
      feature,
      description,
      featured: featured.trim().toLowerCase() === "true",
      custom: custom.trim().toLowerCase() === "true" || messages.trim().toLowerCase() === "custom",
    };
  });

const stringifySmsPlanRows = (rows: SmsPlanRow[]): string => rows
  .map((row) => {
    const messages = row.custom ? "custom" : row.messages;
    const price = row.custom ? "" : row.price;
    return `${messages}|${price}|${row.feature}|${row.description}|${row.featured}|${row.custom}`;
  })
  .join("\n");

const SmsPlansListEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const rows = parseSmsPlanRows(value);

  const updateRow = (index: number, patch: Partial<SmsPlanRow>) => {
    const next = rows.map((row, i) => {
      if (i !== index) return row;
      const updated = { ...row, ...patch };
      if (updated.custom) {
        return { ...updated, messages: "custom", price: "" };
      }
      return updated;
    });
    onChange(stringifySmsPlanRows(next));
  };

  const removeRow = (index: number) => {
    onChange(stringifySmsPlanRows(rows.filter((_, i) => i !== index)));
  };

  const addRow = () => {
    const next = [...rows, { messages: "", price: "", feature: "", description: "", featured: false, custom: false }];
    onChange(stringifySmsPlanRows(next));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs text-gray-500 block">{isAr ? "باقات الرسائل" : "SMS Plans"}</label>
      {rows.map((row, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={row.messages}
              onChange={(e) => updateRow(index, { messages: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "عدد الرسائل (مثال: 1000)" : "Messages count (e.g. 1000)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
            <input
              type="text"
              value={row.price}
              onChange={(e) => updateRow(index, { price: e.target.value })}
              disabled={row.custom}
              placeholder={isAr ? "السعر (مثال: 110)" : "Price (e.g. 110)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm disabled:bg-gray-100"
            />
            <input
              type="text"
              value={row.feature}
              onChange={(e) => updateRow(index, { feature: e.target.value })}
              placeholder={isAr ? "عنوان الباقة" : "Plan feature/title"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={row.description}
              onChange={(e) => updateRow(index, { description: e.target.value })}
              placeholder={isAr ? "وصف الباقة" : "Plan description"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={row.featured}
                onChange={(e) => updateRow(index, { featured: e.target.checked })}
              />
              {isAr ? "الباقة المميزة" : "Featured plan"}
            </label>
            <label className="flex items-center gap-2 text-xs text-gray-600">
              <input
                type="checkbox"
                checked={row.custom}
                onChange={(e) => updateRow(index, { custom: e.target.checked })}
              />
              {isAr ? "باقة مخصصة" : "Custom plan"}
            </label>
            <button
              onClick={() => removeRow(index)}
              className="text-xs text-red-500 hover:text-red-600 hover:underline"
            >
              {isAr ? "حذف الباقة" : "Delete plan"}
            </button>
          </div>
        </div>
      ))}
      <button
        onClick={addRow}
        className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {isAr ? "إضافة باقة" : "Add plan"}
      </button>
      <p className="text-[11px] text-gray-400">
        {isAr
          ? "يتم الحفظ بصيغة قابلة للتوسع تلقائياً مع أي عدد باقات."
          : "Saved in a scalable format and supports any number of plans."}
      </p>
    </div>
  );
};

const defaultWhatsAppPlanTier = (isAr: boolean): WhatsAppPlanTier => ({
  name: isAr ? "شريحة جديدة" : "New Tier",
  price: "",
  priceWithTax: "",
  setupFee: "",
  conversations: "",
  broadcastMessages: "",
  users: "",
});

const defaultWhatsAppPlan = (isAr: boolean): WhatsAppPlanConfig => ({
  id: `plan_${Date.now()}`,
  name: isAr ? "باقة جديدة" : "New Package",
  period: isAr ? "شهرياً" : "Monthly",
  popular: false,
  badge: isAr ? "الأكثر طلباً" : "Most Popular",
  subscribeLabel: isAr ? "اشترك الآن" : "Subscribe Now",
  subscribeUrl: "https://wapp.mobile.net.sa/billing-subscription",
  subscribeUrlType: "external",
  additionalFeatures: [""],
  tiers: [defaultWhatsAppPlanTier(isAr)],
});

const defaultWhatsAppApiPrice = (isAr: boolean): WhatsAppConversationPrice => ({
  type: isAr ? "نوع المحادثة" : "Conversation Type",
  price: "",
  duration: isAr ? "للرسالة" : "per msg",
  description: "",
  isFree: false,
});

const WhatsAppPlansEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const plans = parseWhatsAppPlans(value, []);

  const commit = (next: WhatsAppPlanConfig[]) => {
    onChange(serializeWhatsAppPlans(next));
  };

  const updatePlan = (index: number, patch: Partial<WhatsAppPlanConfig>) => {
    const next = plans.map((plan, i) => {
      if (i !== index) return plan;
      return { ...plan, ...patch };
    });
    commit(next);
  };

  const updateTier = (planIndex: number, tierIndex: number, patch: Partial<WhatsAppPlanTier>) => {
    const next = plans.map((plan, pIndex) => {
      if (pIndex !== planIndex) return plan;
      return {
        ...plan,
        tiers: plan.tiers.map((tier, tIndex) => (tIndex === tierIndex ? { ...tier, ...patch } : tier)),
      };
    });
    commit(next);
  };

  const addPlan = () => {
    commit([...plans, defaultWhatsAppPlan(isAr)]);
  };

  const removePlan = (index: number) => {
    commit(plans.filter((_, i) => i !== index));
  };

  const addTier = (planIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, tiers: [...plan.tiers, defaultWhatsAppPlanTier(isAr)] };
    });
    commit(next);
  };

  const removeTier = (planIndex: number, tierIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, tiers: plan.tiers.filter((_, idx) => idx !== tierIndex) };
    });
    commit(next);
  };

  const addFeature = (planIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, additionalFeatures: [...plan.additionalFeatures, ""] };
    });
    commit(next);
  };

  const updateFeature = (planIndex: number, featureIndex: number, valueText: string) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return {
        ...plan,
        additionalFeatures: plan.additionalFeatures.map((feature, idx) => (idx === featureIndex ? valueText : feature)),
      };
    });
    commit(next);
  };

  const removeFeature = (planIndex: number, featureIndex: number) => {
    const next = plans.map((plan, i) => {
      if (i !== planIndex) return plan;
      return { ...plan, additionalFeatures: plan.additionalFeatures.filter((_, idx) => idx !== featureIndex) };
    });
    commit(next);
  };

  return (
    <div className="space-y-4">
      <label className="text-xs text-gray-500 block">{isAr ? "تفاصيل باقات واتساب" : "WhatsApp package details"}</label>
      {plans.map((plan, planIndex) => (
        <div key={`${plan.id}-${planIndex}`} className="border border-gray-200 rounded-xl p-4 bg-white space-y-4">
          <div className="flex items-center justify-between">
            <h5 className="text-sm text-[#104E8B]">{isAr ? `الباقة ${planIndex + 1}` : `Package ${planIndex + 1}`}</h5>
            <button
              onClick={() => removePlan(planIndex)}
              className="text-xs text-red-500 hover:text-red-600 hover:underline"
            >
              {isAr ? "حذف الباقة" : "Delete package"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={plan.name}
              onChange={(e) => updatePlan(planIndex, { name: e.target.value })}
              placeholder={isAr ? "اسم الباقة" : "Package name"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={plan.period}
              onChange={(e) => updatePlan(planIndex, { period: e.target.value })}
              placeholder={isAr ? "الدورية (مثال: شهرياً)" : "Period (e.g. Monthly)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={plan.badge}
              onChange={(e) => updatePlan(planIndex, { badge: e.target.value })}
              placeholder={isAr ? "شارة الباقة الشائعة" : "Popular badge text"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-xs text-gray-600 px-1">
              <input
                type="checkbox"
                checked={plan.popular}
                onChange={(e) => updatePlan(planIndex, { popular: e.target.checked })}
              />
              {isAr ? "تمييز هذه الباقة كالأكثر طلباً" : "Mark this package as most popular"}
            </label>
            <input
              type="text"
              value={plan.subscribeLabel}
              onChange={(e) => updatePlan(planIndex, { subscribeLabel: e.target.value })}
              placeholder={isAr ? "نص زر الاشتراك" : "Subscribe button text"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <div className="flex items-center gap-2">
              <select
                value={plan.subscribeUrlType || 'external'}
                onChange={(e) => updatePlan(planIndex, { subscribeUrlType: e.target.value as 'form' | 'external' })}
                className="border border-gray-200 rounded-md px-2 py-2 text-xs bg-white"
              >
                <option value="form">{isAr ? "فورم طلب الخدمة" : "Request Form"}</option>
                <option value="external">{isAr ? "رابط خارجي" : "External URL"}</option>
              </select>
              {plan.subscribeUrlType === 'external' && (
                <input
                  type="url"
                  value={plan.subscribeUrl}
                  onChange={(e) => updatePlan(planIndex, { subscribeUrl: e.target.value })}
                  placeholder={isAr ? "رابط الاشتراك" : "Subscribe URL"}
                  className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                  dir="ltr"
                />
              )}
              {plan.subscribeUrlType === 'form' && (
                <span className="text-xs text-gray-500 flex-1">
                  {isAr ? "سيتم توجيه المستخدم لفورم الطلب" : "User will be directed to request form"}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{isAr ? "المميزات الإضافية" : "Additional features"}</p>
              <button
                onClick={() => addFeature(planIndex)}
                className="text-xs text-[#104E8B] hover:text-[#0A2647] hover:underline"
              >
                {isAr ? "إضافة ميزة" : "Add feature"}
              </button>
            </div>
            {plan.additionalFeatures.map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(planIndex, featureIndex, e.target.value)}
                  placeholder={isAr ? "ميزة الباقة" : "Package feature"}
                  className="flex-1 border border-gray-200 rounded-md px-3 py-2 text-sm"
                />
                <button
                  onClick={() => removeFeature(planIndex, featureIndex)}
                  className="text-xs text-red-500 hover:text-red-600 hover:underline"
                >
                  {isAr ? "حذف" : "Delete"}
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{isAr ? "شرائح الباقة" : "Package tiers"}</p>
              <button
                onClick={() => addTier(planIndex)}
                className="text-xs text-[#104E8B] hover:text-[#0A2647] hover:underline"
              >
                {isAr ? "إضافة شريحة" : "Add tier"}
              </button>
            </div>

            {plan.tiers.map((tier, tierIndex) => (
              <div key={tierIndex} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">{isAr ? `الشريحة ${tierIndex + 1}` : `Tier ${tierIndex + 1}`}</p>
                  <button
                    onClick={() => removeTier(planIndex, tierIndex)}
                    className="text-xs text-red-500 hover:text-red-600 hover:underline"
                  >
                    {isAr ? "حذف الشريحة" : "Delete tier"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTier(planIndex, tierIndex, { name: e.target.value })}
                    placeholder={isAr ? "اسم الشريحة" : "Tier name"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={tier.price}
                    onChange={(e) => updateTier(planIndex, tierIndex, { price: e.target.value })}
                    placeholder={isAr ? "السعر" : "Price"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={tier.priceWithTax}
                    onChange={(e) => updateTier(planIndex, tierIndex, { priceWithTax: e.target.value })}
                    placeholder={isAr ? "السعر شامل الضريبة" : "Tax-included price"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={tier.setupFee}
                    onChange={(e) => updateTier(planIndex, tierIndex, { setupFee: e.target.value })}
                    placeholder={isAr ? "رسوم التأسيس" : "Setup fee"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={tier.conversations}
                    onChange={(e) => updateTier(planIndex, tierIndex, { conversations: e.target.value })}
                    placeholder={isAr ? "عدد المحادثات" : "Conversations"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={tier.broadcastMessages}
                    onChange={(e) => updateTier(planIndex, tierIndex, { broadcastMessages: e.target.value })}
                    placeholder={isAr ? "رسائل البث" : "Broadcast messages"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                  <input
                    type="text"
                    value={tier.users}
                    onChange={(e) => updateTier(planIndex, tierIndex, { users: e.target.value })}
                    placeholder={isAr ? "عدد المستخدمين" : "Users"}
                    className="border border-gray-200 rounded-md px-2.5 py-2 text-xs"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={addPlan}
        className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {isAr ? "إضافة باقة واتساب" : "Add WhatsApp package"}
      </button>
      <p className="text-[11px] text-gray-400">
        {isAr
          ? "يتم حفظ الباقات والشرائح بصيغة منظمة لعرضها تلقائياً في صفحة المنتج."
          : "Packages and tiers are saved in a structured format for automatic product-page rendering."}
      </p>
    </div>
  );
};

const WhatsAppApiPricesEditor = ({ value, onChange, isAr }: { value: string; onChange: (value: string) => void; isAr: boolean }) => {
  const rows = parseWhatsAppConversationPrices(value, []);

  const commit = (next: WhatsAppConversationPrice[]) => {
    onChange(serializeWhatsAppConversationPrices(next));
  };

  const updateRow = (index: number, patch: Partial<WhatsAppConversationPrice>) => {
    const next = rows.map((row, i) => {
      if (i !== index) return row;
      const updated = { ...row, ...patch };
      if (updated.isFree && !updated.price.trim()) {
        return { ...updated, price: isAr ? "مجانية" : "Free" };
      }
      return updated;
    });
    commit(next);
  };

  const addRow = () => {
    commit([...rows, defaultWhatsAppApiPrice(isAr)]);
  };

  const removeRow = (index: number) => {
    commit(rows.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs text-gray-500 block">{isAr ? "أسعار محادثات API" : "API conversation prices"}</label>
      {rows.map((row, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={row.type}
              onChange={(e) => updateRow(index, { type: e.target.value })}
              placeholder={isAr ? "نوع المحادثة" : "Conversation type"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={row.price}
              onChange={(e) => updateRow(index, { price: e.target.value })}
              placeholder={isAr ? "السعر (أو مجانية)" : "Price (or Free)"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <input
              type="text"
              value={row.duration}
              onChange={(e) => updateRow(index, { duration: e.target.value })}
              placeholder={isAr ? "المدة" : "Duration"}
              className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-xs text-gray-600 px-1">
              <input
                type="checkbox"
                checked={row.isFree}
                onChange={(e) => updateRow(index, { isFree: e.target.checked })}
              />
              {isAr ? "محادثة مجانية" : "Free conversation"}
            </label>
          </div>
          <textarea
            rows={2}
            value={row.description}
            onChange={(e) => updateRow(index, { description: e.target.value })}
            placeholder={isAr ? "وصف المحادثة" : "Conversation description"}
            className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm resize-none"
          />
          <button
            onClick={() => removeRow(index)}
            className="text-xs text-red-500 hover:text-red-600 hover:underline"
          >
            {isAr ? "حذف النوع" : "Delete type"}
          </button>
        </div>
      ))}
      <button
        onClick={addRow}
        className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        {isAr ? "إضافة نوع محادثة" : "Add conversation type"}
      </button>
      <p className="text-[11px] text-gray-400">
        {isAr
          ? "يمكنك التحكم الكامل في أنواع المحادثات وتسعيرها كما تظهر في صفحة واتساب."
          : "You can fully control conversation types and their pricing as shown on the WhatsApp page."}
      </p>
    </div>
  );
};

const FieldEditor = ({ field, lang, isAr, onChange }: { field: SectionField; lang: "ar" | "en"; isAr: boolean; onChange: (val: string) => void }) => {
  const currentValue = lang === "en" ? (field.valueEn || "") : field.value;
  const fieldLabel = isAr ? field.label : field.labelEn;

  if (field.type === "list") {
    const items = currentValue.split("\n").filter(Boolean);
    return (
      <div>
        <label className="text-xs text-gray-500 mb-2 block">{fieldLabel}</label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-5 text-center">{i + 1}</span>
              <input
                type="text"
                value={item}
                onChange={(e) => {
                  const newItems = [...items];
                  newItems[i] = e.target.value;
                  onChange(newItems.join("\n"));
                }}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] bg-white"
                dir={lang === "ar" ? "rtl" : "ltr"}
              />
              <button
                onClick={() => {
                  const newItems = items.filter((_, idx) => idx !== i);
                  onChange(newItems.join("\n"));
                }}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onChange([...items, ""].join("\n"))}
            className="flex items-center gap-1 text-xs text-[#104E8B] hover:text-[#0A2647] transition-colors mt-1"
          >
            <Plus className="w-3.5 h-3.5" />
            {isAr ? "إضافة عنصر" : "Add Item"}
          </button>
        </div>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div>
        <label className="text-xs text-gray-500 mb-1 block">{fieldLabel}</label>
        <textarea
          rows={3}
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] resize-none bg-white"
          dir={lang === "ar" ? "rtl" : "ltr"}
        />
      </div>
    );
  }

  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{fieldLabel}</label>
      <input
        type={field.type === "url" ? "url" : "text"}
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B] bg-white"
        dir={field.type === "url" ? "ltr" : (lang === "ar" ? "rtl" : "ltr")}
      />
    </div>
  );
};

// ──────────────────── Partners View ────────────────────
const PartnersView = ({ isAr }: { isAr: boolean }) => {
  const { partners, addPartner, removePartner, togglePartner, updatePartnerName } = useSiteData();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newLogoUrl, setNewLogoUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeCount = partners.filter(p => p.active).length;

  const handleAdd = () => {
    if (!newName.trim()) {
      toast.error(isAr ? "يرجى إدخال اسم الشريك" : "Please enter partner name");
      return;
    }
    // Use a placeholder if no logo URL is given
    const logo = newLogoUrl.trim() || "https://placehold.co/200x100/104E8B/white?text=" + encodeURIComponent(newName.trim().slice(0, 10));
    addPartner(newName.trim(), logo);
    setNewName("");
    setNewLogoUrl("");
    setShowAddForm(false);
    toast.success(isAr ? `تمت إضافة "${newName.trim()}" بنجاح` : `"${newName.trim()}" added successfully`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewLogoUrl(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEditing = () => {
    if (editingId && editingName.trim()) {
      updatePartnerName(editingId, editingName.trim());
      toast.success(isAr ? "تم تحديث الاسم" : "Name updated");
    }
    setEditingId(null);
    setEditingName("");
  };

  const handlePartnerDelete = (partner: { id: string; logo: string; active: boolean }) => {
    if (isTrustedFolderLogo(partner.logo)) {
      if (partner.active) {
        togglePartner(partner.id);
        toast.success(isAr ? "تم إخفاء الشريك من العرض" : "Partner hidden from display");
      } else {
        toast.success(isAr ? "هذا الشريك مخفي بالفعل" : "This partner is already hidden");
      }
      return;
    }
    removePartner(partner.id);
    toast.success(isAr ? "تم حذف الشريك" : "Partner removed");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">
            {isAr
              ? `إدارة شعارات شركاء النجاح المعروضة في الصفحة الرئيسية وصفحة الرسائل النصية`
              : `Manage success partner logos displayed on the Home and SMS pages`}
          </p>
          <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-2">
            <Badge className="bg-[#104E8B]/10 text-[#104E8B]">{partners.length} {isAr ? "إجمالي" : "total"}</Badge>
            <Badge className="bg-green-100 text-green-700">{activeCount} {isAr ? "نشط" : "active"}</Badge>
            <Badge className="bg-gray-100 text-gray-500">{partners.length - activeCount} {isAr ? "معطل" : "inactive"}</Badge>
          </div>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-[#104E8B] hover:bg-[#0A2647] text-white w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          {isAr ? "إضافة شريك جديد" : "Add New Partner"}
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-[#104E8B]/5 border border-[#104E8B]/20 rounded-xl p-4 flex items-start gap-3">
        <Handshake className="w-5 h-5 text-[#104E8B] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-[#104E8B]">
            {isAr
              ? "شركاء النجاح يظهرون تلقائياً في شريط الصفحة الرئيسية وصفحة خدمة الرسائل النصية SMS. يمكنك تعطيل أو حذف أي شريك."
              : "Success partners automatically appear on the Home page and SMS page strips. You can disable or delete any partner."}
          </p>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <Card className="border-2 border-[#104E8B]/30 shadow-md">
          <CardHeader>
            <CardTitle className="text-sm text-[#104E8B]">{isAr ? "إضافة شريك جديد" : "Add New Partner"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{isAr ? "اسم الشريك" : "Partner Name"}</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={isAr ? "مثال: شركة أرامكو" : "e.g. Aramco"}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">{isAr ? "شعار الشريك" : "Partner Logo"}</label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  placeholder={isAr ? "رابط الشعار (URL) أو ارفع صورة" : "Logo URL or upload image"}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20 focus:border-[#104E8B]"
                  dir="ltr"
                />
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-gray-200 text-gray-600 h-9 w-full sm:w-auto"
                >
                  <Upload className="w-4 h-4" />
                  {isAr ? "رفع" : "Upload"}
                </Button>
              </div>
              {newLogoUrl && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 inline-block">
                  <img src={resolvePartnerLogoSrc(newLogoUrl)} alt="Preview" className="h-12 max-w-[120px] object-contain" />
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button onClick={handleAdd} className="bg-[#104E8B] hover:bg-[#0A2647] text-white w-full sm:w-auto">
                <CheckCircle className="w-4 h-4" />
                {isAr ? "إضافة" : "Add"}
              </Button>
              <Button variant="outline" onClick={() => { setShowAddForm(false); setNewName(""); setNewLogoUrl(""); }} className="border-gray-200 text-gray-600 w-full sm:w-auto">
                <XCircle className="w-4 h-4" />
                {isAr ? "إلغاء" : "Cancel"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {partners.map((partner) => (
          <Card
            key={partner.id}
            className={`border shadow-sm hover:shadow-md transition-all group overflow-hidden ${
              partner.active ? "border-gray-100" : "border-red-200 bg-red-50/30"
            }`}
          >
            {/* Logo Preview */}
            <div className="aspect-[2/1] bg-white flex items-center justify-center p-4 border-b border-gray-100 relative">
              <img
                src={resolvePartnerLogoSrc(partner.logo)}
                alt={partner.name}
                className={`max-h-full max-w-full object-contain transition-all ${
                  partner.active ? "grayscale-0 opacity-100" : "grayscale opacity-40"
                }`}
              />
              {!partner.active && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50/60">
                  <Badge className="bg-red-100 text-red-600 text-xs">{isAr ? "معطل" : "Inactive"}</Badge>
                </div>
              )}
            </div>

            {/* Partner Info */}
            <CardContent className="p-3">
              {editingId === partner.id ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEditing()}
                    className="flex-1 border border-[#104E8B] rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20"
                    autoFocus
                  />
                  <button onClick={saveEditing} className="p-1 text-green-600 hover:bg-green-50 rounded">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-800 truncate" title={partner.name}>{partner.name}</p>
              )}

              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(partner.id, partner.name)}
                    className="p-1.5 text-gray-400 hover:text-[#104E8B] hover:bg-[#104E8B]/5 rounded-md transition-colors"
                    title={isAr ? "تعديل الاسم" : "Edit Name"}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePartnerDelete(partner)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title={isTrustedFolderLogo(partner.logo)
                      ? (isAr ? "إخفاء (مُدار من مجلد TrustedLogos)" : "Hide (managed from TrustedLogos folder)")
                      : (isAr ? "حذف" : "Delete")}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={() => togglePartner(partner.id)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    partner.active
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {partner.active ? (isAr ? "نشط" : "Active") : (isAr ? "معطل" : "Inactive")}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ──────────────────── WhatsApp Requests View ────────────────────
const WhatsAppRequestsView = ({ isAr }: { isAr: boolean }) => {
  const { whatsAppRequests, fetchWhatsAppRequests, updateWhatsAppRequestStatus, deleteWhatsAppRequest } = useSiteData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = whatsAppRequests.find(r => (r._id || r.id) === selectedId);
  const newCount = whatsAppRequests.filter(r => r.status === 'new').length;
  const formatDate = (d: string) => { try { return new Date(d).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" }); } catch { return d; } };

  const statusLabels: Record<string, string> = {
    "new": isAr ? "جديد" : "New",
    "contacted": isAr ? "تم التواصل" : "Contacted",
    "closed": isAr ? "مغلق" : "Closed",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Badge className="bg-[#25D366]/10 text-[#25D366]">{whatsAppRequests.length} {isAr ? "إجمالي" : "total"}</Badge>
        {newCount > 0 && <Badge className="bg-[#25D366] text-white">{newCount} {isAr ? "جديد" : "new"}</Badge>}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {whatsAppRequests.length === 0 ? (
                <div className="p-12 text-center text-gray-400"><MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>{isAr ? "لا توجد طلبات" : "No requests"}</p></div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {whatsAppRequests.map((req) => (
                    <div key={req._id || req.id || req.email + req.phone} onClick={() => setSelectedId(req._id || req.id || null)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === (req._id || req.id) ? `bg-[#25D366]/5 ${isAr ? "border-r-4" : "border-l-4"} border-[#25D366]` : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {req.status === 'new' && <span className="w-2 h-2 bg-[#25D366] rounded-full flex-shrink-0"></span>}
                            <span className="text-sm text-gray-900">{req.name}</span>
                            <Badge className={req.status === 'new' ? 'bg-[#25D366] text-white text-[10px]' : req.status === 'contacted' ? 'bg-blue-100 text-blue-700 text-[10px]' : 'bg-gray-100 text-gray-500 text-[10px]'}>
                              {statusLabels[req.status] || req.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate" dir="ltr">{req.phone} • {req.email}</p>
                          <p className="text-xs text-gray-400 mt-1">{req.companyName || '-'} • {req.planId}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(req.createdAt)}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteWhatsAppRequest(req._id || req.id); toast.success(isAr ? "تم الحذف" : "Deleted"); }}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {selected ? (
            <Card className="border-0 shadow-sm lg:sticky lg:top-20">
              <CardHeader><CardTitle className="text-sm text-[#25D366]">{isAr ? "تفاصيل الطلب" : "Details"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-xs text-gray-400">{isAr ? "الاسم" : "Name"}</label><p className="text-sm text-gray-800">{selected.name}</p></div>
                <div><label className="text-xs text-gray-400">{isAr ? "البريد" : "Email"}</label><p className="text-sm text-gray-800" dir="ltr">{selected.email}</p></div>
                <div><label className="text-xs text-gray-400">{isAr ? "الجوال" : "Phone"}</label><p className="text-sm text-gray-800" dir="ltr">{selected.phone}</p></div>
                {selected.companyName && <div><label className="text-xs text-gray-400">{isAr ? "الشركة" : "Company"}</label><p className="text-sm text-gray-800">{selected.companyName}</p></div>}
                <div><label className="text-xs text-gray-400">{isAr ? "الباقة" : "Package"}</label><p className="text-sm text-gray-800">{selected.planId} - {selected.tierId}</p></div>
                {selected.industry && <div><label className="text-xs text-gray-400">{isAr ? "الصناعة" : "Industry"}</label><p className="text-sm text-gray-800">{selected.industry}</p></div>}
                {selected.goal && <div><label className="text-xs text-gray-400">{isAr ? "الهدف" : "Goal"}</label><p className="text-sm text-gray-800">{selected.goal}</p></div>}
                {selected.employeeCount && <div><label className="text-xs text-gray-400">{isAr ? "عدد الموظفين" : "Employees"}</label><p className="text-sm text-gray-800">{selected.employeeCount}</p></div>}
                <div><label className="text-xs text-gray-400">{isAr ? "التاريخ" : "Date"}</label><p className="text-sm text-gray-800">{formatDate(selected.createdAt)}</p></div>
                <div><label className="text-xs text-gray-400">{isAr ? "الحالة" : "Status"}</label>
                  <select value={selected.status} onChange={(e) => updateWhatsAppRequestStatus(selected._id || selected.id, e.target.value)}
                    className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="new">{isAr ? "جديد" : "New"}</option>
                    <option value="contacted">{isAr ? "تم التواصل" : "Contacted"}</option>
                    <option value="closed">{isAr ? "مغلق" : "Closed"}</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-[#25D366] hover:bg-[#1da954] text-white" asChild><a href={`mailto:${selected.email}`}><Mail className="w-3.5 h-3.5" />{isAr ? "رد" : "Reply"}</a></Button>
                  <Button size="sm" className="flex-1 bg-[#25D366] hover:bg-[#1da954] text-white" asChild><a href={`https://wa.me/${selected.phone.replace(/^0/, "966")}`} target="_blank"><Phone className="w-3.5 h-3.5" />{isAr ? "واتساب" : "WA"}</a></Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">{isAr ? "اختر طلباً لعرض التفاصيل" : "Select to view"}</p></CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────── Submissions View ────────────────────
const SubmissionsView = ({ isAr }: { isAr: boolean }) => {
  const { contactSubmissions, markSubmissionRead, deleteSubmission, notificationEmail, setNotificationEmail } = useSiteData();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [emailEdit, setEmailEdit] = useState(notificationEmail);
  const unreadCount = contactSubmissions.filter(s => !s.read).length;
  const selected = contactSubmissions.find(s => s.id === selectedId);
  const productLabels: Record<string, string> = { "sms": "SMS", "whatsapp": "واتساب", "o-time": "O-Time", "gov-gate": "Gov Gate", "other": isAr ? "عام" : "General" };
  const formatDate = (d: string) => { try { return new Date(d).toLocaleString("ar-SA", { dateStyle: "medium", timeStyle: "short" }); } catch { return d; } };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#104E8B]" /><span className="text-sm text-gray-700">{isAr ? "بريد الإشعارات:" : "Notification email:"}</span></div>
            <input type="email" value={emailEdit} onChange={(e) => setEmailEdit(e.target.value)} className="flex-1 max-w-sm border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" dir="ltr" />
            <Button size="sm" onClick={() => { setNotificationEmail(emailEdit); toast.success(isAr ? "تم تحديث بريد الإشعارات" : "Updated"); }} className="bg-[#104E8B] hover:bg-[#0A2647] text-white h-9"><Save className="w-3.5 h-3.5" />{isAr ? "حفظ" : "Save"}</Button>
          </div>
          <p className="text-xs text-gray-400 mt-2">{isAr ? "عند استلام طلب تواصل جديد، سيتم إرسال إشعار إلى هذا البريد تلقائياً" : "New submissions trigger a notification to this email"}</p>
        </CardContent>
      </Card>
      <div className="flex items-center gap-3">
        <Badge className="bg-[#104E8B]/10 text-[#104E8B]">{contactSubmissions.length} {isAr ? "إجمالي" : "total"}</Badge>
        {unreadCount > 0 && <Badge className="bg-red-100 text-red-700">{unreadCount} {isAr ? "غير مقروء" : "unread"}</Badge>}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              {contactSubmissions.length === 0 ? (
                <div className="p-12 text-center text-gray-400"><Inbox className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>{isAr ? "لا توجد طلبات" : "No submissions"}</p></div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {contactSubmissions.map((sub) => (
                    <div key={sub.id} onClick={() => { setSelectedId(sub.id); if (!sub.read) markSubmissionRead(sub.id); }}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === sub.id ? `bg-[#104E8B]/5 ${isAr ? "border-r-4" : "border-l-4"} border-[#104E8B]` : ""} ${!sub.read ? "bg-blue-50/30" : ""}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {!sub.read && <span className="w-2 h-2 bg-[#104E8B] rounded-full flex-shrink-0"></span>}
                            <span className="text-sm text-gray-900">{sub.name}</span>
                            {sub.product && <Badge className="bg-gray-100 text-gray-500 text-[10px]">{productLabels[sub.product] || sub.product}</Badge>}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 truncate">{sub.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatDate(sub.date)}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); deleteSubmission(sub.id); toast.success(isAr ? "تم الحذف" : "Deleted"); }}
                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div>
          {selected ? (
            <Card className="border-0 shadow-sm lg:sticky lg:top-20">
              <CardHeader><CardTitle className="text-sm text-[#104E8B]">{isAr ? "تفاصيل الطلب" : "Details"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-xs text-gray-400">{isAr ? "الاسم" : "Name"}</label><p className="text-sm text-gray-800">{selected.name}</p></div>
                <div><label className="text-xs text-gray-400">{isAr ? "البريد" : "Email"}</label><p className="text-sm text-gray-800" dir="ltr">{selected.email}</p></div>
                <div><label className="text-xs text-gray-400">{isAr ? "الجوال" : "Phone"}</label><p className="text-sm text-gray-800" dir="ltr">{selected.phone}</p></div>
                {selected.company && <div><label className="text-xs text-gray-400">{isAr ? "الشركة" : "Company"}</label><p className="text-sm text-gray-800">{selected.company}</p></div>}
                {selected.product && <div><label className="text-xs text-gray-400">{isAr ? "الخدمة" : "Product"}</label><Badge className="bg-[#104E8B]/10 text-[#104E8B] text-xs">{productLabels[selected.product] || selected.product}</Badge></div>}
                <div><label className="text-xs text-gray-400">{isAr ? "الرسالة" : "Message"}</label><p className="text-sm text-gray-800 bg-gray-50 rounded-lg p-3 mt-1">{selected.message}</p></div>
                <div><label className="text-xs text-gray-400">{isAr ? "التاريخ" : "Date"}</label><p className="text-sm text-gray-800">{formatDate(selected.date)}</p></div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" asChild><a href={`mailto:${selected.email}`}><Mail className="w-3.5 h-3.5" />{isAr ? "رد" : "Reply"}</a></Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700 text-white" asChild><a href={`https://wa.me/${selected.phone.replace(/^0/, "966")}`} target="_blank"><Phone className="w-3.5 h-3.5" />{isAr ? "واتساب" : "WA"}</a></Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-0 shadow-sm"><CardContent className="p-12 text-center text-gray-400"><MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" /><p className="text-sm">{isAr ? "اختر طلباً لعرض التفاصيل" : "Select to view"}</p></CardContent></Card>
          )}
        </div>
      </div>
    </div>
  );
};

// ──────────────────── Footer View ────────────────────
const FooterView = ({ isAr }: { isAr: boolean }) => {
  const { footerData, setFooterData, saveSiteData, isSyncing } = useSiteData();

  const updateField = (key: keyof FooterData, value: string) => {
    setFooterData((prev) => ({ ...prev, [key]: value }));
  };

  const updateNavItem = (group: "quickLinks" | "solutions", id: string, updates: Partial<FooterNavItem>) => {
    setFooterData((prev) => ({
      ...prev,
      [group]: prev[group].map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  };

  const addNavItem = (group: "quickLinks" | "solutions") => {
    const id = `${group}-${Date.now()}`;
    setFooterData((prev) => ({
      ...prev,
      [group]: [...prev[group], { id, labelAr: isAr ? "رابط جديد" : "New link", labelEn: "New link", href: "/" }],
    }));
  };

  const ensureQuickLinkPreset = (preset: FooterNavItem) => {
    setFooterData((prev) => {
      if (prev.quickLinks.some((item) => item.id === preset.id)) {
        return prev;
      }
      return {
        ...prev,
        quickLinks: [...prev.quickLinks, preset],
      };
    });
  };

  const removeNavItem = (group: "quickLinks" | "solutions", id: string) => {
    setFooterData((prev) => ({ ...prev, [group]: prev[group].filter((item) => item.id !== id) }));
  };

  const addSocialItem = () => {
    const id = `social-${Date.now()}`;
    setFooterData((prev) => ({
      ...prev,
      socialItems: [
        ...prev.socialItems,
        { id, platform: "New Platform", icon: "globe", url: "", active: true, openInNewTab: true },
      ],
    }));
  };

  const updateSocialItem = (id: string, updates: Partial<FooterSocialItem>) => {
    setFooterData((prev) => ({
      ...prev,
      socialItems: prev.socialItems.map((item) => (item.id === id ? { ...item, ...updates } : item)),
    }));
  };

  const removeSocialItem = (id: string) => {
    setFooterData((prev) => ({
      ...prev,
      socialItems: prev.socialItems.filter((item) => item.id !== id),
    }));
  };

  const uploadLogo = async (key: "logoDefault" | "logoDark" | "logoWhatsApp", file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("/api/upload-image", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    if (!data?.url) throw new Error("No upload URL");
    updateField(key, data.url as string);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <p className="text-sm text-gray-500">{isAr ? "إدارة كاملة لمحتوى الفوتر مع حفظ دائم في قاعدة البيانات." : "Full footer CMS with permanent database persistence."}</p>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#104E8B]">{isAr ? "الشعارات" : "Logos"}</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-4">
          {[
            { key: "logoDefault" as const, label: isAr ? "شعار عادي" : "Default Logo" },
            { key: "logoDark" as const, label: isAr ? "شعار الوضع الداكن" : "Dark Theme Logo" },
            { key: "logoWhatsApp" as const, label: isAr ? "شعار صفحة واتساب" : "WhatsApp Page Logo" },
          ].map((item) => (
            <div key={item.key} className="space-y-2">
              <label className="text-sm text-gray-600 block">{item.label}</label>
              <input
                type="text"
                value={footerData[item.key]}
                onChange={(e) => updateField(item.key, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                dir="ltr"
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    await uploadLogo(item.key, file);
                    toast.success(isAr ? "تم رفع الشعار" : "Logo uploaded");
                  } catch {
                    toast.error(isAr ? "فشل رفع الشعار" : "Logo upload failed");
                  }
                }}
                className="block w-full text-xs"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#104E8B]">{isAr ? "النصوص العامة" : "General Texts"}</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {[
            ["licensedByAr", isAr ? "مرخصة من" : "Licensed By (AR)"],
            ["licensedByEn", isAr ? "Licensed By (EN)" : "Licensed By (EN)"],
            ["madeInSaudiAr", isAr ? "صنع في السعودية" : "Made in Saudi (AR)"],
            ["madeInSaudiEn", isAr ? "Made in Saudi (EN)" : "Made in Saudi (EN)"],
            ["copyrightAr", isAr ? "حقوق النشر عربي" : "Copyright (AR)"],
            ["copyrightEn", isAr ? "حقوق النشر إنجليزي" : "Copyright (EN)"],
            ["countryAr", isAr ? "الدولة عربي" : "Country (AR)"],
            ["countryEn", isAr ? "الدولة إنجليزي" : "Country (EN)"],
            ["commercialRegistryAr", isAr ? "السجل التجاري عربي" : "Commercial Registry (AR)"],
            ["commercialRegistryEn", isAr ? "السجل التجاري إنجليزي" : "Commercial Registry (EN)"],
            ["licenseAr", isAr ? "الترخيص عربي" : "License (AR)"],
            ["licenseEn", isAr ? "الترخيص إنجليزي" : "License (EN)"],
          ].map(([field, label]) => (
            <div key={field as string}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <input
                type="text"
                value={footerData[field as keyof FooterData] as string}
                onChange={(e) => updateField(field as keyof FooterData, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#104E8B]">{isAr ? "بيانات التواصل" : "Contact Data"}</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {[
            ["phoneLabelAr", isAr ? "عنوان الهاتف عربي" : "Phone Label (AR)"],
            ["phoneLabelEn", isAr ? "عنوان الهاتف إنجليزي" : "Phone Label (EN)"],
            ["phoneNumber", isAr ? "رقم الهاتف" : "Phone Number"],
            ["emailLabelAr", isAr ? "عنوان البريد عربي" : "Email Label (AR)"],
            ["emailLabelEn", isAr ? "عنوان البريد إنجليزي" : "Email Label (EN)"],
            ["emailAddress", isAr ? "البريد الإلكتروني" : "Email Address"],
            ["addressLabelAr", isAr ? "عنوان الموقع عربي" : "Address Label (AR)"],
            ["addressLabelEn", isAr ? "عنوان الموقع إنجليزي" : "Address Label (EN)"],
            ["addressDetailAr", isAr ? "تفاصيل العنوان عربي" : "Address Details (AR)"],
            ["addressDetailEn", isAr ? "تفاصيل العنوان إنجليزي" : "Address Details (EN)"],
          ].map(([field, label]) => (
            <div key={field as string}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <input
                type="text"
                value={footerData[field as keyof FooterData] as string}
                onChange={(e) => updateField(field as keyof FooterData, e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                dir={String(field).toLowerCase().includes("url") || String(field).includes("email") || String(field).includes("phone") ? "ltr" : undefined}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg text-[#104E8B]">{isAr ? "روابط التواصل الاجتماعي" : "Social Media Links"}</CardTitle>
            <Button size="sm" className="bg-[#104E8B] hover:bg-[#0A2647] text-white w-full sm:w-auto" onClick={addSocialItem}>
              <Plus className="w-3.5 h-3.5" />
              {isAr ? "إضافة منصة" : "Add Platform"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {footerData.socialItems.map((item) => (
            <div key={item.id} className={`grid lg:grid-cols-6 gap-2 p-3 rounded-lg border ${item.active ? "bg-gray-50 border-gray-200" : "bg-gray-100 border-gray-200 opacity-70"}`}>
              <input
                type="text"
                value={item.platform}
                onChange={(e) => updateSocialItem(item.id, { platform: e.target.value })}
                placeholder={isAr ? "اسم المنصة" : "Platform name"}
                className="border border-gray-200 rounded-md px-2 py-1.5 text-sm"
              />
              <select
                value={item.icon}
                onChange={(e) => updateSocialItem(item.id, { icon: e.target.value as FooterSocialItem["icon"] })}
                className="border border-gray-200 rounded-md px-2 py-1.5 text-sm bg-white"
              >
                <option value="instagram">Instagram</option>
                <option value="twitter">X / Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="facebook">Facebook</option>
                <option value="youtube">YouTube</option>
                <option value="github">GitHub</option>
                <option value="globe">{isAr ? "عام" : "General"}</option>
              </select>
              <input
                type="url"
                dir="ltr"
                value={item.url}
                onChange={(e) => updateSocialItem(item.id, { url: e.target.value })}
                placeholder="https://..."
                className="border border-gray-200 rounded-md px-2 py-1.5 text-sm lg:col-span-2"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateSocialItem(item.id, { active: !item.active })}
                  className={`px-2 py-1 rounded-md text-xs ${item.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {item.active ? (isAr ? "نشط" : "Active") : (isAr ? "مخفي" : "Hidden")}
                </button>
                <button
                  type="button"
                  onClick={() => updateSocialItem(item.id, { openInNewTab: !item.openInNewTab })}
                  className={`px-2 py-1 rounded-md text-xs ${item.openInNewTab ? "bg-blue-100 text-blue-700" : "bg-gray-200 text-gray-700"}`}
                >
                  {item.openInNewTab ? (isAr ? "تبويب جديد" : "New Tab") : (isAr ? "نفس الصفحة" : "Same Tab")}
                </button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => removeSocialItem(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {isAr ? "حذف" : "Delete"}
              </Button>
            </div>
          ))}
          {footerData.socialItems.length === 0 && (
            <p className="text-sm text-gray-500">{isAr ? "لا توجد منصات مضافة." : "No social platforms added yet."}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-3">
            <CardTitle className="text-lg text-[#104E8B]">{isAr ? "روابط سريعة" : "Quick Links"}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-blue-200 text-[#104E8B] hover:bg-blue-50"
                onClick={() => ensureQuickLinkPreset({ id: "ql-products", labelAr: "المنتجات", labelEn: "Products", href: "#footer-products" })}
              >
                {isAr ? "إضافة المنتجات" : "Add Products"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-200 text-[#104E8B] hover:bg-blue-50"
                onClick={() => ensureQuickLinkPreset({ id: "ql-blog", labelAr: "المدونة", labelEn: "Blog", href: "/blog" })}
              >
                {isAr ? "إضافة المدونة" : "Add Blog"}
              </Button>
              <Button size="sm" className="bg-[#104E8B] hover:bg-[#0A2647] text-white" onClick={() => addNavItem("quickLinks")}><Plus className="w-3.5 h-3.5" />{isAr ? "إضافة" : "Add"}</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-gray-500">
            {isAr ? "روابط النافبار الموصى بها: / ، /about-us ، #footer-products ، /blog ، /contact" : "Recommended navbar routes: /, /about-us, #footer-products, /blog, /contact"}
          </p>
          {footerData.quickLinks.map((item) => (
            <div key={item.id} className="grid md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
              <input className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={item.labelAr} onChange={(e) => updateNavItem("quickLinks", item.id, { labelAr: e.target.value })} placeholder={isAr ? "العنوان عربي" : "Arabic label"} />
              <input className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={item.labelEn} onChange={(e) => updateNavItem("quickLinks", item.id, { labelEn: e.target.value })} placeholder={isAr ? "العنوان إنجليزي" : "English label"} />
              <input className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={item.href} dir="ltr" onChange={(e) => updateNavItem("quickLinks", item.id, { href: e.target.value })} placeholder="/contact or /blog" />
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => removeNavItem("quickLinks", item.id)}><Trash2 className="w-3.5 h-3.5" />{isAr ? "حذف" : "Delete"}</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-lg text-[#104E8B]">{isAr ? "روابط المنتجات" : "Products Links"}</CardTitle>
            <Button size="sm" className="bg-[#104E8B] hover:bg-[#0A2647] text-white w-full sm:w-auto" onClick={() => addNavItem("solutions")}><Plus className="w-3.5 h-3.5" />{isAr ? "إضافة" : "Add"}</Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {footerData.solutions.map((item) => (
            <div key={item.id} className="grid md:grid-cols-4 gap-2 p-3 bg-gray-50 rounded-lg">
              <input className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={item.labelAr} onChange={(e) => updateNavItem("solutions", item.id, { labelAr: e.target.value })} placeholder={isAr ? "العنوان عربي" : "Arabic label"} />
              <input className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={item.labelEn} onChange={(e) => updateNavItem("solutions", item.id, { labelEn: e.target.value })} placeholder={isAr ? "العنوان إنجليزي" : "English label"} />
              <input className="border border-gray-200 rounded-md px-2 py-1 text-sm" value={item.href} dir="ltr" onChange={(e) => updateNavItem("solutions", item.id, { href: e.target.value })} placeholder="/products/sms" />
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => removeNavItem("solutions", item.id)}><Trash2 className="w-3.5 h-3.5" />{isAr ? "حذف" : "Delete"}</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Button
        onClick={async () => {
          const ok = await saveSiteData();
          toast.success(ok ? (isAr ? "تم حفظ إعدادات الفوتر" : "Footer settings saved") : (isAr ? "تعذر حفظ الفوتر" : "Failed to save footer settings"));
        }}
        disabled={isSyncing}
        className="bg-[#FFA502] hover:bg-[#E59400] text-white"
      >
        {isSyncing ? (isAr ? "جار الحفظ..." : "Saving...") : (isAr ? "حفظ الفوتر" : "Save Footer")}
      </Button>
    </div>
  );
};

// ──────────────────── Settings View ────────────────────
const SettingsView = ({ isAr }: { isAr: boolean }) => {
  const { notificationEmail, setNotificationEmail, saveSiteData, isSyncing } = useSiteData();
  const brandName = "CorBit | شركة المدار";

  return (
    <div className="space-y-6 max-w-3xl">
      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#104E8B]">{isAr ? "ملخص الإعدادات الفعلي" : "Effective Settings Summary"}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
            {isAr
              ? "تم تنظيف هذه الصفحة من الحقول الوهمية. الإعدادات هنا الآن مرتبطة بالنظام فعلياً."
              : "This page was cleaned from placeholder fields. Settings shown here now map to real system behavior."}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs text-gray-500">{isAr ? "اسم العلامة المعتمد" : "Current Brand Name"}</p>
              <p className="text-sm text-gray-900 mt-1">{brandName}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs text-gray-500">{isAr ? "إشعارات الطلبات" : "Submission Notifications"}</p>
              <p className="text-sm text-gray-900 mt-1" dir="ltr">{notificationEmail || "sales@orbit.sa"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="border-gray-200 text-gray-700 h-9" asChild>
              <Link href="/admin/footer">{isAr ? "إدارة الفوتر" : "Manage Footer"}</Link>
            </Button>
            <Button variant="outline" className="border-gray-200 text-gray-700 h-9" asChild>
              <Link href="/admin/pages">{isAr ? "إدارة الصفحات" : "Manage Pages"}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#104E8B]">{isAr ? "إشعارات طلبات التواصل" : "Contact Notifications"}</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div><label className="text-sm text-gray-600 mb-1 block">{isAr ? "بريد الإشعارات" : "Notification Email"}</label>
            <input type="email" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#104E8B]/20" dir="ltr" /></div>
          <div className="bg-[#104E8B]/5 border border-[#104E8B]/20 rounded-lg p-3"><p className="text-xs text-[#104E8B]">{isAr ? "عند استلام طلب تواصل جديد سيتم إرسال إشعار تلقائي إلى هذا البريد." : "New submissions trigger an automatic email to this address."}</p></div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader><CardTitle className="text-lg text-[#104E8B]">{isAr ? "Google SSO والهوية" : "Google SSO & Branding"}</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <p className="text-xs text-gray-500">{isAr ? "العنوان الحالي للموقع" : "Current Site/App Title"}</p>
            <p className="text-sm text-gray-900 mt-1">{brandName}</p>
          </div>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-900">
              {isAr
                ? "تم تحديث اسم الموقع في الكود إلى CorBit | شركة المدار. إذا ظل اسم Google SSO مختلفاً في نافذة جوجل، فذلك يُدار من Google Cloud Console (OAuth consent screen > App name)."
                : "Site/app name was updated in code to CorBit | شركة المدار. If Google SSO still shows an old name in Google's popup, it must be changed in Google Cloud Console (OAuth consent screen > App name)."}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={async () => {
          const ok = await saveSiteData();
          toast.success(ok ? (isAr ? "تم حفظ الإعدادات" : "Settings saved") : (isAr ? "تعذر حفظ الإعدادات" : "Failed to save settings"));
        }}
        disabled={isSyncing}
        className="bg-[#FFA502] hover:bg-[#E59400] text-white"
      >
        {isSyncing ? (isAr ? "جار الحفظ..." : "Saving...") : (isAr ? "حفظ الإعدادات" : "Save Settings")}
      </Button>
    </div>
  );
};
