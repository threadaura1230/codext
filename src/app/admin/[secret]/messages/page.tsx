"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Trash2, Mail, User, Clock, 
  CheckCircle, Loader2, AlertCircle, 
  MessageSquare, ChevronRight, X, Reply
} from "lucide-react";

interface Message {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    if (currentStatus) return; // Already read

    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true })
      });
      if (res.ok) {
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
        if (selectedMessage?._id === id) {
           setSelectedMessage(prev => prev ? { ...prev, isRead: true } : null);
        }
      }
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m._id !== id));
        setSelectedMessage(null);
      }
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-8 pt-8">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-4">
             Inbox 
             {unreadCount > 0 && (
                <span className="text-xs bg-primary text-white px-3 py-1 rounded-full">{unreadCount} New</span>
             )}
          </h1>
          <p className="text-muted-foreground font-medium">Manage inquiries and support requests from your users.</p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden border-t border-border mt-4">
        {/* Sidebar List */}
        <div className="w-1/3 border-right border-border bg-muted/10 flex flex-col">
           <div className="p-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filter inbox..." 
                  className="w-full bg-background border border-border rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto">
              {loading ? (
                 <div className="p-8 text-center opacity-50">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold uppercase tracking-widest">Loading Mail...</p>
                 </div>
              ) : filteredMessages.length === 0 ? (
                 <div className="p-8 text-center text-muted-foreground italic text-sm">
                    No messages found.
                 </div>
              ) : (
                 <div className="divide-y divide-border/50">
                    {filteredMessages.map((message) => (
                       <button 
                         key={message._id}
                         onClick={() => {
                            setSelectedMessage(message);
                            handleMarkAsRead(message._id, message.isRead);
                         }}
                         className={`w-full p-6 text-left hover:bg-muted/50 transition-all relative flex gap-4 ${selectedMessage?._id === message._id ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                       >
                          {!message.isRead && (
                             <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-primary" />
                          )}
                          <div className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center font-bold text-lg ${message.isRead ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                             {message.fullName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-baseline mb-1">
                                <h3 className={`text-sm font-bold truncate ${message.isRead ? 'text-foreground/70' : 'text-foreground'}`}>{message.fullName}</h3>
                             </div>
                             <p className={`text-xs mb-2 truncate ${message.isRead ? 'font-medium text-muted-foreground' : 'font-bold text-foreground'}`}>{message.subject}</p>
                             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                                {new Date(message.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                             </p>
                          </div>
                       </button>
                    ))}
                 </div>
              )}
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-background overflow-y-auto relative">
           <AnimatePresence mode="wait">
              {selectedMessage ? (
                 <motion.div 
                   key={selectedMessage._id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="p-12"
                 >
                    <div className="flex items-center justify-between mb-12">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-primary/20">
                             {selectedMessage.fullName[0]}
                          </div>
                          <div>
                             <h2 className="text-2xl font-bold">{selectedMessage.fullName}</h2>
                             <p className="text-muted-foreground font-medium">{selectedMessage.email}</p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <button 
                            onClick={() => handleDelete(selectedMessage._id)}
                            className="p-3 bg-muted rounded-2xl hover:bg-red-500 hover:text-white transition-all text-muted-foreground"
                            title="Delete Message"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>
                          <a 
                            href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl transition-all"
                          >
                             <Reply className="w-4 h-4" /> Reply
                          </a>
                       </div>
                    </div>

                    <div className="bg-muted/20 border border-border rounded-[2.5rem] p-10 relative overflow-hidden">
                       <div className="absolute top-10 right-10 opacity-5">
                          <MessageSquare className="w-32 h-32" />
                       </div>
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">
                          <Clock className="w-4 h-4" /> 
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                       </div>
                       <h3 className="text-xl font-bold mb-8 underline decoration-primary/30 decoration-4 underline-offset-8 italic">
                          {selectedMessage.subject}
                       </h3>
                       <div className="text-lg leading-relaxed text-foreground/80 font-medium whitespace-pre-wrap">
                          {selectedMessage.message}
                       </div>
                    </div>
                 </motion.div>
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-center opacity-20 select-none">
                    <Mail className="w-32 h-32 mb-6" />
                    <h2 className="text-3xl font-black uppercase tracking-widest italic">Select a message</h2>
                    <p className="text-lg font-bold">Your inbox is ready for action.</p>
                 </div>
              )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
