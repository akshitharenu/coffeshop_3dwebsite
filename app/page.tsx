'use client';

import { useRef, useState } from 'react';
import { useScroll, useSpring, useTransform, motion, useInView, AnimatePresence } from 'framer-motion';
import ScrollCanvas from '@/components/ScrollCanvas';

/* ─── Fade-in wrapper ───────────────────────────────────────────────── */
function FadeIn({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Menu data ─────────────────────────────────────────────────────── */
const menuItems = [
  { name: 'Signature Espresso', desc: 'Double-shot pulled from single-origin Ethiopian beans with notes of dark chocolate and citrus.', price: '$4.50', tag: 'Best Seller' },
  { name: 'Iced Caramel Latte', desc: 'Smooth cold brew layered with house-made caramel and oat milk over hand-cut ice.', price: '$5.80', tag: 'Featured' },
  { name: 'Matcha Velvet', desc: 'Ceremonial-grade Uji matcha whisked to perfection with steamed vanilla oat milk.', price: '$6.20', tag: '' },
  { name: 'Pour-Over Single Origin', desc: 'Freshly ground Colombian beans brewed with precision using Hario V60 method.', price: '$5.50', tag: '' },
  { name: 'Honey Lavender Latte', desc: 'Locally sourced honey and dried lavender blended into creamy steamed milk.', price: '$6.00', tag: 'New' },
  { name: 'Cold Brew Tonic', desc: 'Our 18-hour cold brew topped with premium tonic water and a twist of lemon.', price: '$5.50', tag: '' },
];

/* ─── Process steps ─────────────────────────────────────────────────── */
const processSteps = [
  { num: '01', title: 'Sourced', desc: 'Direct-trade beans from family farms in Ethiopia, Colombia, and Guatemala.' },
  { num: '02', title: 'Roasted', desc: 'Small-batch roasting in our in-house facility, perfected by our master roaster.' },
  { num: '03', title: 'Brewed', desc: 'Precision brewing techniques tailored to each bean\'s unique flavour profile.' },
  { num: '04', title: 'Served', desc: 'Presented with care in our handcrafted ceramic cups, made for the moment.' },
];

/* ─── Testimonials ──────────────────────────────────────────────────── */
const testimonials = [
  { text: 'The best coffee experience I\'ve ever had. Every sip feels intentional and luxurious.', name: 'Sarah K.', role: 'Food Blogger' },
  { text: 'Artisan Coffee Co. has completely redefined what I expect from a coffee shop. Absolutely stunning.', name: 'Marcus L.', role: 'Creative Director' },
  { text: 'From the ambiance to the cup — every detail is thoughtfully crafted. My daily ritual.', name: 'Elena V.', role: 'Architect' },
];

/* ═══════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const textProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.0001,
  });

  // Beat A — 0–20%
  const opA = useTransform(textProgress, [0, 0.02, 0.15, 0.22], [1, 1, 1, 0]);
  const yA  = useTransform(textProgress, [0, 0.02, 0.15, 0.22], [0, 0, 0, -30]);

  // Beat B — 25–45%
  const opB = useTransform(textProgress, [0.25, 0.30, 0.40, 0.47], [0, 1, 1, 0]);
  const yB  = useTransform(textProgress, [0.25, 0.30, 0.40, 0.47], [30, 0, 0, -30]);

  // Beat C — 50–70%
  const opC = useTransform(textProgress, [0.50, 0.55, 0.65, 0.72], [0, 1, 1, 0]);
  const yC  = useTransform(textProgress, [0.50, 0.55, 0.65, 0.72], [30, 0, 0, -30]);

  // Beat D — 75–95%
  const opD = useTransform(textProgress, [0.75, 0.80, 0.90, 0.97], [0, 1, 1, 0]);
  const yD  = useTransform(textProgress, [0.75, 0.80, 0.90, 0.97], [30, 0, 0, -30]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Menu', href: '#menu' },
    { name: 'Process', href: '#process' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <main className="bg-[#0a0a0a] selection:bg-[#c8a97e]/30 overflow-x-hidden">

      {/* ═══ NAVIGATION BAR ══════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-12 py-5 transition-all duration-500 ${isMenuOpen ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'}`}>
        <div className="font-display text-xl md:text-2xl tracking-wide relative z-10">
          <span className="text-[#c8a97e]">Artisan</span> <span className="text-white/80">Coffee Co.</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-8 text-sm text-white/50 tracking-widest uppercase">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="hover:text-[#c8a97e] transition-colors">{link.name}</a>
          ))}
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#contact" className="hidden md:block px-5 py-2 border border-[#c8a97e]/40 text-[#c8a97e] text-xs tracking-widest uppercase hover:bg-[#c8a97e] hover:text-black transition-all duration-300">
            Reserve
          </a>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 relative z-10"
          >
            <motion.span 
              animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white/80 block origin-center"
            />
            <motion.span 
              animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="w-6 h-0.5 bg-white/80 block"
            />
            <motion.span 
              animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="w-6 h-0.5 bg-white/80 block origin-center"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              {navLinks.map((link, i) => (
                <motion.a
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-display text-white/80 hover:text-[#c8a97e] transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.a
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-4 px-10 py-3 bg-[#c8a97e] text-black font-semibold uppercase tracking-widest text-sm rounded-full"
              >
                Reserve Now
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HERO — SCROLL CANVAS ════════════════════════════════════════ */}
      <div ref={containerRef} className="relative h-[300vh] md:h-[250vh] w-full" style={{ position: 'relative' }}>
        <ScrollCanvas progress={scrollYProgress} />

        <div className="sticky top-0 h-screen w-full pointer-events-none" style={{ zIndex: 10 }}>
          {/* Beat A */}
          <motion.div style={{ opacity: opA, y: yA }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-[#c8a97e] text-[10px] md:text-sm tracking-[0.3em] uppercase mb-4 md:mb-6 font-medium">Artisan Coffee Co.</p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-9xl font-medium tracking-tight text-white mb-5 leading-[0.9]">
              The Art of<br /><span className="gradient-text italic">Coffee</span>
            </h1>
            <p className="text-sm md:text-xl text-white/50 font-light max-w-lg leading-relaxed px-4">
              Handcrafted with precision. Served with passion. Every cup tells a story.
            </p>
          </motion.div>

          {/* Beat B */}
          <motion.div style={{ opacity: opB, y: yB }} className="absolute inset-0 flex flex-col justify-center items-center md:items-start px-6 md:pl-20 md:pr-6 md:max-w-xl text-center md:text-left">
            <div className="divider-line mb-6 mx-auto md:ml-0" />
            <h2 className="font-display text-3xl md:text-6xl font-medium text-white mb-4 leading-tight">
              Single Origin<br /><span className="gradient-text italic">Beans</span>
            </h2>
            <p className="text-sm md:text-lg text-white/50 font-light leading-relaxed max-w-md">
              Sourced directly from family farms. Roasted in small batches to unlock every hidden note.
            </p>
          </motion.div>

          {/* Beat C */}
          <motion.div style={{ opacity: opC, y: yC }} className="absolute inset-0 flex flex-col justify-center items-center md:items-end px-6 md:pr-20 md:pl-6 md:max-w-none md:text-right text-center">
            <div className="md:max-w-xl flex flex-col items-center md:items-end">
              <div className="divider-line mb-6 mx-auto md:mr-0" />
              <h2 className="font-display text-3xl md:text-6xl font-medium text-white mb-4 leading-tight">
                The Perfect<br /><span className="gradient-text italic">Pour</span>
              </h2>
              <p className="text-sm md:text-lg text-white/50 font-light leading-relaxed max-w-md">
                Ice, milk, and espresso collide in a carefully choreographed moment of flavour.
              </p>
            </div>
          </motion.div>

          {/* Beat D */}
          <motion.div style={{ opacity: opD, y: yD }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-auto">
            <h2 className="font-display text-4xl sm:text-6xl md:text-8xl font-medium text-white mb-5 leading-[0.9]">
              Taste the<br /><span className="gradient-text italic">Difference</span>
            </h2>
            <p className="text-sm md:text-xl text-white/50 font-light mb-10">
              Visit us today and discover your new favourite cup.
            </p>
            <a href="#menu" className="px-8 py-3 md:px-10 md:py-4 bg-[#c8a97e] text-black rounded-full text-sm md:text-base font-semibold tracking-wider uppercase hover:bg-[#e8d5b5] hover:scale-105 transition-all duration-300 shadow-lg shadow-[#c8a97e]/20">
              Explore Menu
            </a>
          </motion.div>
        </div>
      </div>

      {/* ═══ ABOUT SECTION ═══════════════════════════════════════════════ */}
      <section id="about" className="relative z-20 bg-[#0a0a0a] px-6 md:px-12 py-24 md:py-48 border-t border-white/5">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">
          <FadeIn>
            <p className="text-[#c8a97e] text-xs tracking-[0.25em] uppercase mb-6 font-medium">Our Story</p>
            <h2 className="font-display text-4xl md:text-7xl font-medium text-white mb-10 leading-[1.1]">
              Where Coffee Meets <span className="italic gradient-text">Craft</span>
            </h2>
            <div className="space-y-6 max-w-lg">
              <p className="text-base md:text-lg text-white/60 font-light leading-relaxed">
                Founded in 2018, Artisan Coffee Co. was born from an obsession with the perfect cup. We travel the world to source the rarest single-origin beans.
              </p>
              <p className="text-base text-white/40 font-light leading-relaxed">
                Every bean is roasted in our in-house micro-roastery, every drink crafted by trained baristas, and every experience designed to make you savour the moment.
              </p>
            </div>
            
            <div className="flex gap-10 md:gap-16 mt-12 pt-10 border-t border-white/5">
              <div>
                <span className="text-2xl md:text-4xl font-bold gradient-text">12+</span>
                <p className="text-[10px] md:text-xs text-white/30 mt-2 uppercase tracking-widest">Origins</p>
              </div>
              <div>
                <span className="text-2xl md:text-4xl font-bold gradient-text">50K</span>
                <p className="text-[10px] md:text-xs text-white/30 mt-2 uppercase tracking-widest">Cups Monthly</p>
              </div>
              <div>
                <span className="text-2xl md:text-4xl font-bold gradient-text">4.9</span>
                <p className="text-[10px] md:text-xs text-white/30 mt-2 uppercase tracking-widest">Rating</p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {[
                { icon: '☕', label: 'Premium Beans', desc: 'Grade-A single origin' },
                { icon: '🔥', label: 'Fresh Roasted', desc: 'Roasted every morning' },
                { icon: '🌿', label: 'Organic', desc: 'Certified sustainable' },
                { icon: '❤️', label: 'Made with Love', desc: 'Handcrafted daily' },
              ].map((item, i) => (
                <div key={i} className="bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 hover:border-[#c8a97e]/30 hover:bg-white/[0.04] transition-all duration-700 group">
                  <span className="text-3xl md:text-4xl mb-6 block group-hover:scale-110 transition-transform duration-500">{item.icon}</span>
                  <h4 className="text-sm md:text-base font-semibold text-white mb-2">{item.label}</h4>
                  <p className="text-xs text-white/30 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ MENU SECTION ════════════════════════════════════════════════ */}
      <section id="menu" className="relative z-20 bg-[#0d0d0d] px-6 md:px-12 py-24 md:py-48 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16 md:mb-24">
            <p className="text-[#c8a97e] text-xs tracking-[0.25em] uppercase mb-4 font-medium">The Menu</p>
            <h2 className="font-display text-4xl md:text-7xl font-medium text-white leading-tight">
              Curated <span className="italic gradient-text">Selections</span>
            </h2>
          </FadeIn>

          <div className="divide-y divide-white/5">
            {menuItems.map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="group flex flex-col md:flex-row md:items-center justify-between py-10 md:py-12 hover:px-4 transition-all duration-500 cursor-default rounded-xl hover:bg-white/[0.01]">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <h3 className="text-lg md:text-2xl font-medium text-white group-hover:text-[#c8a97e] transition-colors duration-300">{item.name}</h3>
                      {item.tag && (
                        <span className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#c8a97e]/10 text-[#c8a97e] border border-[#c8a97e]/20 font-semibold">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-sm md:text-base text-white/30 font-light max-w-lg leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-6 mt-6 md:mt-0">
                    <div className="h-px w-12 bg-white/10 hidden md:block" />
                    <span className="text-2xl md:text-4xl font-display text-[#c8a97e] group-hover:scale-110 transition-transform duration-300">{item.price}</span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PROCESS / HOW WE BREW ═══════════════════════════════════════ */}
      <section id="process" className="relative z-20 bg-[#0a0a0a] px-6 md:px-12 py-20 md:py-40 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16 md:mb-20">
            <p className="text-[#c8a97e] text-xs tracking-[0.25em] uppercase mb-4 font-medium">Our Process</p>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white leading-tight">
              From Bean to <span className="italic gradient-text">Cup</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.12}>
                <div className="relative bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 hover:border-[#c8a97e]/20 transition-all duration-500 group h-full">
                  <span className="text-5xl md:text-6xl font-bold text-white/[0.04] absolute top-4 right-6 font-display group-hover:text-[#c8a97e]/10 transition-colors">{step.num}</span>
                  <div className="relative z-10">
                    <div className="w-10 h-10 rounded-full bg-[#c8a97e]/10 flex items-center justify-center mb-6 group-hover:bg-[#c8a97e]/20 transition-colors">
                      <span className="text-[#c8a97e] text-xs font-bold">{step.num}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-3">{step.title}</h3>
                    <p className="text-xs md:text-sm text-white/40 font-light leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ════════════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#111111] px-6 md:px-12 py-20 md:py-40 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-12 md:mb-16">
            <p className="text-[#c8a97e] text-xs tracking-[0.25em] uppercase mb-4 font-medium">Testimonials</p>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white leading-tight">
              What People <span className="italic gradient-text">Say</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white/[0.02] rounded-2xl p-6 md:p-8 border border-white/5 hover:border-[#c8a97e]/10 transition-all duration-500 h-full flex flex-col">
                  <div className="text-[#c8a97e]/30 text-4xl md:text-5xl font-display mb-4">&ldquo;</div>
                  <p className="text-white/60 font-light leading-relaxed flex-1 text-xs md:text-sm">{t.text}</p>
                  <div className="mt-6 pt-6 border-t border-white/5">
                    <p className="text-white font-medium text-xs md:text-sm">{t.name}</p>
                    <p className="text-white/30 text-[10px] md:text-xs">{t.role}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ VISIT / LOCATION ════════════════════════════════════════════ */}
      <section className="relative z-20 bg-[#0a0a0a] px-6 md:px-12 py-20 md:py-40 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <FadeIn>
            <p className="text-[#c8a97e] text-xs tracking-[0.25em] uppercase mb-4 font-medium">Visit Us</p>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white mb-8 leading-tight">
              Find Your <span className="italic gradient-text">Moment</span>
            </h2>
            <div className="space-y-6 text-white/50 text-xs md:text-sm font-light">
              <div>
                <p className="text-white/30 text-[10px] md:text-xs uppercase tracking-widest mb-1">Address</p>
                <p>42 Espresso Lane, Artisan District<br />Melbourne, VIC 3000</p>
              </div>
              <div>
                <p className="text-white/30 text-[10px] md:text-xs uppercase tracking-widest mb-1">Hours</p>
                <p>Mon – Fri: 7:00 AM – 8:00 PM<br />Sat – Sun: 8:00 AM – 9:00 PM</p>
              </div>
              <div>
                <p className="text-white/30 text-[10px] md:text-xs uppercase tracking-widest mb-1">Phone</p>
                <p>+61 3 9000 1234</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.15}>
            <div className="bg-white/[0.02] rounded-2xl p-1 border border-white/5 overflow-hidden">
              <div className="w-full h-60 md:h-96 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
                <div className="text-center px-4">
                  <span className="text-3xl md:text-4xl mb-3 block">📍</span>
                  <p className="text-white/30 text-xs md:text-sm">Interactive Map</p>
                  <p className="text-white/20 text-[10px] md:text-xs mt-1">Melbourne, Australia</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CONTACT / NEWSLETTER ════════════════════════════════════════ */}
      <section id="contact" className="relative z-20 bg-[#111111] px-6 md:px-12 py-20 md:py-40 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-[#c8a97e] text-xs tracking-[0.25em] uppercase mb-4 font-medium">Stay Connected</p>
            <h2 className="font-display text-4xl md:text-6xl font-medium text-white mb-6 leading-tight">
              Join the <span className="italic gradient-text">Club</span>
            </h2>
            <p className="text-sm md:text-base text-white/50 font-light leading-relaxed mb-10 md:mb-14">
              Get exclusive access to new roasts, seasonal specials, and barista tips delivered straight to your inbox.
            </p>

            <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-full px-6 py-3.5 text-white placeholder-white/20 text-sm outline-none focus:border-[#c8a97e]/50 transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-[#c8a97e] text-black rounded-full text-sm font-semibold tracking-wider uppercase hover:bg-[#e8d5b5] transition-all duration-300 shadow-lg shadow-[#c8a97e]/10 hover:shadow-[#c8a97e]/20 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer className="relative z-20 bg-[#0a0a0a] px-6 md:px-12 pt-16 pb-8 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-1">
              <div className="font-display text-xl tracking-wide mb-4">
                <span className="text-[#c8a97e]">Artisan</span> <span className="text-white/80">Coffee Co.</span>
              </div>
              <p className="text-[10px] md:text-xs text-white/30 leading-relaxed max-w-[200px]">
                Handcrafted coffee experiences since 2018. Every cup, a masterpiece.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Explore', links: ['Menu', 'About', 'Process', 'Locations'] },
              { title: 'Company', links: ['Careers', 'Press', 'Sustainability', 'Partners'] },
              { title: 'Connect', links: ['Instagram', 'Twitter', 'Facebook', 'TikTok'] },
            ].map((col) => (
              <div key={col.title}>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/30 mb-4">{col.title}</p>
                <ul className="space-y-2 md:space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-xs md:text-sm text-white/40 hover:text-[#c8a97e] transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/20 text-[10px] md:text-xs text-center sm:text-left">
              &copy; {new Date().getFullYear()} Artisan Coffee Co. All rights reserved.
            </p>
            <div className="flex gap-4 md:gap-6 text-[10px] md:text-xs text-white/20">
              <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/50 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
