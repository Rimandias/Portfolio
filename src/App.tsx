import { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence
} from 'motion/react';
import {
  Figma,
  Linkedin,
  Instagram,
  Mail,
  ArrowUpRight,
  MapPin,
  Menu,
  X
} from 'lucide-react';
import { Project, PortfolioData } from './types';
import { DEFAULT_PORTFOLIO_DATA } from './data';

// Solid, editorial swatches — no gradients, no SaaS purple/blue.
const PROJECT_TONES = ['#b6491f', '#4b5d46', '#8a6a3f', '#5c4a3a'];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function App() {
  // Always load latest data with updated links, projects and light styling
  const [portfolio] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          !parsed.experiences ||
          parsed.experiences.length === 0 ||
          parsed.profile.name !== "Sérgio Riman Dias" ||
          parsed.profile.skills?.[0]?.level !== 100 ||
          parsed.profile.status !== "Imediata para contratação e projetos freelance" ||
          !parsed.projects?.some((p: Project) => p.id === 'proj-tcg-colecionador') ||
          parsed.projects?.find((p: Project) => p.id === 'proj-portal-rebranding')?.figmaUrl !== 'https://portalassinaturas.ai.studio' ||
          !parsed.socials?.behance
        ) {
          localStorage.setItem('portfolio_data', JSON.stringify(DEFAULT_PORTFOLIO_DATA));
          return DEFAULT_PORTFOLIO_DATA;
        }
        return parsed;
      } catch (e) {
        console.error("Error loading portfolio from localStorage", e);
      }
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero-section');
  const cursorRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { id: 'projetos', label: 'Projetos' },
    { id: 'habilidades', label: 'Habilidades' },
    { id: 'experiencia', label: 'Experiência' },
    { id: 'contato', label: 'Contato' },
  ];

  // Track which section is in view to highlight the active nav link
  useEffect(() => {
    const sections = navLinks
      .map(link => document.getElementById(link.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    sections.forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Subtle trailing cursor accent — desktop/fine-pointer only, never replaces the system cursor
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) return;
    const el = cursorRef.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };
    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('a, button');
      el.classList.toggle('is-active-link', !!target);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseover', handleOver);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseover', handleOver);
    };
  }, []);

  const renderAvatar = (name: string, sizeClass = "w-16 h-16 text-lg") => {
    if (portfolio.profile.avatarUrl) {
      return (
        <img
          src={portfolio.profile.avatarUrl}
          alt={name}
          className={`${sizeClass} object-cover border border-line grayscale-[15%]`}
          referrerPolicy="no-referrer"
        />
      );
    }

    const initials = name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className={`${sizeClass} bg-ink flex items-center justify-center font-mono font-semibold text-paper`}>
        <span className="tracking-wider">{initials}</span>
      </div>
    );
  };

  const featuredProject = portfolio.projects.find(p => p.id === 'proj-portal-rebranding') || portfolio.projects[0];
  const featuredIndex = portfolio.projects.findIndex(p => p.id === featuredProject.id);

  const designSkills = portfolio.profile.skills.filter(s => s.category === "Design");
  const productSkills = portfolio.profile.skills.filter(s => s.category !== "Design");
  const averageLevel = (skills: typeof portfolio.profile.skills) =>
    skills.length ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0;

  const bioFirstChar = portfolio.profile.bio.charAt(0);
  const bioRest = portfolio.profile.bio.slice(1);

  const contactRows = [
    { label: 'E-mail', value: 'sergioriman@gmail.com', href: 'mailto:sergioriman@gmail.com', external: false },
    { label: 'WhatsApp', value: '(11) 95329-3094', href: 'https://wa.me/5511953293094', external: true },
    { label: 'LinkedIn', value: 'Sérgio Riman Dias', href: portfolio.socials.linkedin || '#', external: true },
    { label: 'Behance', value: 'sergiodias5', href: portfolio.socials.behance || '#', external: true },
  ];

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-accent selection:text-paper relative pb-20">
      <div ref={cursorRef} className="trail-cursor hidden md:block" aria-hidden="true" />
      <div className="grain-overlay" aria-hidden="true" />

      {/* Primary Header/Navbar */}
      <header id="main-header" className="sticky top-0 z-40 bg-paper/85 backdrop-blur-md border-b border-line px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.a
            href="#hero-section"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex items-center gap-2.5"
          >
            <div className="w-2 h-2 bg-accent" />
            <span className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-ink">
              Sérgio Riman Dias <span className="text-muted">/</span> Portfólio
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-9 text-[11px] font-mono uppercase tracking-[0.15em] text-ink-soft">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`ink-link transition-colors duration-300 ${
                  activeSection === link.id ? 'text-accent-dark' : 'hover:text-accent-dark'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Contact Anchor Button (desktop) + Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="#contato"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-[11px] font-mono font-semibold uppercase tracking-[0.1em] bg-ink hover:bg-accent-dark text-paper transition-colors duration-500"
            >
              <span>Contato</span>
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="md:hidden flex items-center justify-center w-10 h-10 border border-line text-ink hover:border-accent hover:text-accent transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              id="mobile-nav-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="md:hidden overflow-hidden"
            >
              <div className="max-w-6xl mx-auto flex flex-col pt-4 text-sm font-mono uppercase tracking-wide">
                {navLinks.map(link => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-1 py-3 border-t border-line transition-colors ${
                      activeSection === link.id ? 'text-accent-dark' : 'text-ink-soft hover:text-accent-dark'
                    }`}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="max-w-6xl mx-auto px-4 md:px-8 mt-14 md:mt-20"
      >

        {/* ======================================================== */}
        {/* MASTHEAD / HERO — asymmetric editorial layout */}
        {/* ======================================================== */}
        <section id="hero-section" className="mb-24 md:mb-32">
          <div className="border-t-2 border-ink pt-4 mb-8 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-accent-dark">{portfolio.profile.title}</span>
            <span className="hidden sm:inline text-[11px] font-mono uppercase tracking-[0.25em] text-muted">{portfolio.profile.location.split(',')[0]}</span>
          </div>

          <h1 className="font-serif italic font-medium text-ink leading-[0.92] mb-14 md:mb-20">
            <span className="block text-[clamp(2.75rem,9vw,6.5rem)]">{portfolio.profile.name.split(' ')[0]}</span>
            <span className="block text-[clamp(2.75rem,9vw,6.5rem)] pl-[10vw] md:pl-[14vw]">
              {portfolio.profile.name.split(' ').slice(1).join(' ')}.
            </span>
          </h1>

          {/* Row A — bio (wide) + marginalia (offset, narrow) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 mb-16 md:mb-24">
            <div className="md:col-span-7">
              <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-4">Sobre</span>
              <p className="text-ink-soft text-base md:text-lg leading-relaxed max-w-[540px]">
                <span className="font-serif italic text-accent text-4xl leading-none float-left mr-2 mt-1">{bioFirstChar}</span>
                {bioRest}
              </p>

              <div className="mt-8">
                <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-3">Stack & Foco</span>
                <div className="flex flex-wrap gap-2">
                  {portfolio.profile.skills.slice(0, 6).map((sk, idx) => (
                    <span key={idx} className="border border-line px-2.5 py-1 text-[10px] font-mono uppercase tracking-tight text-ink-soft">
                      {sk.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 md:col-start-9 md:mt-10">
              <div className="flex items-start justify-between border-t-2 border-accent pt-4 mb-5">
                {renderAvatar(portfolio.profile.name, "w-14 h-14 text-base")}
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-700" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted">Disponível</span>
                </div>
              </div>

              <dl className="space-y-4 text-sm">
                <div className="border-t border-line pt-3">
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">Localização</dt>
                  <dd className="flex items-center gap-1.5 text-ink font-medium">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                    {portfolio.profile.location}
                  </dd>
                </div>
                <div className="border-t border-line pt-3">
                  <dt className="text-[10px] font-mono uppercase tracking-widest text-muted mb-1">Disponibilidade</dt>
                  <dd className="text-ink font-medium">{portfolio.profile.status}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Row B — featured project (wide, negative panel) + socials (offset upward) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-10 items-start">
            <div className="md:col-span-7 bg-negative text-negative-text p-8 md:p-10 relative overflow-hidden">
              <span className="absolute -right-2 -top-6 font-serif italic text-[9rem] leading-none text-white/[0.05] select-none pointer-events-none">
                0{featuredIndex >= 0 ? featuredIndex + 1 : 1}
              </span>
              <div className="relative z-10">
                <span className="inline-block text-[10px] font-mono uppercase tracking-[0.2em] border border-accent-light text-accent-light px-2.5 py-1 mb-5">
                  Em destaque
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-negative-text leading-tight mb-3">{featuredProject.title}</h3>
                <p className="text-white/60 text-sm max-w-[420px] leading-relaxed mb-6">{featuredProject.description}</p>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {featuredProject.figmaUrl && (
                    <a
                      href={featuredProject.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ink-link inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-negative-text hover:text-accent-light transition-colors duration-300"
                    >
                      {featuredProject.figmaUrl.includes('figma.com') ? 'Ver no Figma' : 'Acessar projeto'}
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {featuredProject.liveUrl && featuredProject.liveUrl !== featuredProject.figmaUrl && (
                    <a
                      href={featuredProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ink-link inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-widest text-negative-text hover:text-accent-light transition-colors duration-300"
                    >
                      Projeto no ar
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="md:col-span-4 md:col-start-9 md:-mt-6">
              <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-3">Social</span>
              <div className="border-t border-line">
                {portfolio.socials.figma && (
                  <a href={portfolio.socials.figma} target="_blank" rel="noopener noreferrer" className="ink-link group flex items-center justify-between py-3 border-b border-line text-sm text-ink-soft hover:text-accent-dark transition-colors">
                    <span className="flex items-center gap-2"><Figma className="w-3.5 h-3.5" /> Figma</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                )}
                {portfolio.socials.linkedin && (
                  <a href={portfolio.socials.linkedin} target="_blank" rel="noopener noreferrer" className="ink-link group flex items-center justify-between py-3 border-b border-line text-sm text-ink-soft hover:text-accent-dark transition-colors">
                    <span className="flex items-center gap-2"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                )}
                {portfolio.socials.behance && (
                  <a href={portfolio.socials.behance} target="_blank" rel="noopener noreferrer" className="ink-link group flex items-center justify-between py-3 border-b border-line text-sm text-ink-soft hover:text-accent-dark transition-colors">
                    <span className="flex items-center gap-2 font-mono text-xs font-bold">Bē Behance</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                )}
                {portfolio.socials.instagram && (
                  <a href={portfolio.socials.instagram} target="_blank" rel="noopener noreferrer" className="ink-link group flex items-center justify-between py-3 border-b border-line text-sm text-ink-soft hover:text-accent-dark transition-colors">
                    <span className="flex items-center gap-2"><Instagram className="w-3.5 h-3.5" /> Instagram</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                )}
                {portfolio.socials.email && (
                  <a href={`mailto:${portfolio.socials.email}`} className="ink-link group flex items-center justify-between py-3 border-b border-line text-sm text-ink-soft hover:text-accent-dark transition-colors">
                    <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> E-mail</span>
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* PROJECTS — index list, not a symmetric card grid */}
        {/* ======================================================== */}
        <section id="projetos" className="mb-24 md:mb-32 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 border-t-2 border-ink pt-4">
            <div>
              <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent-dark mb-2">
                Trabalho — seleção {String(1).padStart(2, '0')}/{String(portfolio.projects.length).padStart(2, '0')}
              </span>
              <h3 className="font-serif italic text-3xl md:text-4xl text-ink">
                Projetos que saíram do papel.
              </h3>
            </div>
            <p className="text-sm text-muted max-w-[300px]">UX, prototipação e produto no ar — não é mockup, é link.</p>
          </div>

          <div>
            {portfolio.projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                id={`project-card-${proj.id}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: idx * 0.06, ease: EASE }}
                className="group grid grid-cols-1 md:grid-cols-12 gap-6 items-start py-9 border-b border-line hover:bg-paper-alt/40 transition-colors duration-500"
              >
                <div className="md:col-span-1 flex md:block items-center gap-3">
                  <span className="font-mono text-3xl md:text-4xl text-line-strong group-hover:text-accent transition-colors duration-500">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="md:col-span-3">
                  <div
                    className="h-24 md:h-28 relative flex items-center justify-center"
                    style={{ backgroundColor: PROJECT_TONES[idx % PROJECT_TONES.length] }}
                  >
                    <span className="absolute top-2 left-2 w-2.5 h-2.5 border-t border-l border-white/50" />
                    <span className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b border-r border-white/50" />
                  </div>
                </div>

                <div className="md:col-span-5">
                  <h4 className="font-serif text-xl md:text-2xl text-ink group-hover:text-accent transition-colors duration-500 leading-tight mb-2">
                    {proj.title}
                  </h4>
                  <p className="text-sm text-ink-soft leading-relaxed max-w-md mb-3">
                    {proj.description}
                  </p>
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {proj.tags.map((tag, tagIdx) => (
                        <span
                          key={tagIdx}
                          className="text-[10px] font-mono uppercase tracking-tight text-muted border border-line px-2 py-0.5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:col-span-3 flex md:flex-col gap-4 md:gap-2 md:items-end">
                  {proj.figmaUrl && (
                    <a
                      id={`btn-figma-${proj.id}`}
                      href={proj.figmaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ink-link inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-ink-soft hover:text-accent-dark transition-colors"
                    >
                      {proj.figmaUrl.includes('figma.com') ? 'Figma' : 'Acessar'}
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                  {proj.liveUrl && proj.liveUrl !== proj.figmaUrl && (
                    <a
                      id={`btn-live-${proj.id}`}
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ink-link inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-widest text-ink-soft hover:text-accent-dark transition-colors"
                    >
                      No ar
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SKILLS — dry ledger, not a dashboard */}
        {/* ======================================================== */}
        <section id="habilidades" className="mb-24 md:mb-32 scroll-mt-24">
          <div className="border-t-2 border-ink pt-4 mb-12">
            <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent-dark mb-2">Competências — leitura rápida</span>
            <h3 className="font-serif italic text-3xl md:text-4xl text-ink mb-2">Onde eu sou forte, de verdade.</h3>
            <p className="text-sm text-muted max-w-[460px]">Design de produto e liderança, lado a lado — sem inflar número.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="md:pr-12 md:border-r border-line">
              <h4 className="font-mono font-semibold text-xs uppercase tracking-widest text-ink flex items-center justify-between border-b border-ink pb-3 mb-5">
                <span>Visual Design & UX/UI</span>
                <span className="text-accent-dark">{averageLevel(designSkills)}%</span>
              </h4>
              <div className="space-y-4">
                {designSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <span className="text-ink-soft font-medium">{skill.name}</span>
                      <span className="text-muted font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-[3px] w-full bg-line relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EASE }}
                        className="h-full bg-accent absolute left-0 top-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12 md:mt-0 md:pl-12">
              <h4 className="font-mono font-semibold text-xs uppercase tracking-widest text-ink flex items-center justify-between border-b border-ink pb-3 mb-5">
                <span>Product Management</span>
                <span className="text-accent-dark">{averageLevel(productSkills)}%</span>
              </h4>
              <div className="space-y-4">
                {productSkills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-baseline text-xs mb-1.5">
                      <span className="text-ink-soft font-medium">{skill.name}</span>
                      <span className="text-muted font-mono">{skill.level}%</span>
                    </div>
                    <div className="h-[3px] w-full bg-line relative">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: EASE }}
                        className="h-full bg-ink absolute left-0 top-0"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* EXPERIENCE — vertical rule timeline, not boxed cards */}
        {/* ======================================================== */}
        <section id="experiencia" className="mb-24 md:mb-32 scroll-mt-24">
          <div className="border-t-2 border-ink pt-4 mb-12">
            <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent-dark mb-2">Trajetória — 8+ anos</span>
            <h3 className="font-serif italic text-3xl md:text-4xl text-ink mb-2">Onde eu já coloquei a mão.</h3>
            <p className="text-sm text-muted max-w-[460px]">Produto, UX e liderança de squads em cinco empresas diferentes.</p>
          </div>

          <div>
            {portfolio.experiences.map((exp, idx) => (
              <div
                key={exp.id}
                className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-8 border-b border-line ${idx === 0 ? 'border-t-2 border-t-ink' : ''}`}
              >
                <div className="md:col-span-3">
                  <span className="block text-xs font-mono text-muted mb-1">{exp.period}</span>
                  <span className="block text-[11px] font-mono font-bold uppercase tracking-widest text-accent-dark">{exp.company}</span>
                </div>
                <div className="md:col-span-9">
                  <h4 className="font-serif text-lg md:text-xl text-ink mb-3">{exp.role}</h4>
                  <ul className="space-y-2 text-sm text-ink-soft leading-relaxed">
                    {exp.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-start gap-2.5">
                        <span className="text-accent mt-0.5 shrink-0">–</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="mt-16">
            <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-muted mb-5 border-t border-ink pt-4">Formação</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {portfolio.education.map((edu) => (
                <div key={edu.id} className="flex items-baseline gap-4 border-b border-line pb-4">
                  <span className="font-mono text-xs text-accent-dark shrink-0">{edu.year}</span>
                  <div>
                    <div className="font-serif text-base text-ink">{edu.degree}</div>
                    <div className="text-xs text-muted mt-0.5">{edu.institution}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* CONTACT — typographic link list, not icon cards */}
        {/* ======================================================== */}
        <section id="contato" className="scroll-mt-24">
          <div className="border-t-2 border-ink pt-4 mb-12">
            <span className="block text-[11px] font-mono uppercase tracking-[0.2em] text-accent-dark mb-2">Fala comigo</span>
            <h3 className="font-serif italic text-3xl md:text-5xl text-ink mb-3">Tem um projeto? Escreve.</h3>
            <p className="text-sm text-muted max-w-[460px]">{portfolio.profile.status}.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 border-t border-line">
            {contactRows.map((row) => (
              <a
                key={row.label}
                href={row.href}
                target={row.external ? '_blank' : undefined}
                rel={row.external ? 'noopener noreferrer' : undefined}
                className="ink-link group flex items-center justify-between gap-4 py-6 border-b border-line"
              >
                <span>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-muted mb-1">{row.label}</span>
                  <span className="block font-serif text-xl md:text-2xl text-ink group-hover:text-accent transition-colors duration-300">{row.value}</span>
                </span>
                <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-400 shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </motion.main>

      {/* Minimal Footer */}
      <footer className="border-t border-line mt-24 pt-8 text-center max-w-6xl mx-auto px-4">
        <p className="text-xs text-muted">© {new Date().getFullYear()} {portfolio.profile.name}. Todos os direitos reservados.</p>
        <p className="mt-1 text-[10px] font-mono text-muted/70">
          Projetado no Figma · Codificado em React, Tailwind CSS e Motion
        </p>
      </footer>
    </div>
  );
}
