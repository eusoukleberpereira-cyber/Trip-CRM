'use client';

import React, { lazy, Suspense, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  KanbanSquare,
  Users,
  Settings,
  Sun,
  Moon,
  BarChart3,
  Inbox,
  Sparkles,
  LogOut,
  Bug,
  CheckSquare,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { prefetchRoute, RouteName } from '@/lib/prefetch';
import { isDebugMode, enableDebugMode, disableDebugMode } from '@/lib/debug';
import { SkipLink } from '@/lib/a11y';
import { NotificationPopover } from './notifications/NotificationPopover';

const AIAssistant = lazy(() => import('./AIAssistant'));

interface LayoutProps {
  children: React.ReactNode;
}

const NavItem = ({
  to,
  icon: Icon,
  label,
  prefetch,
  clickedPath,
  onItemClick,
  sidebarCollapsed,
}: {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  prefetch?: RouteName;
  clickedPath?: string;
  onItemClick?: (path: string) => void;
  sidebarCollapsed?: boolean;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === to ||
    (to === '/boards' && pathname === '/pipeline') ||
    clickedPath === to;

  return (
    <Link
      href={to}
      onMouseEnter={prefetch ? () => prefetchRoute(prefetch) : undefined}
      onClick={() => onItemClick?.(to)}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
        isActive
          ? 'bg-primary-500/10 text-primary-600'
          : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      {!sidebarCollapsed && <span>{label}</span>}
    </Link>
  );
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { profile, signOut } = useAuth();

  const [isGlobalAIOpen, setIsGlobalAIOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [clickedPath, setClickedPath] = useState<string>();
  const [debugEnabled, setDebugEnabled] = useState(isDebugMode);

  const toggleDebugMode = () => {
    debugEnabled ? disableDebugMode() : enableDebugMode();
    setDebugEnabled(!debugEnabled);
  };

  return (
    <div className="flex h-screen overflow-hidden">

      <SkipLink targetId="main-content" />

      {/* SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r transition-all ${
          sidebarCollapsed ? 'w-16 items-center' : 'w-56'
        }`}
      >
        <div className="h-12 flex items-center justify-between px-3 border-b">
          <span className={`${sidebarCollapsed ? 'hidden' : ''}`}>
            CRM
          </span>

          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1">
          {[
            { to: '/inbox', icon: Inbox, label: 'Inbox', prefetch: 'inbox' as const },
            { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', prefetch: 'dashboard' as const },
            { to: '/boards', icon: KanbanSquare, label: 'Boards', prefetch: 'boards' as const },
            { to: '/contacts', icon: Users, label: 'Contatos', prefetch: 'contacts' as const },
            { to: '/activities', icon: CheckSquare, label: 'Atividades', prefetch: 'activities' as const },
            { to: '/reports', icon: BarChart3, label: 'Relatórios', prefetch: 'reports' as const },
            { to: '/settings', icon: Settings, label: 'Configurações', prefetch: 'settings' as const },
          ].map(item => (
            <NavItem
              key={item.to}
              {...item}
              sidebarCollapsed={sidebarCollapsed}
              clickedPath={clickedPath}
              onItemClick={setClickedPath}
            />
          ))}
        </nav>

        <div className="p-2 border-t">
          <button
            onClick={signOut}
            className="flex items-center gap-2 text-sm text-red-500"
          >
            <LogOut size={16} /> {!sidebarCollapsed && 'Sair'}
          </button>
        </div>
      </aside>

      {/* CONTEÚDO */}
      <div className="flex-1 flex overflow-hidden">

        {/* ÁREA CENTRAL */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* HEADER FINO */}
          <header className="h-12 flex items-center justify-end px-4 border-b gap-2">

            <button onClick={() => setIsGlobalAIOpen(!isGlobalAIOpen)}>
              <Sparkles size={18} />
            </button>

            <button onClick={toggleDebugMode}>
              <Bug size={18} />
            </button>

            <NotificationPopover />

            <button onClick={toggleDarkMode}>
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

          </header>

          {/* ÁREA PRINCIPAL */}
          <main
            id="main-content"
            className="flex-1 overflow-hidden"
          >
            {children}
          </main>
        </div>

        {/* AI SIDEBAR */}
        <aside
          className={`transition-all duration-300 overflow-hidden ${
            isGlobalAIOpen ? 'w-80' : 'w-0'
          }`}
        >
          {isGlobalAIOpen && (
            <Suspense fallback={<div />}>
              <AIAssistant
                isOpen
                onClose={() => setIsGlobalAIOpen(false)}
                variant="sidebar"
              />
            </Suspense>
          )}
        </aside>

      </div>
    </div>
  );
};

export default Layout;
