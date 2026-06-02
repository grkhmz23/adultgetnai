import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Studio', href: '#studio' },
    { label: 'Models', href: '#models' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.06)]'
          : 'bg-transparent'
      }`}
      style={{ height: 60 }}
    >
      <div className="max-w-[1400px] mx-auto h-full flex items-center justify-between px-6">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
              <defs>
                <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8338ec" />
                  <stop offset="100%" stopColor="#3a86ff" />
                </linearGradient>
              </defs>
              <polygon points="20,2 38,35 2,35" stroke="url(#logoGrad)" strokeWidth="2.5" fill="none" strokeLinejoin="round" />
              <polygon points="20,10 30,28 10,28" fill="url(#logoGrad)" opacity="0.3" />
              <circle cx="20" cy="22" r="3" fill="url(#logoGrad)" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-[#121212]">
            AdultGen AI
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <button className="bg-[#121212] text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-[#121212]"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-black/5 px-6 py-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#888888] hover:text-[#121212] transition-colors text-base font-medium"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <button className="bg-[#121212] text-white text-sm font-medium px-5 py-2.5 rounded-full w-full mt-2">
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
