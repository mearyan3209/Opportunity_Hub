import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo.jsx";

/* ─── data ─────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Reviews", href: "#reviews" },
  { label: "Tech Stack", href: "#stack" },
  { label: "FAQ", href: "#faq" },
];

const QUIZ_DEMO = [
  {
    q: "NEET UG 2025 was conducted on which date?",
    opts: ["April 20, 2025", "May 4, 2025", "June 1, 2025", "March 15, 2025"],
    ans: 1,
    cat: "Medical Entrance",
  },
  {
    q: "JEE Advanced is conducted by?",
    opts: ["NTA", "CBSE", "Rotating IITs", "MHRD"],
    ans: 2,
    cat: "Engineering Entrance",
  },
  {
    q: "INSPIRE scholarship is awarded by which ministry?",
    opts: ["Education", "Finance", "Science & Technology", "Health"],
    ans: 2,
    cat: "Scholarship",
  },
  {
    q: "GATE 2026 is organized by?",
    opts: ["NTA", "IIT Roorkee", "UGC", "AICTE"],
    ans: 1,
    cat: "PG Entrance",
  },
];

const STATS = [
  { num: 35, suffix: "+", label: "Opportunities" },
  { num: 5, suffix: "", label: "Categories" },
  { num: 100, suffix: "%", label: "Free to use" },
  { num: 2, suffix: " roles", label: "Admin & Student" },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    title: "Competitive Exams",
    color: "from-indigo-500 to-indigo-600",
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    desc: "JEE Main & Advanced, NEET, NDA, CLAT, GATE, BITSAT, VITEEE — every major Indian entrance exam in one place. Deadline tracked, syllabus listed, PYQs linked.",
    tags: ["JEE", "NEET", "GATE", "NDA", "CLAT"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: "Scholarships",
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    desc: "INSPIRE, NMMS, HDFC Badhte Kadam, Reliance Foundation, Tata Scholarship, NSP — find funding matched to your class level and income bracket.",
    tags: ["INSPIRE", "NMMS", "HDFC", "NSP", "Tata"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />
      </svg>
    ),
    title: "Olympiads",
    color: "from-amber-500 to-amber-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
    desc: "IMO, NSO, IEO, NTSE, IOQM, NSTSE — practice with built-in mini-quizzes drawn from each olympiad's actual question pattern. Get instant scores.",
    tags: ["IMO", "NSO", "NTSE", "IOQM", "IEO"],
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
      </svg>
    ),
    title: "Internships & Hackathons",
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-50",
    text: "text-violet-700",
    desc: "GSoC, SIH, IIT Summer Research, Microsoft Engage, ICPC, Codeforces rounds — build your portfolio with the best programs for Indian CS students.",
    tags: ["GSoC", "SIH", "ICPC", "IIT", "Microsoft"],
  },
];

const STEPS = [
  {
    num: "01",
    color: "bg-indigo-600",
    title: "Create your profile",
    desc: "Sign up in 30 seconds. Tell us your education level — Class 8, 11-12, UG aspirant, or college student. We personalise everything around you.",
  },
  {
    num: "02",
    color: "bg-emerald-500",
    title: "Discover & save",
    desc: "Browse 35+ real opportunities filtered for your level. Save the ones you like, track deadlines, read official syllabi, and open PYQ links in one click.",
  },
  {
    num: "03",
    color: "bg-amber-500",
    title: "Practice & track progress",
    desc: "Each opportunity has a mini-quiz. Attempt it, get instant feedback, review wrong answers, and watch your dashboard analytics improve over time.",
  },
];

const REVIEWS = [
  {
    name: "Aryan Mehta",
    role: "Class 12, Delhi",
    text: "I was preparing for JEE and had no idea INSPIRE scholarship existed. Found it here 3 days before the deadline — got ₹80,000 that year. This platform is genuinely life-changing.",
    stars: 5,
    avatar: "AM",
    color: "bg-indigo-600",
  },
  {
    name: "Priya Nair",
    role: "B.Tech CSE, NIT Calicut",
    text: "The quiz feature is what sets this apart. I practised the GATE CS quiz and spotted exactly the kind of questions asked. The dashboard showing my score trend is chef's kiss.",
    stars: 5,
    avatar: "PN",
    color: "bg-emerald-600",
  },
  {
    name: "Rahul Gupta",
    role: "Class 10, Jaipur",
    text: "My mom was worried I'd miss NTSE registration. I saved it here and got a deadline reminder in my dashboard. Attempted the olympiad quiz too — helpful for practice.",
    stars: 5,
    avatar: "RG",
    color: "bg-amber-600",
  },
  {
    name: "Sanya Khanna",
    role: "UG Aspirant, Chandigarh",
    text: "CUET, BITSAT, VITEEE — I was managing 6 spreadsheets. Now it's one dashboard with deadlines sorted. I actually have time to study instead of tracking dates.",
    stars: 5,
    avatar: "SK",
    color: "bg-violet-600",
  },
];

const STACK = [
  {
    name: "React.js",
    role: "Frontend SPA",
    color: "text-sky-600",
    desc: "Component-driven UI with hooks, Context API for auth state, React Router v6 for client-side navigation.",
  },
  {
    name: "Node.js + Express",
    role: "REST API Backend",
    color: "text-emerald-600",
    desc: "RESTful API with Pino structured logging, role-based middleware, and clean route separation.",
  },
  {
    name: "MongoDB + Mongoose",
    role: "Database",
    color: "text-green-600",
    desc: "Atlas cloud cluster. Schema-driven with Mongoose ODM — User & Opportunity models with embedded quiz arrays.",
  },
  {
    name: "JWT + bcryptjs",
    role: "Authentication",
    color: "text-amber-600",
    desc: "Stateless auth: bcrypt password hashing, HS256 JWT tokens, HTTP-only Authorization header flow.",
  },
  {
    name: "Tailwind CSS v4",
    role: "Styling",
    color: "text-indigo-600",
    desc: "Utility-first CSS. Custom theme tokens for indigo/emerald palette, rounded-2xl card system, responsive grid.",
  },
  {
    name: "Recharts",
    role: "Data Visualisation",
    color: "text-violet-600",
    desc: "BarChart for quiz score history, PieChart for opportunity category distribution — both fully responsive.",
  },
  {
    name: "Axios",
    role: "HTTP Client",
    color: "text-rose-600",
    desc: "Centralised axios instance with JWT interceptor and automatic 401 redirect — clean API abstraction layer.",
  },
  {
    name: "Vite",
    role: "Build Tool",
    color: "text-yellow-600",
    desc: "Lightning-fast HMR in dev, optimised production bundle. Path-based proxy routing via Replit shared proxy.",
  },
];

const FAQS = [
  {
    q: "Is OpportunityHub free?",
    a: "100% free. No hidden fees, no premium tier. Every feature — dashboard, quizzes, saved opportunities, analytics — is available to all registered students.",
  },
  {
    q: "How does the level-based filtering work?",
    a: "When you register, you select your education level (School / Class 11-12 / UG Aspirant / College Student). The Browse page automatically pre-filters opportunities relevant to you. You can always change the filter manually.",
  },
  {
    q: "Who can add or edit opportunities?",
    a: "Admins have a full CRUD panel — add, edit, delete opportunities, manage quiz questions, and view all registered users. Students have read-only access to opportunities.",
  },
  {
    q: "How does the quiz feature work?",
    a: "Every opportunity can have 2–5 multiple-choice questions based on its actual syllabus or previous year patterns. Submit your answers and get instant scoring. Review which questions you got wrong with explanations. Your scores are saved and shown in the dashboard BarChart.",
  },
  {
    q: "Is my data secure?",
    a: "Passwords are hashed with bcryptjs before storage — never stored in plain text. Authentication uses JWT tokens stored client-side. The backend validates every protected route server-side.",
  },
];

/* ─── helpers ───────────────────────────────────────────── */
function useScrolled(threshold = 20) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, [threshold]);
  return scrolled;
}

function useCountUp(target, duration = 1200) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);
  return [val, ref];
}

function Stars({ n }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="#F59E0B" className="w-4 h-4">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
        </svg>
      ))}
    </div>
  );
}

function QuizDemo() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const q = QUIZ_DEMO[idx];

  const next = () => { setIdx((i) => (i + 1) % QUIZ_DEMO.length); setSelected(null); };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-7 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4">
        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
          {q.cat}
        </span>
        <span className="text-xs text-gray-400">
          {idx + 1} / {QUIZ_DEMO.length}
        </span>
      </div>

      <p className="text-base font-semibold text-gray-900 mb-5 leading-snug">{q.q}</p>

      <div className="space-y-2.5">
        {q.opts.map((opt, i) => {
          let cls = "border border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50";
          if (selected !== null) {
            if (i === q.ans) cls = "border-2 border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold";
            else if (i === selected) cls = "border-2 border-red-400 bg-red-50 text-red-700 line-through";
            else cls = "border border-gray-100 text-gray-400";
          }
          return (
            <button
              key={i}
              disabled={selected !== null}
              onClick={() => setSelected(i)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${cls}`}
            >
              <span className="font-bold mr-2 text-gray-400">
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-5 flex items-center justify-between">
          <p className={`text-sm font-semibold ${selected === q.ans ? "text-emerald-600" : "text-red-600"}`}>
            {selected === q.ans ? "✅ Correct!" : `❌ Answer: ${q.opts[q.ans]}`}
          </p>
          <button
            onClick={next}
            className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            Next question →
          </button>
        </div>
      )}

      {selected === null && (
        <p className="text-xs text-gray-400 text-center mt-5">Click an option to check your answer</p>
      )}
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span className="text-base font-semibold text-gray-900">{q}</span>
        <span
          className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-gray-200 transition-transform ${
            open ? "rotate-45 bg-indigo-50 border-indigo-200" : ""
          }`}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="text-sm text-gray-600 pb-5 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function CountStat({ num, suffix, label }) {
  const [val, ref] = useCountUp(num);
  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-white">
        {val}
        {suffix}
      </div>
      <div className="text-indigo-200 text-sm mt-1">{label}</div>
    </div>
  );
}

/* ─── main component ────────────────────────────────────── */
export default function Landing() {
  const scrolled = useScrolled();

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 scroll-smooth">
      {/* ── NAVBAR ──────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link to="/">
            <Logo size={34} showText />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/explore"
              className="px-3 py-1.5 text-sm text-emerald-700 font-semibold hover:bg-emerald-50 rounded-lg transition flex items-center gap-1"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Explore Live
            </Link>
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href.slice(1))}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-5 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute top-20 right-0 w-80 h-80 bg-emerald-100 rounded-full opacity-40 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-violet-100 rounded-full opacity-30 blur-3xl -translate-x-1/2" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            Live · For Indian students · Class 8 to UG
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
            Never miss an{" "}
            <span className="relative inline-block">
              <span className="text-indigo-600">opportunity</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 to-emerald-400 rounded-full" />
            </span>
            <br />
            again.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Competitive exams, scholarships, olympiads, internships — all in one
            smart dashboard. Track deadlines, practise quizzes, and launch your future.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              to="/register"
              className="px-8 py-3.5 text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-lg hover:shadow-indigo-200 transition-all"
            >
              Start for free →
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 text-base font-semibold text-indigo-700 bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-2xl transition-all"
            >
              Try demo account
            </Link>
          </div>

          <p className="text-xs text-gray-400 font-mono">
            Demo: student@opportunityhub.com / student123
          </p>
        </div>
      </section>

      {/* ── STATS BAND ──────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 py-12">
        <div className="max-w-4xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <CountStat key={s.label} num={s.num} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how" className="py-24 px-5 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              How it works
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900">
              Up and running in 3 steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(33%-20px)] right-[calc(33%-20px)] h-0.5 bg-gradient-to-r from-indigo-300 to-emerald-300" />
            {STEPS.map((s) => (
              <div key={s.num} className="relative flex flex-col items-center text-center">
                <div
                  className={`w-16 h-16 rounded-2xl ${s.color} text-white flex items-center justify-center text-2xl font-extrabold shadow-lg mb-5`}
                >
                  {s.num}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900">
              Everything a student needs
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              One platform that covers every type of opportunity the Indian student ecosystem offers.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-3xl border border-gray-100 p-7 hover:shadow-xl hover:border-indigo-100 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} text-white flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{f.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {f.tags.map((t) => (
                    <span
                      key={t}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${f.bg} ${f.text}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD HIGHLIGHT ─────────────────────────────── */}
      <section className="py-24 px-5 bg-indigo-600 overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              Smart Dashboard
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-5 leading-tight">
              Your personalised command centre
            </h2>
            <ul className="space-y-4">
              {[
                "Quiz score history — bar chart across your last 6 attempts",
                "Category breakdown — pie chart of your saved opportunities",
                "Upcoming deadline counter — never miss a date",
                "Recommended opportunities filtered by your education level",
                "Profile progress indicator that grows as you engage",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-indigo-100">
                  <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-400 flex items-center justify-center">
                    <svg viewBox="0 0 20 20" fill="white" className="w-3 h-3">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-block mt-8 px-6 py-3 bg-white text-indigo-700 font-bold rounded-2xl hover:shadow-lg transition"
            >
              See your dashboard →
            </Link>
          </div>

          <div className="flex-1 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-6 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { label: "Saved", val: "12", icon: "🔖", col: "bg-white/20" },
                  { label: "Deadlines Soon", val: "3", icon: "⏰", col: "bg-amber-400/30" },
                  { label: "Avg Quiz Score", val: "78%", icon: "🏆", col: "bg-emerald-400/30" },
                  { label: "Progress", val: "65%", icon: "📈", col: "bg-violet-400/30" },
                ].map((c) => (
                  <div key={c.label} className={`${c.col} rounded-2xl p-3`}>
                    <div className="text-xl mb-1">{c.icon}</div>
                    <div className="text-white text-xl font-bold">{c.val}</div>
                    <div className="text-indigo-200 text-xs">{c.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white/10 rounded-2xl p-4">
                <div className="text-white text-sm font-semibold mb-3">Quiz Score Trend</div>
                <div className="flex items-end gap-2 h-16">
                  {[45, 60, 55, 72, 68, 85].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        style={{ height: `${h}%` }}
                        className="w-full bg-emerald-400 rounded-t-md opacity-80"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"].map((l) => (
                    <span key={l} className="text-indigo-300 text-xs">{l}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── QUIZ DEMO ────────────────────────────────────────── */}
      <section className="py-24 px-5 bg-gray-50">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Practice Quizzes
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-5 text-gray-900 leading-tight">
              Test your exam knowledge<br />right here, right now.
            </h2>
            <p className="text-gray-500 text-base leading-relaxed mb-6">
              Every opportunity on OpportunityHub comes with a built-in MCQ quiz based on its actual syllabus or past year patterns. Click an option on the right and see instant feedback — just like the real quiz inside the app.
            </p>
            <ul className="space-y-3">
              {[
                "Quizzes modelled on actual exam patterns",
                "Instant correct/incorrect feedback",
                "Score saved to your dashboard",
                "Review wrong answers after submission",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className="inline-block mt-8 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition shadow-md"
            >
              Start practicing free →
            </Link>
          </div>
          <div className="flex-1 w-full max-w-lg">
            <QuizDemo />
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────── */}
      <section id="reviews" className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
              Student Reviews
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900">
              Students love OpportunityHub
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {REVIEWS.map((r) => (
              <div
                key={r.name}
                className="bg-white rounded-3xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-100 transition flex flex-col"
              >
                <Stars n={r.stars} />
                <p className="text-sm text-gray-600 my-4 leading-relaxed flex-1">
                  "{r.text}"
                </p>
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                  <div
                    className={`w-9 h-9 rounded-xl ${r.color} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}
                  >
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH STACK ──────────────────────────────────────── */}
      <section id="stack" className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Tech Stack
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900">
              Built with industry-standard tools
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              A complete full-stack MERN application — the same stack used at product companies worldwide.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STACK.map((s) => (
              <div
                key={s.name}
                className="rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:border-indigo-100 transition"
              >
                <div className={`text-lg font-extrabold ${s.color} mb-0.5`}>{s.name}</div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  {s.role}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-50 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Full-stack MERN · REST API · JWT Auth · Role-based Access · Recharts Analytics
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Capstone project showcasing end-to-end product development with real-world patterns.
              </p>
            </div>
            <Link
              to="/register"
              className="flex-shrink-0 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
            >
              Try it live →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-5 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 text-gray-900">
              Common questions
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 px-7 divide-y divide-gray-100 shadow-sm">
            {FAQS.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────── */}
      <section className="py-24 px-5 bg-gradient-to-br from-indigo-600 via-indigo-700 to-emerald-700 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Your next big opportunity<br />is one click away.
          </h2>
          <p className="text-indigo-200 text-lg mb-10">
            Join now — it's free, no card needed, no spam.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="px-10 py-4 bg-white text-indigo-700 font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all text-base"
            >
              Create free account →
            </Link>
            <Link
              to="/login"
              className="px-10 py-4 border-2 border-white/40 text-white font-semibold rounded-2xl hover:bg-white/10 transition text-base"
            >
              Sign in
            </Link>
          </div>
          <p className="text-indigo-300 text-xs mt-8 font-mono">
            Demo: admin@opportunityhub.com / admin123
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm">
              O
            </div>
            <span className="font-bold text-white">OpportunityHub</span>
          </div>
          <div className="flex gap-6 text-sm">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href.slice(1))}
                className="hover:text-white transition"
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-xs">
            Built with React · Node · Express · MongoDB
          </p>
        </div>
      </footer>
    </div>
  );
}
