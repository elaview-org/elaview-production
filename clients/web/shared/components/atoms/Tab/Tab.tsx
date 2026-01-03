"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Target, Plus, Send, Upload, FileDown } from "lucide-react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeColor?: "purple" | "blue" | "emerald" | "orange";
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// Hook to use tabs context
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab components must be used within a Tabs component");
  }
  return context;
}

export interface TabsProps {
  /** Default active tab ID */
  defaultTab?: string;
  /** Controlled active tab ID */
  activeTab?: string;
  /** Callback when tab changes */
  onTabChange?: (tab: string) => void;
  /** Active border color variant */
  activeColor?: "purple" | "blue" | "emerald" | "orange";
  /** Tab children */
  children: ReactNode;
  /** Optional className */
  className?: string;
}

function Tabs({
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  activeColor = "purple",
  children,
  className = "",
}: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || "");
  const isControlled = controlledActiveTab !== undefined;
  const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

  const setActiveTab = (tab: string) => {
    if (!isControlled) {
      setInternalActiveTab(tab);
    }
    onTabChange?.(tab);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, activeColor }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: ReactNode;
}

function TabList({ children }: TabListProps) {
  return (
    <div className={`mt-3 flex gap-1 border-b border-slate-700`} role="tablist">
      {children}
    </div>
  );
}

interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  tabId: string;
  children: ReactNode;
  icon?: LucideIcon;
  className?: string;
}

function Tab({
  tabId,
  children,
  icon: Icon,
  className = "",
  ...props
}: TabProps) {
  const { activeTab, setActiveTab, activeColor = "purple" } = useTabsContext();

  const activeColorClasses = {
    purple: "border-purple-500",
    blue: "border-blue-500",
    emerald: "border-emerald-500",
    orange: "border-orange-500",
  };

  const isActive = activeTab === tabId;

  return (
    <button
      onClick={() => setActiveTab(tabId)}
      className={`px-3 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "text-white border-b-2 border-purple-500"
          : "text-slate-400 hover:text-white"
      }`}
      aria-selected={isActive}
      role="tab"
      {...props}
    >
      {Icon && <Icon className="mr-2 h-3.5 w-3.5 inline-block" />}
      {children}
    </button>
  );
}

interface TabPanelProps {
  tabId: string;
  children: ReactNode;
  className?: string;
}

function TabPanel({ tabId, children, className = "" }: TabPanelProps) {
  const { activeTab } = useTabsContext();

  if (activeTab !== tabId) {
    return null;
  }

  return (
    <div
      className={className}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      id={`panel-${tabId}`}
    >
      {children}
    </div>
  );
}

/** only for marketing dashboard */

function TabHeader({
  actions = {},
}: {
  actions?: Record<string, React.ReactNode>;
}) {
  const { activeTab } = useTabsContext();
  return (
    <div className="shrink-0 px-4 py-3 border-b border-slate-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-6 w-6 text-purple-400" />
          <div>
            <h2 className="text-xl font-bold text-white">Outbound CRM</h2>
            <p className="text-xs text-slate-400">
              Phase 2: Outreach tracking and customer conversion
            </p>
          </div>
        </div>

        {actions[activeTab]}
      </div>
    </div>
  );
}

Tabs.List = TabList;
Tabs.Button = Tab;
Tabs.Panel = TabPanel;
Tabs.Header = TabHeader;

export default Tabs;
