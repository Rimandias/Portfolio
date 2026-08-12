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

  // Render avatar with stylized initials
  const renderAvatar = (name: string, sizeClass = "w-16 h-16 text-xl") => {
    if (portfolio.profile.avatarUrl) {
      return (
        <img 
          src={portfolio.profile.avatarUrl} 
          alt={name} 
          className={`${sizeClass} rounded-2xl object-cover border-2 border-indigo-100 shadow-md`}
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
      <div className={`${sizeClass} rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center font-display font-bold text-white shadow-md relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2),transparent_60%)]" />
        <span className="relative z-10 tracking-wider">{initials}</span>
      </div>
    );
  };

  const featuredProject = portfolio.projects.find(p => p.id === 'proj-portal-rebranding') || portfolio.projects[0];

  const designSkills = portfolio.profile.skills.filter(s => s.category === "Design");
  const productSkills = portfolio.profile.skills.filter(s => s.category !== "Design");
  const averageLevel = (skills: typeof portfolio.profile.skills) =>
    skills.length ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / skills.length) : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-500 selection:text-white relative pb-16">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[600px] right-1/4 w-[600px] h-[600px] bg-purple-100/30 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[450px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />

      {/* Primary Header/Navbar */}
      <header id="main-header" className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></div>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-800">
                {portfolio.profile.name} <span className="text-slate-400">/</span> Portfolio
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold text-slate-600">
            {navLinks.map(link => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`transition-colors border-b pb-0.5 ${
                  activeSection === link.id
                    ? 'text-indigo-600 border-indigo-600'
                    : 'border-transparent hover:text-indigo-600 hover:border-indigo-600'
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
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide bg-slate-900 hover:bg-indigo-600 text-white transition-all duration-300 shadow-sm"
            >
              <span>Contato</span>
            </a>
            <button
              type="button"
              onClick={() => setIsMenuOpen(prev => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors"
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
              <div className="max-w-6xl mx-auto flex flex-col gap-1 pt-4 text-sm font-semibold text-slate-700">
                {navLinks.map(link => (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-2 py-2.5 rounded-lg transition-colors ${
                      activeSection === link.id
                        ? 'text-indigo-600 bg-indigo-50'
                        : 'hover:text-indigo-600 hover:bg-slate-50'
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
            <div className="col-span-1 md:col-span-2 md:row-span-2 bg-white border border-slate-200/80 rounded-[36px] p-8 md:p-10 flex flex-col justify-between relative overflow-hidden min-h-[440px] shadow-sm group">
              <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
                  <Figma className="w-7 h-7 text-indigo-600" />
                </div>
                <div>
                  {renderAvatar(portfolio.profile.name, "w-16 h-16 text-xl")}
                </div>
              </div>

              <div className="mt-8 z-10">
                <div className="mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3.5 py-1.5 rounded-full inline-block">
                    {portfolio.profile.title}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[0.95] mb-4 text-slate-900 font-serif italic">
                  {portfolio.profile.name.split(' ')[0]}<br/>
                  {portfolio.profile.name.split(' ').slice(1).join(' ')}.
                </h1>
                
                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-[440px]">
                  {portfolio.profile.bio}
                </p>
              </div>
            </div>

            {/* Location Card (Col Span 1, Row Span 2) */}
            <div className="col-span-1 md:row-span-2 bg-slate-900 text-white rounded-[36px] border border-slate-800 relative overflow-hidden min-h-[340px] flex flex-col justify-between p-8 shadow-md">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 z-10"></div>
              
              {/* Geometric pattern */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <svg width="200" height="200" viewBox="0 0 200 200" className="animate-pulse">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#818cf8" strokeWidth="0.5" strokeDasharray="8 4" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#a5b4fc" strokeWidth="1" />
                  <circle cx="100" cy="100" r="40" fill="#c7d2fe" opacity="0.2" />
                </svg>
              </div>

              <div className="z-20">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">Disponibilidade Remota</span>
                <p className="text-slate-200 text-xs font-medium mt-1">Atuação Global & Squads Ágeis</p>
              </div>

              <div className="z-20">
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 font-mono">Localização</div>
                <div className="text-base font-medium text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400 shrink-0" />
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
                className="col-span-1 bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all rounded-[36px] p-8 flex flex-col justify-between group cursor-pointer min-h-[190px] shadow-sm"
              >
                <div className="w-12 h-12 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-[#f24e1e]" fill="currentColor" viewBox="0 0 38 57">
                    <path d="M19 28.5c0 5.247-4.253 9.5-9.5 9.5S0 33.747 0 28.5 4.253 19 9.5 19s9.5 4.253 9.5 9.5z"/>
                    <path d="M19 9.5C19 14.747 14.747 19 9.5 19S0 14.747 0 9.5 4.253 0 9.5 0 19 4.253 19 9.5z"/>
                    <path d="M38 9.5C38 14.747 33.747 19 28.5 19S19 14.747 19 9.5 23.253 0 28.5 0 38 4.253 38 9.5z"/>
                    <path d="M38 28.5c0 5.247-4.253 9.5-9.5 9.5S19 33.747 19 28.5 23.253 19 28.5 19s9.5 4.253 9.5 9.5z"/>
                    <path d="M19 47.5c0 5.247-4.253 9.5-9.5 9.5S0 52.747 0 47.5 4.253 38 9.5 38 19 42.253 19 47.5z"/>
                  </svg>
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                    Portal de Assinatura <ExternalLink className="w-4 h-4 opacity-50" />
                  </div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Acessar no Figma</div>
                </div>
              </a>
            )}

            {/* Socials Grid (Col Span 1, Row Span 1) */}
            <div className="col-span-1 bg-white border border-slate-200/80 rounded-[36px] p-8 flex flex-col justify-between min-h-[190px] shadow-sm">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="flex gap-1.5">
                  {portfolio.socials.behance && (
                    <a 
                      href={portfolio.socials.behance} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="h-8 px-2.5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 hover:bg-blue-100 transition-colors text-[11px] font-bold font-mono" 
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
                      className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition-colors" 
                      title="Instagram"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
              <div>
                <div className="text-base font-bold text-slate-900">Socials & Portfólios</div>
                <div className="flex flex-wrap gap-2.5 mt-2">
                  {portfolio.socials.linkedin && (
                    <a href={portfolio.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-600 hover:underline">
                      LinkedIn
                    </a>
                  )}
                  {portfolio.socials.behance && (
                    <a href={portfolio.socials.behance} target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600 hover:underline">
                      Behance
                    </a>
                  )}
                  {portfolio.socials.email && (
                    <a href={`mailto:${portfolio.socials.email}`} className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 hover:underline">
                      E-mail
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Project Showcase (Col Span 2, Row Span 1) */}
            <div className="col-span-1 md:col-span-2 bg-indigo-600 rounded-[36px] p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group min-h-[190px] text-white shadow-lg shadow-indigo-600/15">
              <div className="z-20 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full mb-3 inline-block">Destaque Principal</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-1.5 text-white leading-tight">{featuredProject.title}</h3>
                <p className="text-indigo-100 text-xs md:text-sm max-w-[340px] line-clamp-2">{featuredProject.description}</p>
              </div>
              <div className="md:ml-auto z-20 shrink-0 flex gap-2">
                {featuredProject.figmaUrl && (
                  <a 
                    href={featuredProject.figmaUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl hover:scale-105 transition-transform shrink-0"
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
                    className="w-14 h-14 bg-indigo-500/40 border border-indigo-400/30 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 transition-transform shrink-0"
                    title="Acessar Projeto no Ar"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            {/* Status Card (Col Span 1, Row Span 1) */}
            <div className="col-span-1 bg-white border border-slate-200/80 rounded-[36px] p-8 flex flex-col items-center justify-center text-center min-h-[190px] shadow-sm">
               <div className="w-10 h-10 relative flex items-center justify-center mb-3">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-ping opacity-30"></div>
                  <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full shadow-sm shadow-emerald-500/40"></div>
               </div>
               <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Disponibilidade</div>
               <div className="text-sm font-semibold text-slate-800 mt-1">{portfolio.profile.status}</div>
            </div>

            {/* Tech Stack expertise (Col Span 1, Row Span 1) */}
            <div className="col-span-1 bg-white border border-slate-200/80 rounded-[36px] p-8 flex flex-col justify-between min-h-[190px] shadow-sm">
               <div className="flex flex-wrap gap-1.5">
                  {portfolio.profile.skills.slice(0, 4).map((sk, idx) => (
                    <div key={idx} className="bg-slate-100 text-[9px] px-2.5 py-1 rounded-full border border-slate-200 uppercase tracking-tight text-slate-700 font-medium">
                      {sk.name}
                    </div>
                  ))}
               </div>
               <div className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
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
                <Globe className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">Showcase de Produtos</span>
              </div>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">
                Projetos & Aplicações em Destaque
              </h3>
              <p className="text-sm text-slate-600 mt-1">Concepção de UX/UI, prototipação de alta fidelidade e aplicações web no ar.</p>
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
                className="bg-white border border-slate-200/80 rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-900/5 hover:border-slate-300 transition-all duration-300 flex flex-col group"
              >
                {/* Gradient Cover Visual */}
                <div className={`h-44 bg-gradient-to-tr ${proj.gradient} relative overflow-hidden flex items-center justify-center p-6`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.2),transparent_60%)]" />
                  <div className="absolute inset-0 bg-black/5" />
                  
                  {/* Mockup Card */}
                  <div className="relative z-10 w-full max-w-[280px] bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 p-4 shadow-xl flex flex-col justify-between group-hover:scale-105 transition-transform duration-300">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                        <span className="text-[10px] font-bold text-slate-800">{proj.title}</span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <div className="w-full h-1.5 bg-slate-200 rounded"></div>
                      <div className="w-3/4 h-1.5 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>

                {/* Body Info */}
                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-display font-bold text-xl text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>

                    {/* Project Tags */}
                    {proj.tags && proj.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.tags.map((tag, tagIdx) => (
                          <span 
                            key={tagIdx}
                            className="bg-slate-100 text-slate-700 text-[10px] px-2.5 py-0.5 rounded-lg border border-slate-200/80 font-mono font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer Buttons */}
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                    {proj.figmaUrl && (
                      <a 
                        id={`btn-figma-${proj.id}`}
                        href={proj.figmaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`flex-1 ${
                          proj.figmaUrl.includes('figma.com') 
                            ? 'bg-pink-600 hover:bg-pink-700 shadow-sm shadow-pink-600/20' 
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20'
                        } text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer`}
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
                        className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl border border-slate-200 transition-all flex items-center justify-center"
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
        {/* 4. SKILLS SECTION */}
        {/* ======================================================== */}
        <section id="habilidades" className="mb-16 scroll-mt-24">
          <div className="bg-white border border-slate-200/80 p-8 md:p-10 rounded-[36px] shadow-sm relative overflow-hidden">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5 mb-1">
                <Code className="w-3.5 h-3.5" />
                Matriz de Competências
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900">Habilidades & Especialidades</h3>
              <p className="text-sm text-slate-600 mt-1">Evolução técnica contínua combinando design visual com liderança de produto e métodos ágeis.</p>
            </div>

            {/* Visual Skill Matrix Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {/* Design Core Skills (100%) */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  Visual Design & UX/UI ({averageLevel(designSkills)}%)
                </h4>
                <div className="space-y-3.5">
                  {designSkills
                    .map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-800 font-medium">{skill.name}</span>
                          <span className="text-indigo-600 font-mono font-bold">{skill.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Product Management (90%) */}
              <div className="space-y-4">
                <h4 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  Product Management ({averageLevel(productSkills)}%)
                </h4>
                <div className="space-y-3.5">
                  {productSkills
                    .map((skill, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-800 font-medium">{skill.name}</span>
                          <span className="text-emerald-600 font-mono font-bold">{skill.level}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/80">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* 5. WORK EXPERIENCE TIMELINE */}
        {/* ======================================================== */}
        <section id="experiencia" className="mb-16 scroll-mt-24">
          <div className="bg-white border border-slate-200/80 p-8 md:p-10 rounded-[36px] shadow-sm">
            <div className="mb-8">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1.5 mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                Carreira & Trajetória
              </span>
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900">Experiência Profissional</h3>
              <p className="text-sm text-slate-600 mt-1">Mais de 8 anos de atuação em liderança de produtos digitais, UX/UI e Design Systems.</p>
            </div>

            <div className="space-y-6">
              {portfolio.experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-bold text-base text-slate-900">{exp.role}</h4>
                      <div className="text-sm font-semibold text-indigo-600">{exp.company}</div>
                    </div>
                    <span className="text-xs font-mono font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 w-fit">
                      {exp.period}
                    </span>
                  </div>

                  <ul className="space-y-2 mt-3 text-xs text-slate-600 leading-relaxed">
                    {exp.activities.map((act, actIdx) => (
                      <li key={actIdx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education Section */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                <h4 className="font-display font-bold text-lg text-slate-900">Formação Acadêmica</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {portfolio.education.map((edu) => (
                  <div key={edu.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <span className="text-xs font-mono font-bold text-indigo-600">{edu.year}</span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{edu.degree}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{edu.institution}</div>
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
          <div className="bg-white border border-slate-200/80 p-8 md:p-12 rounded-[36px] shadow-sm relative overflow-hidden text-center">
            <div className="max-w-2xl mx-auto mb-10">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 flex items-center justify-center gap-1.5 mb-2">
                <Mail className="w-3.5 h-3.5" />
                Contato Direto
              </span>
              <h3 className="font-display font-extrabold text-3xl md:text-4xl text-slate-900 tracking-tight">
                Vamos construir algo incrível juntos?
              </h3>
              <p className="text-sm text-slate-600 mt-2">Disponibilidade imediata para contratação, liderança de squads ou projetos freelance.</p>
            </div>

            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              
              {/* Email Card */}
              <a 
                href="mailto:sergioriman@gmail.com"
                className="bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-white rounded-2xl p-6 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">E-mail</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors break-all">sergioriman@gmail.com</div>
              </a>

              {/* WhatsApp Card */}
              <a 
                href="https://wa.me/5511953293094"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-white rounded-2xl p-6 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">WhatsApp</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">(11) 95329-3094</div>
              </a>

              {/* LinkedIn Card */}
              <a 
                href="https://www.linkedin.com/in/sergio-riman-dias-21714474/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white rounded-2xl p-6 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">LinkedIn</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Sérgio Riman Dias</div>
              </a>

              {/* Behance Card */}
              <a 
                href="https://www.behance.net/sergiodias5"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white rounded-2xl p-6 flex flex-col items-center text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300 font-bold font-mono text-base">
                  Bē
                </div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold mb-1">Behance</div>
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">sergiodias5</div>
              </a>

            </div>

          </div>
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 mt-20 pt-8 text-center text-xs text-slate-500 max-w-6xl mx-auto px-4">
        <p>© {new Date().getFullYear()} {portfolio.profile.name}. Todos os direitos reservados.</p>
        <p className="mt-1 text-[10px] font-mono text-slate-400">
          Projetado no Figma • Codificado em React, Tailwind CSS e Motion
        </p>
      </footer>
    </div>
  );
}
