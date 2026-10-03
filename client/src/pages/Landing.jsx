import { Link } from 'react-router-dom';

const highlights = [
  '15 / 30 / 60 SEC TESTS',
  'REAL-TIME WPM',
  'XP & LEVELS',
  'DAILY CHALLENGES',
];

const features = [
  {
    number: '01',
    title: 'Typing Tests',
    description:
      'Build speed and precision with focused typing sessions and live performance feedback.',
    accent: 'text-[#00ff88]',
    border: 'border-emerald-400/20',
  },
  {
    number: '02',
    title: 'Missions & XP',
    description:
      'Complete training objectives, earn experience, and advance through new levels.',
    accent: 'text-cyan-300',
    border: 'border-cyan-400/20',
  },
  {
    number: '03',
    title: 'Performance Analytics',
    description:
      'Track your results over time and find the areas where focused practice can help.',
    accent: 'text-purple-300',
    border: 'border-purple-400/20',
  },
  {
    number: '04',
    title: 'Daily Challenges',
    description:
      'Take on a fresh challenge and put your consistency and accuracy to the test.',
    accent: 'text-[#00ff88]',
    border: 'border-emerald-400/20',
  },
];

const Landing = () => (
  <div className="min-h-screen w-full overflow-hidden bg-[#05070d] text-slate-100">
    <header className="border-b border-cyan-400/10 bg-[#05070d]/90">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10"
      >
        <Link to="/" className="flex items-center gap-2 font-mono font-bold tracking-wider text-white">
          <span className="text-[#00ff88]">TYPE</span>
          <span className="text-cyan-300">⚡</span>
          <span>RUSH X</span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/login"
            className="rounded-lg px-3 py-2 font-mono text-xs font-bold tracking-widest text-slate-300 transition-colors hover:text-[#00ff88] sm:px-4"
          >
            SIGN IN
          </Link>
          <Link
            to="/signup"
            className="rounded-lg border border-[#00ff88]/40 bg-[#00ff88]/10 px-3 py-2 font-mono text-xs font-bold tracking-wider text-[#00ff88] shadow-[0_0_18px_rgba(0,255,136,0.08)] transition-colors hover:bg-[#00ff88]/15 sm:px-5"
          >
            GET STARTED
          </Link>
        </div>
      </nav>
    </header>

    <main>
      <section className="relative mx-auto flex min-h-[calc(100svh-77px)] w-full max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="pointer-events-none absolute right-8 top-[38%] hidden h-72 w-72 -translate-y-1/2 rounded-full border border-cyan-400/10 lg:block" />
        <div className="pointer-events-none absolute right-16 top-[38%] hidden h-56 w-56 -translate-y-1/2 rounded-full border border-emerald-400/10 lg:block" />

        <div className="relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div className="max-w-4xl">
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.3em] text-[#00ff88]">
              SYSTEM // TYPING TRAINING
            </p>
            <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl">
              TYPE FASTER.
              <br />
              <span className="text-[#00ff88]">THINK FASTER.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Train your typing speed, accuracy and consistency through an
              interactive cyber-training system.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#00ff88] px-6 py-3 font-mono text-sm font-bold tracking-wider text-[#05070d] shadow-[0_0_24px_rgba(0,255,136,0.16)] transition-colors hover:bg-[#38ffaa]"
              >
                START TRAINING →
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-cyan-400/25 bg-[#0a0f18] px-6 py-3 font-mono text-sm font-bold tracking-wider text-cyan-200 transition-colors hover:border-cyan-300/50 hover:bg-cyan-400/5"
              >
                VIEW FEATURES
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:mx-0 lg:justify-self-end">
            <div className="absolute -inset-4 rounded-[2rem] bg-cyan-400/[0.03] blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-[#0a0f18] shadow-[0_20px_70px_rgba(0,0,0,0.38),0_0_32px_rgba(0,255,136,0.06)]">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div className="flex items-center gap-2" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-slate-500">
                  T-RX // CONSOLE_01
                </span>
              </div>

              <div className="p-5 sm:p-7">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-xs tracking-[0.22em] text-[#00ff88]">
                    SYSTEM // READY
                  </p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 font-mono text-[10px] tracking-widest text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#00ff88]" />
                    ONLINE
                  </span>
                </div>

                <div className="mt-6 rounded-xl border border-slate-800 bg-[#05070d]/70 p-4 sm:p-5">
                  <p className="font-mono text-xs font-bold tracking-[0.2em] text-cyan-200">
                    TYPING ENGINE
                  </p>
                  <div className="my-4 h-px bg-gradient-to-r from-cyan-300/40 via-slate-700 to-transparent" />

                  <dl className="space-y-4 font-mono text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-5">
                      <dt className="tracking-wider text-slate-500">WPM</dt>
                      <dd className="text-xl font-bold text-[#00ff88]">48</dd>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                      <dt className="tracking-wider text-slate-500">ACCURACY</dt>
                      <dd className="font-bold text-cyan-200">97%</dd>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                      <dt className="tracking-wider text-slate-500">SESSION</dt>
                      <dd className="text-slate-200">30s</dd>
                    </div>
                    <div className="flex items-center justify-between gap-5">
                      <dt className="tracking-wider text-slate-500">STATUS</dt>
                      <dd className="font-bold tracking-widest text-emerald-300">READY</dd>
                    </div>
                  </dl>

                  <div className="my-4 h-px bg-gradient-to-r from-cyan-300/40 via-slate-700 to-transparent" />
                  <p className="font-mono text-xs leading-6 text-[#00ff88]">
                    <span className="text-cyan-300">&gt;</span> INITIALIZE TRAINING_
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-widest text-slate-600">
                  <span>TRAINING MODULE // ACTIVE</span>
                  <span className="text-purple-300/80">BUILD 01.04</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-16 grid grid-cols-2 gap-3 border-t border-cyan-400/15 pt-6 sm:mt-20 sm:grid-cols-4 sm:gap-5">
          {highlights.map((highlight, index) => (
            <div key={highlight} className="py-2 sm:border-r sm:border-slate-800 sm:last:border-r-0">
              <p className="font-mono text-[10px] tracking-[0.18em] text-slate-500">
                0{index + 1} // TRAINING MODULE
              </p>
              <p className="mt-2 text-xs font-bold tracking-wide text-slate-200 sm:text-sm">
                {highlight}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="border-y border-cyan-400/10 bg-[#080c13]">
        <div className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="mb-10 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-300">
              TRAINING // CAPABILITIES
            </p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
              Your training console.
            </h2>
            <p className="mt-3 text-slate-400">
              A focused toolkit to help you practice, measure progress, and keep
              moving forward.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.number}
                className={`rounded-2xl border ${feature.border} bg-[#0a0f18] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.18)]`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-xs tracking-widest ${feature.accent}`}>
                    MODULE // {feature.number}
                  </span>
                  <span className={`h-2 w-2 rounded-full bg-current ${feature.accent}`} />
                </div>
                <h3 className="mt-8 text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-7 px-5 py-20 sm:px-8 md:flex-row md:items-center lg:px-10 lg:py-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#00ff88]">
            SYSTEM // AWAITING OPERATOR
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            READY TO START TRAINING?
          </h2>
        </div>
        <Link
          to="/signup"
          className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#00ff88]/40 bg-[#00ff88] px-6 py-3 font-mono text-sm font-bold tracking-wider text-[#05070d] shadow-[0_0_24px_rgba(0,255,136,0.14)] transition-colors hover:bg-[#38ffaa]"
        >
          INITIALIZE TRAINING →
        </Link>
      </section>
    </main>

    <footer className="border-t border-slate-800 px-5 py-5 text-center font-mono text-[10px] tracking-widest text-slate-600">
      TYPERUSHX // TRAINING SYSTEM
    </footer>
  </div>
);

export default Landing;
