import { useEffect, useState } from "react";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [year] = useState(() => new Date().getFullYear());

  // Intersection Observer (reveal + stagger) + Parallax (rAF)
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".reveal, .reveal-left, .reveal-right, .staff-line, .floating-note",
      ),
    );

    const indexInGroup = new WeakMap<Element, number>();
    const groupSizes = new Map<Element, number>();
    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!parent) return;
      const n = groupSizes.get(parent) ?? 0;
      indexInGroup.set(el, n);
      groupSizes.set(parent, n + 1);
    });

    let io: IntersectionObserver | null = null;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const el = entry.target as HTMLElement;
            const i = indexInGroup.get(el) ?? 0;
            const delay = Math.min(i * 90, 540);
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add("is-visible");
            io?.unobserve(el);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      );
      revealEls.forEach((el) => io!.observe(el));
    }

    const floatingNotes = Array.from(document.querySelectorAll<HTMLElement>(".floating-note"));
    const staffLines = Array.from(document.querySelectorAll<SVGPathElement>(".staff-line"));

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollY = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight || 1;
      const p = scrollY / vh;

      floatingNotes.forEach((el, idx) => {
        const speed = parseFloat(el.dataset.floatSpeed || "0.35") || 0.35;
        const dir = idx % 2 === 0 ? 1 : -1;
        const ty = -p * 60 * speed;
        const tx = Math.sin(p * Math.PI) * 12 * speed * dir;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      });

      staffLines.forEach((el, idx) => {
        const speed = 0.15 + idx * 0.04;
        const ty = -p * 30 * speed;
        (el as unknown as HTMLElement).style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
      });
    };

    const onScroll = () => {
      if (ticking || prefersReduced) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    if (!prefersReduced) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      update();
    }

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const navItems = [
    { href: "#sobre", label: "Sobre" },
    { href: "#professores", label: "Professores" },
    { href: "#metodologia", label: "Metodologia" },
    { href: "#instrumentos", label: "Instrumentos" },
    { href: "#depoimentos", label: "Depoimentos" },
  ];

  const teachers = [
    { name: "Adriana Vieira", specialty: "Piano Erudito", initial: "A" },
    { name: "Marco Lenz", specialty: "Violino", initial: "M" },
    { name: "Sofia Albuquerque", specialty: "Canto Lírico", initial: "S" },
    { name: "Rafael Tonin", specialty: "Violão Clássico", initial: "R" },
  ];

  const method = [
    { num: "I.", title: "Diagnóstico", desc: "Uma audição inicial define repertório, ritmo de estudo e objetivos pessoais." },
    { num: "II.", title: "Fundamentos", desc: "Solfejo, harmonia e técnica instrumental construídos com rigor e paciência." },
    { num: "III.", title: "Repertório", desc: "Do barroco ao contemporâneo, cada aluno desenvolve um catálogo próprio." },
    { num: "IV.", title: "Performance", desc: "Recitais trimestrais em salas acusticamente preparadas para o público." },
  ];

  const instruments = [
    { name: "Piano", tag: "Clássico · Jazz · Contemporâneo" },
    { name: "Violino", tag: "Suzuki · Galamian" },
    { name: "Violão", tag: "Clássico · Popular" },
    { name: "Canto", tag: "Lírico · Popular" },
    { name: "Violoncelo", tag: "Câmara · Orquestra" },
    { name: "Flauta", tag: "Transversal · Doce" },
  ];

  const testimonials = [
    { name: "Júlia Moreno", when: "há 2 meses", initial: "J", text: "A SUA_EMPRESA mudou minha relação com a música. Os professores são generosos e exigentes na medida certa." },
    { name: "Pedro Lacerda", when: "há 4 meses", initial: "P", text: "Ambiente sofisticado, instrumentos impecáveis e uma metodologia que respeita o tempo do aluno." },
    { name: "Camila Reis", when: "há 6 meses", initial: "C", text: "Os recitais trimestrais transformam o aprendizado em arte viva. Recomendo de olhos fechados." },
    { name: "Tomás Vidal", when: "há 1 ano", initial: "T", text: "Saí de uma escola tradicional e finalmente encontrei rigor sem perder o prazer de tocar." },
  ];

  return (
    <div className="bg-ivory text-ink font-sans antialiased selection:bg-ink selection:text-ivory">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 header-blur border-b border-ink/10">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between" aria-label="Navegação principal">
          <a href="#hero" className="flex items-center gap-3" aria-label="SUA_EMPRESA — Início">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-ink/40">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M14 2c-2.2 0-4 1.8-4 4v9.5a3 3 0 1 1-3-3 .5.5 0 0 0 0-1 4 4 0 1 0 4 4V6a2 2 0 1 1 4 0c0 1.4-1 2.3-2.2 3.4C11.3 10.7 10 12 10 14.5c0 2 1.3 3.6 3 4.2v.8a2 2 0 1 1-2-2 .5.5 0 0 0 0-1 3 3 0 1 0 3 3v-.6c1.7-.6 3-2.2 3-4.2 0-2.5-1.3-3.8-2.8-5.1C13 8.3 12 7.4 12 6c0-.7.4-1.2 1-1.5V3a1 1 0 0 0-1-1z" />
              </svg>
            </span>
            <span className="font-serif text-2xl tracking-wide">SUA_EMPRESA</span>
          </a>

          <ul className="hidden md:flex items-center gap-10 text-sm uppercase tracking-[0.18em]">
            {navItems.map((n) => (
              <li key={n.href}><a href={n.href} className="nav-link">{n.label}</a></li>
            ))}
          </ul>

          <a href="#cta" className="hidden md:inline-flex items-center px-5 py-2.5 text-xs tracking-[0.2em] uppercase border border-ink text-ink hover:bg-ink hover:text-ivory transition-colors duration-500">
            Matricule-se
          </a>

          <button type="button" onClick={() => setMenuOpen((o) => !o)} className="md:hidden p-2" aria-label="Abrir menu" aria-expanded={menuOpen} aria-controls="mobileMenu">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
        </nav>

        {menuOpen && (
          <div id="mobileMenu" className="md:hidden border-t border-ink/10 bg-ivory">
            <ul className="px-6 py-6 space-y-4 text-sm uppercase tracking-[0.18em]">
              {navItems.map((n) => (
                <li key={n.href}>
                  <a onClick={() => setMenuOpen(false)} href={n.href} className="block py-1">{n.label}</a>
                </li>
              ))}
              <li>
                <a onClick={() => setMenuOpen(false)} href="#cta" className="inline-block mt-2 px-5 py-2.5 border border-ink">Matricule-se</a>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden pt-20">
          <svg className="absolute inset-x-0 top-1/3 w-full h-40 text-ink/30" viewBox="0 0 1600 160" preserveAspectRatio="none" aria-hidden="true">
            <g fill="none" stroke="currentColor" strokeWidth={1}>
              <path className="staff-line" d="M0,20 Q400,0 800,20 T1600,20" />
              <path className="staff-line" d="M0,50 Q400,30 800,50 T1600,50" />
              <path className="staff-line" d="M0,80 Q400,60 800,80 T1600,80" />
              <path className="staff-line" d="M0,110 Q400,90 800,110 T1600,110" />
              <path className="staff-line" d="M0,140 Q400,120 800,140 T1600,140" />
            </g>
          </svg>

          <div className="floating-note" style={{ top: "18%", left: "8%" }} data-float-speed="0.4">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="currentColor" className="text-ink"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" /></svg>
          </div>
          <div className="floating-note" style={{ top: "65%", right: "12%" }} data-float-speed="0.6">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="currentColor" className="text-ink"><path d="M9 3v10.55A4 4 0 1 0 11 17V7h6v10.55A4 4 0 1 0 19 21V3H9z" /></svg>
          </div>
          <div className="floating-note" style={{ top: "30%", right: "22%" }} data-float-speed="0.3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="text-ink"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" /></svg>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-8 reveal">
              <p className="text-xs tracking-[0.4em] uppercase text-ink/60 mb-6">Est. 1998 · Tradição & Excelência</p>
              <h1 className="font-serif text-5xl sm:text-6xl lg:text-8xl leading-[1.05] tracking-tight">
                Onde cada nota<br />
                <em className="italic text-ink/80">se torna</em> história.
              </h1>
              <p className="mt-8 max-w-xl text-lg text-ink/70 leading-relaxed">
                Uma escola de música dedicada ao rigor clássico e à expressão contemporânea. Estude com mestres, em um ambiente pensado para revelar o seu talento.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#cta" className="inline-flex items-center px-8 py-4 bg-ink text-ivory text-xs tracking-[0.25em] uppercase hover:bg-graphite transition-colors duration-500">Agende uma aula experimental</a>
                <a href="#sobre" className="inline-flex items-center px-8 py-4 border border-ink/40 text-xs tracking-[0.25em] uppercase hover:border-ink transition-colors duration-500">Conheça a escola</a>
              </div>
            </div>

            <div className="lg:col-span-4 reveal-right hidden lg:block">
              <div className="border-l border-ink/30 pl-8 space-y-8">
                <div><p className="font-serif text-5xl">25+</p><p className="text-xs uppercase tracking-[0.2em] text-ink/60 mt-1">Anos de tradição</p></div>
                <div><p className="font-serif text-5xl">40</p><p className="text-xs uppercase tracking-[0.2em] text-ink/60 mt-1">Mestres em atuação</p></div>
                <div><p className="font-serif text-5xl">2k+</p><p className="text-xs uppercase tracking-[0.2em] text-ink/60 mt-1">Alunos formados</p></div>
              </div>
            </div>
          </div>
        </section>

        {/* SOBRE */}
        <section id="sobre" className="relative py-32 border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4 lg:sticky lg:top-32 self-start reveal-left">
              <p className="text-xs tracking-[0.4em] uppercase text-ink/60 mb-4">01 · Sobre</p>
              <h2 className="font-serif text-4xl lg:text-5xl leading-tight">Um conservatório<br />contemporâneo.</h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-6 reveal">
              <p className="text-lg leading-relaxed text-ink/75">A SUA_EMPRESA nasceu da convicção de que a música é, antes de tudo, disciplina e beleza. Nossos programas combinam fundamentos clássicos — solfejo, harmonia, repertório — com a liberdade de criar em qualquer linguagem.</p>
              <p className="mt-6 text-base leading-relaxed text-ink/60">Estúdios acusticamente tratados, instrumentos de alta performance e um corpo docente formado em conservatórios da Europa e das Américas.</p>
            </div>
            <div className="lg:col-span-3 lg:row-start-1 lg:col-start-9 reveal-right">
              <div className="aspect-[3/4] bg-ink/5 border border-ink/10 flex items-center justify-center">
                <svg viewBox="0 0 100 200" className="w-1/2 text-ink/40" fill="currentColor" aria-hidden="true">
                  <path d="M50 10c-12 0-20 8-20 20v110a18 18 0 1 0 8 16V40c0-7 5-12 12-12s12 5 12 12c0 8-6 13-13 19-7 7-15 14-15 27 0 11 7 20 17 23v6a10 10 0 1 1-10-10 3 3 0 0 0 0-6 16 16 0 1 0 16 16v-6c10-3 17-12 17-23 0-13-8-20-15-27-7-6-13-11-13-19 0-4 2-7 5-9V18a5 5 0 0 0-5-5z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* PROFESSORES */}
        <section id="professores" className="relative py-32 border-t border-ink/10 bg-ink/[0.02]">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 reveal">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-ink/60 mb-4">02 · Corpo Docente</p>
                <h2 className="font-serif text-4xl lg:text-5xl">Mestres que inspiram.</h2>
              </div>
              <p className="max-w-md text-ink/70">Professores premiados, formados em instituições de referência mundial, prontos para guiar cada etapa da sua jornada musical.</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {teachers.map((t) => (
                <article key={t.name} className="teacher-card bg-ivory border border-ink/10 p-6 reveal">
                  <div className="aspect-[4/5] bg-ink/10 mb-6 overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-ink/30 font-serif text-7xl">{t.initial}</div>
                  </div>
                  <h3 className="font-serif text-2xl">{t.name}</h3>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/60 mt-2">{t.specialty}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* METODOLOGIA */}
        <section id="metodologia" className="relative py-32 border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-20 reveal">
              <p className="text-xs tracking-[0.4em] uppercase text-ink/60 mb-4">03 · Metodologia</p>
              <h2 className="font-serif text-4xl lg:text-5xl">Quatro movimentos<br /><em className="italic text-ink/70">de uma mesma sinfonia.</em></h2>
            </div>

            <ol className="relative border-l border-ink/20 ml-3 space-y-16">
              {method.map((m, i) => (
                <li key={m.title} className="pl-10 reveal relative">
                  <span className={`absolute -left-[9px] w-4 h-4 ${i === method.length - 1 ? "bg-ink" : "bg-ivory"} border border-ink rounded-full`} />
                  <p className="font-serif text-3xl"><span className="text-ink/40 mr-3">{m.num}</span>{m.title}</p>
                  <p className="mt-3 text-ink/70 max-w-2xl">{m.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* INSTRUMENTOS */}
        <section id="instrumentos" className="relative py-32 border-t border-ink/10 bg-ink text-ivory overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="max-w-2xl mb-16 reveal">
              <p className="text-xs tracking-[0.4em] uppercase text-ivory/60 mb-4">04 · Instrumentos</p>
              <h2 className="font-serif text-4xl lg:text-5xl">Um instrumento<br />para cada voz interior.</h2>
            </div>

            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 divide-y divide-ivory/15 lg:divide-y-0 lg:divide-x border-y border-ivory/15">
              {instruments.map((it) => (
                <li key={it.name} className="py-10 lg:px-10 reveal">
                  <p className="font-serif text-3xl">{it.name}</p>
                  <p className="text-sm text-ivory/60 mt-2 uppercase tracking-[0.2em]">{it.tag}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* DEPOIMENTOS */}
        <section id="depoimentos" className="relative py-32 border-t border-ink/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between gap-6 mb-12 reveal">
              <div>
                <p className="text-xs tracking-[0.4em] uppercase text-ink/60 mb-4">05 · Depoimentos</p>
                <h2 className="font-serif text-4xl lg:text-5xl">Vozes da nossa comunidade.</h2>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-ink/60">
                <span className="font-serif text-2xl text-ink">4.9</span>
                <span aria-label="5 estrelas">★★★★★</span>
                <span>· Google</span>
              </div>
            </div>

            <div className="snap-row flex gap-6 overflow-x-auto pb-6 -mx-6 px-6">
              {testimonials.map((t) => (
                <article key={t.name} className="snap-start shrink-0 w-[85%] sm:w-[420px] border border-ink/15 p-8 bg-ivory reveal">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-ink/10 flex items-center justify-center font-serif">{t.initial}</div>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-xs text-ink/50">★★★★★ · {t.when}</p>
                    </div>
                  </div>
                  <p className="text-ink/75 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="relative py-32 border-t border-ink/10 text-center">
          <div className="max-w-3xl mx-auto px-6 reveal">
            <p className="text-xs tracking-[0.4em] uppercase text-ink/60 mb-6">Comece agora</p>
            <h2 className="font-serif text-5xl lg:text-6xl leading-tight">A primeira nota<br /><em className="italic">é sempre a mais difícil, mas conosco pode ficar fácil.</em></h2>
            <p className="mt-6 text-ink/70">Agende uma aula experimental gratuita e descubra seu instrumento.</p>
            <a href="#" className="inline-flex mt-10 items-center px-10 py-4 bg-ink text-ivory text-xs tracking-[0.25em] uppercase hover:bg-graphite transition-colors duration-500">Quero agendar</a>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-ink text-ivory/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="font-serif text-3xl text-ivory">SUA_EMPRESA</p>
            <p className="mt-4 text-sm text-ivory/60 max-w-xs">Escola de música dedicada à tradição clássica e à expressão contemporânea.</p>
            <address className="not-italic mt-6 text-sm space-y-1 text-ivory/70">
              <p>Rua das Sonatas, 88 · Centro</p>
              <p>São Paulo · SP</p>
              <p>+55 (11) 0000-0000</p>
              <p>contato@suaempresa.com.br</p>
            </address>
          </div>

          <nav className="lg:col-span-3" aria-label="Links úteis">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/50 mb-5">Navegação</p>
            <ul className="space-y-3 text-sm">
              {navItems.map((n) => (
                <li key={n.href}><a href={n.href} className="hover:text-ivory">{n.label}</a></li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.3em] text-ivory/50 mb-5">Visite-nos</p>
            <div className="aspect-[16/9] bg-ivory/10 border border-ivory/15 flex items-center justify-center text-ivory/40 text-sm">
              [ Mapa — Google Maps iframe placeholder ]
            </div>
          </div>
        </div>
        <div className="border-t border-ivory/10">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/50">
            <p>© {year} SUA_EMPRESA. Todos os direitos reservados.</p>
            <p>Feito com rigor clássico.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
