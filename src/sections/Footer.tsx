import { Github, Twitter } from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

const footerLinks = [
  {
    title: 'Product',
    links: ['Features', 'Studio', 'Models', 'Pricing', 'Changelog'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'Tutorials', 'Blog'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Terms', 'Privacy'],
  },
];

export default function Footer() {
  return (
    <footer
      className="relative bg-[#fbfbfb] border-t border-black/8"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-4">
            <a href="#" className="inline-flex mb-4" aria-label="AdultGen AI home">
              <BrandLogo />
            </a>
            <p className="text-sm text-[#888888] max-w-[280px] leading-relaxed mb-6">
              The most advanced AI-powered platform for creating photorealistic adult content. Private, secure, and lightning-fast.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-[#888888] hover:text-[#121212] hover:bg-black/10 transition-all duration-300"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-[#888888] hover:text-[#121212] hover:bg-black/10 transition-all duration-300"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="md:col-span-2 md:col-start-auto">
              <h4 className="text-sm font-semibold text-[#121212] mb-4 uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[#888888] hover:text-[#121212] transition-colors duration-300"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-black/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#aaaaaa]">
            &copy; 2025 AdultGen AI. All rights reserved.
          </p>
          <p className="text-xs text-[#aaaaaa]">
            AI-POWERED. PERSONALIZED. PRIVATE.
          </p>
        </div>
      </div>
    </footer>
  );
}
