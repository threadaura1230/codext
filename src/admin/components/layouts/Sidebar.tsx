"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  LogOut, 
  ChevronRight,
  ShoppingBag,
  PenSquare,
  ShieldCheck,
  Briefcase,
  Mail,
  Users,
  HelpCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onLogout: () => void;
}

const Sidebar = ({ isOpen, onToggle, onLogout }: SidebarProps) => {
  const pathname = usePathname();
  
  // Extract the secret from the pathname
  const secretMatch = pathname.match(/\/admin\/([^\/]+)/);
  const secret = secretMatch ? secretMatch[1] : "";
  const adminBase = `/admin/${secret}`;

  const menuItems = [
    { name: "Dashboard", href: adminBase, icon: LayoutDashboard },
    { name: "Services", href: `${adminBase}/our-offers`, icon: ShoppingBag},
    { name: "Projects", href: `${adminBase}/our-works`, icon: Briefcase},
    { name: "Editorial", href: `${adminBase}/blogs`, icon: PenSquare},
    { name: "Testimonials", href: `${adminBase}/testimonials`, icon: Users},
    { name: "Inbox", href: `${adminBase}/messages`, icon: Mail},
    { name: "Help Center", href: `${adminBase}/faqs`, icon: HelpCircle},
  ];

  return (
    <aside className={cn(
      "fixed inset-y-0 left-0 z-40 bg-background/50 backdrop-blur-xl border-r border-border p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-in-out",
      isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full lg:translate-x-0 lg:w-0 lg:p-0 lg:border-0"
    )}>
      {/* Glow Effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 blur-[100px] rounded-full" />
      
      <div className={cn("relative z-10 transition-opacity duration-200", !isOpen && "lg:opacity-0")}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg shadow-primary/20">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Codext <span className="text-primary text-xs uppercase tracking-widest ml-1">Admin</span>
          </span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between group px-4 py-3 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-primary/10 text-primary shadow-sm" 
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className={cn("relative z-10 space-y-4 transition-opacity duration-200", !isOpen && "lg:opacity-0")}>
        <div className="p-4 rounded-2xl bg-gradient-soft border border-primary/10">
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-medium">System Online</span>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
