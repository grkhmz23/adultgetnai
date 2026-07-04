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
          ? 'bg-black/85 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.08)]'
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
            className="rounded-full bg-white px-5 py-2 text-sm font-medium text-[#111111] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
          >
            Request Early Access
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="p-2 text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-black/95 px-6 py-6 backdrop-blur-xl md:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-base font-medium text-[#999999] transition-colors hover:text-white"
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
              className="mt-2 w-full rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#111111]"
            >
              Request Early Access
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
