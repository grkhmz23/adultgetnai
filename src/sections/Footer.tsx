import BrandLogo from '../components/BrandLogo';

const footerLinks = [
  {
    title: 'Product',
    links: [
      { label: 'Overview', href: '/' },
      { label: 'Early access', href: '/contact' },
      { label: 'Compliance', href: '/content-policy' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', href: '/terms' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Content Policy', href: '/content-policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/10 bg-[#050505]"
      style={{ zIndex: 2 }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-5">
            <a href="/" className="inline-flex mb-4" aria-label="AdultGen AI home">
              <BrandLogo compact />
            </a>
            <p className="text-sm text-[#888888] max-w-[300px] leading-relaxed mb-6">
              Uncensored adult chat for verified adults — live in private beta. Synthetic image and video experiences are in development.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((column) => (
            <div key={column.title} className="md:col-span-2 md:col-start-auto">
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#888888] transition-colors duration-300 hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-[#aaaaaa]">
            &copy; 2026 AdultGen AI. All rights reserved.
          </p>
          <p className="text-xs text-[#aaaaaa]">
            Chat is in private beta. Public image and video generation are not available on this website.
          </p>
        </div>
      </div>
    </footer>
  );
}
