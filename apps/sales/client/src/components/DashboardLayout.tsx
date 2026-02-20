/*
 * QuickBooks Authentic — Dashboard Layout
 * - Fixed left sidebar with icon rail + expandable navigation
 * - Top header with search bar, auth, and utility icons
 * - Create modal overlay
 * - Global search with command palette (Cmd+K)
 */
import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  Plus, Bookmark, Home, Rss, BarChart3, LayoutGrid,
  Calculator, CreditCard, DollarSign, Users, UserPlus,
  Receipt, Globe, Megaphone, Search, Settings, Bell,
  HelpCircle, ChevronDown, ChevronRight, MoreHorizontal,
  SlidersHorizontal, X, FileText, Banknote, ClipboardList,
  Calendar, LogIn, LogOut, User, Loader2
} from "lucide-react";
import { toast } from "sonner";
import NotificationCenter from "./NotificationCenter";

interface DashboardLayoutProps {
  children: ReactNode;
}

const sidebarSections = [
  {
    id: "accounting",
    label: "Accounting",
    icon: Calculator,
    color: "#0077C5",
    items: [
      { label: "Bank transactions", path: "/bank-transactions" },
      { label: "Integration transactions", path: "#" },
      { label: "Receipts", path: "#" },
      { label: "Reconcile", path: "/reconciliation" },
      { label: "Rules", path: "/bank-rules" },
      { label: "Chart of accounts", path: "/chart-of-accounts" },
      { label: "Recurring transactions", path: "/recurring" },
      { label: "Journal entries", path: "/journal-entries" },
      { label: "Audit log", path: "/audit-log" },
      { label: "Audit trail", path: "/audit-trail" },
    ],
  },
  {
    id: "expenses",
    label: "Expenses & Pay Bills",
    icon: CreditCard,
    color: "#2CA01C",
    items: [
      { label: "Expense transactions", path: "/expenses" },
      { label: "Bills", path: "/bills" },
      { label: "Suppliers", path: "/suppliers" },
      { label: "Mileage", path: "#" },
    ],
  },
  {
    id: "sales",
    label: "Sales & Get Paid",
    icon: DollarSign,
    color: "#0077C5",
    items: [
      { label: "Overview", path: "#" },
      { label: "Sales transactions", path: "#" },
      { label: "Invoices", path: "/invoices" },
      { label: "Payment links", path: "#" },
      { label: "QuickBooks payouts", path: "#" },
      { label: "Products & services", path: "/products-services" },
    ],
  },
  {
    id: "customer-hub",
    label: "Customer Hub",
    icon: Users,
    color: "#2CA01C",
    items: [
      { label: "Overview", path: "#" },
      { label: "Customers", path: "/customers" },
      { label: "Estimates", path: "/estimates" },
    ],
  },
  {
    id: "team",
    label: "Team",
    icon: UserPlus,
    color: "#0097A7",
    items: [],
  },
  {
    id: "sales-tax",
    label: "Sales Tax",
    icon: Receipt,
    color: "#D4380D",
    items: [
      { label: "Overview", path: "/sales-tax" },
    ],
  },
];

const createActions = [
  { label: "Invoice", icon: FileText, category: "Customers", path: "/invoices" },
  { label: "Payment link", icon: DollarSign, category: "Customers", path: "#" },
  { label: "Receive payment", icon: Banknote, category: "Customers", path: "#" },
  { label: "Estimate", icon: ClipboardList, category: "Customers", path: "/estimates" },
  { label: "Credit note", icon: FileText, category: "Customers", path: "#" },
  { label: "Sales receipt", icon: Receipt, category: "Customers", path: "#" },
  { label: "Refund receipt", icon: Receipt, category: "Customers", path: "#" },
  { label: "Delayed credit", icon: Calendar, category: "Customers", path: "#" },
  { label: "Delayed charge", icon: Calendar, category: "Customers", path: "#" },
  { label: "Expense", icon: CreditCard, category: "Suppliers", path: "/expenses" },
  { label: "Cheque", icon: FileText, category: "Suppliers", path: "#" },
  { label: "Bill", icon: FileText, category: "Suppliers", path: "/bills" },
  { label: "Pay bills", icon: Banknote, category: "Suppliers", path: "#" },
  { label: "Purchase order", icon: ClipboardList, category: "Suppliers", path: "#" },
  { label: "Supplier credit", icon: FileText, category: "Suppliers", path: "#" },
  { label: "Credit card credit", icon: CreditCard, category: "Suppliers", path: "#" },
  { label: "Bank deposit", icon: Banknote, category: "Other", path: "/deposits" },
  { label: "Transfer", icon: Banknote, category: "Other", path: "#" },
  { label: "Journal entry", icon: FileText, category: "Other", path: "/journal-entries" },
  { label: "Statement", icon: FileText, category: "Other", path: "#" },
  { label: "Inventory qty adjustment", icon: ClipboardList, category: "Other", path: "#" },
];

// Search result type mapping
const searchTypeIcons: Record<string, typeof Users> = {
  customers: Users,
  invoices: FileText,
  accounts: Calculator,
  products: Receipt,
  suppliers: CreditCard,
};

const searchTypeRoutes: Record<string, (id: number) => string> = {
  customers: (id) => `/customers`,
  invoices: (id) => `/invoices`,
  accounts: (id) => `/chart-of-accounts`,
  products: (id) => `/products-services`,
  suppliers: (id) => `/suppliers`,
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location, setLocation] = useLocation();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showNav, setShowNav] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, isAuthenticated, logout } = useAuth();

  // Company settings from API
  const { data: company } = trpc.company.get.useQuery();
  const companyName = company?.companyName || "RusingAcademy";
  const userName = user?.name || "Steven";

  // Global search
  const { data: searchResults, isLoading: searchLoading } = trpc.search.query.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length >= 2 }
  );

  const isHome = location === "/";
  const isReports = location === "/reports";

  // Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      if (e.key === "Escape") {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close nav panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showNav && navRef.current && !navRef.current.contains(e.target as Node)) {
        const target = e.target as HTMLElement;
        if (!target.closest('[data-sidebar-rail]')) {
          setShowNav(false);
        }
      }
      if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNav, showUserMenu]);

  const getActiveSection = () => {
    for (const section of sidebarSections) {
      for (const item of section.items) {
        if (item.path !== "#" && location === item.path) return section.id;
      }
    }
    return null;
  };

  const activeSection = getActiveSection();

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
  };

  const handleSearchSelect = (type: string, id: number) => {
    const routeFn = searchTypeRoutes[type];
    if (routeFn) {
      setLocation(routeFn(id));
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const totalSearchResults = searchResults
    ? Object.values(searchResults).reduce((sum, arr) => sum + (arr as any[]).length, 0)
    : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f5f8]">
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">Skip to main content</a>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Left Icon Sidebar */}
      <nav data-sidebar-rail className={`w-[64px] bg-white border-r border-gray-200 flex flex-col items-center py-2 shrink-0 z-50 transition-transform duration-200 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative h-full`} role="navigation" aria-label="Main navigation">
        <Link href="/" className="mb-1 p-2">
          <div className="w-8 h-8 bg-[#2CA01C] rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">QB</span>
          </div>
        </Link>

        <button
          className={`flex flex-col items-center py-2 px-1 text-[10px] w-full transition-colors ${showCreate ? "text-[#2CA01C]" : "text-gray-600 hover:text-gray-900"}`}
          onClick={() => { setShowCreate(!showCreate); setShowNav(false); }}
        >
          <Plus size={20} />
          <span className="mt-0.5">Create</span>
        </button>

        <button
          className="flex flex-col items-center py-2 px-1 text-[10px] text-gray-600 hover:text-gray-900 w-full"
          onClick={() => toast("Feature coming soon")}
        >
          <Bookmark size={20} />
          <span className="mt-0.5">Bookmarks</span>
        </button>

        <Link href="/" className={`flex flex-col items-center py-2 px-1 text-[10px] w-full ${isHome ? "text-gray-900 bg-gray-100 rounded" : "text-gray-600 hover:text-gray-900"}`}>
          <Home size={20} />
          <span className="mt-0.5">Home</span>
        </Link>

        <button
          className="flex flex-col items-center py-2 px-1 text-[10px] text-gray-600 hover:text-gray-900 w-full"
          onClick={() => toast("Feature coming soon")}
        >
          <Rss size={20} />
          <span className="mt-0.5">Feed</span>
        </button>

        <Link href="/reports" className={`flex flex-col items-center py-2 px-1 text-[10px] w-full ${isReports ? "text-gray-900 bg-gray-100 rounded" : "text-gray-600 hover:text-gray-900"}`}>
          <BarChart3 size={20} />
          <span className="mt-0.5">Reports</span>
        </Link>

        <button
          className="flex flex-col items-center py-2 px-1 text-[10px] text-gray-600 hover:text-gray-900 w-full"
          onClick={() => toast("Feature coming soon")}
        >
          <LayoutGrid size={20} />
          <span className="mt-0.5">My apps</span>
        </button>

        <div className="mt-3 border-t border-gray-200 pt-2 w-full">
          <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider text-center mb-1">Pinned</div>
          <button
            className={`flex flex-col items-center py-2 px-1 text-[10px] w-full ${activeSection === "accounting" ? "text-gray-900 bg-gray-100 rounded" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => { setShowNav(!showNav); setShowCreate(false); setExpandedSection("accounting"); }}
          >
            <Calculator size={20} />
            <span className="mt-0.5">Accounting</span>
          </button>
        </div>

        <div className="mt-auto">
          <button
            className={`flex flex-col items-center py-2 px-1 text-[10px] w-full ${showNav ? "text-gray-900 bg-gray-100 rounded" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => { setShowNav(!showNav); setShowCreate(false); }}
          >
            <MoreHorizontal size={20} />
            <span className="mt-0.5">More</span>
          </button>
          <button
            className="flex flex-col items-center py-2 px-1 text-[10px] text-gray-600 hover:text-gray-900 w-full"
            onClick={() => toast("Feature coming soon")}
          >
            <SlidersHorizontal size={20} />
            <span className="mt-0.5">Customize</span>
          </button>
        </div>
      </nav>

      {/* Expandable Navigation Panel */}
      {showNav && (
        <div ref={navRef} className="w-[260px] bg-white border-r border-gray-200 overflow-y-auto shrink-0 z-50 shadow-lg fixed lg:absolute left-[64px] top-0 h-full">
          <div className="p-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </div>
          {sidebarSections.map((section) => (
            <div key={section.id}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-medium ${activeSection === section.id ? "text-gray-900 bg-gray-50" : "text-gray-700"}`}
                onClick={() => section.items.length > 0 ? toggleSection(section.id) : toast("Feature coming soon")}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: section.color }}>
                  <section.icon size={14} className="text-white" />
                </div>
                <span className="flex-1 text-left">{section.label}</span>
                {section.items.length > 0 && (
                  expandedSection === section.id ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
                )}
              </button>
              {expandedSection === section.id && section.items.length > 0 && (
                <div className="ml-10 pb-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      href={item.path === "#" ? "#" : item.path}
                      onClick={(e) => {
                        if (item.path === "#") { e.preventDefault(); toast("Feature coming soon"); }
                        else { setShowNav(false); }
                      }}
                      className={`block px-3 py-1.5 text-[13px] rounded-md ${
                        location === item.path ? "font-semibold text-gray-900 bg-gray-100" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="border-t border-gray-100 mt-2 pt-2">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-700" onClick={() => toast("Feature coming soon")}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#0077C5]"><Globe size={14} className="text-white" /></div>
              <span>Payroll</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-sm font-medium text-gray-700" onClick={() => toast("Feature coming soon")}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#2CA01C]"><Megaphone size={14} className="text-white" /></div>
              <span>Marketing</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-[56px] bg-white border-b border-gray-200 flex items-center px-3 sm:px-4 gap-2 sm:gap-4 shrink-0 z-10">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 shrink-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <SlidersHorizontal size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 bg-[#2CA01C] rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">QB</span>
            </div>
            <span className="font-semibold text-sm text-gray-800 hidden sm:inline">{companyName}</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Navigate or search for transactions, contacts, reports, and more"
                className="w-full pl-10 pr-16 py-2 bg-gray-100 rounded-full text-sm text-gray-600 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-green-500/30"
                onClick={() => { setShowSearch(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
                readOnly
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded">⌘K</span>
            </div>
          </div>

          {/* Mobile search icon */}
          <button
            className="sm:hidden p-2 rounded-full hover:bg-gray-100"
            onClick={() => { setShowSearch(true); setTimeout(() => searchInputRef.current?.focus(), 100); }}
            aria-label="Search"
          >
            <Search size={20} className="text-gray-600" />
          </button>

          {/* Right Icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* User Avatar / Login */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {isAuthenticated ? (
                  <div className="w-7 h-7 rounded-full bg-[#0097A7] flex items-center justify-center text-white text-xs font-bold">
                    {(user?.name || "S").charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={14} className="text-gray-600" />
                  </div>
                )}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">{user?.name || "User"}</p>
                        <p className="text-xs text-gray-500">{user?.email || ""}</p>
                        <p className="text-[10px] text-gray-400 mt-1">Role: {user?.role || "user"}</p>
                      </div>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => { setShowUserMenu(false); toast("Feature coming soon"); }}
                      >
                        <Settings size={14} /> Account settings
                      </button>
                      <button
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={async () => { setShowUserMenu(false); await logout(); }}
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </>
                  ) : (
                    <a
                      href={getLoginUrl()}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogIn size={14} /> Sign in
                    </a>
                  )}
                </div>
              )}
            </div>
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => toast("Feature coming soon")}>
              <ClipboardList size={20} className="text-gray-600" />
            </button>
            <NotificationCenter />
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => toast("Feature coming soon")}>
              <Settings size={20} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100" onClick={() => toast("Feature coming soon")}>
              <HelpCircle size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main id="main-content" className="flex-1 overflow-y-auto" role="main" aria-label="Main content">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-[32px] bg-white border-t border-gray-200 flex items-center justify-center text-[11px] text-gray-400 shrink-0">
          &copy; 2026 Intuit. All rights reserved. &nbsp;
          <span className="text-blue-500 cursor-pointer hover:underline">Privacy</span>&nbsp;
          <span className="text-blue-500 cursor-pointer hover:underline">Security</span>&nbsp;
          <span className="text-blue-500 cursor-pointer hover:underline">Terms of Service</span>
        </footer>
      </div>

      {/* Create Modal Overlay */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-[640px] max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Create</h2>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={() => setShowCreate(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              {["Customers", "Suppliers", "Other"].map(category => {
                const items = createActions.filter(a => a.category === category);
                return (
                  <div key={category} className="mb-4">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category}</h3>
                    <div className="grid grid-cols-3 gap-1">
                      {items.map(action => (
                        <button
                          key={action.label}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 text-left"
                          onClick={() => {
                            setShowCreate(false);
                            if (action.path !== "#") { setLocation(action.path); }
                            else { toast("Feature coming soon"); }
                          }}
                        >
                          <action.icon size={16} className="text-gray-400 shrink-0" />
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Global Search / Command Palette */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
          <div className="absolute inset-0 bg-black/30" onClick={() => { setShowSearch(false); setSearchQuery(""); }} />
          <div ref={searchRef} className="relative bg-white rounded-xl shadow-2xl w-[600px] max-h-[60vh] overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search size={18} className="text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, contacts, reports, and more..."
                className="flex-1 text-sm text-gray-800 placeholder-gray-400 border-0 focus:outline-none bg-transparent"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-1 hover:bg-gray-100 rounded">
                  <X size={14} className="text-gray-400" />
                </button>
              )}
              <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">ESC</span>
            </div>

            <div className="overflow-y-auto max-h-[50vh]">
              {searchQuery.length < 2 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500">Type at least 2 characters to search</p>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {[
                      { label: "Invoices", path: "/invoices", icon: FileText },
                      { label: "Customers", path: "/customers", icon: Users },
                      { label: "Expenses", path: "/expenses", icon: CreditCard },
                      { label: "Reports", path: "/reports", icon: BarChart3 },
                      { label: "Chart of Accounts", path: "/chart-of-accounts", icon: Calculator },
                      { label: "Products & Services", path: "/products-services", icon: Receipt },
                    ].map(item => (
                      <button
                        key={item.label}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-sm text-gray-700 text-left"
                        onClick={() => { setLocation(item.path); setShowSearch(false); setSearchQuery(""); }}
                      >
                        <item.icon size={14} className="text-gray-400" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchLoading ? (
                <div className="p-6 flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                  <span className="text-sm text-gray-500">Searching...</span>
                </div>
              ) : totalSearchResults === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
                </div>
              ) : (
                <div className="py-2">
                  {searchResults && Object.entries(searchResults).map(([type, items]) => {
                    if (!items || (items as any[]).length === 0) return null;
                    const Icon = searchTypeIcons[type] || FileText;
                    return (
                      <div key={type}>
                        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {type}
                        </div>
                        {(items as any[]).map((item: any) => (
                          <button
                            key={item.id}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
                            onClick={() => handleSearchSelect(type, item.id)}
                          >
                            <Icon size={14} className="text-gray-400 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 truncate">
                                {item.displayName || item.name || item.invoiceNumber || item.description || `#${item.id}`}
                              </p>
                              {item.email && <p className="text-xs text-gray-400 truncate">{item.email}</p>}
                              {item.accountType && <p className="text-xs text-gray-400">{item.accountType}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
