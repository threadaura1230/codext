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
          <p className="text-muted-foreground text-sm leading-relaxed mb-6">
            Codext is one of the leading SaaS platforms helping businesses scale
            with modern technology and secure systems.
          </p>
          <div className="flex gap-4">
            {[Globe, Mail, ExternalLink, Share2].map((Icon, i) => (
              <Link
                key={i}
                href="#"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">Docs</Link></li>
            <li><Link href="#" className="hover:text-primary">Tutorials</Link></li>
            <li><Link href="#" className="hover:text-primary">Blog</Link></li>
            <li><Link href="#" className="hover:text-primary">Support</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-foreground mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li><Link href="#" className="hover:text-primary">About Us</Link></li>
            <li><Link href="#" className="hover:text-primary">Careers</Link></li>
            <li><Link href="#" className="hover:text-primary">Contact</Link></li>
            <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
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
              className="bg-white border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button className="bg-gradient-premium text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Codext. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
