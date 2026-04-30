"use client";

import React from "react";
import { Search, Bell, User, Menu, X, ChevronLeft, ChevronRight } from "lucide-react";

interface AdminHeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

const AdminHeader = ({ sidebarOpen, onToggleSidebar, onLogout }: AdminHeaderProps) => {
  return (
    <header className="h-20 bg-background/50 backdrop-blur-md border-b border-border px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onToggleSidebar}
          className="p-2 rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-foreground lg:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {!sidebarOpen && (
          <button 
            onClick={onToggleSidebar}
            className="p-2 rounded-xl hover:bg-muted transition-all text-muted-foreground hover:text-foreground hidden lg:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search analytics, users, or settings..."
            className="w-full bg-muted/50 border border-border rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="h-8 w-px bg-border" />
        
        <div className="flex items-center gap-3 pl-2">
          <div className="w-10 h-10 rounded-full bg-gradient-premium p-[2px]">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
              <User className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
