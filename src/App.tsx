import { useEffect, useState } from 'react';
import {
  motion,
  AnimatePresence
} from 'motion/react';
import {
  Figma,
  Linkedin,
  Instagram,
  Mail,
  ExternalLink,
  MapPin,
  Briefcase,
  Code,
  Palette,
  Globe,
  MessageSquare,
  GraduationCap,
  Menu,
  X
} from 'lucide-react';
import { Project, PortfolioData } from './types';
import { DEFAULT_PORTFOLIO_DATA } from './data';

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
          parsed.profile.name !== "Sergio Riman Dias" ||
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

  // Render avatar as a raised circular badge with stylized initials
  const renderAvatar = (name: string, sizeClass = "w-16 h-16 text-xl") => {
    if (portfolio.profile.avatarUrl) {
      return (
        <div className={`${sizeClass} neu-raised-sm rounded-full p-1`}>
          <img
            src={portfolio.profile.avatarUrl}
            alt={name}
            className="w-full h-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    const initials = name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div className={`${sizeClass} neu-raised rounded-full flex items-center justify-center font-display font-bold text-accent`}>
        <span className="tracking-wider">{initials}</span>
      </div>
    );
  };

  const featuredProject = portfolio.projects.find(p => p.id === 'proj-portal-rebranding') || portfolio.projects[0];

  const designSkills = portfolio.profile.skills.filter(s => s.category === "Design");
  const productSkills = portfolio.profile.skills.filter(s => s.category !== "Design");
  const averageLevel = (skills: typeof portfolio.profile.skills) =>
    skills.length ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0;

  // The signature element: a physical dial/slider gauge instead of a flat progress bar
  const renderGauge = (skill: { name: string; level: number }, key: number) => (
    <div key={key} className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-ink font-medium">{skill.name}</span>
        <span className="text-accent font-mono font-bold">{skill.level}%</span>
      </div>
      <div className="relative h-3 w-full neu-inset rounded-full">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-0 h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--color-accent-2), var(--color-accent))' }}
        />
        <div
          className="absolute top-1/2 w-4 h-4 neu-raised-sm rounded-full border border-white/40"
          style={{ left: `${skill.level}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-ink font-sans selection:bg-accent selection:text-white relative pb-16">

      {/* Primary Header/Navbar */}
      <header id="main-header" className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, var(--color-accent-2), var(--color-accent))' }} />
            <div>
              <span className="text-xs font-display font-bold uppercase tracking-[0.25em] text-ink">
                {portfolio.profile.name} <span className="text-muted">/</span> Portfolio
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-[11px] uppercase tracking-widest font-bold text-muted neu-inset rounded-full p-1.5">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  activeSection === link.id
                    ? 'neu-raised-sm text-accent'
                    : 'text-muted hover:text-ink'
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
              className="neu-raised neu-pressable hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-display font-bold tracking-wide text-accent"
            >
              <span>Contato</span>
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="neu-raised neu-pressable md:hidden flex items-center justify-center w-10 h-10 rounded-2xl text-ink"
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
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden"
            >
              <div className="max-w-6xl mx-auto flex flex-col gap-2 pt-4 text-sm font-semibold text-muted">
                {navLinks.map(link => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-2xl transition-colors ${
                      activeSection === link.id
                        ? 'neu-inset text-accent'
                        : 'text-muted hover:text-ink'
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
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-8 md:mt-12">

        {/* ======================================================== */}
        {/* BENTO GRID HERO SECTION */}
        {/* ======================================================== */}
        <section id="hero-section" className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

            {/* Intro Card (Col Span 2, Row Span 2) */}
            <div className="col-span-1 md:col-span-2 md:row-span-2 neu-raised rounded-[40px] p-8 md:p-10 flex flex-col justify-between min-h-[440px]">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 neu-inset rounded-2xl flex items-center justify-center">
                  <Figma className="w-7 h-7 text-accent" />
                </div>
                <div>
                  {renderAvatar(portfolio.profile.name, "w-16 h-16 text-xl")}
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-accent neu-inset-sm px-3.5 py-1.5 rounded-full inline-block">
                    {portfolio.profile.title}
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight leading-[0.95] mb-4 text-ink">
                  {portfolio.profile.name.split(' ')[0]}<br/>
                  {portfolio.profile.name.split(' ').slice(1).join(' ')}.
                </h1>

                <p className="text-muted text-sm md:text-base leading-relaxed max-w-[440px]">
                  {portfolio.profile.bio}
                </p>
              </div>
            </div>

            {/* Location Card — extruded inward, no black panel (Col Span 1, Row Span 2) */}
            <div className="col-span-1 md:row-span-2 neu-inset rounded-[40px] min-h-[340px] flex flex-col justify-between p-8">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-muted font-mono">Disponibilidade Remota</span>
                <p className="text-ink text-xs font-medium mt-1">Atuação Global & Squads Ágeis</p>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-widest text-muted mb-1 font-mono">Localização</div>
                <div className="text-base font-medium text-ink flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-accent shrink-0" />
                  {portfolio.profile.location}
                </div>
              </div>
            </div>

            {/* Figma Profile Link (Col Span 1, Row Span 1) */}
            {portfolio.socials.figma && (
              <a
                href={portfolio.socials.figma}
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised neu-pressable col-span-1 rounded-[40px] p-8 flex flex-col justify-between min-h-[190px]"
              >
                <div className="w-12 h-12 neu-inset rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-accent" fill="currentColor" viewBox="0 0 38 57">
                    <path d="M19 28.5c0 5.247-4.253 9.5-9.5 9.5S0 33.747 0 28.5 4.253 19 9.5 19s9.5 4.253 9.5 9.5z"/>
                    <path d="M19 9.5C19 14.747 14.747 19 9.5 19S0 14.747 0 9.5 4.253 0 9.5 0 19 4.253 19 9.5z"/>
                    <path d="M38 9.5C38 14.747 33.747 19 28.5 19S19 14.747 19 9.5 23.253 0 28.5 0 38 4.253 38 9.5z"/>
                    <path d="M38 28.5c0 5.247-4.253 9.5-9.5 9.5S19 33.747 19 28.5 23.253 19 28.5 19s9.5 4.253 9.5 9.5z"/>
                    <path d="M19 47.5c0 5.247-4.253 9.5-9.5 9.5S0 52.747 0 47.5 4.253 38 9.5 38 19 42.253 19 47.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-base font-bold text-ink flex items-center gap-1.5">
                    Portal de Assinatura <ExternalLink className="w-4 h-4 opacity-50" />
                  </div>
                  <div className="text-[10px] text-muted uppercase tracking-[0.2em] font-bold mt-1">Acessar no Figma</div>
                </div>
              </a>
            )}

            {/* Socials Grid (Col Span 1, Row Span 1) */}
            <div className="col-span-1 neu-raised rounded-[40px] p-8 flex flex-col justify-between min-h-[190px]">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 neu-inset rounded-2xl flex items-center justify-center text-accent">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="flex gap-1.5">
                  {portfolio.socials.behance && (
                    <a
                      href={portfolio.socials.behance}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-raised-sm neu-pressable h-8 px-2.5 rounded-full flex items-center justify-center text-accent text-[11px] font-bold font-mono"
                      title="Behance"
                    >
                      Bē
                    </a>
                  )}
                  {portfolio.socials.instagram && (
                    <a
                      href={portfolio.socials.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-raised-sm neu-pressable w-8 h-8 rounded-full flex items-center justify-center text-muted"
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-ink">Socials & Portfólios</div>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {portfolio.socials.linkedin && (
                    <a href={portfolio.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {portfolio.socials.behance && (
                    <a href={portfolio.socials.behance} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-wider text-accent hover:underline">
                      Behance
                    </a>
                  )}
                  {portfolio.socials.email && (
                    <a href={`mailto:${portfolio.socials.email}`} className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted hover:underline">
                      E-mail
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Project Showcase — extruded inward, no black panel (Col Span 2, Row Span 1) */}
            <div className="col-span-1 md:col-span-2 neu-inset rounded-[40px] p-8 flex flex-col md:flex-row items-center gap-6 min-h-[190px]">
              <div className="text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent border border-accent/30 px-3 py-1 rounded-full mb-3 inline-block">Destaque Principal</span>
                <h3 className="text-2xl md:text-3xl font-display font-bold mb-1.5 text-ink leading-tight">{featuredProject.title}</h3>
                <p className="text-muted text-xs md:text-sm max-w-[340px] line-clamp-2">{featuredProject.description}</p>
              </div>
              <div className="md:ml-auto shrink-0 flex gap-2">
                {featuredProject.figmaUrl && (
                  <a
                    href={featuredProject.figmaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-raised-sm neu-pressable w-14 h-14 rounded-2xl flex items-center justify-center text-accent shrink-0"
                    title={featuredProject.figmaUrl.includes('figma.com') ? "Abrir no Figma" : "Acessar Projeto no Ar"}
                  >
                    {featuredProject.figmaUrl.includes('figma.com') ? <Figma className="w-6 h-6" /> : <Globe className="w-6 h-6" />}
                  </a>
                )}
                {featuredProject.liveUrl && featuredProject.liveUrl !== featuredProject.figmaUrl && (
                  <a
                    href={featuredProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-raised-sm neu-pressable w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-accent"
                    title="Acessar Projeto no Ar"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

            {/* Status Card (Col Span 1, Row Span 1) */}
            <div className="col-span-1 neu-raised rounded-[40px] p-8 flex flex-col items-center justify-center text-center min-h-[190px]">
               <div className="w-10 h-10 relative flex items-center justify-center mb-3">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: 'var(--color-accent)' }} />
                  <div className="w-3.5 h-3.5 rounded-full" style={{ background: 'linear-gradient(135deg, var(--color-accent-2), var(--color-accent))' }} />
               </div>
               <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">Disponibilidade</div>
               <div className="text-sm font-semibold text-ink mt-1">{portfolio.profile.status}</div>
            </div>

            {/* Tech Stack expertise (Col Span 1, Row Span 1) */}
            <div className="col-span-1 neu-raised rounded-[40px] p-8 flex flex-col justify-between min-h-[190px]">
               <div className="flex flex-wrap gap-1.5">
                  {portfolio.profile.skills.slice(0, 4).map((sk, idx) => (
                    <div key={idx} className="neu-inset-sm text-[9px] px-2.5 py-1 rounded-full uppercase tracking-tight text-muted font-medium">
                      {sk.name}
                    </div>
                  ))}
               </div>
               <div className="text-muted font-bold text-[10px] uppercase tracking-widest">
                  Expertise & Squads
               </div>
            </div>

          </div>
        </section>

        {/* ======================================================== */}
        {/* 3. FIGMA & WEB PROJECTS SECTION */}
        {/* ======================================================== */}
        <section id="projetos" className="mb-16 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Globe className="w-4 h-4 text-accent" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent">Showcase de Produtos</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-ink tracking-tight">
                Projetos & Aplicações em Destaque
              </h3>
              <p className="text-sm text-muted mt-1">Concepção de UX/UI, prototipação de alta fidelidade e aplicações web no ar.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {portfolio.projects.map((proj, idx) => (
              <motion.div
                key={proj.id}
                id={`project-card-${proj.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className="neu-raised rounded-[32px] overflow-hidden flex flex-col group"
              >
                {/* Image area — strong RGB orange gradient instead of a fake mockup */}
                <div
                  className="h-44 m-4 mb-0 rounded-[24px] relative overflow-hidden flex items-end p-5 group-hover:brightness-105 transition-[filter] duration-300"
                  style={{ background: 'linear-gradient(135deg, var(--color-accent-2), var(--color-accent))' }}
                >
                  <span className="absolute -right-3 -bottom-4 font-display font-extrabold text-8xl leading-none text-white/20 select-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="relative z-10 font-display font-extrabold uppercase tracking-tight text-white text-base">
                    {proj.title}
                  </span>
                </div>

                {/* Body Info */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-display font-extrabold uppercase tracking-tight text-xl text-ink leading-tight">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-muted leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Project Tags */}
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tags.map((tag, tagIdx) => (
                          <span
                            key={tagIdx}
                            className="neu-inset-sm text-muted text-[10px] px-2.5 py-0.5 rounded-lg font-mono font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center gap-3 mt-6 pt-4">
                    {proj.figmaUrl && (
                      <a
                        id={`btn-figma-${proj.id}`}
                        href={proj.figmaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-raised-sm neu-pressable flex-1 text-accent py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {proj.figmaUrl.includes('figma.com') ? (
                          <>
                            <Figma className="w-3.5 h-3.5" />
                            <span>Abrir no Figma</span>
                          </>
                        ) : (
                          <>
                            <Globe className="w-3.5 h-3.5" />
                            <span>Acessar Projeto</span>
                          </>
                        )}
                      </a>
                    )}

                    {proj.liveUrl && proj.liveUrl !== proj.figmaUrl && (
                      <a
                        id={`btn-live-${proj.id}`}
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ver Aplicação / Protótipo Online"
                        className="neu-raised-sm neu-pressable p-2.5 text-muted rounded-xl flex items-center justify-center"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ======================================================== */}
        {/* 4. SKILLS SECTION — physical gauges (signature element) */}
        {/* ======================================================== */}
        <section id="habilidades" className="mb-16 scroll-mt-24">
          <div className="neu-raised p-8 md:p-10 rounded-[40px]">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 mb-1">
                <Code className="w-3.5 h-3.5" />
                Matriz de Competências
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-ink">Habilidades & Especialidades</h3>
              <p className="text-sm text-muted mt-1">Evolução técnica contínua combinando design visual com liderança de produto e métodos ágeis.</p>
            </div>

            {/* Visual Skill Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {/* Design Core Skills */}
              <div className="space-y-5">
                <h4 className="font-display font-bold text-sm text-ink flex items-center gap-2 pb-2">
                  <Palette className="w-4 h-4 text-accent" />
                  Visual Design & UX/UI ({averageLevel(designSkills)}%)
                </h4>
                <div className="space-y-4">
                  {designSkills.map((skill, index) => renderGauge(skill, index))}
                </div>
              </div>

              {/* Product Management */}
              <div className="space-y-5">
                <h4 className="font-display font-bold text-sm text-ink flex items-center gap-2 pb-2">
                  <Briefcase className="w-4 h-4 text-accent" />
                  Product Management ({averageLevel(productSkills)}%)
                </h4>
                <div className="space-y-4">
                  {productSkills.map((skill, index) => renderGauge(skill, index))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. WORK EXPERIENCE TIMELINE */}
        {/* ======================================================== */}
        <section id="experiencia" className="mb-16 scroll-mt-24">
          <div className="neu-raised p-8 md:p-10 rounded-[40px]">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                Carreira & Trajetória
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-ink">Experiência Profissional</h3>
              <p className="text-sm text-muted mt-1">Mais de 8 anos de atuação em liderança de produtos digitais, UX/UI e Design Systems.</p>
            </div>

            <div className="space-y-5">
              {portfolio.experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="neu-inset p-6 rounded-[24px]"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-base text-ink">{exp.role}</h4>
                      <div className="text-sm font-semibold text-accent">{exp.company}</div>
                    </div>
                    <span className="text-xs font-mono font-medium text-muted neu-raised-sm px-3 py-1 rounded-full w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mt-3 text-xs text-muted leading-relaxed">
                    {exp.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: 'linear-gradient(135deg, var(--color-accent-2), var(--color-accent))' }} />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="mt-10 pt-8">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-accent" />
                <h4 className="font-display font-bold text-lg text-ink">Formação Acadêmica</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="neu-inset p-5 rounded-[24px]">
                    <span className="text-xs font-mono font-bold text-accent">{edu.year}</span>
                    <div className="font-bold text-ink text-sm mt-0.5">{edu.degree}</div>
                    <div className="text-xs text-muted mt-0.5">{edu.institution}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 6. CONTACT SECTION */}
        {/* ======================================================== */}
        <section id="contato" className="scroll-mt-24">
          <div className="neu-raised p-8 md:p-12 rounded-[40px] text-center">
            <div className="max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-accent flex items-center justify-center gap-1.5 mb-2">
                <Mail className="w-3.5 h-3.5" />
                Contato Direto
              </span>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl text-ink tracking-tight">
                Vamos construir algo incrível juntos?
              </h3>
              <p className="text-sm text-muted mt-2">Disponibilidade imediata para contratação, liderança de squads ou projetos freelance.</p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">

              {/* Email Card */}
              <a
                href="mailto:sergioriman@gmail.com"
                className="neu-raised neu-pressable rounded-[24px] p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 neu-inset text-accent rounded-2xl flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-widest font-semibold mb-1">E-mail</div>
                <div className="text-xs font-bold text-ink break-all">sergioriman@gmail.com</div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/5511953293094"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised neu-pressable rounded-[24px] p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 neu-inset text-accent rounded-2xl flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-widest font-semibold mb-1">WhatsApp</div>
                <div className="text-xs font-bold text-ink">(11) 95329-3094</div>
              </a>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/sergio-riman-dias-21714474/"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised neu-pressable rounded-[24px] p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 neu-inset text-accent rounded-2xl flex items-center justify-center mb-3">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-widest font-semibold mb-1">LinkedIn</div>
                <div className="text-xs font-bold text-ink">Sergio Riman Dias</div>
              </a>

              {/* Behance Card */}
              <a
                href="https://www.behance.net/sergiodias5"
                target="_blank"
                rel="noopener noreferrer"
                className="neu-raised neu-pressable rounded-[24px] p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 neu-inset text-accent rounded-2xl flex items-center justify-center mb-3 font-bold font-mono text-base">
                  Bē
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-widest font-semibold mb-1">Behance</div>
                <div className="text-xs font-bold text-ink">sergiodias5</div>
              </a>

            </div>

          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="mt-20 pt-8 text-center text-xs text-muted max-w-6xl mx-auto px-4">
        <p>© {new Date().getFullYear()} {portfolio.profile.name}. Todos os direitos reservados.</p>
        <p className="mt-1 text-[10px] font-mono text-muted/70">
          Projetado no Figma • Codificado em React, Tailwind CSS e Motion
        </p>
      </footer>
    </div>
  );
}
