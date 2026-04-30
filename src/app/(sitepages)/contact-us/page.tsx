"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
    Mail,
    Phone,
    MapPin,
    Send,
    MessageSquare,
    Globe,
    ChevronDown,
    CheckCircle2,
    Loader2,
    AlertCircle
} from "lucide-react";

interface Faq {
    _id: string;
    question: string;
    answer: string;
}

export default function ContactUsPage() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [faqsLoading, setFaqsLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [error, setError] = useState("");

    // Form data state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });

    useEffect(() => {
        const fetchFaqs = async () => {
            try {
                const res = await fetch("/api/faqs");
                const data = await res.json();
                setFaqs(data);
            } catch (err) {
                console.error("Failed to fetch FAQs", err);
            } finally {
                setFaqsLoading(false);
            }
        };
        fetchFaqs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setError("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setFormSubmitted(true);
                setFormData({
                    fullName: "",
                    email: "",
                    subject: "General Inquiry",
                    message: ""
                });
            } else {
                setError("Failed to send message. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please check your connection.");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <div className="pt-24 min-h-screen">
            {/* Hero Section */}
            <section className="pt-16 pb-24 px-6 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Let's Start a <span className="text-gradient">Conversation</span>
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                        Whether you have a question about our platform, pricing, or a custom project, our team is here to help you scale.
                    </p>
                </motion.div>
            </section>

            {/* Main Contact Section */}
            <section className="px-6 pb-32">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

                        {/* Contact Info & Cards */}
                        <div className="lg:col-span-5 space-y-12">
                            <div>
                                <h2 className="text-4xl font-bold mb-8">Get in Touch</h2>
                                <p className="text-muted-foreground font-medium mb-10">We usually respond to all inquiries within one business day.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                                {[
                                    { icon: Mail, title: "Email Us", detail: "hello@codext.io", sub: "Support available 24/7" },
                                    { icon: Phone, title: "Call Us", detail: "+1 (555) 000-1234", sub: "Mon-Fri from 9am to 6pm" },
                                    { icon: MapPin, title: "Visit Us", detail: "123 Innovation Way", sub: "Silicon Valley, CA 94025" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="p-8 rounded-[2rem] bg-background border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                <item.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                                                <p className="font-bold text-foreground/80 mb-1">{item.detail}</p>
                                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.sub}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-7">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="p-8 md:p-16 rounded-[3rem] bg-background border border-border shadow-2xl shadow-primary/5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />
                                
                                {formSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-20 relative z-10"
                                    >
                                        <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-lg">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <h3 className="text-4xl font-bold mb-6">Message Sent!</h3>
                                        <p className="text-muted-foreground text-lg mb-12 max-w-sm mx-auto font-medium leading-relaxed">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                                        <button
                                            onClick={() => setFormSubmitted(false)}
                                            className="px-8 py-4 bg-primary/10 text-primary rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-lg"
                                        >
                                            Send another message
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                                        {error && (
                                            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-center gap-3">
                                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                                {error}
                                            </div>
                                        )}
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Full Name</label>
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.fullName}
                                                    onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                                                    placeholder="John Doe"
                                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Work Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                                    placeholder="john@company.com"
                                                    className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">How can we help?</label>
                                            <select 
                                                value={formData.subject}
                                                onChange={(e) => setFormData(p => ({ ...p, subject: e.target.value }))}
                                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none font-medium cursor-pointer"
                                            >
                                                <option>General Inquiry</option>
                                                <option>Enterprise Sales</option>
                                                <option>Technical Support</option>
                                                <option>Partnerships</option>
                                            </select>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Your Message</label>
                                            <textarea
                                                required
                                                rows={5}
                                                value={formData.message}
                                                onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                                                placeholder="Tell us about your project or questions..."
                                                className="w-full bg-muted/30 border border-border rounded-2xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none font-medium leading-relaxed"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={formLoading}
                                            className="w-full py-6 bg-primary text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-2 transition-all disabled:opacity-50 active:scale-95"
                                        >
                                            {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Message <Send className="w-4 h-4" /></>}
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        </div>

                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-32 bg-muted/20 px-6 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-1/3 h-full bg-primary/5 rounded-tl-full blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight"
                        >
                            Quick <span className="text-gradient">Answers</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-muted-foreground text-lg font-medium"
                        >
                            Common questions we get from startups just like yours.
                        </motion.p>
                    </div>

                    <div className="space-y-6">
                        {faqsLoading ? (
                            <div className="text-center py-10 opacity-50">
                                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-xs font-black uppercase tracking-widest">Loading knowledge base...</p>
                            </div>
                        ) : faqs.length === 0 ? (
                            <div className="text-center py-10 italic text-muted-foreground">No FAQs available at the moment.</div>
                        ) : (
                            faqs.map((faq, i) => (
                                <motion.div
                                    key={faq._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    viewport={{ once: true }}
                                    className={`border border-border/50 rounded-[2rem] overflow-hidden transition-all duration-500 ${activeFaq === i ? "bg-background shadow-2xl shadow-primary/5" : "bg-background/50 hover:bg-background"}`}
                                >
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full px-10 py-8 flex items-center justify-between text-left group"
                                    >
                                        <span className={`font-bold text-xl transition-colors ${activeFaq === i ? "text-primary" : "text-foreground"}`}>{faq.question}</span>
                                        <div className={`w-10 h-10 rounded-full border border-border flex items-center justify-center transition-all ${activeFaq === i ? "bg-primary text-white border-primary rotate-180" : "group-hover:border-primary group-hover:text-primary"}`}>
                                            <ChevronDown className="w-5 h-5" />
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {activeFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-10 pb-10 text-muted-foreground text-lg leading-relaxed font-medium">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-32 px-6 text-center">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground mb-16">Trusted by teams at</h3>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                        <div className="text-3xl font-black italic tracking-tighter">TECHFLOW</div>
                        <div className="text-3xl font-black italic tracking-tighter">CLOUDCORE</div>
                        <div className="text-3xl font-black italic tracking-tighter">DATAWAVE</div>
                        <div className="text-3xl font-black italic tracking-tighter">ZENITH</div>
                        <div className="text-3xl font-black italic tracking-tighter">NEXUS</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
