import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';
import { requestEarlyAccess } from '../lib/requestEarlyAccess';

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
    { label: 'Overview', href: '/' },
    { label: 'Product', href: '/#product' },
    { label: 'Compliance', href: '/content-policy' },
    { label: 'About', href: '/about' },
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
        <a href="/" aria-label="AdultGen AI home">
          <BrandLogo compact />
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
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={requestEarlyAccess}
            className="bg-[#121212] text-white text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Request Early Access
          </button>
          <a
            href="/chat"
            className="border border-black/10 bg-white/60 text-[#121212] text-sm font-medium px-5 py-2 rounded-full transition-all duration-300 hover:scale-[1.02] hover:bg-white"
          >
            Private chat
          </a>
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
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                requestEarlyAccess();
              }}
              className="bg-[#121212] text-white text-sm font-medium px-5 py-2.5 rounded-full w-full mt-2"
            >
              Request Early Access
            </button>
            <a
              href="/chat"
              className="border border-black/10 bg-white text-[#121212] text-sm font-medium px-5 py-2.5 rounded-full w-full text-center"
            >
              Private chat
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
