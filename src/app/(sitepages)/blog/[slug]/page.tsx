"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Calendar, Clock, User, Share2, Tag, Loader2 } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  readTime: string;
  author: string;
  slug: string;
  createdAt: string;
}

export default function BlogPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        fetchBlog(resolvedParams.slug);
      } catch (err) {
        console.error("Failed to resolve params", err);
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  const fetchBlog = async (slug: string) => {
    try {
      const res = await fetch(`/api/blogs/by-slug/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setBlog(data);
      }
    } catch (err) {
      console.error("Failed to fetch blog post", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <p className="text-muted-foreground font-medium animate-pulse">Opening editorial file...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <p className="text-muted-foreground mb-8 max-w-md">The article you're looking for might have been moved or deleted.</p>
        <Link href="/blog" className="px-10 py-5 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl transition-all">
          Back to Insights
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Navigation */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Insights
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black rounded-full uppercase tracking-widest">
              {blog.category}
            </span>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
               <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
               <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {blog.readTime}</div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 leading-[1.1]">
            {blog.title}
          </h1>

          <div className="flex items-center justify-between py-8 border-y border-border/50">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black text-xl shadow-lg">
                   {blog.author[0]}
                </div>
                <div>
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Written By</p>
                   <p className="font-bold text-lg">{blog.author}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-2xl border border-border flex items-center justify-center hover:bg-muted transition-colors">
                   <Share2 className="w-5 h-5 text-muted-foreground" />
                </button>
             </div>
          </div>
        </motion.div>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative aspect-video rounded-[3rem] overflow-hidden border border-border/50 shadow-2xl mb-16"
        >
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </motion.div>

        {/* Content Area */}
        <article className="relative">
           <div className="prose prose-lg dark:prose-invert max-w-none">
              <div 
                className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium"
                dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
           </div>
           
           {/* Sidebar Elements for larger screens */}
           <div className="hidden lg:block absolute -left-32 top-0 h-full">
              <div className="sticky top-40 flex flex-col gap-6">
                 <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                    <User className="w-5 h-5" />
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary cursor-pointer hover:bg-primary/10 transition-colors">
                    <Tag className="w-5 h-5" />
                 </div>
              </div>
           </div>
        </article>

        {/* Footer/CTA */}
        <section className="mt-24 p-12 bg-muted/30 rounded-[3rem] border border-border/50 text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
           <h3 className="text-3xl font-bold mb-6 italic">Looking for more?</h3>
           <p className="text-muted-foreground mb-10 max-w-lg mx-auto">
              Our engineering team publishes weekly deep-dives into the latest technologies we're using to build the next generation of SaaS.
           </p>
           <Link href="/blog" className="inline-flex items-center gap-2 font-black uppercase tracking-widest text-sm text-primary hover:gap-4 transition-all">
              Browse All Insights <ArrowRight className="w-5 h-5" />
           </Link>
        </section>
      </div>
    </div>
  );
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
