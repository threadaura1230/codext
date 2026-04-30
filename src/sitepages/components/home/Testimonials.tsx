"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, Loader2 } from "lucide-react";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("/api/testimonials");
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center opacity-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="text-sm font-medium tracking-widest uppercase">Collecting customer stories...</p>
      </div>
    );
  }

  // If no testimonials in DB, show nothing or a placeholder
  if (testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4"
          >
            Let's see our <span className="text-gradient">User's Review</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-muted-foreground max-w-2xl mx-auto font-medium"
          >
            Don't just take our word for it. Here's what our users have to say 
            about their experience with Codext.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[3rem] border border-border/50 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 relative group"
              >
                <div className="absolute top-8 right-10 text-primary/10 group-hover:text-primary/20 transition-colors">
                  <Quote className="w-16 h-16" />
                </div>
                
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>

                <p className="text-muted-foreground mb-10 relative z-10 leading-relaxed italic text-lg font-medium">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted shadow-lg border-2 border-white">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg leading-none mb-1">{testimonial.name}</h4>
                    <p className="text-xs font-black uppercase tracking-widest text-primary/70">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
