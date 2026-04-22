import { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useTranslation } from "@/hooks/useTranslation";
import { IconBell, IconCalendar, IconChart, IconClock, IconGrid, IconLanguage, IconList, IconLogout, IconMenu, IconRoles, IconSearch, IconSettings, IconUser, IconUsers } from "@/components/icons";
import { APP_NAME, LOCALES } from "@/types/consts";
import { usePermission } from "@/hooks/usePermission";
import type { NavItem, PageProps } from "@/types/interfaces";

// --- Main Component ---
export default function DashboardLayout({ children }: { children?: React.ReactNode }) {
  const { url, props } = usePage<PageProps>();
  const [showSuccess, setShowSuccess] = useState(false);
  const flash = props.flash as { success?: string; id?: string | number };

  // Show success message when flash data changes
  useEffect(() => {
    if (flash?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash?.success, flash?.id]);

  const { t, changeLocale } = useTranslation();
  const { hasAnyRole, canAny } = usePermission();

  const navSections: { key: string; items: NavItem[] }[] = [
    {
      key: "main_section",
      items: [
        { key: "menu_dashboard", icon: <IconGrid />, url: "/dashboard", active: true },
        { key: "menu_customers", icon: <IconUser />, url: "/customers" },
        { key: "menu_orders", icon: <IconList />, url: "/orders", badge: 12 },
        { key: "menu_calendar", icon: <IconCalendar />, url: "/calendar" },
      ],
    },
    {
      key: "analytics_section",
      items: [
        { key: "menu_reports", icon: <IconChart />, url: "/reports" },
        { key: "menu_activity", icon: <IconClock />, url: "/activity" },
      ],
    },
    {
      key: "settings_section",
      items: [
        { key: "menu_settings", icon: <IconSettings />, url: "/settings" },
        { key: "menu_users", icon: <IconUsers />, url: "/users", shown: hasAnyRole(['admin']) || canAny(['create users', 'read users', 'update users', 'delete users']) },
        { key: "menu_roles", icon: <IconRoles />, url: "/roles", shown: hasAnyRole(['admin']) || canAny(['create roles', 'read roles', 'update roles', 'delete roles']) },
      ],
    },
  ];

  // Detect current active item from URL
  const currentPath = url.split('?')[0];
  const matchedItem = navSections
    .flatMap((section) => section.items)
    .find((item) => item.url === currentPath || (item.url !== "/dashboard" && currentPath?.startsWith(item.url + "/")));

  const [activeNav, setActiveNav] = useState(matchedItem?.key || "menu_dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sync activeNav when URL changes (e.g., via back button or programmatic navigation)
  useEffect(() => {
    if (matchedItem) {
      setActiveNav(matchedItem.key);
    }
  }, [url, matchedItem?.key]);

  return (
    <div className="flex h-screen bg-base-200 overflow-hidden">
      {/* Success Toast Notification */}
      {showSuccess && flash?.success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-4 py-2.5 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300"
          style={{ background: "#5340c9", color: "white" }}>
          <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 16 16" className="w-3 h-3 fill-white">
              <path d="M13.485 3.515a.5.5 0 0 1 .11.622l-6 10a.5.5 0 0 1-.772.103l-4-4a.5.5 0 0 1 .707-.707l3.52 3.52 5.756-9.593a.5.5 0 0 1 .68-.145z" />
            </svg>
          </div>
          <span className="text-[13px] font-medium">{t(flash.success)}</span>
          <button
            onClick={() => setShowSuccess(false)}
            className="ml-1 opacity-60 hover:opacity-100 transition-opacity cursor-pointer border-none bg-transparent p-1"
          >
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-white">
              <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
            </svg>
          </button>
        </div>
      )}

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-base-100 border-r border-base-300 w-[220px] transition-transform duration-300 transform lg:translate-x-0 lg:static ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Brand */}
        <div className="h-14 flex items-center gap-2.5 px-4 border-b border-base-300">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "#5340c9" }}
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4 fill-white">
              <path d="M8 2L14 5.5V10.5L8 14L2 10.5V5.5L8 2Z" />
            </svg>
          </div>
          <span
            className="text-[15px] font-semibold tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {APP_NAME}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-2.5 flex flex-col gap-0.5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.key}>
              <span className="text-[11px] text-base-content/40 uppercase tracking-widest px-2 py-2 font-medium block">
                {t(`app.${section.key}`)}
              </span>
              {section.items.filter(item => item.shown !== false).map((item) => (
                <Link
                  key={item.key}
                  href={item.url || "#"}
                  onClick={() => { setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13.5px] transition-colors cursor-pointer border-none
                    ${activeNav === item.key
                      ? "text-[#5340c9] font-medium"
                      : "text-base-content/60 hover:bg-base-200 hover:text-base-content"
                    }`}
                  style={
                    activeNav === item.key
                      ? { background: "#eeebff" }
                      : {}
                  }
                >
                  <span className={activeNav === item.key ? "opacity-100" : "opacity-70"}>
                    {item.icon}
                  </span>
                  <span>{t(`app.${item.key}`)}</span>
                  {item.badge && (
                    <span
                      className="ml-auto text-[10px] text-white px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: "#5340c9" }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-2.5 border-t border-base-300">
          <div className="flex items-center justify-between gap-2 px-2.5 py-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
                style={{ background: "#d5cff7", color: "#5340c9" }}
              >
                {props.auth.user.name
                  .split(" ")
                  .filter(Boolean)
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-medium text-base-content truncate">{props.auth.user.name}</div>
                <div className="text-[11px] text-base-content/40">{props.auth.roles.join(', ')}</div>
              </div>
            </div>
            <Link
              href="/logout"
              className="btn btn-ghost btn-xs btn-square text-base-content/40 hover:text-error"
              title={t('app.logout')}
            >
              <IconLogout />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <div className="h-14 bg-base-100 border-b border-base-300 flex items-center px-5 gap-3 shrink-0">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-1.5 -ml-1.5 rounded-lg hover:bg-base-200 transition-colors border-none bg-transparent cursor-pointer"
          >
            <IconMenu />
          </button>

          <h1
            className="text-[15px] font-semibold text-base-content flex-1"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {t(`app.${activeNav}`)}
          </h1>
          <div className="flex items-center gap-2 bg-base-200 border border-base-300 rounded-lg px-3 h-8 text-[13px] text-base-content/40">
            <IconSearch />
            <span>{t('app.search_placeholder')}</span>
          </div>
          <button className="w-8 h-8 rounded-lg flex items-center justify-center border border-base-300 hover:bg-base-200 transition-colors relative cursor-pointer bg-transparent">
            <IconBell />
            <span
              className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full border-2 border-base-100"
              style={{ background: "#e24b4a" }}
            />
          </button>
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1 w-8 h-8 rounded-lg flex items-center justify-center border border-base-300 hover:bg-base-200 transition-colors relative cursor-pointer bg-transparent">
              <IconLanguage />
            </div>
            <ul tabIndex={-1} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              {LOCALES.map(({ code, label }) => (
                <li key={code}>
                  <a onClick={() => changeLocale(code)}>{label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {children}
        </div>
      </main>
    </div>
  );
}
