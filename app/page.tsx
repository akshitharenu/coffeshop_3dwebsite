'use client';

import { useRef, useEffect, useState } from 'react';
import { useScroll, useSpring, useTransform, motion } from 'framer-motion';
import ScrollCanvas from '@/components/ScrollCanvas';

/* ── Scroll-reveal hook ─────────────────────────────────────────────── */
function useSR() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.querySelectorAll('.sr').forEach(c => c.classList.add('visible')); obs.unobserve(el); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ── Data ────────────────────────────────────────────────────────────── */
const menuItems = [
  { name: 'Signature Espresso', desc: 'Double-shot pulled from single-origin Ethiopian beans with notes of dark chocolate and citrus.', price: '$4.50', tag: 'Best Seller' },
  { name: 'Iced Caramel Latte', desc: 'Smooth cold brew layered with house-made caramel and oat milk over hand-cut ice.', price: '$5.80', tag: 'Featured' },
  { name: 'Matcha Velvet', desc: 'Ceremonial-grade Uji matcha whisked to perfection with steamed vanilla oat milk.', price: '$6.20', tag: '' },
  { name: 'Pour-Over Single Origin', desc: 'Freshly ground Colombian beans brewed with precision using the Hario V60 method.', price: '$5.50', tag: '' },
  { name: 'Honey Lavender Latte', desc: 'Locally sourced honey and dried lavender blended into creamy steamed milk.', price: '$6.00', tag: 'New' },
  { name: 'Cold Brew Tonic', desc: 'Our 18-hour cold brew topped with premium tonic water and a twist of lemon.', price: '$5.50', tag: '' },
];

const stats = [
  { val: '12+', label: 'Origins' },
  { val: '50K', label: 'Cups Monthly' },
  { val: '4.9', label: 'Rating' },
];

/* ═══════════════════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════════════════ */
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadPct, setLoadPct] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (loadPct < 100) setShowSkip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, [loadPct]);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const textProgress = useSpring(scrollYProgress, { stiffness: 150, damping: 35, restDelta: 0.001 });

  // Beats
  const opA = useTransform(textProgress, [0, 0.05, 0.18, 0.24], [1, 1, 1, 0]);
  const yA  = useTransform(textProgress, [0, 0.05, 0.18, 0.24], [0, 0, 0, -40]);
  const blA = useTransform(textProgress, [0.18, 0.24], ['blur(0px)', 'blur(10px)']);

  const opB = useTransform(textProgress, [0.26, 0.32, 0.44, 0.50], [0, 1, 1, 0]);
  const yB  = useTransform(textProgress, [0.26, 0.32, 0.44, 0.50], [40, 0, 0, -40]);
  const blB = useTransform(textProgress, [0.26, 0.32, 0.44, 0.50], ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']);

  const opC = useTransform(textProgress, [0.52, 0.58, 0.70, 0.76], [0, 1, 1, 0]);
  const yC  = useTransform(textProgress, [0.52, 0.58, 0.70, 0.76], [40, 0, 0, -40]);
  const blC = useTransform(textProgress, [0.52, 0.58, 0.70, 0.76], ['blur(10px)', 'blur(0px)', 'blur(0px)', 'blur(10px)']);

  const opD = useTransform(textProgress, [0.78, 0.84, 0.95, 1.0], [0, 1, 1, 1]);
  const yD  = useTransform(textProgress, [0.78, 0.84, 0.95, 1.0], [40, 0, 0, 0]);
  const blD = useTransform(textProgress, [0.78, 0.84], ['blur(10px)', 'blur(0px)']);

  // Nav scroll detection
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Section refs
  const aboutRef   = useSR();
  const menuRef    = useSR();
  const contactRef = useSR();

  return (
    <>
      {/* ═══ FIXED HEADER ════════════════════════════════════════════════ */}
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          padding: '0 clamp(20px, 4vw, 56px)',
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: scrolled || menuOpen ? 'rgba(8,7,10,0.95)' : 'transparent',
          backdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled || menuOpen ? 'blur(20px)' : 'none',
          borderBottom: scrolled || menuOpen ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background 0.5s, backdrop-filter 0.5s, border-color 0.5s',
        }}
      >
        <div style={{ position: 'relative', zIndex: 101 }}>
          <div className="font-head" style={{ fontSize: 'clamp(16px, 5vw, 20px)', color: 'var(--gold)', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
            Artisan Coffee
          </div>
          <div className="font-ui" style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 1 }}>
            Est. 2018 · Melbourne
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-9">
          {['About', 'Menu', 'Contact'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
          ))}
        </nav>

        <a
          href="#contact"
          className="font-ui hidden md:inline-block"
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            padding: '10px 28px', background: 'var(--gold)', color: 'var(--bg)', borderRadius: 999,
            textDecoration: 'none', transition: 'opacity 0.3s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          Reserve
        </a>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden flex flex-col justify-center items-center gap-[5px] z-[101] w-10 h-10 -mr-2 outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          aria-label="Toggle Menu"
        >
          <div style={{ width: 24, height: 1, background: 'var(--gold)', transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <div style={{ width: 24, height: 1, background: 'var(--gold)', transition: 'transform 0.3s, opacity 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 1, background: 'var(--gold)', transition: 'transform 0.3s, opacity 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
        </button>

        {/* Mobile Menu Overlay */}
        <div 
          className="md:hidden"
          style={{
            position: 'fixed', inset: 0, zIndex: 100, height: '100dvh',
            background: 'var(--bg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32,
            opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none',
            transition: 'opacity 0.4s ease',
          }}
        >
          {['About', 'Menu', 'Contact'].map(l => (
            <a 
              key={l} 
              href={`#${l.toLowerCase()}`} 
              className="font-head" 
              style={{ fontSize: '2rem', color: 'var(--text)', textDecoration: 'none', transition: 'color 0.3s' }}
              onClick={() => setMenuOpen(false)}
            >
              {l}
            </a>
          ))}
          <a
            href="#contact"
            className="font-ui"
            style={{
              fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '12px 36px', background: 'var(--gold)', color: 'var(--bg)', borderRadius: 999,
              textDecoration: 'none', marginTop: 16
            }}
            onClick={() => setMenuOpen(false)}
          >
            Reserve
          </a>
        </div>
      </header>

      {/* ═══ HERO ════════════════════════════════════════════════════════ */}
      <div ref={containerRef} style={{ position: 'relative', height: '500vh', zIndex: 0 }}>
        <ScrollCanvas progress={scrollYProgress} onLoaded={setLoadPct} />

        <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', zIndex: 10, pointerEvents: 'none' }}>
          <motion.div style={{ opacity: opA, y: yA, filter: blA }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="font-ui" style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.5em', textTransform: 'uppercase', marginBottom: 24, opacity: 0.8 }}>Artisan Coffee Co.</p>
            <h1 className="font-head" style={{ fontSize: 'clamp(2.5rem, 8vw, 9rem)', fontWeight: 400, color: '#fff', lineHeight: 0.88, marginBottom: 32 }}>
              The Art of<br /><span className="gradient-text" style={{ fontStyle: 'italic' }}>Coffee</span>
            </h1>
            <p className="font-body" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)', color: 'var(--text-muted)', maxWidth: 520, lineHeight: 1.7 }}>
              Handcrafted with precision. Served with passion. Every cup tells a story.
            </p>
          </motion.div>

          <motion.div style={{ opacity: opB, y: yB, filter: blB }} className="absolute inset-0 flex flex-col justify-center px-8 md:px-32 text-left">
            <div style={{ width: 48, height: 1, background: 'var(--gold)', opacity: 0.5, marginBottom: 32 }} />
            <h2 className="font-head" style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.05, marginBottom: 24 }}>
              Single Origin<br /><span className="gradient-text" style={{ fontStyle: 'italic' }}>Beans</span>
            </h2>
            <p className="font-body" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: 'var(--text-muted)', maxWidth: 460, lineHeight: 1.7 }}>
              Sourced directly from family-owned farms. Roasted in micro-batches to unlock every hidden flavor note.
            </p>
          </motion.div>

          <motion.div style={{ opacity: opC, y: yC, filter: blC }} className="absolute inset-0 flex flex-col justify-center items-end px-8 md:px-32 text-right">
            <div style={{ maxWidth: 520 }}>
              <div style={{ width: 48, height: 1, background: 'var(--gold)', opacity: 0.5, marginBottom: 32, marginLeft: 'auto' }} />
              <h2 className="font-head" style={{ fontSize: 'clamp(2rem, 5vw, 5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.05, marginBottom: 24 }}>
                The Perfect<br /><span className="gradient-text" style={{ fontStyle: 'italic' }}>Pour</span>
              </h2>
              <p className="font-body" style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: 'var(--text-muted)', lineHeight: 1.7 }}>
                Ice, milk, and espresso collide in a carefully choreographed moment of artisanal flavour.
              </p>
            </div>
          </motion.div>

          <motion.div style={{ opacity: opD, y: yD, filter: blD }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <h2 className="font-head" style={{ fontSize: 'clamp(2.5rem, 7vw, 7.5rem)', fontWeight: 400, color: '#fff', lineHeight: 0.9, marginBottom: 28 }}>
              Taste the<br /><span className="gradient-text" style={{ fontStyle: 'italic' }}>Difference</span>
            </h2>
            <p className="font-body" style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: 'var(--text-muted)', maxWidth: 480, lineHeight: 1.7 }}>
              Experience coffee in its purest form. A journey of flavour, one cup at a time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ ABOUT ═══════════════════════════════════════════════════════ */}
      <section id="about" ref={aboutRef} style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 40px)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px,100%), 1fr))', gap: '48px 64px', alignItems: 'center' }}>
          {/* Left — image frame */}
          <div className="sr" style={{ position: 'relative' }}>
            <div style={{ position: 'relative', aspectRatio: '3/4', borderRadius: 18, overflow: 'hidden', background: 'var(--bg2)' }}>
              <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=700&q=80" alt="Coffee beans" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
              {/* offset border accent */}
              <div style={{ position: 'absolute', inset: -8, border: '1px solid var(--gold)', borderRadius: 22, opacity: 0.25, pointerEvents: 'none', transform: 'translate(12px,12px)' }} />
            </div>
            {/* floating stat tag */}
            <div className="animate-float" style={{
              position: 'absolute', bottom: 32, right: -16,
              background: 'rgba(8,7,10,0.92)', backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)', borderRadius: 14, padding: '18px 24px',
              textAlign: 'center',
            }}>
              <div className="font-head" style={{ fontSize: 32, color: 'var(--gold)', lineHeight: 1 }}>7+</div>
              <div className="font-ui" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 4 }}>Years of Craft</div>
            </div>
          </div>

          {/* Right — content */}
          <div>
            <div className="section-label sr sr-d1">Our Story</div>
            <h2 className="font-head sr sr-d2" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, marginBottom: 28 }}>
              Where Coffee Meets<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Craft</span>
            </h2>
            <p className="font-body sr sr-d3" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: 20 }}>
              Founded in 2018, Artisan Coffee Co. was born from an obsession with the perfect cup. We travel the world to source the rarest single-origin beans from family estates across three continents.
            </p>
            <p className="font-body sr sr-d4" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: 48, paddingLeft: 20, borderLeft: '2px solid rgba(200,169,110,0.25)' }}>
              Every bean is roasted in our in-house micro-roastery, every drink crafted by master baristas, and every experience designed to make you savour the moment.
            </p>

            {/* Stats */}
            <div className="sr sr-d5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '24px 12px', borderTop: '1px solid var(--border)', paddingTop: 32 }}>
              {stats.map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div className="font-head" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', color: '#fff', lineHeight: 1 }}>{s.val}</div>
                  <div className="font-ui" style={{ fontSize: 9, letterSpacing: '0.2em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 8 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MENU ════════════════════════════════════════════════════════ */}
      <section id="menu" ref={menuRef} style={{ position: 'relative', zIndex: 1, background: 'var(--bg2)', padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 80px)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label sr" style={{ justifyContent: 'center' }}>The Menu</div>
            <h2 className="font-head sr sr-d1" style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
              Curated <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Selections</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px,100%), 1fr))', gap: 20 }}>
            {menuItems.map((item, i) => (
              <div key={i} className={`menu-card sr sr-d${Math.min(i + 1, 6)}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <h3 className="font-head" style={{ fontSize: 18, color: '#fff', fontWeight: 500, lineHeight: 1.3, flex: 1 }}>{item.name}</h3>
                  <span className="font-head" style={{ fontSize: 22, color: 'var(--gold)', marginLeft: 16, whiteSpace: 'nowrap' }}>{item.price}</span>
                </div>
                {item.tag && <span className="pill" style={{ marginBottom: 12, display: 'inline-block' }}>{item.tag}</span>}
                <p className="font-body" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <p className="sr sr-d4 font-ui" style={{ textAlign: 'center', marginTop: 48, fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', letterSpacing: '0.05em' }}>
            Prices may vary by location. All beans are ethically sourced.
          </p>
        </div>
      </section>

      {/* ═══ CONTACT ═════════════════════════════════════════════════════ */}
      <section id="contact" ref={contactRef} style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: 'clamp(80px, 12vw, 160px) clamp(20px, 5vw, 80px)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-label sr" style={{ justifyContent: 'center' }}>Get in Touch</div>
            <h2 className="font-head sr sr-d1" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1 }}>
              Visit <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Us</span>
            </h2>
          </div>

          {/* Info row */}
          <div className="sr sr-d2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 40, marginBottom: 56 }}>
            {[
              { icon: '📍', title: 'Address', lines: ['42 Espresso Lane', 'Artisan District', 'Melbourne, VIC 3000'] },
              { icon: '🕐', title: 'Hours', lines: ['Mon – Fri: 7am – 8pm', 'Sat – Sun: 8am – 9pm'] },
              { icon: '📞', title: 'Phone', lines: ['+61 3 9000 1234', 'hello@artisan.coffee'] },
            ].map(c => (
              <div key={c.title} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
                <div className="font-ui" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12, fontWeight: 600 }}>{c.title}</div>
                {c.lines.map((l, i) => (
                  <div key={i} className="font-body" style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{l}</div>
                ))}
              </div>
            ))}
          </div>

          <hr className="gold-rule sr sr-d3" style={{ marginBottom: 56 }} />

          {/* Newsletter */}
          <div className="sr sr-d4" style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            <h3 className="font-head" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 400, color: '#fff', marginBottom: 12 }}>
              Join the <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Club</span>
            </h3>
            <p className="font-body" style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 32 }}>
              Exclusive access to rare roasts, seasonal specials, and masterclass invitations.
            </p>
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', gap: 0, borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="font-ui"
                suppressHydrationWarning
                style={{
                  flex: 1, padding: '14px 24px', background: 'var(--bg2)', color: 'var(--text)',
                  border: 'none', outline: 'none', fontSize: 13, letterSpacing: '0.03em',
                  minWidth: 0,
                }}
              />
              <button
                type="submit"
                className="font-ui"
                suppressHydrationWarning
                style={{
                  padding: '14px 32px', background: 'var(--gold)', color: 'var(--bg)',
                  border: 'none', fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ══════════════════════════════════════════════════════ */}
      <footer style={{ position: 'relative', zIndex: 1, background: 'var(--bg)', padding: '48px clamp(20px, 5vw, 80px)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div className="font-head w-full md:w-auto text-center md:text-left" style={{ fontSize: 18, color: 'var(--gold)', letterSpacing: '0.06em' }}>
            Artisan Coffee
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end" style={{ gap: 28 }}>
            {['Instagram', 'Twitter', 'Facebook'].map(s => (
              <a key={s} href="#" className="font-ui" style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 600 }}>{s}</a>
            ))}
          </div>
          <p className="font-ui w-full md:w-auto text-center md:text-left" style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} Artisan Coffee Co. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
