"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Users, 
  Briefcase, 
  BookOpen, 
  Zap,
  ArrowUpRight,
  Activity,
  Plus,
  ArrowRight,
  Loader2,
  Mail,
  HelpCircle
} from "lucide-react";

const StatsCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-background/50 backdrop-blur-xl border border-border p-6 rounded-3xl group hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 blur-3xl rounded-full -mr-8 -mt-8`} />
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-2xl ${color.replace('bg-', 'bg-opacity-10 text-')} group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="p-2 rounded-full bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
         <ArrowUpRight className="w-4 h-4" />
      </div>
    </div>
    <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
    <div className="flex items-baseline gap-2">
       <p className="text-3xl font-bold tracking-tight">{value}</p>
       <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{subtitle}</span>
    </div>
  </motion.div>
);

const QuickAction = ({ title, desc, icon: Icon, href, secret }: { title: string, desc: string, icon: any, href: string, secret: string }) => (
  <Link href={`/admin/${secret}${href}`} className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border hover:bg-muted/50 hover:border-primary/30 transition-all group">
     <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center text-primary border border-border group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5" />
     </div>
     <div className="flex-1">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{desc}</p>
     </div>
     <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
  </Link>
);

export default function DashboardPage() {
  const [stats, setStats] = useState({
    offers: 0,
    works: 0,
    blogs: 0,
    testimonials: 0,
    messages: 0,
    faqs: 0,
    loading: true
  });

  // Extract secret from URL path
  const [secret, setSecret] = useState("");

  useEffect(() => {
    // Get the secret from the pathname
    const pathParts = window.location.pathname.split('/');
    const secretPart = pathParts[2]; // /admin/[secret]/dashboard
    setSecret(secretPart);

    const fetchStats = async () => {
      try {
        const [offersRes, worksRes, blogsRes, testimonialsRes, messagesRes, faqsRes] = await Promise.all([
          fetch("/api/our-offers"),
          fetch("/api/our-works"),
          fetch("/api/blogs"),
          fetch("/api/testimonials"),
          fetch("/api/contact"),
          fetch("/api/faqs")
        ]);

        const [offers, works, blogs, testimonials, messages, faqs] = await Promise.all([
          offersRes.json(),
          worksRes.json(),
          blogsRes.json(),
          testimonialsRes.json(),
          messagesRes.json(),
          faqsRes.json()
        ]);

        setStats({
          offers: Array.isArray(offers) ? offers.length : 0,
          works: Array.isArray(works) ? works.length : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          testimonials: Array.isArray(testimonials) ? testimonials.length : 0,
          messages: Array.isArray(messages) ? messages.length : 0,
          faqs: Array.isArray(faqs) ? faqs.length : 0,
          loading: false
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
         <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
         <p className="text-muted-foreground font-medium animate-pulse">Aggregating platform data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Platform Overview</h1>
          <p className="text-muted-foreground font-medium">Control center for your dynamic site content and architecture.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-500 rounded-full text-xs font-bold flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
              SYSTEM OPERATIONAL
           </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Service Bundles" 
          value={stats.offers} 
          subtitle="Offers" 
          icon={Zap} 
          color="bg-primary"
        />
        <StatsCard 
          title="Case Studies" 
          value={stats.works} 
          subtitle="Projects" 
          icon={Briefcase} 
          color="bg-purple-500"
        />
        <StatsCard 
          title="Insights" 
          value={stats.blogs} 
          subtitle="Articles" 
          icon={BookOpen} 
          color="bg-amber-500"
        />
        <StatsCard 
          title="Social Proof" 
          value={stats.testimonials} 
          subtitle="Reviews" 
          icon={Users} 
          color="bg-green-500"
        />
        <StatsCard 
          title="Inbox" 
          value={stats.messages} 
          subtitle="Inquiries" 
          icon={Mail} 
          color="bg-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Status */}
        <div className="lg:col-span-2 bg-background/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold italic">Content Distribution</h2>
            <Link href="#" className="text-sm font-bold text-primary hover:underline">Full Analytics</Link>
          </div>
          
          <div className="space-y-8">
             {[
               { label: "Portfolio Growth", percentage: 85, color: "bg-purple-500" },
               { label: "Service Expansion", percentage: 65, color: "bg-primary" },
               { label: "Blog Frequency", percentage: 45, color: "bg-amber-500" }
             ].map((item, i) => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between text-sm font-bold uppercase tracking-widest">
                     <span>{item.label}</span>
                     <span>{item.percentage}%</span>
                  </div>
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        className={`h-full ${item.color} rounded-full shadow-lg shadow-black/10`} 
                     />
                  </div>
               </div>
             ))}
          </div>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-6">
             <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <Activity className="w-6 h-6" />
             </div>
             <div className="flex-1">
                <p className="text-sm font-bold italic">Ready to scale?</p>
                <p className="text-xs text-muted-foreground font-medium">Add more services or projects to increase your site's SEO reach and customer conversion.</p>
             </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-background/50 backdrop-blur-xl border border-border rounded-[2.5rem] p-8">
          <h2 className="text-xl font-bold mb-8">Manage Content</h2>
          <div className="space-y-4">
             <QuickAction title="Update Services" desc="Edit or add new offers" icon={Zap} href="/our-offers" secret={secret} />
             <QuickAction title="Portfolio Hub" desc="Manage case studies" icon={Briefcase} href="/our-works" secret={secret} />
             <QuickAction title="Editorial Desk" desc="Publish blog posts" icon={BookOpen} href="/blogs" secret={secret} />
             <QuickAction title="Customer Reviews" desc="Manage testimonials" icon={Users} href="/testimonials" secret={secret} />
             <QuickAction title="Communication" desc="Manage inbox" icon={Mail} href="/messages" secret={secret} />
             <QuickAction title="Knowledge Base" desc="Manage FAQs" icon={HelpCircle} href="/faqs" secret={secret} />
             
             <div className="pt-6">
                <button className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground font-bold text-xs uppercase tracking-[0.2em] hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                   <Plus className="w-4 h-4" /> Customize Layout
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
