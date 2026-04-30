import React from "react";
import Link from "next/link";
import { Rocket, Globe, Mail, ExternalLink, Share2 } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted pt-20 pb-10 px-6 border-t border-border/50">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-premium rounded-lg flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Codext
            </span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed mb-8 pr-4">
            Codext is one of the leading SaaS platforms helping businesses scale
            with modern technology and secure systems.
          </p>
          <div className="flex gap-4">
            {[Globe, Mail, ExternalLink, Share2].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-10 h-10 rounded-full border border-border/50 bg-background flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/our-offers" className="hover:text-primary transition-colors">Services</Link></li>
            <li><Link href="/our-works" className="hover:text-primary transition-colors">Works</Link></li>
            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link href="/contact-us" className="hover:text-primary transition-colors">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Terms</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Subscribe to our newsletter for the latest updates.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="bg-background border border-border/60 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
            />
            <button className="bg-gradient-premium text-white px-6 py-3.5 rounded-xl font-semibold text-sm hover:shadow-xl hover:shadow-blue-500/20 transition-all transform hover:-translate-y-0.5">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Codext. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
