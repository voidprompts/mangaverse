import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-bold text-gray-800 mb-3">{title}</h2>
    <div className="text-gray-600 text-sm leading-relaxed space-y-2">{children}</div>
  </div>
);

function StaticWrapper({ title, emoji, setPage, children }) {
  return (
    <div className="min-h-screen bg-stone-50 pt-20 animate-fade-in">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <button onClick={() => setPage('discover')} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-6 transition">
          <ChevronLeft className="w-4 h-4" /> Back to Discover
        </button>
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
          <div className="text-4xl mb-3">{emoji}</div>
          <h1 className="text-3xl font-black text-gray-800 mb-2">{title}</h1>
          <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full mb-8"></div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function AboutPage({ setPage }) {
  return (
    <StaticWrapper title="About MangaVerse" emoji="📖" setPage={setPage}>
      <Section title="Who We Are">
        <p>MangaVerse is a modern manga reading platform dedicated to bringing the best manga experience to readers around the world. Our mission is simple: make manga accessible, beautiful, and enjoyable for everyone.</p>
      </Section>
      <Section title="Our Technology">
        <p>We use cutting-edge web scraping technology to aggregate the latest manga chapters from multiple trusted sources, ensuring our readers always have access to the newest releases the moment they drop.</p>
      </Section>
      <Section title="Our Mission">
        <p>We believe great storytelling transcends borders. MangaVerse bridges cultures by making manga accessible to a global audience in a premium, distraction-free reading environment.</p>
      </Section>
    </StaticWrapper>
  );
}

export function PrivacyPage({ setPage }) {
  return (
    <StaticWrapper title="Privacy Policy" emoji="🔒" setPage={setPage}>
      <p className="text-xs text-gray-400 mb-6">Last updated: September 1, 2025</p>
      <Section title="Information We Collect">
        <p>We collect information you provide directly, such as account registration data, reading preferences, and bookmarks. We also collect usage data to improve our service.</p>
      </Section>
      <Section title="How We Use Your Information">
        <p>Your data is used to personalize your reading experience, remember your progress, and send notifications about new chapters. We do not sell your personal information to third parties.</p>
      </Section>
      <Section title="Cookies & Advertising">
        <p>MangaVerse uses cookies to maintain your session and serve relevant advertisements through Google AdSense. You can manage cookie preferences in your browser settings.</p>
        <p>We participate in Google AdSense advertising. Google may use cookies to serve ads based on your visits to this and other websites. You can opt out of personalized advertising at <a href="https://www.google.com/settings/ads" className="text-indigo-500 underline" target="_blank" rel="noopener noreferrer">Google Ad Settings</a>.</p>
      </Section>
      <Section title="Data Retention">
        <p>We retain your data for as long as your account is active. You may request deletion of your data at any time by contacting our support team.</p>
      </Section>
      <Section title="Contact Us">
        <p>For privacy concerns, contact us at privacy@mangaverse.io</p>
      </Section>
    </StaticWrapper>
  );
}

export function TermsPage({ setPage }) {
  return (
    <StaticWrapper title="Terms of Service" emoji="📋" setPage={setPage}>
      <p className="text-xs text-gray-400 mb-6">Last updated: September 1, 2025</p>
      <Section title="Acceptance of Terms">
        <p>By accessing MangaVerse, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue use of our service.</p>
      </Section>
      <Section title="Content Disclaimer">
        <p>MangaVerse is an aggregator platform. We do not host manga files directly. All manga content belongs to their respective authors, artists, and publishers. MangaVerse claims no ownership over third-party content.</p>
      </Section>
      <Section title="User Conduct">
        <p>You agree not to misuse our service, attempt to circumvent security measures, or use automated tools to scrape our platform without permission.</p>
      </Section>
      <Section title="Advertising">
        <p>MangaVerse displays advertisements to fund our free service. By using MangaVerse, you consent to receiving advertising content in accordance with our advertising partners' policies.</p>
      </Section>
    </StaticWrapper>
  );
}

export function DMCAPage({ setPage }) {
  return (
    <StaticWrapper title="DMCA Policy" emoji="⚖️" setPage={setPage}>
      <Section title="Copyright Notice">
        <p>MangaVerse respects intellectual property rights and expects users to do the same. We comply fully with the Digital Millennium Copyright Act (DMCA).</p>
      </Section>
      <Section title="Filing a DMCA Takedown">
        <p>If you believe content on MangaVerse infringes your copyright, please send a written notice to our DMCA agent with:</p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Your name, address, and contact information</li>
          <li>A description of the copyrighted work</li>
          <li>The URL of the allegedly infringing content</li>
          <li>A statement of good faith belief</li>
          <li>Your electronic signature</li>
        </ul>
      </Section>
      <Section title="Contact">
        <p>Send DMCA notices to: dmca@mangaverse.io</p>
        <p>We respond to valid DMCA notices within 48 hours.</p>
      </Section>
    </StaticWrapper>
  );
}

export function ContactPage({ setPage }) {
  return (
    <StaticWrapper title="Contact Us" emoji="💬" setPage={setPage}>
      <Section title="Get in Touch">
        <p>Have a question, suggestion, or found an issue? We'd love to hear from you.</p>
      </Section>
      <div className="space-y-4">
        {[
          { label: 'Your Name', type: 'text', placeholder: 'Yuki Tanaka' },
          { label: 'Email', type: 'email', placeholder: 'hello@example.com' },
        ].map(f => (
          <div key={f.label}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{f.label}</label>
            <input type={f.type} placeholder={f.placeholder}
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition" />
          </div>
        ))}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
          <textarea rows={5} placeholder="Tell us what's on your mind…"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
        </div>
        <button className="w-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-bold py-3 rounded-full shadow-md hover:shadow-indigo-200 hover:shadow-lg transition">
          Send Message
        </button>
      </div>
    </StaticWrapper>
  );
}

export function AdvertisePage({ setPage }) {
  return (
    <StaticWrapper title="Advertise with Us" emoji="📣" setPage={setPage}>
      <Section title="Reach Manga Fans Worldwide">
        <p>MangaVerse serves millions of manga enthusiasts globally. Our engaged audience of 18–35 year-olds is passionate about Japanese culture, gaming, animation, and entertainment.</p>
      </Section>
      <Section title="Ad Formats Available">
        <ul className="list-disc list-inside space-y-1">
          <li>Display Ads (via Google AdSense)</li>
          <li>Sponsored Series Cards (native)</li>
          <li>Newsletter Sponsorships</li>
          <li>Category Page Takeovers</li>
          <li>Reader Interstitials</li>
        </ul>
      </Section>
      <Section title="Our Audience">
        <div className="grid grid-cols-3 gap-4 mt-3">
          {[['12M+','Monthly Readers'],['85%','18–35 Age'],['4.2min','Avg Session']].map(([v,l]) => (
            <div key={l} className="text-center bg-indigo-50 rounded-xl p-3">
              <div className="font-black text-indigo-600 text-xl">{v}</div>
              <div className="text-xs text-gray-500 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Contact Advertising">
        <p>Reach out at ads@mangaverse.io to discuss partnership opportunities.</p>
      </Section>
    </StaticWrapper>
  );
}

export function SitemapPage({ setPage }) {
  const links = [
    ['🏠 Home / Discover',   'discover'],
    ['📚 My Library',        'library'],
    ['🗂️ Categories',        'categories'],
    ['🔔 Updates',           'updates'],
    ['ℹ️ About Us',          'about'],
    ['💬 Contact',           'contact'],
    ['🔒 Privacy Policy',    'privacy'],
    ['📋 Terms of Service',  'terms'],
    ['⚖️ DMCA Policy',       'dmca'],
    ['📣 Advertise',         'advertise'],
  ];
  return (
    <StaticWrapper title="Sitemap" emoji="🗺️" setPage={setPage}>
      <p className="text-sm text-gray-500 mb-6">Quick navigation to all pages on MangaVerse.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {links.map(([label, id]) => (
          <button key={id} onClick={() => setPage(id)}
            className="flex items-center gap-2 px-4 py-3 bg-stone-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl text-sm font-medium text-gray-700 transition text-left border border-stone-100 hover:border-indigo-200">
            {label}
          </button>
        ))}
      </div>
    </StaticWrapper>
  );
}
