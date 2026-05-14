import Link from "next/link";
import Image from "next/image";
import { FiTwitter, FiLinkedin, FiGithub, FiInstagram } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/10 bg-bg-primary">
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden neon-border">
                <Image src="/logo.jpeg" alt="codee.erra" fill className="object-cover" />
              </div>
              <span className="font-display text-lg font-bold gradient-text tracking-widest">
                codee.erra
              </span>
            </div>
            <p className="text-text-secondary font-body text-sm leading-relaxed max-w-xs">
              Building the future through innovative AI-driven software solutions and cutting-edge technology products.
            </p>
            <div className="flex gap-4">
              {[FiTwitter, FiLinkedin, FiGithub, FiInstagram].map((Icon, i) => (
                <a key={i} href="#" className="text-text-secondary hover:text-accent-cyan transition-colors p-2 rounded border border-transparent hover:border-cyan-500/30">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-xs tracking-widest text-accent-cyan uppercase mb-6">Navigation</h4>
            <ul className="space-y-3">
              {["Home", "About", "Products", "Contact"].map((item) => (
                <li key={item}>
                  <Link href={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="text-text-secondary hover:text-white font-body text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-xs tracking-widest text-accent-cyan uppercase mb-6">Contact</h4>
            <div className="space-y-3 text-text-secondary font-body text-sm">
              <p>codeeerra@gmail.com</p>
             
              <p>India<br />Mumbai</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cyan-500/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary font-body text-xs tracking-widest">
            © {new Date().getFullYear()} codee.erra — All rights reserved.
          </p>
          <p className="text-text-secondary font-body text-xs tracking-widest">
            Built with <span className="neon-text-subtle">precision</span> & <span className="neon-text-subtle">vision</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
